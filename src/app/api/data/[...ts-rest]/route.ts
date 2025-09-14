import { createNextHandler } from '@ts-rest/serverless/next';

import { rootRouter } from '@/contract/rootRouter';
import { dataService } from '@/server/dataService';
import { errorHandler } from '@/server/errorHandler';

const handler = createNextHandler(
  rootRouter.api.data,
  {
    getDeviceData: async ({ params: { deviceId }, query: { startDateMs, period = 1 } }) => {
      const startDateMsNum = parseInt(startDateMs, 10);
      const endDateMs = startDateMsNum + period * 24 * 60 * 60 * 1000; // Add days in milliseconds

      const data = await dataService.getHistoricalData({ deviceId, startDateMs: startDateMsNum, endDateMs });
      return { status: 200, body: data };
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
