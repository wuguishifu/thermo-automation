import { createNextHandler } from '@ts-rest/serverless/next';
import { addDays } from 'date-fns';
import { and, asc, eq, gte, lt } from 'drizzle-orm';

import { rootRouter } from '@/contract/rootRouter';
import { getDb } from '@/db/client';
import { deviceStatusRecordsSchema } from '@/db/schema';
import { errorHandler } from '@/server/errorHandler';

const handler = createNextHandler(
  rootRouter.api.data,
  {
    getDeviceData: async ({ params: { deviceId }, query: { startDate, periodDays = 1 } }) => {
      const db = getDb();

      const data = await db
        .select()
        .from(deviceStatusRecordsSchema)
        .where(
          and(
            eq(deviceStatusRecordsSchema.deviceId, deviceId),
            gte(deviceStatusRecordsSchema.recordedAt, new Date(startDate)),
            lt(deviceStatusRecordsSchema.recordedAt, addDays(new Date(), periodDays)),
          ),
        )
        .orderBy(asc(deviceStatusRecordsSchema.recordedAt));

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
