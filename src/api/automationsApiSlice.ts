import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ClientInferRequest, ClientInferResponseBody } from '@ts-rest/core';
import { toast } from 'sonner';

import { apiClient } from '@/api/apiClient';
import { rootRouter } from '@/contract/rootRouter';

type AutomationsRouter<T extends keyof typeof rootRouter.api.automations> = (typeof rootRouter.api.automations)[T];

type ListAutomationsResponse = ClientInferResponseBody<AutomationsRouter<'listAutomations'>>;
type ListAutomationsQuery = ClientInferRequest<AutomationsRouter<'listAutomations'>>['query'];

type CreateAutomationResponse = ClientInferResponseBody<AutomationsRouter<'createAutomation'>>;
type CreateAutomationBody = ClientInferRequest<AutomationsRouter<'createAutomation'>>['body'];

type DeleteAutomationResponse = ClientInferResponseBody<AutomationsRouter<'deleteAutomation'>>;
type DeleteAutomationBody = ClientInferRequest<AutomationsRouter<'deleteAutomation'>>['query'];

type EnableAutomationResponse = ClientInferResponseBody<AutomationsRouter<'enableAutomation'>>;
type EnableAutomationBody = ClientInferRequest<AutomationsRouter<'enableAutomation'>>['body'];

type DisableAutomationResponse = ClientInferResponseBody<AutomationsRouter<'disableAutomation'>>;
type DisableAutomationBody = ClientInferRequest<AutomationsRouter<'disableAutomation'>>['body'];

type UpdateAutomationResponse = ClientInferResponseBody<AutomationsRouter<'updateAutomation'>>;
type UpdateAutomationBody = ClientInferRequest<AutomationsRouter<'updateAutomation'>>['body'];

export const automationsApi = createApi({
  reducerPath: 'automationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'use apiClient directly',
  }),
  tagTypes: ['automations'],
  endpoints: (builder) => ({
    listAutomations: builder.query<ListAutomationsResponse, ListAutomationsQuery>({
      keepUnusedDataFor: 180,
      providesTags: ['automations'],
      queryFn: (query) =>
        apiClient.api.automations.listAutomations({ query }).then((response) => {
          if (response.status === 200) {
            return { data: response.body };
          }

          toast.error('Failed to get automations');
          throw new Error('Failed to get automations');
        }),
    }),
    createAutomation: builder.mutation<CreateAutomationResponse, CreateAutomationBody>({
      invalidatesTags: ['automations'],
      queryFn: (body) =>
        apiClient.api.automations.createAutomation({ body }).then((response) => {
          if (response.status === 201) {
            toast.success('Automation created successfully');
            return { data: response.body };
          }

          toast.error('Failed to create automation');
          throw new Error('Failed to create automation');
        }),
    }),
    deleteAutomation: builder.mutation<DeleteAutomationResponse, DeleteAutomationBody>({
      invalidatesTags: ['automations'],
      queryFn: (query) =>
        apiClient.api.automations.deleteAutomation({ query }).then((response) => {
          if (response.status === 200) {
            toast.success('Automation deleted successfully');
            return { data: response.body };
          }

          toast.error('Failed to delete automation');
          throw new Error('Failed to delete automation');
        }),
    }),
    enableAutomation: builder.mutation<EnableAutomationResponse, EnableAutomationBody>({
      invalidatesTags: ['automations'],
      queryFn: (body) =>
        apiClient.api.automations.enableAutomation({ body }).then((response) => {
          if (response.status === 200) {
            toast.success('Automation enabled successfully');
            return { data: response.body };
          }

          toast.error('Failed to enable automation');
          throw new Error('Failed to enable automation');
        }),
    }),
    disableAutomation: builder.mutation<DisableAutomationResponse, DisableAutomationBody>({
      invalidatesTags: ['automations'],
      queryFn: (body) =>
        apiClient.api.automations.disableAutomation({ body }).then((response) => {
          if (response.status === 200) {
            toast.success('Automation disabled successfully');
            return { data: response.body };
          }

          toast.error('Failed to disable automation');
          throw new Error('Failed to disable automation');
        }),
    }),
    updateAutomation: builder.mutation<UpdateAutomationResponse, UpdateAutomationBody>({
      invalidatesTags: ['automations'],
      queryFn: (body) =>
        apiClient.api.automations.updateAutomation({ body }).then((response) => {
          if (response.status === 200) {
            toast.success('Automation updated successfully');
            return { data: response.body };
          }

          toast.error('Failed to update automation');
          throw new Error('Failed to update automation');
        }),
    }),
  }),
});

export const {
  useListAutomationsQuery,
  useCreateAutomationMutation,
  useDeleteAutomationMutation,
  useEnableAutomationMutation,
  useDisableAutomationMutation,
  useUpdateAutomationMutation,
} = automationsApi;
