import { useAppSelector } from '@/state/store';

export function Temperature({ celsiusValue }: { celsiusValue: number }) {
  const temperatureDisplay = useAppSelector((state) => state.settings.temperatureDisplay);

  if (temperatureDisplay === 'Celsius') {
    return <span>{celsiusValue.toFixed(1)}°C</span>;
  }

  if (temperatureDisplay === 'Fahrenheit') {
    const fahrenheitValue = celsiusValue * 1.8 + 32;
    return <span>{fahrenheitValue.toFixed(1)}°F</span>;
  }

  return <span>{celsiusValue.toFixed(1)}°C</span>;
}
