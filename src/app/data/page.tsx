import { DevicesList } from '@/components/devices/DevicesList';
import { AppBreadcrumbs } from '@/components/layout/AppBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';

export default function DataIndex() {
  return (
    <PageWrapper>
      <PageHeader>
        <AppBreadcrumbs>
          {[
            { url: '/', title: 'Home' },
            { url: '/data', title: 'Data' },
          ]}
        </AppBreadcrumbs>
      </PageHeader>
      <PageContent>
        <h1 className="text-2xl font-bold">Select a Device</h1>
        <DevicesList routePrefix="data" />
      </PageContent>
    </PageWrapper>
  );
}
