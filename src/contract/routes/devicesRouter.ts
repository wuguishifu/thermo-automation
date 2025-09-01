import z from 'zod';

import { c } from '@/contract/contract';
import { DeviceInformation } from '@/types/device';

export const devicesRouter = c.router(
  {
    listDevices: {
      summary: 'List all devices',
      method: 'GET',
      path: '/devices',
      responses: {
        200: z.array(
          z.object({
            locationName: z.string(),
            devices: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                model: z.string(),
                firmwareVersion: z.string(),
              }),
            ),
          }),
        ),
      },
    },
    getDeviceInfo: {
      summary: 'Get info for a device',
      method: 'GET',
      path: '/devices/:id',
      pathParams: z.object({
        id: z.string(),
      }),
      responses: {
        200: DeviceInformation,
      },
    },
  },
  {
    pathPrefix: '/thermostat',
  },
);
