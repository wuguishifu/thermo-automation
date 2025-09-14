import { ExternalLink, MoreVertical } from 'lucide-react';
import Link from 'next/link';

import { AutomationItemOptions } from '@/components/automations/AutomationItemOptions';
import { Temperature } from '@/components/devices/Temperature';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatTemperature } from '@/lib/utils/temperature';
import { useAppSelector } from '@/state/store';
import { Automation } from '@/types/automation';
import { Device } from '@/types/device';

export function AutomationItem({ automation, device }: { automation: Automation; device?: Device }) {
  const temperatureDisplay = useAppSelector((state) => state.settings.temperatureDisplay);

  return (
    <Card className="p-4">
      <CardTitle className={cn('flex items-center justify-between', { 'opacity-50': !automation.enabled })}>
        <span>Automation ID: {automation.id}</span>
        <AutomationItemOptions automation={automation}>
          <MoreVertical size={16} />
        </AutomationItemOptions>
      </CardTitle>
      <CardDescription className={cn({ 'opacity-50': !automation.enabled })}>
        <Link href={`/devices/${automation.deviceId}`} className="flex gap-2">
          <span>Device: {device?.name ?? automation.deviceId.slice(0, 8)}</span>
          <ExternalLink size={16} />
        </Link>
        <p>Created: {new Date(automation.createdAt).toLocaleString()}</p>
      </CardDescription>
      <CardContent className={cn('p-0', { 'opacity-50': !automation.enabled })}>
        <p>
          {automation.startsAt} - {automation.endsAt}
        </p>
        <p>
          {automation.minTemperature ? <Temperature celsiusValue={automation.minTemperature} /> : 'No min'} -{' '}
          {automation.maxTemperature ? <Temperature celsiusValue={automation.maxTemperature} /> : 'No max'}
        </p>
        <p>Buffer: {automation.bufferDegrees ? formatTemperature(automation.bufferDegrees, temperatureDisplay) : 'No buffer'}</p>
      </CardContent>
    </Card>
  );
}
