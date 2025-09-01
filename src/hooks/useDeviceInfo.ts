import { useMemo } from 'react';

import { useGetDeviceInfoQuery, useListDevicesQuery } from '@/api/devicesApiSlice';
import { DEFAULT_POLLING_INTERVAL } from '@/lib/constants';
import { findDeviceById } from '@/lib/utils/findDeviceById';

export function useDeviceInfo(id: string) {
  const { data: devicesList, error: devicesListError, isLoading: devicesListIsLoading } = useListDevicesQuery();
  const {
    data: deviceInfo,
    error: deviceInfoError,
    isLoading: deviceInfoIsLoading,
  } = useGetDeviceInfoQuery({ id }, { pollingInterval: DEFAULT_POLLING_INTERVAL });

  const device = useMemo(() => {
    return devicesList ? findDeviceById(devicesList, id) : undefined;
  }, [devicesList, id]);

  return {
    deviceInfo: {
      ...device,
      ...deviceInfo,
    },
    error: devicesListError || deviceInfoError,
    isLoading: devicesListIsLoading || deviceInfoIsLoading,
  };
}
