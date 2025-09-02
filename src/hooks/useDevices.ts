import { useMemo } from 'react';

import { useListDevicesQuery } from '@/api/devicesApiSlice';

export function useDevices() {
  const { data, isLoading } = useListDevicesQuery();

  return useMemo(
    () => ({
      devices:
        data?.flatMap(({ devices, locationName }) => devices.map((device) => ({ ...device, locationName }))) ?? [],
      isLoading,
    }),
    [data, isLoading],
  );
}
