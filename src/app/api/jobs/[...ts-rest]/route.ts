import { createNextHandler } from '@ts-rest/serverless/next';

import { rootRouter } from '@/contract/rootRouter';
import { getDb } from '@/db/client';
import { deviceStatusRecordsSchema } from '@/db/schema';
import { errorHandler } from '@/server/errorHandler';
import { httpService } from '@/server/httpService';
import { requestAuthenticationMiddleware } from '@/server/requestAuthenticationMiddleware';
import { Device, DeviceInformation } from '@/types/device';

const handler = createNextHandler(
  rootRouter.api.jobs,
  {
    handleAutomationJob: async () => {
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
            maxTemperature: result.value.data.setpointMaximum,
            minTemperature: result.value.data.setpointMinimum,
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
