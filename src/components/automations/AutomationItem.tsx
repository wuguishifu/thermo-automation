import { MoreVertical } from 'lucide-react';

import { AutomationItemOptions } from '@/components/automations/AutomationItemOptions';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { ClientAutomationSchema } from '@/db/types';

export function AutomationItem({ automation }: { automation: ClientAutomationSchema }) {
  return (
    <Card className="p-4">
      <CardTitle className="flex items-center justify-between">
        <span>Automation ID: {automation.id}</span>
        <AutomationItemOptions automationId={automation.id}>
          <MoreVertical size={16} />
        </AutomationItemOptions>
      </CardTitle>
      <CardDescription>
        <p>Created: {new Date(automation.createdAtMillis).toLocaleString()}</p>
        <p>Temperature Buffer: {automation.bufferDegrees}°C</p>
      </CardDescription>
    </Card>
  );
}
