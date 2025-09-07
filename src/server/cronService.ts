import { eq } from 'drizzle-orm';
import * as cron from 'node-cron';

import { getDb } from '@/db/client';
import { schema } from '@/db/schema';

interface ActiveAutomation {
  id: number;
  deviceId: string;
  startsAt: string;
  endsAt: string;
  maxTemperature: number | null;
  minTemperature: number | null;
  bufferDegrees: number;
}

export function isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
  const [currentHour, currentMinute] = currentTime.split(':').map(Number);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const currentMinutes = currentHour * 60 + currentMinute;
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (startMinutes > endMinutes) {
    // range crosses midnight
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  } else {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }
}

export function formatTime(timeString: string): string {
  // HH:MM
  return timeString.split(' ')[0].substring(0, 5);
}

export async function checkActiveAutomations(): Promise<void> {
  try {
    const db = getDb();
    const now = new Date();
    const currentTime = formatTime(now.toTimeString());

    console.log(`\n🕐 Checking automations at ${currentTime}...`);

    const automations = await db.select().from(schema.automations).where(eq(schema.automations.enabled, true));

    const activeAutomations: ActiveAutomation[] = [];

    for (const automation of automations) {
      const startsAt = formatTime(automation.startsAt);
      const endsAt = formatTime(automation.endsAt);

      if (isTimeInRange(currentTime, startsAt, endsAt)) {
        activeAutomations.push({
          id: automation.id,
          deviceId: automation.deviceId,
          startsAt,
          endsAt,
          maxTemperature: automation.maxTemperature,
          minTemperature: automation.minTemperature,
          bufferDegrees: automation.bufferDegrees,
        });
      }
    }

    if (activeAutomations.length > 0) {
      console.log(`✅ Found ${activeAutomations.length} active automation(s):`);
      activeAutomations.forEach((automation) => {
        console.log(`   📱 Device: ${automation.deviceId}`);
        console.log(`   ⏰ Time Range: ${automation.startsAt} - ${automation.endsAt}`);
        console.log(
          `   🌡️  Temperature Range: ${automation.minTemperature || 'N/A'}°F - ${automation.maxTemperature || 'N/A'}°F`,
        );
        console.log(`   📊 Buffer: ${automation.bufferDegrees}°F`);
        console.log(`   🆔 ID: ${automation.id}`);
        console.log('   ---');
      });
    } else {
      console.log('❌ No active automations found');
    }

    console.log(`\n⏰ Next check in 3 minutes...\n`);
  } catch (error) {
    console.error('❌ Error checking automations:', error);
  }
}

export function startAutomationCron(): void {
  console.log('🚀 Starting automation cron job (every 3 minutes)...');

  checkActiveAutomations();

  cron.schedule(
    // run every 3 minutes
    '*/3 * * * *',
    () => checkActiveAutomations(),
    { timezone: process.env.TIMEZONE },
  );
}

export function stopAutomationCron(): void {
  console.log('🛑 Stopping automation cron job...');
  cron.getTasks().forEach((task) => task.destroy());
}
