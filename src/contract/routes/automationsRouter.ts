import z from 'zod';

import { c } from '@/contract/contract';
import { Automation } from '@/types/automation';

export const automationsRouter = c.router(
  {
    listAutomations: {
      summary: 'Get automations',
      method: 'GET',
      path: '/',
      query: z.object({
        deviceId: z.string().optional(),
      }),
      responses: {
        200: z.array(Automation),
      },
    },
    createAutomation: {
      summary: 'Create an automation',
      method: 'POST',
      path: '/',
      body: z.object({
        deviceId: z.string(),
        startsAt: z.string(),
        endsAt: z.string(),
        maxTemperature: z.number().optional(),
        minTemperature: z.number().optional(),
        bufferDegrees: z.number(),
        wraps: z.boolean(),
      }),
      responses: {
        201: Automation,
      },
    },
    deleteAutomation: {
      summary: 'Delete an automation',
      method: 'DELETE',
      path: '/',
      query: z.object({
        id: z.number(),
      }),
      responses: {
        200: z.object({
          deleted: z.literal(true),
        }),
      },
    },
  },
  {
    pathPrefix: '/automations',
  },
);
