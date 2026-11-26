-- Photos from the day a puppy goes home (handover, the drive, the family
-- picking it up at the farm). Shown in their own section on the dog's page
-- and in the "วันส่งมอบน้อง" strip on the home page.
alter table dog_photos add column is_handover boolean not null default false;
create index dog_photos_handover_idx on dog_photos (created_at desc) where is_handover;
