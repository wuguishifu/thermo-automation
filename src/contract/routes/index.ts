import { c } from '@/contract/contract';
import { automationsRouter } from '@/contract/routes/automationsRouter';
import { devicesRouter } from '@/contract/routes/devicesRouter';
import { jobsRouter } from '@/contract/routes/jobsRouter';
import { thermostatRouter } from '@/contract/routes/thermostatRouter';

export const apiRouter = c.router(
  {
    devices: devicesRouter,
    thermostat: thermostatRouter,
    automations: automationsRouter,
    jobs: jobsRouter,
  },
  {
    pathPrefix: '/api',
  },
);
