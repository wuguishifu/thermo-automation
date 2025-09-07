import { subDays } from 'date-fns';
import { redirect } from 'next/navigation';

import { DeviceDataGraph } from '@/components/data/DeviceDataGraph';
import { DeviceDataPageBreadcrumbs } from '@/components/data/DeviceDataPageBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';

export default async function DeviceDataPage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string>;
  params: Promise<{ deviceId: string }>;
}) {
  const { deviceId } = await params;
  const { start, period } = searchParams;

  if (!start || !period) {
    return redirect(`/data/${deviceId}?start=${subDays(new Date(), 1).toISOString()}&period=2`);
  }

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
