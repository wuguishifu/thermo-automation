'use client';

import { useMemo } from 'react';

import { AppBreadcrumbs, Breadcrumb } from '@/components/layout/AppBreadcrumbs';
import { useDevice } from '@/hooks/useDeviceName';

export function DeviceDataPageBreadcrumbs({ deviceId }: { deviceId: string }) {
  const device = useDevice(deviceId);

  const breadcrumbs: Breadcrumb[] = useMemo(() => {
    return [
      { url: '/', title: 'Home' },
      { url: `/data`, title: 'Data' },
      { url: `/data/${deviceId}`, title: device?.name ?? deviceId },
    ];
  }, [device, deviceId]);

  return <AppBreadcrumbs>{breadcrumbs}</AppBreadcrumbs>;
}
