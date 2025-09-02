'use client';

import { useMemo } from 'react';

import { useListDevicesQuery } from '@/api/devicesApiSlice';
import { AppBreadcrumbs, Breadcrumb } from '@/components/layout/AppBreadcrumbs';
import { findDeviceById } from '@/lib/utils/findDeviceById';

export function AutomationsPageBreadcrumbs({ deviceId }: { deviceId: string }) {
  const { data } = useListDevicesQuery();

  const device = useMemo(() => {
    return data ? findDeviceById(data, deviceId) : undefined;
  }, [data, deviceId]);

  const breadcrumbs: Breadcrumb[] = useMemo(() => {
    return [
      { url: '/', title: 'Home' },
      { url: `/devices`, title: 'Devices' },
      { url: `/devices/${deviceId}`, title: device?.name ?? deviceId },
      { url: `/devices/${deviceId}/automations`, title: 'Automations' },
    ];
  }, [device, deviceId]);

  return <AppBreadcrumbs>{breadcrumbs}</AppBreadcrumbs>;
}
