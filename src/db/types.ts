import { InferSelectModel } from 'drizzle-orm';

import { automationsSchema } from '@/db/schema';

export type ClientAutomationSchema = Omit<InferSelectModel<typeof automationsSchema>, 'createdAt'> & {
  createdAtMillis: number;
};
