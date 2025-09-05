import { MoreVertical } from 'lucide-react';

import { AutomationItemOptions } from '@/components/automations/AutomationItemOptions';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Automation } from '@/types/automation';

export function AutomationItem({ automation }: { automation: Automation }) {
  return (
    <Card className="p-4">
      <CardTitle className="flex items-center justify-between">
        <span>Automation ID: {automation.id}</span>
        <AutomationItemOptions automationId={automation.id}>
          <MoreVertical size={16} />
        </AutomationItemOptions>
      </CardTitle>
      <CardDescription>
        <p>Created: {new Date(automation.createdAt).toLocaleString()}</p>
        <p>Temperature Buffer: {automation.bufferDegrees}°C</p>
        <p>Device ID: {automation.deviceId}</p>
      </CardDescription>
    </Card>
  );
}
