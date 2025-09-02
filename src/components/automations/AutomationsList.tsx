'use client';

import { useListAutomationsQuery } from '@/api/automationsApiSlice';
import { AutomationItem } from '@/components/automations/AutomationItem';

export function AutomationsList({ deviceId }: { deviceId?: string }) {
  const { data: automations } = useListAutomationsQuery({ deviceId });

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {automations?.map((automation) => (
        <AutomationItem automation={automation} key={automation.id} />
      ))}
    </div>
  );
}
