import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { apiClient } from '@/api/apiClient';
import { GetDeviceDataPathParams, GetDeviceDataQuery, GetDeviceDataResponse } from '@/contract/routes/dataRouter';

type GetDeviceDataParams = {
  params: GetDeviceDataPathParams;
  query: GetDeviceDataQuery;
};

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'use apiClient directly',
  }),
  tagTypes: ['deviceData'],
  endpoints: (builder) => ({
    getDeviceData: builder.query<GetDeviceDataResponse, GetDeviceDataParams>({
      keepUnusedDataFor: 180,
      providesTags: (_, __, arg) => [
        {
          type: 'deviceData',
          id: `${arg.params.deviceId}-${arg.query.startDateMs}-${arg.query.period}`,
        },
      ],
      queryFn: (data) =>
        apiClient.api.data.getDeviceData(data).then((response) => {
          if (response.status === 200) {
            return { data: response.body };
          }

          throw new Error('Failed to get device data');
        }),
    }),
  }),
});

export const { useGetDeviceDataQuery } = dataApi;
