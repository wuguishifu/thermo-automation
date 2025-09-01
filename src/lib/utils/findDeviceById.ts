import { Device, Location } from '@/types/device';

export function findDeviceById(locations: Location[], deviceId: string): Device | undefined {
  for (const location of locations) {
    const device = location.devices.find((d) => d.id === deviceId);
    if (device) {
      return device;
    }
  }
  return undefined;
}
