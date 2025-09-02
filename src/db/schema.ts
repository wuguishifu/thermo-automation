import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const automationsSchema = pgTable('automations', {
  id: serial('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  bufferDegrees: integer('buffer_degrees').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const schema = {
  automations: automationsSchema,
};
