'use client';


import { useGetDeviceDataQuery } from '@/api/dataApiSlice';
import { subDays } from 'date-fns';
import { useState } from 'react';

type DeviceDataGraphProps = {
  deviceId: string;
};

export function DeviceDataGraph({ deviceId }: DeviceDataGraphProps) {
  const [startDate, setStartDate] = useState(subDays(new Date(), 7).toISOString());
  const [periodDays, setPeriodDays] = useState(7);

  const { data: deviceData } = useGetDeviceDataQuery({
    params: { deviceId },
    query: { startDate, periodDays },
  });

  return <pre>{JSON.stringify(deviceData, null, 2)}</pre>;
}
