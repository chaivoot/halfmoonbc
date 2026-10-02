import "server-only";
import { sql } from "@/lib/db";
import type { Dog } from "@/lib/dogs";

type DogRow = {
  id: string;
  name: string;
  name_th: string | null;
  sex: Dog["sex"];
  color: string | null;
  category: Dog["category"];
  status: Dog["status"];
  description: string | null;
  tags: string[];
  cover_photo: string | null;
};

function toDog(r: DogRow): Dog {
  return {
    id: r.id,
    name: r.name,
    nameTh: r.name_th,
    sex: r.sex,
    color: r.color,
    category: r.category,
    status: r.status,
    description: r.description,
    tags: r.tags,
    coverPhoto: r.cover_photo,
  };
}

// Published dogs with their cover photo (or first photo if none is marked).
async function publishedDogs(parents: boolean): Promise<Dog[]> {
  const rows = await sql<DogRow[]>`
    select d.id, d.name, d.name_th, d.sex, d.color, d.category, d.status,
           d.description, d.tags,
           (select p.storage_path from dog_photos p
             where p.dog_id = d.id
             order by p.is_cover desc, p.sort_order, p.created_at
             limit 1) as cover_photo
    from dogs d
    where d.is_published
      and (d.category = 'parent') = ${parents}
    order by d.sort_order, d.created_at
  `;
  return rows.map(toDog);
}

export const getParents = () => publishedDogs(true);
export const getFamily = () => publishedDogs(false);
