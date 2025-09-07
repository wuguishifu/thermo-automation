import { useGetDeviceInfoQuery } from '@/api/devicesApiSlice';
import { useDevice } from '@/hooks/useDeviceName';
import { DEFAULT_POLLING_INTERVAL } from '@/lib/constants';

export function useDeviceInfo(id: string) {
  const device = useDevice(id);
  const {
    data: deviceInfo,
    error,
    isLoading,
  } = useGetDeviceInfoQuery({ id }, { pollingInterval: DEFAULT_POLLING_INTERVAL });
  return { deviceInfo: { ...device, ...deviceInfo }, error, isLoading };
}
