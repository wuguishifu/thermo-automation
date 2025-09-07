import { TsRestRequest, TsRestResponse } from '@ts-rest/serverless';

export const errorHandler = (error: unknown, _request: TsRestRequest) => {
  console.error(error);
  return TsRestResponse.fromJson({ message: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
};
