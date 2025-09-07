import { and, asc, eq, gte, lt } from 'drizzle-orm';

import { getDb } from '@/db/client';
import { deviceStatusRecordsSchema } from '@/db/schema';
import { filterFulfilled } from '@/lib/utils/filterFulfilled';
import { deviceService } from '@/server/deviceService';

class DataService {
  public async recordCurrentStatuses() {
    const devices = await deviceService.getAllDevices();
    const statusRecords = await Promise.allSettled(
      devices.map(async (device) => {
        const deviceInformation = await deviceService.getDeviceInformation(device.id);
        if (!deviceInformation) {
          throw new Error(`Failed to fetch device information for device ID: ${device.id}`);
        }
        return { data: deviceInformation, deviceId: device.id };
      }),
    ).then((results) => {
      return results.filter(filterFulfilled).map((result) => ({
        deviceId: result.value.deviceId,
        maxTemperature: result.value.data.coolSetpoint,
        minTemperature: result.value.data.heatSetpoint,
        currentTemperature: result.value.data.tempIndoor,
        currentHumidity: result.value.data.humIndoor,
        currentMode: result.value.data.mode,
      }));
    });

    const db = getDb();
    await db.insert(deviceStatusRecordsSchema).values(statusRecords);
  }

  public async getHistoricalData({
    deviceId,
    startDate,
    endDate,
  }: {
    deviceId: string;
    startDate: Date;
    endDate: Date;
  }) {
    const db = getDb();
    return await db
      .select()
      .from(deviceStatusRecordsSchema)
      .where(
        and(
          eq(deviceStatusRecordsSchema.deviceId, deviceId),
          gte(deviceStatusRecordsSchema.recordedAt, startDate),
          lt(deviceStatusRecordsSchema.recordedAt, endDate),
        ),
      )
      .orderBy(asc(deviceStatusRecordsSchema.recordedAt));
  }
}

export const dataService = new DataService();
