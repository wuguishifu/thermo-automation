import { DevicesList } from '@/components/devices/DevicesList';
import { AppBreadcrumbs } from '@/components/layout/AppBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';

export default function RootDevicesList() {
  return (
    <PageWrapper>
      <PageHeader>
        <AppBreadcrumbs>
          {[
            { url: '/', title: 'Home' },
            { url: '/devices', title: 'All Devices' },
          ]}
        </AppBreadcrumbs>
      </PageHeader>
      <PageContent>
        <h1 className="text-2xl font-bold">All Devices</h1>
        <DevicesList />
      </PageContent>
    </PageWrapper>
  );
}
