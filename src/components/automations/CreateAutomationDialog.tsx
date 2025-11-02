'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { useCreateAutomationMutation } from '@/api/automationsApiSlice';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { fromDaysMask, toDaysMask } from '@/db/schema';
import { useDevices } from '@/hooks/useDevices';
import {
  convertNonLocalizedTemperature,
  convertTemperatureForStorage,
  getTemperatureUnitSymbol,
} from '@/lib/utils/temperature';
import { useAppSelector } from '@/state/store';

const formSchema = z.object({
  deviceId: z.string(),
  startsAt: z.string().min(1, 'Start time is required'),
  endsAt: z.string().min(1, 'End time is required'),
  maxTemperature: z.number().optional(),
  minTemperature: z.number().optional(),
  bufferDegrees: z.number().min(0.5).max(5),
  wraps: z.boolean(),
  daysMask: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = { children: React.ReactNode; asChild?: boolean };

export function CreateAutomationDialog({ children, asChild }: Props) {
  const { devices, isLoading: devicesLoading } = useDevices();
  const temperatureDisplay = useAppSelector((state) => state.settings.temperatureDisplay);

  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceId: '',
      startsAt: '',
      endsAt: '',
      maxTemperature: undefined,
      minTemperature: undefined,
      bufferDegrees: 2,
      wraps: false,
      daysMask: 0,
    },
  });

  const [createAutomation, { isLoading }] = useCreateAutomationMutation();

  const handleSubmit = useCallback(
    (values: FormSchema) => {
      if (isLoading) {
        return;
      }

      if (!values.deviceId) {
        toast.error('Please select a device');
        return;
      }

      if (!values.startsAt) {
        toast.error('Please select a start time');
        return;
      }

      if (!values.endsAt) {
        toast.error('Please select an end time');
        return;
      }

      // Convert temperatures from display units to Celsius for storage
      const submitValues = {
        ...values,
        maxTemperature: values.maxTemperature
          ? convertTemperatureForStorage(values.maxTemperature, temperatureDisplay)
          : undefined,
        minTemperature: values.minTemperature
          ? convertTemperatureForStorage(values.minTemperature, temperatureDisplay)
          : undefined,
        bufferDegrees: convertNonLocalizedTemperature(values.bufferDegrees, temperatureDisplay),
        daysMask: values.daysMask,
      };

      createAutomation(submitValues)
        .unwrap()
        .then(() => setOpen(false));
    },
    [createAutomation, isLoading, temperatureDisplay],
  );

  const handleOpenChange = useCallback(
    (value: boolean) => {
      setOpen(value);
      form.reset();
    },
    [form],
  );

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Automation</DialogTitle>
        {devicesLoading ? (
          <Spinner />
        ) : (
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
                name="daysMask"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days</FormLabel>
                    <FormDescription>Days of the week to run this automation</FormDescription>
                    <ToggleGroup
                      type="multiple"
                      className="flex flex-row w-full"
                      onValueChange={(value) => {
                        field.onChange(toDaysMask(value.map(Number)));
                      }}
                      value={fromDaysMask(field.value).map(String)}
                    >
                      <ToggleGroupItem value="0" className="flex-1">
                        S
                      </ToggleGroupItem>
                      <ToggleGroupItem value="1" className="flex-1">
                        M
                      </ToggleGroupItem>
                      <ToggleGroupItem value="2" className="flex-1">
                        T
                      </ToggleGroupItem>
                      <ToggleGroupItem value="3" className="flex-1">
                        W
                      </ToggleGroupItem>
                      <ToggleGroupItem value="4" className="flex-1">
                        R
                      </ToggleGroupItem>
                      <ToggleGroupItem value="5" className="flex-1">
                        F
                      </ToggleGroupItem>
                      <ToggleGroupItem value="6" className="flex-1">
                        S
                      </ToggleGroupItem>
                    </ToggleGroup>
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
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                      The temperature buffer range for the automation. Min 1
                      {getTemperatureUnitSymbol(temperatureDisplay)}, max 5
                      {getTemperatureUnitSymbol(temperatureDisplay)}
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
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Create
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
