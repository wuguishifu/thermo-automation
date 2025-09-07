import { useMemo } from 'react';

import { useListDevicesQuery } from '@/api/devicesApiSlice';
import { Device, Location } from '@/types/device';

export function useDevice(deviceId: string): Device | undefined {
  const { data } = useListDevicesQuery();
  return useMemo(() => (data ? findDeviceById(data, deviceId) : undefined), [data, deviceId]);
}

function findDeviceById(locations: Location[], deviceId: string): Device | undefined {
  for (const location of locations) {
    const device = location.devices.find((d) => d.id === deviceId);
    if (device) {
      return device;
    }
  }
  return undefined;
}
