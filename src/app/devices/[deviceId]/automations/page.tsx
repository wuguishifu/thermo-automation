import { AutomationsList } from '@/components/automations/AutomationsList';
import { AutomationsPageBreadcrumbs } from '@/components/automations/AutomationsPageBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';

export default async function DeviceAutomations({ params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params;

  return (
    <PageWrapper>
      <PageHeader>
        <AutomationsPageBreadcrumbs deviceId={deviceId} />
      </PageHeader>
      <PageContent>
        <h1 className="text-2xl font-bold">Automations</h1>
        <AutomationsList deviceId={deviceId} />
      </PageContent>
    </PageWrapper>
  );
}
