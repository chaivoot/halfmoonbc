import "server-only";
import { sql } from "@/lib/db";
import type { Dog } from "@/lib/dogs";

type DogRow = {
  id: string;
  slug: string | null;
  name: string;
  name_th: string | null;
  sex: Dog["sex"];
  color: string | null;
  category: Dog["category"];
  status: Dog["status"];
  description: string | null;
  tags: string[];
  cover_photo: string | null;
  instagram: string | null;
  province: string | null;
  owner_message: string | null;
};

function toDog(r: DogRow): Dog {
  return {
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
    coverPhoto: r.cover_photo,
    instagram: r.instagram,
    province: r.province,
    ownerMessage: r.owner_message,
  };
}

const dogColumns = () => sql`
  d.id, d.slug, d.name, d.name_th, d.sex, d.color, d.category, d.status,
  d.description, d.tags, d.instagram, d.province, d.owner_message,
  (select p.storage_path from dog_photos p
    where p.dog_id = d.id
    order by p.is_cover desc, p.sort_order, p.created_at
    limit 1) as cover_photo
`;

type Group = "parents" | "puppies" | "family";

// Published dogs of one homepage section, with their cover photo (or first photo).
// Puppies are newborns not yet homed; once homed they belong to the family.
async function publishedDogs(group: Group): Promise<Dog[]> {
  const where =
    group === "parents"
      ? sql`d.category = 'parent'`
      : group === "puppies"
        ? sql`d.category <> 'parent' and d.status is distinct from 'homed'`
        : sql`d.category <> 'parent' and d.status = 'homed'`;
  const rows = await sql<DogRow[]>`
    select ${dogColumns()}
    from dogs d
    where d.is_published and ${where}
    -- available first, then reserved, no status, homed; newest (highest sort_order) on top
    order by array_position(array['available','reserved','none','homed'], coalesce(d.status, 'none')), d.sort_order desc, d.created_at desc
  `;
  return rows.map(toDog);
}

export const getParents = () => publishedDogs("parents");
export const getPuppies = () => publishedDogs("puppies");
export const getFamily = () => publishedDogs("family");

export type DogPage = Dog & {
  birthDate: string | null;
  litter: string | null;
  updatedAt: Date;
  photos: string[];
};

// One published dog with all its photos, for /dogs/[slug].
export async function getDogPage(slug: string): Promise<DogPage | null> {
  const [row] = await sql<(DogRow & { birth_date: string | null; litter: string | null; updated_at: Date })[]>`
    select ${dogColumns()}, d.litter, d.updated_at, to_char(d.birth_date, 'YYYY-MM-DD') as birth_date
    from dogs d
    where d.slug = ${slug} and d.is_published
  `;
  if (!row) return null;
  const photos = await sql<{ storage_path: string }[]>`
    select storage_path from dog_photos
    where dog_id = ${row.id}
    order by is_cover desc, sort_order, created_at
  `;
  return {
    ...toDog(row),
    birthDate: row.birth_date,
    litter: row.litter,
    updatedAt: row.updated_at,
    photos: photos.map((p) => p.storage_path),
  };
}

// Every published dog that has a page, for the sitemap and static generation.
export async function getDogSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  const rows = await sql<{ slug: string; updated_at: Date }[]>`
    select d.slug, d.updated_at from dogs d
    where d.is_published and d.slug is not null
    order by array_position(array['parent','newborn'], d.category),
             array_position(array['available','reserved','none','homed'], coalesce(d.status, 'none')), d.sort_order desc, d.created_at desc
  `;
  return rows.map((r) => ({ slug: r.slug, updatedAt: r.updated_at }));
}
