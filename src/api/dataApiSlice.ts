import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ClientInferRequest, ClientInferResponseBody } from '@ts-rest/core';

import { apiClient } from '@/api/apiClient';
import { rootRouter } from '@/contract/rootRouter';

type DataRouter<T extends keyof typeof rootRouter.api.data> = (typeof rootRouter.api.data)[T];

type GetDeviceDataResponse = ClientInferResponseBody<DataRouter<'getDeviceData'>>;
type GetDeviceDataPathParams = ClientInferRequest<DataRouter<'getDeviceData'>>;

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'use apiClient directly',
  }),
  tagTypes: ['deviceData'],
  endpoints: (builder) => ({
    getDeviceData: builder.query<GetDeviceDataResponse, GetDeviceDataPathParams>({
      keepUnusedDataFor: 180,
      providesTags: (_, __, arg) => [
        {
          type: 'deviceData',
          id: `${arg.params.deviceId}-${arg.query.startDate}-${arg.query.periodDays}`,
        },
      ],
      queryFn: (data) =>
        apiClient.api.data.getDeviceData(data).then((response) => {
          console.log({ response });

          if (response.status === 200) {
            return { data: response.body };
          }

          throw new Error('Failed to get device data');
        }),
    }),
  }),
});

export const { useGetDeviceDataQuery } = dataApi;
