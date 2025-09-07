import { createNextHandler } from '@ts-rest/serverless/next';
import { addDays } from 'date-fns';

import { rootRouter } from '@/contract/rootRouter';
import { dataService } from '@/server/dataService';
import { errorHandler } from '@/server/errorHandler';

const handler = createNextHandler(
  rootRouter.api.data,
  {
    getDeviceData: async ({ params: { deviceId }, query: { startDate: startDateISOString, period = 1 } }) => {
      const startDate = new Date(startDateISOString);
      const endDate = addDays(startDate, period);

      const data = await dataService.getHistoricalData({ deviceId, startDate, endDate });
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
