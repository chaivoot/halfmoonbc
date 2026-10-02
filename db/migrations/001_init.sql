create extension if not exists pgcrypto;

create table dogs (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  name_th text,
  sex text check (sex in ('male', 'female')),
  color text,
  category text not null check (category in ('parent', 'newborn', 'young', 'adult')),
  -- null for parents, who are never for sale
  status text check (status in ('available', 'reserved', 'homed')),
  description text,
  tags text[] not null default '{}',
  birth_date date,
  litter text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index dogs_category_idx on dogs (category, sort_order);

create table dog_photos (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid not null references dogs (id) on delete cascade,
  -- a site path such as /images/... or a full Vercel Blob URL
  storage_path text not null,
  is_cover boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index dog_photos_dog_idx on dog_photos (dog_id, sort_order);
create unique index dog_photos_one_cover_idx on dog_photos (dog_id) where is_cover;

create function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger dogs_set_updated_at before update on dogs
  for each row execute function set_updated_at();
