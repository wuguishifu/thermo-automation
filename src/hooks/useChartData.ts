import { useMemo } from 'react';

import { useGetDeviceDataQuery } from '@/api/dataApiSlice';

type UseChartDataProps = {
  deviceId: string;
  startDate: Date;
  periodDays: number;
};

export function useChartData({ deviceId, startDate, periodDays }: UseChartDataProps) {
  const startDateString = useMemo(() => startDate.toISOString(), [startDate]);

  const { data, isLoading } = useGetDeviceDataQuery({
    params: { deviceId },
    query: { startDate: startDateString, periodDays },
  });

  return { data, isLoading };
}
