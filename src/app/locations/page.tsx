'use client';

import Link from 'next/link';

import { useListDevicesQuery } from '@/api/devicesApiSlice';
import { AppBreadcrumbs, Breadcrumb } from '@/components/layout/AppBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

const breadcrumbs: Breadcrumb[] = [
  { url: '/', title: 'Home' },
  { url: '/locations', title: 'Locations' },
];

export default function Locations() {
  const { data } = useListDevicesQuery();

  return (
    <PageWrapper>
      <PageHeader>
        <AppBreadcrumbs>{breadcrumbs}</AppBreadcrumbs>
      </PageHeader>
      <PageContent>
        <h1 className="text-2xl font-bold">Locations</h1>
        <div className="mt-4 flex items-center flex-wrap">
          {data?.map(({ locationName, devices }) => (
            <Link key={locationName} href={`/locations/${locationName}`}>
              <Card className="w-48">
                <CardTitle className="text-center text-lg font-semibold">{locationName}</CardTitle>
                <CardDescription className="text-center">
                  {devices.length} device{devices.length !== 1 ? 's' : ''}
                </CardDescription>
              </Card>
            </Link>
          ))}
        </div>
      </PageContent>
    </PageWrapper>
  );
}
