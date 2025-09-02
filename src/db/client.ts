import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const globalForDb = globalThis as unknown as { db?: ReturnType<typeof drizzle> };

export function getDb() {
  if (!globalForDb.db) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // low footprint defaults; tune if needed
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    });
    globalForDb.db = drizzle(pool);
  }
  return globalForDb.db;
}
