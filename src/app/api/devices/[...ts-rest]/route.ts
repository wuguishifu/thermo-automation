import { createNextHandler } from '@ts-rest/serverless/next';

import { rootRouter } from '@/contract/rootRouter';
import { errorHandler } from '@/server/errorHandler';
import { httpService } from '@/server/httpService';
import { Device, DeviceInformation } from '@/types/device';

const handler = createNextHandler(
  rootRouter.api.devices,
  {
    listDevices: async () => {
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
  {
    handlerType: 'app-router',
    jsonQuery: true,
    responseValidation: true,
    errorHandler,
  },
);

export { handler as GET };
