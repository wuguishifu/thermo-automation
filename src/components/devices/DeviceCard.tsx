'use client';

import { DeviceInfo } from '@/components/devices/DeviceInfo';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useDeviceInfo } from '@/hooks/useDeviceInfo';

export function DeviceCard({ deviceId }: { deviceId: string }) {
  const { deviceInfo, isLoading } = useDeviceInfo(deviceId);

  return (
    <Card className="p-4">
      <CardTitle className="text-2xl font-bold">{isLoading ? 'Loading...' : deviceInfo.name}</CardTitle>
      <CardDescription>
        <p>ID: {deviceInfo.id ?? '...'}</p>
        <p>Model: {deviceInfo.model ?? '...'}</p>
        <p>Firmware Version: {deviceInfo.firmwareVersion ?? '...'}</p>
      </CardDescription>
      <CardContent className="p-0">
        {isLoading ? (
          <Spinner />
        ) : deviceInfo ? (
          <DeviceInfo deviceInfo={deviceInfo} />
        ) : (
          <p>Failed to load device information</p>
        )}
      </CardContent>
    </Card>
  );
}
