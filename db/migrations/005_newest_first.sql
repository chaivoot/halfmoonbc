-- Dogs are now listed by status, then highest sort_order first, so a newly
-- added dog (max + 1) lands on top. Flip the existing numbers within each
-- category so today's order on the site stays exactly as it is.
update dogs d
set sort_order = m.max_order + 1 - d.sort_order
from (select category, max(sort_order) as max_order from dogs group by category) m
where d.category = m.category;
