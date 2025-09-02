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
        <AutomationsList />
      </PageContent>
    </PageWrapper>
  );
}
