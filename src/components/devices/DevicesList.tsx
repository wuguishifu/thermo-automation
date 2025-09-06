'use client';

import Link from 'next/link';
import { useCallback, useMemo } from 'react';

import { useListDevicesQuery } from '@/api/devicesApiSlice';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

type DevicesListProps = {
  locationName?: string;
  routePrefix?: string;
};

export function DevicesList({ locationName, routePrefix }: DevicesListProps) {
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

  const getHref = useCallback(
    (id: string) => {
      if (routePrefix) {
        return `/${routePrefix}/${id}`;
      }

      return `/devices/${id}`;
    },
    [routePrefix],
  );

  return (
    <div className="mt-4 flex items-center flex-wrap">
      {devices?.map((device) => (
        <Link key={device.id} href={getHref(device.id)}>
          <Card className="w-48 p-4">
            <CardTitle className="text-center text-lg font-semibold">{device.name}</CardTitle>
            <CardDescription>
              <p>Location: {device.locationName}</p>
              <p>Model: {device.model}</p>
            </CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
}
