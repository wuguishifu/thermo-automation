import { redirect } from 'next/navigation';

import { DeviceDataGraph } from '@/components/data/DeviceDataGraph';
import { DeviceDataPageBreadcrumbs } from '@/components/data/DeviceDataPageBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';
import { subDays } from 'date-fns';

export default async function DeviceDataPage({
  searchParams,
  params,
}:{
  searchParams: Promise<Partial<{ start: string; period: string }>>;
  params: Promise<{ deviceId: string }>;
}) {
  const { deviceId } = await params;
  const { start, period } = await searchParams;

  if (!start || !period) {
    const params = new URLSearchParams();
    params.set('start', start ?? subDays(new Date(), 1).toISOString());
    params.set('period', period ?? '2');
    return redirect(`/data/${deviceId}?${params.toString()}`);
  }

  return (
    <PageWrapper>
      <PageHeader>
        <DeviceDataPageBreadcrumbs deviceId={deviceId} />
      </PageHeader>
      <PageContent>
        <DeviceDataGraph deviceId={deviceId} startDate={new Date(start)} period={parseInt(period, 10)} />
      </PageContent>
    </PageWrapper>
  );
}
