import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import * as schema from './schema';
import { relations } from './relations';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});
