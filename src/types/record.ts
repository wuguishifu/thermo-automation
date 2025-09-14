import z from 'zod';

export const Record = z.object({
  id: z.number(),
  deviceId: z.string(),
  recordedAtMs: z.number(),
  maxTemperature: z.number(),
  minTemperature: z.number(),
  currentTemperature: z.number(),
  currentHumidity: z.number(),
  currentMode: z.number(),
});
export type Record = z.infer<typeof Record>;
