-- New structure: puppies (category 'newborn') are listed under ลูกสุนัข while
-- available or reserved, and move to ครอบครัว Halfmoon once their status is homed.
-- Young and Adult are retired: those dogs have all gone to their homes.
update dogs set status = 'homed' where category in ('young', 'adult');
update dogs set category = 'newborn' where category in ('young', 'adult');

alter table dogs drop constraint if exists dogs_category_check;
alter table dogs add constraint dogs_category_check check (category in ('parent', 'newborn'));

-- Shown for dogs in ครอบครัว Halfmoon, so customers can see how they are doing.
alter table dogs add column instagram text;      -- handle without @, e.g. luna.bordercollie
alter table dogs add column province text;       -- where the dog lives now
alter table dogs add column owner_message text;  -- a few words from the new family
