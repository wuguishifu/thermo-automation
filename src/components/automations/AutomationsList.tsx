'use client';

import { useListAutomationsQuery } from '@/api/automationsApiSlice';
import { AutomationItem } from '@/components/automations/AutomationItem';
import { useDeviceIdMap } from '@/hooks/useDeviceIdMap';

export function AutomationsList({ deviceId }: { deviceId?: string }) {
  const { data: automations } = useListAutomationsQuery({ deviceId });
  const devicesMap = useDeviceIdMap();

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {automations?.map((automation) => (
        <AutomationItem automation={automation} device={devicesMap?.[automation.deviceId]} key={automation.id} />
      ))}
    </div>
  );
}
