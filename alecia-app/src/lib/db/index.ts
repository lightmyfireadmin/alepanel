import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DbType = NeonHttpDatabase<typeof schema> & { $client: NeonQueryFunction<false, false> };

function getDbConnection(): DbType | null {
  let databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.warn("[DB] DATABASE_URL not set, database features will be unavailable");
    return null;
  }
  
  // Strip surrounding quotes if present (Vercel env var issue)
  if ((databaseUrl.startsWith("'") && databaseUrl.endsWith("'")) ||
      (databaseUrl.startsWith('"') && databaseUrl.endsWith('"'))) {
    databaseUrl = databaseUrl.slice(1, -1);
  }
  
  try {
    const sql = neon(databaseUrl);
    return drizzle(sql, { schema }) as DbType;
  } catch (error) {
    console.error("[DB] Failed to connect to database:", error);
    return null;
  }
}

// Deep proxy stub for when database is not available (static builds)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createStubProxy(): any {
  const handler: ProxyHandler<object> = {
    get() {
      return new Proxy(() => Promise.resolve([]), {
        get() {
          return createStubProxy();
        },
        apply() {
          return createStubProxy();
        }
      });
    },
    apply() {
      return Promise.resolve([]);
    }
  };
  return new Proxy(function() {}, handler);
}

// Lazy initialization to avoid build-time errors
let _db: DbType | null = null;
let _initialized = false;

export const db: DbType = new Proxy({} as DbType, {
  get(_, prop) {
    if (!_initialized) {
      _db = getDbConnection();
      _initialized = true;
    }
    if (!_db) {
      return createStubProxy();
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export { schema };
