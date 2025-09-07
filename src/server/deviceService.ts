import { httpService } from '@/server/httpService';
import { Device, DeviceInformation, LocationWithDevices, Mode } from '@/types/device';

class DeviceService {
  public async getAllDevices(): Promise<Device[]> {
    try {
      return await httpService
        .get<LocationWithDevices[]>('devices')
        .then((response) => response.data?.flatMap(({ devices }) => devices));
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  }

  public async getDeviceInformation(deviceId: string): Promise<DeviceInformation | null> {
    try {
      return await httpService.get<DeviceInformation>(`devices/${deviceId}`).then((response) => response.data);
    } catch (error) {
      console.error(`Error fetching device information for deviceId ${deviceId}:`, error);
      return null;
    }
  }

  public async updateDeviceMode({
    deviceId,
    mode,
    heatSetpoint,
    coolSetpoint,
  }: {
    deviceId: string;
    mode: Mode;
    heatSetpoint: number;
    coolSetpoint: number;
  }) {
    try {
      await httpService.put<{ message: string }, { mode: number; heatSetpoint: number; coolSetpoint: number }>(
        `/devices/${deviceId}/msp`,
        {
          mode,
          heatSetpoint,
          coolSetpoint,
        },
      );
    } catch (error) {
      console.error(`Error updating device mode for deviceId ${deviceId}:`, error);
    }
  }
}

export const deviceService = new DeviceService();
