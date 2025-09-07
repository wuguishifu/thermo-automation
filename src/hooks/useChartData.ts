import { useMemo } from 'react';

import { useGetDeviceDataQuery } from '@/api/dataApiSlice';
import { DEFAULT_POLLING_INTERVAL } from '@/lib/constants';

type UseChartDataProps = {
  deviceId: string;
  startDate: Date;
  period: number;
};

export function useChartData({ deviceId, startDate, period }: UseChartDataProps) {
  const startDateString = useMemo(() => startDate.toISOString(), [startDate]);

  const { data, isLoading } = useGetDeviceDataQuery(
    {
      params: { deviceId },
      query: { startDate: startDateString, period },
    },
    {
      pollingInterval: DEFAULT_POLLING_INTERVAL,
    },
  );

  return { data, isLoading };
}
