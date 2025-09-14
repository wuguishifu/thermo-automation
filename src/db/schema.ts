import { bigint, boolean, integer, pgTable, real, serial, text, time, timestamp } from 'drizzle-orm/pg-core';

export const automationsSchema = pgTable('automations', {
  id: serial('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  startsAt: time('starts_at', { withTimezone: true }).notNull(),
  endsAt: time('ends_at', { withTimezone: true }).notNull(),
  maxTemperature: real('max_temperature'),
  minTemperature: real('min_temperature'),
  bufferDegrees: real('buffer_degrees').notNull(),
  enabled: boolean('enabled').default(true).notNull(),
});

export const deviceStatusRecordsSchema = pgTable('device_status_records', {
  id: serial('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  recordedAtMs: bigint('recorded_at_ms', { mode: 'number' }).notNull(),
  maxTemperature: real('max_temperature').notNull(),
  minTemperature: real('min_temperature').notNull(),
  currentTemperature: real('current_temperature').notNull(),
  currentHumidity: real('humidity').notNull(),
  currentMode: integer('current_mode').notNull(),
});

export const schema = {
  automations: automationsSchema,
  deviceStatusRecords: deviceStatusRecordsSchema,
};
