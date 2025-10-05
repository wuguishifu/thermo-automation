'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { useUpdateAutomationMutation } from '@/api/automationsApiSlice';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDevices } from '@/hooks/useDevices';
import {
  convertNonLocalizedTemperature,
  convertTemperature,
  convertTemperatureForStorage,
  getTemperatureUnitSymbol,
} from '@/lib/utils/temperature';
import { useAppSelector } from '@/state/store';
import { Automation } from '@/types/automation';

function to24Hour(value: string): string {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return value;
  }
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === 'AM') {
    if (hours === 12) {
      hours = 0;
    }
  } else if (ampm === 'PM') {
    if (hours !== 12) {
      hours += 12;
    }
  }
  const hh = String(hours).padStart(2, '0');
  return `${hh}:${minutes}`;
}

const formSchema = z.object({
  id: z.number(),
  deviceId: z.string(),
  startsAt: z.string().min(1, 'Start time is required'),
  endsAt: z.string().min(1, 'End time is required'),
  maxTemperature: z.number().nullable().optional(),
  minTemperature: z.number().nullable().optional(),
  bufferDegrees: z.number().min(0.5).max(5),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = { open: boolean; onOpenChange: (open: boolean) => void; automation: Automation };

export function EditAutomationDialog({ open, onOpenChange, automation }: Props) {
  const { devices } = useDevices();
  const temperatureDisplay = useAppSelector((state) => state.settings.temperatureDisplay);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: automation.id,
      deviceId: automation.deviceId,
      startsAt: to24Hour(automation.startsAt),
      endsAt: to24Hour(automation.endsAt),
      maxTemperature:
        automation.maxTemperature != null
          ? Number(convertTemperature(automation.maxTemperature, temperatureDisplay).toFixed(1))
          : undefined,
      minTemperature:
        automation.minTemperature != null
          ? Number(convertTemperature(automation.minTemperature, temperatureDisplay).toFixed(1))
          : undefined,
      bufferDegrees: Number(
        (temperatureDisplay === 'Fahrenheit' ? automation.bufferDegrees * 1.8 : automation.bufferDegrees).toFixed(1),
      ),
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    form.reset({
      id: automation.id,
      deviceId: automation.deviceId,
      startsAt: to24Hour(automation.startsAt),
      endsAt: to24Hour(automation.endsAt),
      maxTemperature:
        automation.maxTemperature != null
          ? Number(convertTemperature(automation.maxTemperature, temperatureDisplay).toFixed(1))
          : undefined,
      minTemperature:
        automation.minTemperature != null
          ? Number(convertTemperature(automation.minTemperature, temperatureDisplay).toFixed(1))
          : undefined,
      bufferDegrees: Number(
        (temperatureDisplay === 'Fahrenheit' ? automation.bufferDegrees * 1.8 : automation.bufferDegrees).toFixed(1),
      ),
    });
  }, [open, automation, form, temperatureDisplay]);

  const [updateAutomation, { isLoading }] = useUpdateAutomationMutation();

  const handleSubmit = useCallback(
    (values: FormSchema) => {
      if (isLoading) {
        return;
      }

      const submitValues = {
        id: automation.id,
        deviceId: values.deviceId,
        startsAt: values.startsAt,
        endsAt: values.endsAt,
        maxTemperature:
          values.maxTemperature != null
            ? convertTemperatureForStorage(values.maxTemperature, temperatureDisplay)
            : null,
        minTemperature:
          values.minTemperature != null
            ? convertTemperatureForStorage(values.minTemperature, temperatureDisplay)
            : null,
        bufferDegrees: convertNonLocalizedTemperature(values.bufferDegrees, temperatureDisplay),
      } as const;

      updateAutomation(submitValues)
        .unwrap()
        .then(() => onOpenChange(false));
    },
    [automation.id, isLoading, onOpenChange, temperatureDisplay, updateAutomation],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Edit Automation</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device</FormLabel>
                  <FormDescription>The device to automate</FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Device" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {devices.map((device) => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.name} ({device.locationName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startsAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormDescription>When the automation should start</FormDescription>
                  <FormControl>
                    <Input type="time" value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endsAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormDescription>When the automation should end</FormDescription>
                  <FormControl>
                    <Input type="time" value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxTemperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Temperature ({getTemperatureUnitSymbol(temperatureDisplay)})</FormLabel>
                  <FormDescription>Maximum temperature threshold (optional)</FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.1}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      placeholder="No limit"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minTemperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Temperature ({getTemperatureUnitSymbol(temperatureDisplay)})</FormLabel>
                  <FormDescription>Minimum temperature threshold (optional)</FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.1}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      placeholder="No limit"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bufferDegrees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buffer Degrees ({getTemperatureUnitSymbol(temperatureDisplay)})</FormLabel>
                  <FormDescription>
                    The temperature buffer range for the automation. Min 1{getTemperatureUnitSymbol(temperatureDisplay)}
                    , max 5{getTemperatureUnitSymbol(temperatureDisplay)}
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      min={temperatureDisplay === 'Fahrenheit' ? 1 : 0.5}
                      max={temperatureDisplay === 'Fahrenheit' ? 10 : 5}
                      step={0.1}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4 mt-4">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
