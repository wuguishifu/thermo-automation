import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ClientInferResponseBody } from '@ts-rest/core';
import { toast } from 'sonner';

import { apiClient } from '@/api/apiClient';
import { rootRouter } from '@/contract/rootRouter';

type DevicesRouter<T extends keyof typeof rootRouter.api.devices> = (typeof rootRouter.api.devices)[T];

type ListDevicesResponse = ClientInferResponseBody<DevicesRouter<'listDevices'>>;

export const devicesApi = createApi({
  reducerPath: 'devicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'use apiClient directly',
  }),
  tagTypes: ['devices'],
  endpoints: (builder) => ({
    listDevices: builder.query<ListDevicesResponse, void>({
      queryFn: () =>
        apiClient.api.devices.listDevices().then((response) => {
          if (response.status === 200) {
            return { data: response.body };
          }

          toast.error('Failed to get devices');
          throw new Error('Failed to get devices');
        }),
      providesTags: ['devices'],
    }),
  }),
});

export const { useListDevicesQuery } = devicesApi;
