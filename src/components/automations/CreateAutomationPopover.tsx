'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { useCreateAutomationMutation } from '@/api/automationsApiSlice';
import { Temperature } from '@/components/devices/Temperature';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useDevices } from '@/hooks/useDevices';
import { useAppSelector } from '@/state/store';

const formSchema = z.object({
  deviceId: z.string(),
  bufferDegrees: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = { children: React.ReactNode; asChild?: boolean };

export function CreateAutomationPopover({ children, asChild }: Props) {
  const temperatureDisplay = useAppSelector((state) => state.settings.temperatureDisplay);
  const { devices, isLoading: devicesLoading } = useDevices();

  const [open, setOpen] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceId: '',
      bufferDegrees: 3,
    },
  });

  const [createAutomation, { isLoading }] = useCreateAutomationMutation();

  const handleSubmit = useCallback(
    (values: FormSchema) => {
      if (isLoading) {
        return;
      }

      createAutomation(values)
        .unwrap()
        .then(() => setOpen(false));
    },
    [createAutomation, isLoading],
  );

  const handleOpenChange = useCallback(
    (value: boolean) => {
      setOpen(value);
      form.reset();
    },
    [form],
  );

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent>
        {devicesLoading ? (
          <Spinner />
        ) : (
          <>
            <h1>Create Automation</h1>
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
                  name="bufferDegrees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buffer Degrees</FormLabel>
                      <FormDescription>
                        The temperature buffer range for the automation. Min 1°C, max 5°C
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
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
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
