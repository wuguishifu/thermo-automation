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
import { useDevices } from '@/hooks/useDevices';

const formSchema = z.object({
  deviceId: z.string(),
  startsAt: z.string().min(1, 'Start time is required'),
  endsAt: z.string().min(1, 'End time is required'),
  maxTemperature: z.number().optional(),
  minTemperature: z.number().optional(),
  bufferDegrees: z.number().min(1).max(5),
  wraps: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = { children: React.ReactNode; asChild?: boolean };

export function CreateAutomationDialog({ children, asChild }: Props) {
  const { devices, isLoading: devicesLoading } = useDevices();

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
                    <FormLabel>Max Temperature (°C)</FormLabel>
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
                    <FormLabel>Min Temperature (°C)</FormLabel>
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
                    <FormLabel>Buffer Degrees</FormLabel>
                    <FormDescription>The temperature buffer range for the automation. Min 1°C, max 5°C</FormDescription>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
