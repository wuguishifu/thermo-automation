import z from 'zod';

import { c } from '@/contract/contract';
import { Automation } from '@/types/automation';

export const automationsRouter = c.router(
  {
    listAutomations: {
      summary: 'Get automations',
      method: 'GET',
      path: '/list',
      query: z.object({
        deviceId: z.string().optional(),
      }),
      responses: {
        200: z.array(Automation),
      },
    },
    updateAutomation: {
      summary: 'Update an automation',
      method: 'POST',
      path: '/update',
      body: z.object({
        id: z.number(),
        deviceId: z.string().optional(),
        startsAt: z.string().optional(),
        endsAt: z.string().optional(),
        maxTemperature: z.number().optional().nullable(),
        minTemperature: z.number().optional().nullable(),
        bufferDegrees: z.number().optional(),
        daysMask: z.number().optional(),
      }),
      responses: {
        200: Automation,
      },
    },
    createAutomation: {
      summary: 'Create an automation',
      method: 'POST',
      path: '/create',
      body: z.object({
        deviceId: z.string(),
        startsAt: z.string(),
        endsAt: z.string(),
        maxTemperature: z.number().optional(),
        minTemperature: z.number().optional(),
        bufferDegrees: z.number(),
        daysMask: z.number(),
      }),
      responses: {
        201: Automation,
      },
    },
    deleteAutomation: {
      summary: 'Delete an automation',
      method: 'DELETE',
      path: '/delete',
      query: z.object({
        id: z.number(),
      }),
      responses: {
        200: z.object({
          deleted: z.literal(true),
        }),
      },
    },
    enableAutomation: {
      summary: 'Enable an automation',
      method: 'POST',
      path: '/enable',
      body: z.object({
        id: z.number(),
      }),
      responses: {
        200: z.literal('ok'),
      },
    },
    disableAutomation: {
      summary: 'Disable an automation',
      method: 'POST',
      path: '/disable',
      body: z.object({
        id: z.number(),
      }),
      responses: {
        200: z.literal('ok'),
      },
    },
  },
  {
    pathPrefix: '/automations',
  },
);
