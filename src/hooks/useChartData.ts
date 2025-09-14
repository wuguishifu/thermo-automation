import { useMemo } from 'react';

import { useGetDeviceDataQuery } from '@/api/dataApiSlice';
import { DEFAULT_POLLING_INTERVAL } from '@/lib/constants';

type UseChartDataProps = {
  deviceId: string;
  startDate: Date;
  period: number;
};

export function useChartData({ deviceId, startDate, period }: UseChartDataProps) {
  const startDateMs = useMemo(() => startDate.getTime(), [startDate]);

  const { data, isLoading } = useGetDeviceDataQuery(
    {
      params: { deviceId },
      query: { startDateMs: startDateMs.toString(), period },
    },
    {
      pollingInterval: DEFAULT_POLLING_INTERVAL,
    },
  );

  return { data, isLoading };
}
