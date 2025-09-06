import z from 'zod';

import { c } from '@/contract/contract';
import { Record } from '@/types/record';

export const dataRouter = c.router(
  {
    getDeviceData: {
      summary: 'Get historical data for a device',
      method: 'GET',
      path: '/history/:deviceId',
      pathParams: z.object({
        deviceId: z.string(),
      }),
      query: z.object({
        startDate: z.string(),
        periodDays: z.number().optional(),
      }),
      responses: {
        200: z.array(Record),
      },
    },
  },
  {
    pathPrefix: '/data',
  },
);
