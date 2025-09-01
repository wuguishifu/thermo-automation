'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { useListDevicesQuery } from '@/api/devicesApiSlice';
import { Card, CardTitle } from '@/components/ui/card';

export function DevicesList({ locationName }: { locationName?: string }) {
  const { data } = useListDevicesQuery();

  const devices = useMemo(() => {
    return (
      data
        ?.filter((location) => (locationName ? location.locationName === locationName : true))
        .flatMap(({ locationName, devices }) =>
          devices.map((device) => ({
            ...device,
            locationName,
          })),
        ) ?? []
    );
  }, [data, locationName]);

  return (
    <div className="mt-4 flex items-center flex-wrap">
      {devices?.map((device) => (
        <Link key={device.id} href={`/devices/${device.id}`}>
          <Card className="w-48">
            <CardTitle className="text-center text-lg font-semibold">{device.name}</CardTitle>
          </Card>
        </Link>
      ))}
    </div>
  );
}
