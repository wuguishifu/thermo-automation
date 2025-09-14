import { addDays, format, subDays } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function GraphDatePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = useMemo(() => {
    const startDateParam = searchParams.get('start');
    if (startDateParam) {
      // Parse numeric timestamp and create date at midnight in local timezone
      const timestamp = parseInt(startDateParam, 10);
      const date = new Date(timestamp);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    return subDays(new Date(), 1);
  }, [searchParams]);

  const [open, setOpen] = useState(false);

  const handleDateChange = useCallback(
    (newStartDate: Date) => {
      const params = new URLSearchParams(searchParams);
      // Store as numeric timestamp representing midnight in local timezone
      const localMidnight = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), newStartDate.getDate());
      params.set('start', localMidnight.getTime().toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handlePreviousDay = useCallback(() => {
    const previousDay = subDays(startDate, 1);
    handleDateChange(previousDay);
  }, [startDate, handleDateChange]);

  const handleNextDay = useCallback(() => {
    const nextDay = addDays(startDate, 1);
    handleDateChange(nextDay);
  }, [startDate, handleDateChange]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={handlePreviousDay} className="size-9" title="Previous day">
          <ChevronLeft className="size-4" />
        </Button>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="start-date"
              variant="outline"
              className={cn('w-[260px] justify-start text-left font-normal', { 'text-muted-foreground': !startDate })}
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
        <Button variant="outline" size="icon" onClick={handleNextDay} className="size-9" title="Next day">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
