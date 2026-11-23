"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changePassword, login, logout, requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import type { AdminPhoto } from "@/lib/admin-dogs";
import { getPhotos } from "@/lib/admin-dogs";
import type { DogStatus } from "@/lib/dogs";
import { isBlobUrl, isCategory, isStatus, isUuid } from "@/lib/validate";

export type FormState = { error?: string; saved?: boolean } | undefined;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const optional = (fd: FormData, key: string) => str(fd, key) || null;

function refreshSite() {
  revalidatePath("/");
  revalidatePath("/dogs/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin", "layout");
}

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Give a dog its page URL the first time it has an English name. An existing
// slug is never changed, so links already shared keep working after a rename.
async function ensureSlug(id: string, name: string) {
  const base = toSlug(name);
  if (!base) return;
  const [dog] = await sql<{ slug: string | null }[]>`select slug from dogs where id = ${id}`;
  if (!dog || dog.slug) return;
  const taken = new Set(
    (await sql<{ slug: string }[]>`
      select slug from dogs where slug = ${base} or slug like ${base + "-%"}
    `).map((r) => r.slug),
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  await sql`update dogs set slug = ${slug} where id = ${id} and slug is null`;
}

async function deleteBlobs(urls: string[]) {
  // Photos imported from the old site live in public/ and are not blobs.
  const blobs = urls.filter(isBlobUrl);
  if (blobs.length) await del(blobs);
}

// Highest sort_order in a category plus one: lists show the highest first,
// so this puts a dog at the top of its status group.
async function nextSortOrder(category: string): Promise<number> {
  const [{ next }] = await sql<{ next: number }[]>`
    select coalesce(max(sort_order), 0) + 1 as next from dogs where category = ${category}
  `;
  return next;
}

// ---- Auth ----

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const username = str(fd, "username").toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!username || !password) return { error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" };
  const result = await login(username, password);
  if (!result.ok) return { error: result.error };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

export async function changePasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin({ allowPendingPasswordChange: true });
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  if (next.length < 8) return { error: "รหัสผ่านใหม่ต้องยาวอย่างน้อย 8 ตัวอักษร" };
  if (next !== confirm) return { error: "รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน" };
  const result = await changePassword(admin, current, next);
  if (!result.ok) return { error: result.error };
  redirect("/admin?password=changed");
}

// ---- Dogs ----

export async function saveDogAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = optional(fd, "id");
  if (id && !isUuid(id)) return { error: "ไม่พบข้อมูลสุนัขตัวนี้" };

  const category = str(fd, "category");
  if (!isCategory(category)) return { error: "กรุณาเลือกหมวด" };

  const sexRaw = str(fd, "sex");
  const sex = sexRaw === "male" || sexRaw === "female" ? sexRaw : null;

  // Parents are never for sale, so they have no status.
  const statusRaw = str(fd, "status");
  const status = category === "parent" || !isStatus(statusRaw) ? null : statusRaw;

  const birthDate = optional(fd, "birth_date");
  if (birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return { error: "วันเกิดไม่ถูกต้อง" };

  const tags = str(fd, "tags")
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 10);

  const values = {
    name: str(fd, "name"),
    name_th: optional(fd, "name_th"),
    sex,
    color: optional(fd, "color"),
    category,
    status,
    description: optional(fd, "description"),
    tags,
    birth_date: birthDate,
    litter: optional(fd, "litter"),
    is_published: fd.get("is_published") === "on",
  };

  if (id) {
    const [before] = await sql<{ category: string }[]>`select category from dogs where id = ${id}`;
    if (!before) return { error: "ไม่พบข้อมูลสุนัขตัวนี้" };
    // A dog moved to another category (e.g. New born -> Young) goes to the top of it.
    const moved = before.category !== category ? { sort_order: await nextSortOrder(category) } : {};
    const res = await sql`update dogs set ${sql({ ...values, ...moved })} where id = ${id}`;
    if (res.count === 0) return { error: "ไม่พบข้อมูลสุนัขตัวนี้" };
    await ensureSlug(id, values.name);
    refreshSite();
    return { saved: true };
  }

  const [created] = await sql<{ id: string }[]>`
    insert into dogs ${sql({ ...values, sort_order: await nextSortOrder(category) })} returning id
  `;
  await ensureSlug(created.id, values.name);
  refreshSite();
  redirect(`/admin/dogs/${created.id}?created=1`);
}

export async function setStatusAction(id: string, status: DogStatus) {
  await requireAdmin();
  if (!isUuid(id) || (status !== null && !isStatus(status))) return;
  await sql`update dogs set status = ${status} where id = ${id} and category <> 'parent'`;
  refreshSite();
}

// Swap a dog with its neighbour above or below. Dogs only trade places within
// the same category and status, because status decides the order between groups.
export async function moveDogAction(id: string, direction: "up" | "down") {
  await requireAdmin();
  if (!isUuid(id) || (direction !== "up" && direction !== "down")) return;
  await sql.begin(async (tx) => {
    const [dog] = await tx<{ category: string; status: string | null; sort_order: number }[]>`
      select category, status, sort_order from dogs where id = ${id} for update
    `;
    if (!dog) return;
    // Lists show the highest sort_order first, so "up" means the next higher number.
    const [other] = await tx<{ id: string; sort_order: number }[]>`
      select id, sort_order from dogs
      where category = ${dog.category}
        and status is not distinct from ${dog.status}
        and id <> ${id}
        and ${direction === "up" ? tx`sort_order >= ${dog.sort_order}` : tx`sort_order <= ${dog.sort_order}`}
      order by ${direction === "up" ? tx`sort_order asc` : tx`sort_order desc`}, created_at
      limit 1
      for update
    `;
    if (!other) return;
    // Equal numbers would swap to no effect, so nudge past the neighbour instead.
    const target =
      other.sort_order === dog.sort_order ? dog.sort_order + (direction === "up" ? 1 : -1) : other.sort_order;
    await tx`update dogs set sort_order = ${dog.sort_order} where id = ${other.id}`;
    await tx`update dogs set sort_order = ${target} where id = ${id}`;
  });
  refreshSite();
}

export async function setPublishedAction(id: string, published: boolean) {
  await requireAdmin();
  if (!isUuid(id)) return;
  await sql`update dogs set is_published = ${published} where id = ${id}`;
  refreshSite();
}

export async function deleteDogAction(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return;
  const photos = await sql<{ storage_path: string }[]>`
    select storage_path from dog_photos where dog_id = ${id}
  `;
  await sql`delete from dogs where id = ${id}`;
  await deleteBlobs(photos.map((p) => p.storage_path));
  refreshSite();
  redirect("/admin?deleted=1");
}

// ---- Photos ----

export async function addPhotosAction(dogId: string, urls: string[]): Promise<AdminPhoto[]> {
  await requireAdmin();
  if (!isUuid(dogId)) throw new Error("invalid dog");
  const clean = urls.filter(isBlobUrl).slice(0, 30);
  const [dog] = await sql<{ category: string }[]>`select category from dogs where id = ${dogId}`;
  if (dog && clean.length) {
    const gallery = dog.category !== "parent";
    await sql.begin(async (tx) => {
      const [{ next, has_cover }] = await tx<{ next: number; has_cover: boolean }[]>`
        select coalesce(max(sort_order), 0) + 1 as next, coalesce(bool_or(is_cover), false) as has_cover
        from dog_photos where dog_id = ${dogId}
      `;
      await tx`
        insert into dog_photos ${tx(
          clean.map((url, i) => ({
            dog_id: dogId,
            storage_path: url,
            sort_order: next + i,
            is_cover: !has_cover && i === 0,
            // The browser watermarks gallery photos before upload (src/lib/prepare-photo.ts).
            watermarked: gallery,
          })),
        )}
      `;
    });
    refreshSite();
  }
  return getPhotos(dogId);
}

export async function setCoverAction(dogId: string, photoId: string): Promise<AdminPhoto[]> {
  await requireAdmin();
  if (!isUuid(dogId) || !isUuid(photoId)) throw new Error("invalid id");
  await sql.begin(async (tx) => {
    await tx`update dog_photos set is_cover = false where dog_id = ${dogId} and is_cover`;
    await tx`update dog_photos set is_cover = true where dog_id = ${dogId} and id = ${photoId}`;
  });
  refreshSite();
  return getPhotos(dogId);
}

export async function deletePhotoAction(dogId: string, photoId: string): Promise<AdminPhoto[]> {
  await requireAdmin();
  if (!isUuid(dogId) || !isUuid(photoId)) throw new Error("invalid id");
  const [removed] = await sql<{ storage_path: string; is_cover: boolean }[]>`
    delete from dog_photos where dog_id = ${dogId} and id = ${photoId}
    returning storage_path, is_cover
  `;
  if (removed) {
    if (removed.is_cover) {
      await sql`
        update dog_photos set is_cover = true
        where id = (select id from dog_photos where dog_id = ${dogId} order by sort_order, created_at limit 1)
      `;
    }
    await deleteBlobs([removed.storage_path]);
    refreshSite();
  }
  return getPhotos(dogId);
}

export async function reorderPhotosAction(dogId: string, photoIds: string[]): Promise<AdminPhoto[]> {
  await requireAdmin();
  if (!isUuid(dogId) || !photoIds.every(isUuid)) throw new Error("invalid id");
  await sql`
    update dog_photos p set sort_order = o.ord
    from unnest(${photoIds}::uuid[]) with ordinality as o(id, ord)
    where p.id = o.id and p.dog_id = ${dogId}
  `;
  refreshSite();
  return getPhotos(dogId);
}

