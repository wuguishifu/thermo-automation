import z from 'zod';

import { c } from '@/contract/contract';

export const jobsRouter = c.router(
  {
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
