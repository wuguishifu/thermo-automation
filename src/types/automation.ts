import z from 'zod';

export const Automation = z.object({
  deviceId: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  maxTemperature: z.number().nullish(),
  minTemperature: z.number().nullish(),
  bufferDegrees: z.number(),
  id: z.number(),
  createdAt: z.date(),
  enabled: z.boolean(),
});
export type Automation = z.infer<typeof Automation>;
