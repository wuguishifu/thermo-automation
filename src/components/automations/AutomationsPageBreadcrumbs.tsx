'use client';

import { useMemo } from 'react';

import { AppBreadcrumbs, Breadcrumb } from '@/components/layout/AppBreadcrumbs';
import { useDevice } from '@/hooks/useDeviceName';

export function AutomationsPageBreadcrumbs({ deviceId }: { deviceId: string }) {
  const device = useDevice(deviceId);

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
