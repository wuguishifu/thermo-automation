import { createNextHandler } from '@ts-rest/serverless/next';

import { rootRouter } from '@/contract/rootRouter';
import { dataService } from '@/server/dataService';
import { errorHandler } from '@/server/errorHandler';
import { requestAuthenticationMiddleware } from '@/server/requestAuthenticationMiddleware';
import { thermostatService } from '@/server/thermostatService';

const handler = createNextHandler(
  rootRouter.api.jobs,
  {
    handleAutomationJob: async () => {
      try {
        await thermostatService.handleJob();
      } catch (error) {
        console.error('Error handling automation job:', error);
      }

      return { status: 200, body: 'ok' };
    },
    recordCurrentStatus: async () => {
      try {
        await dataService.recordCurrentStatuses();
      } catch (error) {
        console.error('Error recording current statuses:', error);
      }

      return { status: 200, body: 'ok' };
    },
  },
  {
    handlerType: 'app-router',
    jsonQuery: true,
    responseValidation: true,
    errorHandler,
    requestMiddleware: [requestAuthenticationMiddleware],
  },
);

export { handler as POST };
