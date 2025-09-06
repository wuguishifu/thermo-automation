import z from 'zod';

import { c } from '@/contract/contract';

export const thermostatRouter = c.router(
  {
    updateMode: {
      summary: 'Update the thermostat mode',
      method: 'PUT',
      path: '/mode',
      body: z.object({
        deviceId: z.string(),
        mode: z.number(),
        heatSetpoint: z.number(),
        coolSetpoint: z.number(),
      }),
      responses: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
  },
  {
    pathPrefix: '/thermostat',
  },
);
