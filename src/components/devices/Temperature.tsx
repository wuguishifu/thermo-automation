import { formatTemperature } from '@/lib/utils/temperature';
import { useAppSelector } from '@/state/store';

export function Temperature({ celsiusValue }: { celsiusValue: number }) {
  const temperatureDisplay = useAppSelector((state) => state.settings.temperatureDisplay);
  return <span>{formatTemperature(celsiusValue, temperatureDisplay)}</span>;
}
