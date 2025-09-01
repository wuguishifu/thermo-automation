import { DevicesList } from '@/components/devices/DevicesList';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';
import { LocationPageBreadcrumbs } from '@/components/locations/LocationPageBreadcrumbs';

export default async function Location({ params }: { params: Promise<{ locationName: string }> }) {
  const { locationName } = await params;

  return (
    <PageWrapper>
      <PageHeader>
        <LocationPageBreadcrumbs locationName={locationName} />
      </PageHeader>
      <PageContent>
        <h1 className="text-2xl font-bold">Devices in {locationName}</h1>
        <DevicesList locationName={locationName} />
      </PageContent>
    </PageWrapper>
  );
}
