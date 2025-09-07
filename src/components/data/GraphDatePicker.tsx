import { Label } from '@radix-ui/react-label';
import { format, subDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function GraphDatePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDateParam = searchParams.get('start');
  const startDate = startDateParam ? new Date(startDateParam) : subDays(new Date(), 1);

  const [open, setOpen] = useState(false);

  const handleDateChange = useCallback(
    (newStartDate: Date) => {
      const params = new URLSearchParams(searchParams);
      params.set('start', newStartDate.toISOString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <Label className="text-sm font-medium flex items-center gap-2">
      <span>Start Date:</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('w-[240px] justify-start text-left font-normal', { 'text-muted-foreground': !startDate })}
          >
            <CalendarIcon className="mr-2 size-4" />
            {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => {
              handleDateChange(date ?? subDays(new Date(), 1));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Label>
  );
}
