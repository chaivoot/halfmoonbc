import "server-only";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { sql } from "@/lib/db";

const SESSION_COOKIE = "hm_admin";
const SESSION_DAYS = 30;
const MAX_FAILED_LOGINS = 10;
const LOCKOUT_MINUTES = 15;

export type Admin = {
  id: string;
  username: string;
  email: string | null;
  mustChangePassword: boolean;
};

// ---- Passwords: scrypt$N$r$p$salt$hash (base64url) ----

const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function scryptAsync(password: string, salt: Buffer, opts: typeof SCRYPT): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password, salt, 64, opts, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, SCRYPT);
  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64url"), hash.toString("base64url")].join("$");
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, n, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt") return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await scryptAsync(password, Buffer.from(salt, "base64url"), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: SCRYPT.maxmem,
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// ---- Sessions ----

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

async function startSession(adminId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await sql`
    insert into admin_sessions (token_hash, admin_id, expires_at)
    values (${sha256(token)}, ${adminId}, ${expires})
  `;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export const getAdmin = cache(async (): Promise<Admin | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [row] = await sql<{ id: string; username: string; email: string | null; must_change_password: boolean }[]>`
    select a.id, a.username, a.email, a.must_change_password
    from admin_sessions s join admins a on a.id = s.admin_id
    where s.token_hash = ${sha256(token)} and s.expires_at > now()
  `;
  return row
    ? { id: row.id, username: row.username, email: row.email, mustChangePassword: row.must_change_password }
    : null;
});

/**
 * Call at the top of every admin page and server action.
 * Server actions are public endpoints, so a check in the layout alone is not enough.
 */
export async function requireAdmin(opts: { allowPendingPasswordChange?: boolean } = {}): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.mustChangePassword && !opts.allowPendingPasswordChange) redirect("/admin/password");
  return admin;
}

async function clientIp(): Promise<string | null> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip");
}

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(username: string, password: string): Promise<LoginResult> {
  const ip = await clientIp();
  const [{ failures }] = await sql<{ failures: number }[]>`
    select count(*)::int as failures from login_attempts
    where not success
      and attempted_at > now() - make_interval(mins => ${LOCKOUT_MINUTES})
      and (username = ${username} or ip = ${ip})
  `;
  if (failures >= MAX_FAILED_LOGINS) {
    return { ok: false, error: `ใส่รหัสผิดหลายครั้งเกินไป ลองใหม่อีกครั้งใน ${LOCKOUT_MINUTES} นาที` };
  }

  const [admin] = await sql<{ id: string; password_hash: string }[]>`
    select id, password_hash from admins where username = ${username}
  `;
  const ok = admin ? await verifyPassword(password, admin.password_hash) : false;
  await sql`insert into login_attempts (username, ip, success) values (${username}, ${ip}, ${ok})`;
  if (!ok || !admin) return { ok: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };

  await sql`delete from admin_sessions where expires_at < now()`;
  await sql`delete from login_attempts where attempted_at < now() - interval '30 days'`;
  await startSession(admin.id);
  return { ok: true };
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await sql`delete from admin_sessions where token_hash = ${sha256(token)}`;
  jar.delete(SESSION_COOKIE);
}

export async function changePassword(admin: Admin, current: string, next: string): Promise<LoginResult> {
  const [row] = await sql<{ password_hash: string }[]>`select password_hash from admins where id = ${admin.id}`;
  if (!row || !(await verifyPassword(current, row.password_hash))) {
    return { ok: false, error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" };
  }
  if (next === current) return { ok: false, error: "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสเดิม" };

  await sql`
    update admins set password_hash = ${await hashPassword(next)}, must_change_password = false
    where id = ${admin.id}
  `;
  // Sign out every other device, then start a fresh session here.
  await sql`delete from admin_sessions where admin_id = ${admin.id}`;
  await startSession(admin.id);
  return { ok: true };
}
