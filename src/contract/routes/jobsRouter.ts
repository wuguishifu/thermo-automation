import z from 'zod';

import { c } from '@/contract/contract';

export const jobsRouter = c.router(
  {
    debugGetCurrentJobs: {
      summary: 'Get current jobs for debugging',
      method: 'GET',
      path: '/current',
      query: z.object({
        timezone: z.string().default('UTC'),
      }),
      responses: {
        200: z.any().optional(),
      },
    },
    handleAutomationJob: {
      summary: 'Cron job endpoint',
      method: 'POST',
      path: '/automation',
      body: c.noBody(),
      responses: {
        200: z.literal('ok'),
      },
    },
    recordCurrentStatus: {
      summary: 'Record current status of devices',
      method: 'POST',
      path: '/statuses',
      body: c.noBody(),
      responses: {
        200: z.literal('ok'),
      },
    },
  },
  {
    pathPrefix: '/jobs',
  },
);
