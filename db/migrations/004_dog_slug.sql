-- URL part for each dog's own page, e.g. /dogs/halfmoon. Set once from the
-- English name and kept when the name changes, so shared links keep working.
alter table dogs add column slug text unique;

with base as (
  select id, created_at,
         trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')) as s
  from dogs
  where name <> ''
),
numbered as (
  select id, s, row_number() over (partition by s order by created_at, id) as n
  from base
  where s <> ''
)
update dogs d
set slug = case when n.n = 1 then n.s else n.s || '-' || n.n end
from numbered n
where d.id = n.id;
