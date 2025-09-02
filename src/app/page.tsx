'use client';

import { Cog, Thermometer, Workflow } from 'lucide-react';
import Link from 'next/link';

import { AppBreadcrumbs } from '@/components/layout/AppBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';
import { ChordBadge } from '@/components/menus/ChordBadge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <PageWrapper>
      <PageHeader>
        <AppBreadcrumbs>{[{ url: '/', title: 'Home' }]}</AppBreadcrumbs>
      </PageHeader>
      <PageContent>
        <div className="flex flex-row justify-center items-center gap-4 h-full">
          <Link href="/devices">
            <Card className="hover:scale-110 transition-all duration-300 w-48">
              <CardHeader className="flex flex-col items-center">
                <CardTitle>Devices</CardTitle>
                <CardDescription className="w-full text-center">View all your thermostats</CardDescription>
              </CardHeader>
              <CardContent className="w-full items-center flex justify-center">
                <Thermometer className="size-16" strokeWidth={1} />
              </CardContent>
              <CardFooter className="flex justify-center">
                <ChordBadge className="text-sm opacity-50">{['G', 'd']}</ChordBadge>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/automations">
            <Card className="hover:scale-110 transition-all duration-300 w-48">
              <CardHeader className="flex flex-col items-center">
                <CardTitle>Automations</CardTitle>
                <CardDescription className="w-full text-center">View all your automations</CardDescription>
              </CardHeader>
              <CardContent className="w-full items-center flex justify-center">
                <Workflow className="size-16" strokeWidth={1} />
              </CardContent>
              <CardFooter className="flex justify-center">
                <ChordBadge className="text-sm opacity-50">{['G', 'a']}</ChordBadge>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/settings">
            <Card className="hover:scale-110 transition-all duration-300 w-48">
              <CardHeader className="flex flex-col items-center">
                <CardTitle>Settings</CardTitle>
                <CardDescription className="w-full text-center">Manage your preferences</CardDescription>
              </CardHeader>
              <CardContent className="w-full items-center flex justify-center">
                <Cog className="size-16" strokeWidth={1} />
              </CardContent>
              <CardFooter className="flex justify-center">
                <ChordBadge className="text-sm opacity-50">{['G', 's']}</ChordBadge>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </PageContent>
    </PageWrapper>
  );
}
