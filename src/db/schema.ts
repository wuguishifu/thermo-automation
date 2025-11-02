import { bigint, boolean, integer, pgTable, real, serial, smallint, text, time, timestamp } from 'drizzle-orm/pg-core';

export enum Weekday {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export function toDaysMask(days: Weekday[]): number {
  return days.reduce((mask, day) => mask | (1 << day), 0);
}

export function fromDaysMask(mask: number): Weekday[] {
  const days: Weekday[] = [];
  for (let day = 0; day < 7; day++) {
    if (mask & (1 << day)) {
      days.push(day);
    }
  }
  return days;
}

export function isDayInMask(day: Weekday, mask: number): boolean {
  return (mask & (1 << day)) !== 0;
}

export const automationsSchema = pgTable('automations', {
  id: serial('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  startsAt: time('starts_at', { withTimezone: true }).notNull(),
  endsAt: time('ends_at', { withTimezone: true }).notNull(),
  maxTemperature: real('max_temperature'),
  minTemperature: real('min_temperature'),
  bufferDegrees: real('buffer_degrees').notNull(),
  enabled: boolean('enabled').default(true).notNull(),
  /** default to every day */
  daysMask: smallint('days_mask').default(0).notNull(),
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
