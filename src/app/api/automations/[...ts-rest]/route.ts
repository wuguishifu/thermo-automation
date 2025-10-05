import { createNextHandler } from '@ts-rest/serverless/next';
import { asc, eq, sql } from 'drizzle-orm';

import { rootRouter } from '@/contract/rootRouter';
import { getDb } from '@/db/client';
import { schema } from '@/db/schema';
import { errorHandler } from '@/server/errorHandler';

const handler = createNextHandler(
  rootRouter.api.automations,
  {
    listAutomations: async ({ query: { deviceId } }) => {
      const db = getDb();
      const automations = await db
        .select({
          id: schema.automations.id,
          deviceId: schema.automations.deviceId,
          createdAt: schema.automations.createdAt,
          updatedAt: schema.automations.updatedAt,
          startsAt: sql<string>`to_char(${schema.automations.startsAt}::time, 'HH12:MI AM')`,
          endsAt: sql<string>`to_char(${schema.automations.endsAt}::time, 'HH12:MI AM')`,
          maxTemperature: schema.automations.maxTemperature,
          minTemperature: schema.automations.minTemperature,
          bufferDegrees: schema.automations.bufferDegrees,
          enabled: schema.automations.enabled,
        })
        .from(schema.automations)
        .where(deviceId ? eq(schema.automations.deviceId, deviceId) : undefined)
        .orderBy(asc(schema.automations.createdAt));
      return {
        status: 200,
        body: automations,
      };
    },
    updateAutomation: async ({ body }) => {
      const db = getDb();
      const { id, ...rest } = body;
      const [automation] = await db
        .update(schema.automations)
        .set({
          ...rest,
          updatedAt: sql`now()`,
        })
        .where(eq(schema.automations.id, id))
        .returning({
          id: schema.automations.id,
          deviceId: schema.automations.deviceId,
          createdAt: schema.automations.createdAt,
          updatedAt: schema.automations.updatedAt,
          startsAt: sql<string>`to_char(${schema.automations.startsAt}::time, 'HH24:MI')`,
          endsAt: sql<string>`to_char(${schema.automations.endsAt}::time, 'HH24:MI')`,
          maxTemperature: schema.automations.maxTemperature,
          minTemperature: schema.automations.minTemperature,
          bufferDegrees: schema.automations.bufferDegrees,
          enabled: schema.automations.enabled,
        });
      return {
        status: 200,
        body: automation,
      };
    },
    createAutomation: async ({ body }) => {
      const db = getDb();
      const [automation] = await db
        .insert(schema.automations)
        .values({
          deviceId: body.deviceId,
          startsAt: body.startsAt,
          endsAt: body.endsAt,
          maxTemperature: body.maxTemperature,
          minTemperature: body.minTemperature,
          bufferDegrees: body.bufferDegrees,
        })
        .returning();
      return {
        status: 201,
        body: automation,
      };
    },
    deleteAutomation: async ({ query: { id } }) => {
      const db = getDb();
      await db.delete(schema.automations).where(eq(schema.automations.id, id));
      return {
        status: 200,
        body: {
          deleted: true,
        },
      };
    },
    enableAutomation: async ({ body: { id } }) => {
      const db = getDb();
      await db.update(schema.automations).set({ enabled: true }).where(eq(schema.automations.id, id));
      return {
        status: 200,
        body: 'ok',
      };
    },
    disableAutomation: async ({ body: { id } }) => {
      const db = getDb();
      await db.update(schema.automations).set({ enabled: false }).where(eq(schema.automations.id, id));
      return {
        status: 200,
        body: 'ok',
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

export { handler as GET, handler as POST, handler as DELETE };
