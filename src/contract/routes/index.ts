import { c } from '@/contract/contract';
import { automationsRouter } from '@/contract/routes/automationsRouter';
import { devicesRouter } from '@/contract/routes/devicesRouter';
import { thermostatRouter } from '@/contract/routes/thermostatRouter';

export const apiRouter = c.router(
  {
    devices: devicesRouter,
    thermostat: thermostatRouter,
    automations: automationsRouter,
  },
  {
    pathPrefix: '/api',
  },
);
