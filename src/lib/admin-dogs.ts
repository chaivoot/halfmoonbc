import "server-only";
import { sql } from "@/lib/db";
import type { DogCategory, DogStatus } from "@/lib/dogs";

export type AdminDog = {
  id: string;
  slug: string | null;
  name: string;
  nameTh: string | null;
  sex: "male" | "female" | null;
  color: string | null;
  category: DogCategory;
  status: DogStatus;
  description: string | null;
  tags: string[];
  birthDate: string | null;
  litter: string | null;
  instagram: string | null;
  province: string | null;
  ownerMessage: string | null;
  isPublished: boolean;
  coverPhoto: string | null;
  photoCount: number;
};

export type AdminPhoto = { id: string; url: string; isCover: boolean };

type Row = {
  id: string;
  slug: string | null;
  name: string;
  name_th: string | null;
  sex: AdminDog["sex"];
  color: string | null;
  category: DogCategory;
  status: DogStatus;
  description: string | null;
  tags: string[];
  birth_date: string | null;
  litter: string | null;
  instagram: string | null;
  province: string | null;
  owner_message: string | null;
  is_published: boolean;
  cover_photo: string | null;
  photo_count: number;
};

const toAdminDog = (r: Row): AdminDog => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  nameTh: r.name_th,
  sex: r.sex,
  color: r.color,
  category: r.category,
  status: r.status,
  description: r.description,
  tags: r.tags,
  birthDate: r.birth_date,
  litter: r.litter,
  instagram: r.instagram,
  province: r.province,
  ownerMessage: r.owner_message,
  isPublished: r.is_published,
  coverPhoto: r.cover_photo,
  photoCount: r.photo_count,
});

// A function so each query gets its own fragment instance.
const selectDogs = () => sql`
  select d.id, d.slug, d.name, d.name_th, d.sex, d.color, d.category, d.status, d.description,
         d.tags, to_char(d.birth_date, 'YYYY-MM-DD') as birth_date, d.litter, d.is_published,
         d.instagram, d.province, d.owner_message,
         (select p.storage_path from dog_photos p where p.dog_id = d.id
           order by p.is_cover desc, p.sort_order, p.created_at limit 1) as cover_photo,
         (select count(*)::int from dog_photos p where p.dog_id = d.id) as photo_count
  from dogs d
`;

// Admin list filters: the same three groups as the website.
export type DogFilter = "parent" | "puppies" | "family";

export async function listDogs(filter: DogFilter | null): Promise<AdminDog[]> {
  const where =
    filter === "parent"
      ? sql`where d.category = 'parent'`
      : filter === "puppies"
        ? sql`where d.category <> 'parent' and d.status is distinct from 'homed'`
        : filter === "family"
          ? sql`where d.category <> 'parent' and d.status = 'homed'`
          : sql``;
  const rows = await sql<Row[]>`
    ${selectDogs()}
    ${where}
    -- Same order as the website: parents, then puppies by status (homed last), newest on top
    order by array_position(array['parent','newborn'], d.category),
             array_position(array['available','reserved','none','homed'], coalesce(d.status, 'none')), d.sort_order desc, d.created_at desc
  `;
  return rows.map(toAdminDog);
}

export async function getDog(id: string): Promise<AdminDog | null> {
  const [row] = await sql<Row[]>`${selectDogs()} where d.id = ${id}`;
  return row ? toAdminDog(row) : null;
}

export async function getPhotos(dogId: string): Promise<AdminPhoto[]> {
  const rows = await sql<{ id: string; storage_path: string; is_cover: boolean }[]>`
    select id, storage_path, is_cover from dog_photos
    where dog_id = ${dogId}
    order by sort_order, created_at
  `;
  return rows.map((r) => ({ id: r.id, url: r.storage_path, isCover: r.is_cover }));
}
