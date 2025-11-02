import { and, eq, gt, gte, lte, or, sql } from 'drizzle-orm';

import { getDb } from '@/db/client';
import { automationsSchema } from '@/db/schema';
import { filterFulfilled } from '@/lib/utils/filterFulfilled';
import { deviceService } from '@/server/deviceService';
import { Automation } from '@/types/automation';
import { DeviceInformation, Mode } from '@/types/device';

type Target = { targetMin: number; targetMax: number; buffer: number };

class ThermostatService {
  get db() {
    return getDb();
  }

  public async handleJob(timezone = process.env.TIMEZONE ?? 'UTC') {
    const currentAutomations = await this.getCurrentAutomations(timezone);

    if (!currentAutomations.length) {
      return this.disableAllDevices();
    }

    const targets = this.getRawTargets(currentAutomations);

    const deviceInformationMap = await Promise.allSettled(
      Object.keys(targets).map(async (deviceId) => {
        const deviceInfo = await deviceService.getDeviceInformation(deviceId);
        if (!deviceInfo) {
          throw new Error(`Device information not found for device ID ${deviceId}`);
        }
        return { deviceId, deviceInfo };
      }),
    )
      .then((results) => results.filter(filterFulfilled).map(({ value }) => value))
      .then((entries) =>
        entries.reduce<Record<string, DeviceInformation>>((acc, { deviceId, deviceInfo }) => {
          acc[deviceId] = deviceInfo;
          return acc;
        }, {}),
      );

    const sanitizedTargets = await Promise.allSettled(
      Object.entries(targets)
        .filter(([deviceId]) => deviceInformationMap[deviceId])
        .map(([deviceId, target]) => {
          const deviceInfo = deviceInformationMap[deviceId];
          const { targetMin, targetMax, buffer } = this.getSanitizedTarget({ target, deviceInfo });
          return { deviceId, buffer, targetMin, targetMax };
        }),
    ).then((results) => results.filter(filterFulfilled).map(({ value }) => value));

    sanitizedTargets
      .filter(({ deviceId }) => deviceInformationMap[deviceId])
      .forEach(async ({ deviceId, targetMin, targetMax, buffer }) => {
        const { tempIndoor: currentTemperature, mode } = deviceInformationMap[deviceId];

        // device is outside of spec
        if ((currentTemperature < targetMin || currentTemperature > targetMax) && mode === Mode.OFF) {
          await deviceService.updateDeviceMode({
            deviceId,
            mode: Mode.AUTO,
            heatSetpoint: targetMin,
            coolSetpoint: targetMax,
          });
        }

        // device is within spec
        if (
          currentTemperature >= targetMin + buffer &&
          currentTemperature <= targetMax - buffer &&
          mode === Mode.AUTO
        ) {
          await this.disableDevice(deviceId, deviceInformationMap[deviceId]);
        }
      });
  }

  private async disableAllDevices() {
    const automatedDeviceIds = await this.getAllAutomatedDevices();
    await Promise.all(automatedDeviceIds.map((deviceId) => this.disableDevice(deviceId)));
  }

  private async disableDevice(deviceId: string, deviceInformation?: DeviceInformation) {
    try {
      const currentDeviceInfo = deviceInformation ?? (await deviceService.getDeviceInformation(deviceId));
      if (!currentDeviceInfo) {
        throw new Error(`Device with ID ${deviceId} not found`);
      }

      const { mode, heatSetpoint, coolSetpoint } = currentDeviceInfo;
      if (mode === Mode.OFF) {
        console.log(`Device with ID ${deviceId} is already off. Skipping.`);
        return;
      }

      await deviceService.updateDeviceMode({ deviceId, mode: Mode.OFF, heatSetpoint, coolSetpoint });
    } catch (error) {
      console.error(`Failed to disable device with ID ${deviceId}`, error);
    }
  }

  public async getCurrentAutomations(timezone: string) {
    const now = sql`(CURRENT_TIME AT TIME ZONE ${timezone})::time`;
    const currentDayOfWeek = sql`EXTRACT(DOW FROM CURRENT_TIMESTAMP AT TIME ZONE ${timezone})::integer`;
    return await this.db
      .select()
      .from(automationsSchema)
      .where(
        and(
          eq(automationsSchema.enabled, true),
          sql`(${automationsSchema.daysMask} & (1 << ${currentDayOfWeek})) != 0`,
          or(
            and(gt(now, automationsSchema.startsAt), lte(now, automationsSchema.endsAt)),
            // overnight case
            and(
              gt(automationsSchema.startsAt, automationsSchema.endsAt),
              or(gte(now, automationsSchema.startsAt), lte(now, automationsSchema.endsAt)),
            ),
          ),
        ),
      );
  }

  private getRawTargets(automations: Automation[]) {
    return automations.reduce<Record<string, Target>>((acc, automation) => {
      if (!acc[automation.deviceId]) {
        acc[automation.deviceId] = {
          targetMin: automation.minTemperature ?? -Infinity,
          targetMax: automation.maxTemperature ?? Infinity,
          buffer: automation.bufferDegrees ?? 0,
        };

        return acc;
      }

      if (automation.minTemperature != null && automation.minTemperature > acc[automation.deviceId].targetMin) {
        acc[automation.deviceId].buffer = automation.bufferDegrees ?? 0;
        acc[automation.deviceId].targetMin = automation.minTemperature;
      }

      if (automation.maxTemperature != null && automation.maxTemperature < acc[automation.deviceId].targetMax) {
        acc[automation.deviceId].buffer = automation.bufferDegrees ?? 0;
        acc[automation.deviceId].targetMax = automation.maxTemperature;
      }

      return acc;
    }, {});
  }

  private getSanitizedTarget({ target, deviceInfo }: { target: Target; deviceInfo: DeviceInformation }) {
    let targetMin =
      target.targetMin === -Infinity ? deviceInfo.heatSetpoint : Math.max(target.targetMin, deviceInfo.setpointMinimum);

    const targetMax =
      target.targetMax === Infinity ? deviceInfo.coolSetpoint : Math.min(target.targetMax, deviceInfo.setpointMaximum);

    if (targetMin > targetMax - deviceInfo.setpointDelta) {
      targetMin = targetMax - deviceInfo.setpointDelta;
    }

    const buffer = target.buffer ?? 0;

    return { targetMin, targetMax, buffer };
  }

  private async getAllAutomatedDevices(): Promise<string[]> {
    return await this.db
      .selectDistinctOn([automationsSchema.deviceId])
      .from(automationsSchema)
      .where(eq(automationsSchema.enabled, true))
      .then((rows) => rows.map(({ deviceId }) => deviceId));
  }
}

export const thermostatService = new ThermostatService();
