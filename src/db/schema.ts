import { integer, pgTable, serial, text, time, timestamp } from 'drizzle-orm/pg-core';

export const automationsSchema = pgTable('automations', {
  id: serial('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  startsAt: time('starts_at', { withTimezone: true }).notNull(),
  endsAt: time('ends_at', { withTimezone: true }).notNull(),
  maxTemperature: integer('max_temperature'),
  minTemperature: integer('min_temperature'),
  bufferDegrees: integer('buffer_degrees').notNull(),
});

export const schema = {
  automations: automationsSchema,
};
