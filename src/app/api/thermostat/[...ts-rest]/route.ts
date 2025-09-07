import { createNextHandler } from '@ts-rest/serverless/next';

import { rootRouter } from '@/contract/rootRouter';
import { errorHandler } from '@/server/errorHandler';
import { httpService } from '@/server/httpService';

const handler = createNextHandler(
  rootRouter.api.thermostat,
  {
    updateMode: async ({ body }) => {
      const response = await httpService.put<
        { message: string },
        { mode: number; heatSetpoint: number; coolSetpoint: number }
      >(`/devices/${body.deviceId}/msp`, {
        mode: body.mode,
        heatSetpoint: body.heatSetpoint,
        coolSetpoint: body.coolSetpoint,
      });

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

export { handler as PUT };
