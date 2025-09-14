const API_BASE_URL = process.env.API_BASE_URL || 'http://thermo-automation:3000';
const API_KEY = process.env.THERMO_AUTOMATION_API_KEY || 'password';

async function runJobs() {
  try {
    console.log(`[${new Date().toISOString()}] Running automation jobs...`);

    await fetch(`${API_BASE_URL}/api/jobs/automation`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    await fetch(`${API_BASE_URL}/api/jobs/statuses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log(`[${new Date().toISOString()}] Jobs completed successfully`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error running jobs:`, error.message);
  }
}

(async () => {
  console.log(`[${new Date().toISOString()}] Starting cron job script...`);
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`API Key: ${API_KEY ? '***' + API_KEY.slice(-4) : 'NOT SET'}`);

  while (true) {
    await runJobs();
    await new Promise((resolve) => setTimeout(resolve, 3 * 60 * 1000));
  }
})()
  .catch((error) => console.error(`[${new Date().toISOString()}] Fatal error:`, error))
  .then(() => console.log(`[${new Date().toISOString()}] Script finished`))
  .finally(() => process.exit(0));
