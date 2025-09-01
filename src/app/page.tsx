'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { useListDevicesQuery } from '@/api/devicesApiSlice';
import { Card, CardTitle } from '@/components/ui/card';

export default function Home() {
  const { data } = useListDevicesQuery();

  const locations = useMemo(() => {
    return data?.map((location) => location.locationName);
  }, [data]);

  return (
    <main className="py-8 px-4 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold">Locations</h1>
      <div className="mt-4 flex items-center flex-wrap">
        {locations?.map((location) => (
          <Link key={location} href={`/locations/${location}`}>
            <Card className="w-48">
              <CardTitle className="text-center text-lg font-semibold">{location}</CardTitle>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
