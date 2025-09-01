import { DeviceInfo } from '@/components/devices/DeviceInfo';
import { DevicePageBreadcrumbs } from '@/components/devices/DevicePageBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';

export default async function DevicePage({ params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params;

  return (
    <PageWrapper>
      <PageHeader>
        <DevicePageBreadcrumbs deviceId={deviceId} />
      </PageHeader>
      <PageContent>
        <DeviceInfo deviceId={deviceId} />
      </PageContent>
    </PageWrapper>
  );
}
