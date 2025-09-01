'use client';

import { useMemo } from 'react';

import { useListDevicesQuery } from '@/api/devicesApiSlice';
import { AppBreadcrumbs } from '@/components/layout/AppBreadcrumbs';

export function LocationPageBreadcrumbs({ locationName }: { locationName: string }) {
  const { data } = useListDevicesQuery();

  const deviceCount = useMemo(() => {
    return data?.find((location) => location.locationName === locationName)?.devices.length || 0;
  }, [data, locationName]);

  const breadcrumbs = useMemo(() => {
    return [
      { url: '/', title: 'Home' },
      { url: '/locations', title: 'Locations' },
      { url: `/locations/${locationName}`, title: `${locationName} (${deviceCount})` },
    ];
  }, [locationName, deviceCount]);

  return <AppBreadcrumbs>{breadcrumbs}</AppBreadcrumbs>;
}
