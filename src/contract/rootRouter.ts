import { c } from '@/contract/contract';
import { apiRouter } from '@/contract/routes';

export const rootRouter = c.router({ api: apiRouter }, { strictStatusCodes: true });
