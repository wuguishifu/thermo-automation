import { useMemo } from 'react';

import { useListDevicesQuery } from '@/api/devicesApiSlice';

export function useLocationDevices(location: string) {
  const { data } = useListDevicesQuery();

  return useMemo(() => {
    return data?.find(({ locationName }) => locationName === location)?.devices;
  }, [location, data]);
}
