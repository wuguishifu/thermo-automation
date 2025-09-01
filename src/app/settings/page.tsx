'use client';

import { AppBreadcrumbs } from '@/components/layout/AppBreadcrumbs';
import { PageContent, PageHeader, PageWrapper } from '@/components/layout/PageLayout';
import { Toggle } from '@/components/ui/toggle';
import { settingsActions } from '@/state/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

export default function Settings() {
  const dispatch = useAppDispatch();
  const temperatureDisplay = useAppSelector((state) => state.settings.temperatureDisplay);

  return (
    <PageWrapper>
      <PageHeader>
        <AppBreadcrumbs>
          {[
            { url: '/', title: 'Home' },
            { url: '/settings', title: 'Settings' },
          ]}
        </AppBreadcrumbs>
      </PageHeader>
      <PageContent>
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex items-center gap-2">
          Temperature Display
          <Toggle
            type="button"
            className="cursor-pointer"
            onClick={() => dispatch(settingsActions.setTemperatureDisplay('Fahrenheit'))}
            pressed={temperatureDisplay === 'Fahrenheit'}
          >
            °F
          </Toggle>
          <Toggle
            type="button"
            className="cursor-pointer"
            onClick={() => dispatch(settingsActions.setTemperatureDisplay('Celsius'))}
            pressed={temperatureDisplay === 'Celsius'}
          >
            °C
          </Toggle>
        </div>
      </PageContent>
    </PageWrapper>
  );
}
