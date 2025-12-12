import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDbConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

// Lazy initialization to avoid build-time errors
let _db: ReturnType<typeof getDbConnection> | null = null;

export const db = new Proxy({} as ReturnType<typeof getDbConnection>, {
  get(_, prop) {
    if (!_db) {
      _db = getDbConnection();
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export { schema };
