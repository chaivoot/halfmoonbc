import "server-only";
import postgres from "postgres";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!url) throw new Error("DATABASE_URL is not set");

// Reuse one client across hot reloads in dev.
const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

// prepare: false because Neon's pooled endpoint runs PgBouncer in transaction mode.
export const sql = globalForDb.sql ?? postgres(url, { prepare: false, max: 5 });

if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;
