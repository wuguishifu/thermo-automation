import { createNextHandler } from '@ts-rest/serverless/next';
import { asc, eq, sql } from 'drizzle-orm';

import { rootRouter } from '@/contract/rootRouter';
import { getDb } from '@/db/client';
import { schema } from '@/db/schema';
import { errorHandler } from '@/server/errorHandler';
import { httpService } from '@/server/httpService';
import { Device, DeviceInformation } from '@/types/device';

const handler = createNextHandler(
  rootRouter.api,
  {
    devices: {
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
    automations: {
      listAutomations: async ({ query: { deviceId } }) => {
        const db = getDb();
        const automations = await db
          .select({
            id: schema.automations.id,
            deviceId: schema.automations.deviceId,
            createdAt: schema.automations.createdAt,
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
  },
  {
    handlerType: 'app-router',
    jsonQuery: true,
    responseValidation: true,
    errorHandler,
  },
);

export { handler as DELETE, handler as GET, handler as POST };
