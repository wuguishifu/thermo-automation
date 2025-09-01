import { createNextHandler } from '@ts-rest/serverless/next';

import { rootRouter } from '@/contract/rootRouter';
import { errorHandler } from '@/server/errorHandler';
import { httpService } from '@/server/httpService';
import { Device, DeviceInformation } from '@/types/device';

const handler = createNextHandler(
  rootRouter.api,
  {
    devices: {
      listDevices: async () => {
        console.log('list devices');
        const response = await httpService.get<{ locationName: string; devices: Device[] }[]>('devices');
        return {
          status: 200,
          body: response.data,
        };
      },
      getDeviceInfo: async ({ params }) => {
        const response = await httpService.get<DeviceInformation>(`devices/${params.id}`);
        return {
          status: 200,
          body: response.data,
        };
      },
    },
    thermostat: {
      updateMode: async ({ body }) => {
        const response = await httpService.put<
          { message: string },
          { body: { mode: number; heatSetpoint: number; coolSetpoint: number } }
        >(`/devices/${body.deviceId}/msp`, {
          body: {
            mode: body.mode,
            heatSetpoint: body.heatSetpoint,
            coolSetpoint: body.coolSetpoint,
          },
        });

        return {
          status: 200,
          body: response.data,
        };
      },
    },
  },
  {
    handlerType: 'app-router',
    jsonQuery: true,
    responseValidation: true,
    errorHandler,
  },
);

export { handler as GET, handler as POST };
