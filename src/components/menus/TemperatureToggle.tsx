'use client';

import { Thermometer } from 'lucide-react';

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { settingsActions } from '@/state/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/state/store';

export function TemperatureToggle() {
  const dispatch = useAppDispatch();
  const temperatureDisplay = useAppSelector((state) => state.settings.temperatureDisplay);

  const toggleTemperature = () => {
    const newUnit = temperatureDisplay === 'Celsius' ? 'Fahrenheit' : 'Celsius';
    dispatch(settingsActions.setTemperatureDisplay(newUnit));
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={toggleTemperature}
        className="cursor-pointer"
        tooltip={`Switch to ${temperatureDisplay === 'Celsius' ? 'Fahrenheit' : 'Celsius'}`}
      >
        <Thermometer />
        <span>{temperatureDisplay === 'Celsius' ? 'Switch to °F' : 'Switch to °C'}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
