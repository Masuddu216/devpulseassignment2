import { Pool } from 'pg';
import { env } from './env.js';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    console.log('Initializing database connection pool...');
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 1,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }
  return pool;
}

export async function testConnection(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query('SELECT NOW()');
  } finally {
    client.release();
  }
}