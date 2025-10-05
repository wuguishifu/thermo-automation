import { redirect } from 'next/navigation';

import { DeviceDataGraph } from '@/components/data/DeviceDataGraph';
import { DeviceDataPageBreadcrumbs } from '@/components/data/DeviceDataPageBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';
import { cookies } from 'next/headers';

export default async function DeviceDataPage({
  searchParams,
  params,
}: {
  searchParams: Promise<Partial<{ start: string; period: string }>>;
  params: Promise<{ deviceId: string }>;
}) {
  const cookiesStore = await cookies();
  const showLabels = cookiesStore.get('show_labels')?.value !== 'false';

  const { deviceId } = await params;
  const { start, period } = await searchParams;

  if (!start || !period) {
    const params = new URLSearchParams();
    const defaultDate = new Date();
    const localMidnight = new Date(defaultDate.getFullYear(), defaultDate.getMonth(), defaultDate.getDate());
    params.set('start', start ?? localMidnight.getTime().toString());
    params.set('period', period ?? '1');
    return redirect(`/data/${deviceId}?${params.toString()}`);
  }

  return (
    <PageWrapper>
      <PageHeader>
        <DeviceDataPageBreadcrumbs deviceId={deviceId} />
      </PageHeader>
      <PageContent>
        <DeviceDataGraph deviceId={deviceId} startDate={new Date(parseInt(start, 10))} period={parseInt(period, 10)} showLabels={showLabels} />
      </PageContent>
    </PageWrapper>
  );
}
