import { createNextHandler } from '@ts-rest/serverless/next';
import { eq } from 'drizzle-orm';

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
          .select()
          .from(schema.automations)
          .where(deviceId ? eq(schema.automations.deviceId, deviceId) : undefined)
          .then((results) =>
            results.map(({ createdAt, ...result }) => ({
              ...result,
              createdAtMillis: createdAt.getTime(),
            })),
          );
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
            bufferDegrees: body.bufferDegrees,
          })
          .returning();
        return {
          status: 201,
          body: {
            id: automation.id,
            deviceId: automation.deviceId,
            bufferDegrees: automation.bufferDegrees,
            createdAtMillis: automation.createdAt.getTime(),
          },
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
