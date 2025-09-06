import { useMemo } from 'react';

import { useGetDeviceDataQuery } from '@/api/dataApiSlice';
import { DEFAULT_POLLING_INTERVAL } from '@/lib/constants';

type UseChartDataProps = {
  deviceId: string;
  startDate: Date;
  periodDays: number;
};

export function useChartData({ deviceId, startDate, periodDays }: UseChartDataProps) {
  const startDateString = useMemo(() => startDate.toISOString(), [startDate]);

  const { data, isLoading } = useGetDeviceDataQuery(
    {
      params: { deviceId },
      query: { startDate: startDateString, periodDays },
    },
    {
      pollingInterval: DEFAULT_POLLING_INTERVAL,
    },
  );

  return { data, isLoading };
}
