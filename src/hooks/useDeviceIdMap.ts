import { useMemo } from 'react';

import { useListDevicesQuery } from '@/api/devicesApiSlice';
import { Device } from '@/types/device';

export function useDeviceIdMap() {
  const { data: devices } = useListDevicesQuery();

  return useMemo(() => {
    return devices?.reduce<Record<string, Device>>((map, { devices }) => {
      devices.forEach((device) => {
        map[device.id] = device;
      });

      return map;
    }, {});
  }, [devices]);
}
