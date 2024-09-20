import { drizzle } from 'drizzle-orm/neon-serverless';
// import postgres from 'postgres';
import { Pool } from '@neondatabase/serverless';

const migrationClient = new Pool({
  connectionString: process.env.DATABASE_URL as string,
});

export const db = drizzle(migrationClient);
