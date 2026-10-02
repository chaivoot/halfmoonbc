import "server-only";
import { sql } from "@/lib/db";
import type { DogCategory, DogStatus } from "@/lib/dogs";

export type AdminDog = {
  id: string;
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
  isPublished: boolean;
  coverPhoto: string | null;
  photoCount: number;
};

export type AdminPhoto = { id: string; url: string; isCover: boolean };

type Row = {
  id: string;
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
  is_published: boolean;
  cover_photo: string | null;
  photo_count: number;
};

const toAdminDog = (r: Row): AdminDog => ({
  id: r.id,
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
  isPublished: r.is_published,
  coverPhoto: r.cover_photo,
  photoCount: r.photo_count,
});

// A function so each query gets its own fragment instance.
const selectDogs = () => sql`
  select d.id, d.name, d.name_th, d.sex, d.color, d.category, d.status, d.description,
         d.tags, to_char(d.birth_date, 'YYYY-MM-DD') as birth_date, d.litter, d.is_published,
         (select p.storage_path from dog_photos p where p.dog_id = d.id
           order by p.is_cover desc, p.sort_order, p.created_at limit 1) as cover_photo,
         (select count(*)::int from dog_photos p where p.dog_id = d.id) as photo_count
  from dogs d
`;

export async function listDogs(category: DogCategory | null): Promise<AdminDog[]> {
  const rows = await sql<Row[]>`
    ${selectDogs()}
    ${category ? sql`where d.category = ${category}` : sql``}
    order by array_position(array['parent','newborn','young','adult'], d.category),
             d.sort_order, d.created_at
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
