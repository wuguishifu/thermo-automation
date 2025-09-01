import z from 'zod';

export const Device = z.object({
  id: z.string(),
  name: z.string(),
  model: z.string(),
  firmwareVersion: z.string(),
});
export type Device = z.infer<typeof Device>;

export const DeviceInformation = z.object({
  /**
   * HVAC equipment status
   * - 1: cool
   * - 2: overcool for dehum
   * - 3: heat
   * - 4: fan
   * - 5: idle
   */
  equipmentStatus: z.number(),
  /**
   * Thermostat mode
   * - 0: off
   * - 1: heat
   * - 2: cool
   * - 3: auto
   * - 4: emergency heat
   */
  mode: z.number(),
  /**
   * Thermostat mode limits
   * - 0: none
   * - 1: all
   * - 2: heat only
   * - 3: cool only
   */
  modeLimit: z.number(),
  modeEmHeatAvailable: z.boolean(),
  fan: z.number(),
  fanCirculate: z.number(),
  fanCirculateSpeed: z.number(),
  /**
   * The target minimum temperature in 0.1 degree Celsius increments
   */
  heatSetpoint: z.number(),
  /**
   * The target maximum temperature in 0.1 degree Celsius increments
   */
  coolSetpoint: z.number(),
  /**
   * The minimum temperature delta in 0.5 degree Celsius increments
   */
  setpointDelta: z.number(),
  /**
   * The minimum allowed setpoint
   */
  setpointMinimum: z.number(),
  /**
   * The maximum allowed setpoint
   */
  setpointMaximum: z.number(),
  /**
   * The current indoor temperature in Celsius
   */
  tempIndoor: z.number(),
  /**
   * The current indoor humidity as a percentage
   */
  humIndoor: z.number(),
  /**
   * The current outdoor temperature in Celsius
   */
  tempOutdoor: z.number(),
  /**
   * The current outdoor humidity as a percentage
   */
  humOutdoor: z.number(),
  scheduleEnabled: z.boolean(),
  geofencingEnabled: z.boolean(),
});
export type DeviceInformation = z.infer<typeof DeviceInformation>;

export const Location = z.object({
  locationName: z.string(),
  devices: z.array(Device),
});
export type Location = z.infer<typeof Location>;
