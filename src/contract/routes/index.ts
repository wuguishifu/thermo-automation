import { c } from '@/contract/contract';
import { automationsRouter } from '@/contract/routes/automationsRouter';
import { dataRouter } from '@/contract/routes/dataRouter';
import { devicesRouter } from '@/contract/routes/devicesRouter';
import { jobsRouter } from '@/contract/routes/jobsRouter';
import { thermostatRouter } from '@/contract/routes/thermostatRouter';

export const apiRouter = c.router(
  {
    devices: devicesRouter,
    thermostat: thermostatRouter,
    automations: automationsRouter,
    jobs: jobsRouter,
    data: dataRouter,
  },
  {
    pathPrefix: '/api',
  },
);
