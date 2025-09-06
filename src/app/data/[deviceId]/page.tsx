import { DeviceDataGraph } from '@/components/data/DeviceDataGraph';
import { DeviceDataPageBreadcrumbs } from '@/components/data/DeviceDataPageBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';

export default async function DeviceDataPage({ params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params;

  return (
    <PageWrapper>
      <PageHeader>
        <DeviceDataPageBreadcrumbs deviceId={deviceId} />
      </PageHeader>
      <PageContent>
        <DeviceDataGraph deviceId={deviceId} />
      </PageContent>
    </PageWrapper>
  );
}
