import { createNextHandler } from '@ts-rest/serverless/next';
import { AxiosResponse } from 'axios';
import { and, eq, gt, gte, lte, or, sql } from 'drizzle-orm';

import { rootRouter } from '@/contract/rootRouter';
import { getDb } from '@/db/client';
import { automationsSchema, deviceStatusRecordsSchema } from '@/db/schema';
import { errorHandler } from '@/server/errorHandler';
import { httpService } from '@/server/httpService';
import { requestAuthenticationMiddleware } from '@/server/requestAuthenticationMiddleware';
import { Device, DeviceInformation, Mode } from '@/types/device';

type Targets = { minTemperature: number; maxTemperature: number; buffer: number };
type TargetsWithDeviceStats = { deviceId: string; deviceData: DeviceInformation; targets: Targets };

const handler = createNextHandler(
  rootRouter.api.jobs,
  {
    handleAutomationJob: async () => {
      const db = getDb();
      // DB-side current time (no timezone issues, proper type)
      const timezone = process.env.TIMEZONE ?? 'UTC';
      const now = sql`(CURRENT_TIME AT TIME ZONE ${timezone})::time`;

      const currentAutomations = await db
        .select()
        .from(automationsSchema)
        .where(
          and(
            eq(automationsSchema.enabled, true),
            or(
              and(
                lte(automationsSchema.startsAt, automationsSchema.endsAt),
                gte(now, automationsSchema.startsAt),
                lte(now, automationsSchema.endsAt),
              ),
              // overnight case
              and(
                gt(automationsSchema.startsAt, automationsSchema.endsAt),
                or(gte(now, automationsSchema.startsAt), lte(now, automationsSchema.endsAt)),
              ),
            ),
          ),
        );

      if (!currentAutomations.length) {
        return {
          status: 200,
          body: 'ok',
        };
      }

      const deviceTargets = currentAutomations.reduce<
        Record<string, { minTemperature: number; maxTemperature: number; buffer: number }>
      >((acc, automation) => {
        if (!acc[automation.deviceId]) {
          acc[automation.deviceId] = { minTemperature: -Infinity, maxTemperature: Infinity, buffer: 0 };
        }

        if (automation.minTemperature !== null && automation.minTemperature > acc[automation.deviceId].minTemperature) {
          acc[automation.deviceId].buffer = automation.bufferDegrees ?? 0;
          acc[automation.deviceId].minTemperature = automation.minTemperature;
        }

        if (automation.maxTemperature !== null && automation.maxTemperature < acc[automation.deviceId].maxTemperature) {
          acc[automation.deviceId].buffer = automation.bufferDegrees ?? 0;
          acc[automation.deviceId].maxTemperature = automation.maxTemperature;
        }

        return acc;
      }, {});

      const targetsWithDeviceStats = await Promise.allSettled(
        Object.entries(deviceTargets).map<Promise<TargetsWithDeviceStats>>(async ([deviceId, targets]) => {
          const response = await httpService.get<DeviceInformation>(`devices/${deviceId}`);

          return {
            deviceId,
            deviceData: response.data,
            targets,
          };
        }),
      ).then((results) => {
        return results
          .filter((result): result is PromiseFulfilledResult<TargetsWithDeviceStats> => result.status === 'fulfilled')
          .map(({ value }) => value);
      });

      await Promise.allSettled(
        targetsWithDeviceStats.map(async ({ deviceId, deviceData, targets }) => {
          const { minTemperature, maxTemperature } = targets;
          const {
            coolSetpoint,
            heatSetpoint,
            mode,
            tempIndoor: currentTemperature,
            setpointMaximum,
            setpointMinimum,
          } = deviceData;

          const targetMin = minTemperature === -Infinity ? heatSetpoint : Math.max(minTemperature, setpointMinimum);
          const targetMax = maxTemperature === Infinity ? coolSetpoint : Math.min(maxTemperature, setpointMaximum);

          if ((currentTemperature < targetMin || currentTemperature > targetMax) && mode === Mode.Off) {
            // Device is outside of target range, and is off - turn it on to auto mode
            return await httpService.put<
              { message: string },
              { mode: number; heatSetpoint: number; coolSetpoint: number }
            >(`/devices/${deviceId}/msp`, {
              mode: Mode.Auto,
              heatSetpoint: targetMin,
              coolSetpoint: targetMax,
            });
          }

          if (
            currentTemperature >= targetMin + targets.buffer &&
            currentTemperature <= targetMax - targets.buffer &&
            mode !== Mode.Off
          ) {
            // Device is within target range (with buffer), and is not off - turn it off
            return await httpService.put<
              { message: string },
              { mode: number; heatSetpoint: number; coolSetpoint: number }
            >(`/devices/${deviceId}/msp`, {
              mode: Mode.Off,
              heatSetpoint,
              coolSetpoint,
            });
          }
        }),
      ).then((results) => {
        const fulfilled = results.filter(
          (result): result is PromiseFulfilledResult<AxiosResponse<{ message: string }>> =>
            result.status === 'fulfilled',
        );
        const rejected = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected');
      });

      return {
        status: 200,
        body: 'ok',
      };
    },
    recordCurrentStatus: async () => {
      const listDevicesResponse = await httpService.get<{ locationName: string; devices: Device[] }[]>('devices');
      if (!listDevicesResponse.data) {
        return { status: 200, body: 'ok' };
      }

      const devices = listDevicesResponse.data.flatMap((location) => location.devices);
      const statusRecords = await Promise.allSettled(
        devices.map(async (device) => {
          const response = await httpService.get<DeviceInformation>(`devices/${device.id}`);
          return { data: response.data, deviceId: device.id };
        }),
      ).then((results) =>
        results
          .filter(
            (result): result is PromiseFulfilledResult<{ data: DeviceInformation; deviceId: string }> =>
              result.status === 'fulfilled',
          )
          .map((result) => ({
            deviceId: result.value.deviceId,
            maxTemperature: result.value.data.coolSetpoint,
            minTemperature: result.value.data.heatSetpoint,
            currentTemperature: result.value.data.tempIndoor,
            currentHumidity: result.value.data.humIndoor,
            currentMode: result.value.data.mode,
          })),
      );

      const db = getDb();
      await db.insert(deviceStatusRecordsSchema).values(statusRecords);

      return {
        status: 200,
        body: 'ok',
      };
    },
  },
  {
    handlerType: 'app-router',
    jsonQuery: true,
    responseValidation: true,
    errorHandler,
    requestMiddleware: [requestAuthenticationMiddleware],
  },
);

export { handler as POST };
