import { tsr, TsRestResponse } from '@ts-rest/serverless/next';

export const requestAuthenticationMiddleware = tsr.middleware((request) => {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  const apiKey = process.env.API_KEY;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return TsRestResponse.fromJson({ message: 'Unauthorized' }, { status: 403 });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  if (token !== apiKey) {
    return TsRestResponse.fromJson({ message: 'Forbidden' }, { status: 403 });
  }
});
