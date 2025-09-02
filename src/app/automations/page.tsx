import { AutomationsList } from '@/components/automations/AutomationsList';
import { AppBreadcrumbs } from '@/components/layout/AppBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';

const breadcrumbs = [
  { url: '/', title: 'Home' },
  { url: '/automations', title: 'Automations' },
];

export default function Automations() {
  return (
    <PageWrapper>
      <PageHeader>
        <AppBreadcrumbs>{breadcrumbs}</AppBreadcrumbs>
      </PageHeader>
      <PageContent>
        <h1 className="text-2xl font-bold">All Automations</h1>
        <AutomationsList />
      </PageContent>
    </PageWrapper>
  );
}
