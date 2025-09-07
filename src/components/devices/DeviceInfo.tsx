import { Workflow } from 'lucide-react';
import Link from 'next/link';

import { DeviceInfoSection } from '@/components/devices/DeviceInfoSection';
import { Temperature } from '@/components/devices/Temperature';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Device, DeviceInformation } from '@/types/device';

const modeMap: Record<DeviceInformation['mode'], string> = {
  0: 'Off',
  1: 'Cooling',
  2: 'Heating',
  3: 'Auto',
  4: 'Emergency Heat',
};

export function DeviceInfo({ deviceInfo }: { deviceInfo: Partial<Device & DeviceInformation> }) {
  return (
    <div className="space-y-8">
      <div className="flex gap-8">
        <DeviceInfoSection title="Internal Readings">
          Inside Temperature: <Temperature celsiusValue={deviceInfo.tempIndoor ?? 0} />
          <br />
          Inside Humidity: {deviceInfo.humIndoor}%
        </DeviceInfoSection>
        <DeviceInfoSection title="External Readings (idk what these come from but they're wrong)">
          Outside Temperature: <Temperature celsiusValue={deviceInfo.tempOutdoor ?? 0} />
          <br />
          Outside Humidity: {deviceInfo.humOutdoor}%
        </DeviceInfoSection>
      </div>
      <DeviceInfoSection title="Device Settings">
        Cooling Setpoint: <Temperature celsiusValue={deviceInfo.coolSetpoint ?? 0} />
        <br />
        Heating Setpoint: <Temperature celsiusValue={deviceInfo.heatSetpoint ?? 0} />
        <br />
        Current Mode: {modeMap[deviceInfo.mode ?? 0]}
      </DeviceInfoSection>
      <DeviceInfoSection title="Device Limits">
        Minimum Setpoint: <Temperature celsiusValue={deviceInfo.setpointMinimum ?? 0} />
        <br />
        Maximum Setpoint: <Temperature celsiusValue={deviceInfo.setpointMaximum ?? 0} />
        <br />
        Minimum Delta: <Temperature celsiusValue={deviceInfo.setpointDelta ?? 0} />
      </DeviceInfoSection>
      <Link href={`/devices/${deviceInfo.id}/automations`} className={cn(buttonVariants({ variant: 'default' }))}>
        <Workflow />
        <span>Automations</span>
      </Link>
    </div>
  );
}
