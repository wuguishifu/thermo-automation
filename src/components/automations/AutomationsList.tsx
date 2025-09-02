'use client';

import { useListAutomationsQuery } from '@/api/automationsApiSlice';

export function AutomationsList({ deviceId }: { deviceId?: string }) {
  const { data: automations } = useListAutomationsQuery({ deviceId });

  return <pre>{JSON.stringify(automations, null, 2)}</pre>;
}
