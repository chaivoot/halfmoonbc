// Applies db/migrations/*.sql in filename order, each once, inside a transaction.
// Runs before `next build`, so a failed migration fails the deploy and the
// previous deployment stays live.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

// Migrations need a direct connection: the pooler can't hold session-level locks.
const url =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL;

if (!url) {
  console.error("migrate: DATABASE_URL is not set");
  process.exit(1);
}

const dir = path.join(process.cwd(), "db", "migrations");
const sql = postgres(url, { max: 1, onnotice: () => {} });

try {
  // Serialize concurrent builds (e.g. production and preview) on the same database.
  await sql`select pg_advisory_lock(727001)`;
  await sql`
    create table if not exists schema_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `;
  const applied = new Set((await sql`select name from schema_migrations`).map((r) => r.name));
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const body = await readFile(path.join(dir, file), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(body);
      await tx`insert into schema_migrations (name) values (${file})`;
    });
    console.log(`migrate: applied ${file}`);
  }
  console.log("migrate: up to date");
} catch (err) {
  console.error("migrate: failed", err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
