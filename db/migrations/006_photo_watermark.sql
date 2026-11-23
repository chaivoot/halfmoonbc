-- Photos get "Halfmoon" burned in before upload. Existing photos start as false
-- and are converted from the admin page, which then sets this to true.
alter table dog_photos add column watermarked boolean not null default false;
