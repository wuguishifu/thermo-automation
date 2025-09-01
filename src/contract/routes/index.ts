import { c } from '@/contract/contract';
import { devicesRouter } from '@/contract/routes/devicesRouter';
import { thermostatRouter } from '@/contract/routes/thermostatRouter';

export const apiRouter = c.router(
  {
    devices: devicesRouter,
    thermostat: thermostatRouter,
  },
  {
    pathPrefix: '/api',
  },
);
