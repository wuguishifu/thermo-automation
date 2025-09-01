import { initClient, tsRestFetchApi } from '@ts-rest/core';

import { rootRouter } from '@/contract/rootRouter';

export const apiClient = initClient(rootRouter, {
  baseUrl: '',
  baseHeaders: {},
  jsonQuery: true,
  api: (args) => {
    return tsRestFetchApi(args);
  },
});
