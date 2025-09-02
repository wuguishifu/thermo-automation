import z from 'zod';

import { c } from '@/contract/contract';

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
        200: z.array(
          z.object({
            id: z.number(),
            deviceId: z.string(),
            bufferDegrees: z.number(),
            createdAtMillis: z.number(),
          }),
        ),
      },
    },
    createAutomation: {
      summary: 'Create an automation',
      method: 'POST',
      path: '/',
      body: z.object({
        deviceId: z.string(),
        bufferDegrees: z.number(),
      }),
      responses: {
        201: z.object({
          id: z.number(),
          deviceId: z.string(),
          bufferDegrees: z.number(),
          createdAtMillis: z.number(),
        }),
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
