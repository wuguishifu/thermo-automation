import { startAutomationCron } from '@/server/cronService';

let cronStarted = false;

/**
 * Ensures the cron job is started only once per server instance
 */
export function initializeCronJob(): void {
  if (!cronStarted) {
    startAutomationCron();
    cronStarted = true;
  }
}
