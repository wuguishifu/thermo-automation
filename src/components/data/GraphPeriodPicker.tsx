import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function GraphPeriodPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const periodParam = searchParams.get('period');
  const period = periodParam ? parseInt(periodParam, 10) : 2;

  const handlePeriodChange = useCallback(
    (newPeriod: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('period', newPeriod.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="flex items-center gap-2">
      <Select value={period.toString()} onValueChange={(value) => handlePeriodChange(parseInt(value))}>
        <SelectTrigger className="w-[120px]" id="period">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 Day</SelectItem>
          <SelectItem value="2">2 Day</SelectItem>
          <SelectItem value="7">7 Days</SelectItem>
          <SelectItem value="30">30 Days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
