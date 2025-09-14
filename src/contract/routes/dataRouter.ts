import z from 'zod';

import { c } from '@/contract/contract';
import { Record } from '@/types/record';

export const GetDeviceDataQuery = z.object({
  startDateMs: z.string(),
  period: z.number().optional(),
});
export type GetDeviceDataQuery = z.infer<typeof GetDeviceDataQuery>;

export const GetDeviceDataPathParams = z.object({
  deviceId: z.string(),
});
export type GetDeviceDataPathParams = z.infer<typeof GetDeviceDataPathParams>;

export const GetDeviceDataResponse = z.array(Record);
export type GetDeviceDataResponse = z.infer<typeof GetDeviceDataResponse>;

export const dataRouter = c.router(
  {
    getDeviceData: {
      summary: 'Get historical data for a device',
      method: 'GET',
      path: '/history/:deviceId',
      pathParams: GetDeviceDataPathParams,
      query: GetDeviceDataQuery,
      responses: {
        200: GetDeviceDataResponse,
      },
    },
  },
  {
    pathPrefix: '/data',
  },
);
