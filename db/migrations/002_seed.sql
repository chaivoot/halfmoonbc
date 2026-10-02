-- Parent dogs from the project brief, with photos imported from the old site.
with parents (sort_order, name, name_th, sex, color, description, tags, photo) as (
  values
    (1, 'Halfmoon', 'ฮาฟมูน', 'male', 'Blue Merle (บลูเมิร์ล)',
     'สุนัขตัวแรกของบ้าน น่ารัก เรียบร้อย ขี้อ้อน กินจุ สายประกวด ขนยาวสวยงาม เข้ากับเด็กๆ และน้องหมาตัวใหม่ได้ง่าย',
     array['สายประกวด', 'เข้ากับเด็ก'], '/images/parents/halfmoon.webp'),
    (2, 'Dakota', 'ดาโคด้า', 'male', 'Tri Color (ไตรคัลเลอร์)',
     'สุดหล่อขี้อ้อน สาย Agility ทรงสปอร์ต แข็งแรง Active ชอบวิ่งเล่น พลังงานสูง เรียนรู้ไว คว้ารางวัลมาให้บ้านมากมาย',
     array['Agility', 'พลังงานสูง'], '/images/parents/dakota.webp'),
    (3, 'Mona', 'โมนา', 'female', 'Black & White (ขาวดำ)',
     'สาวที่เต็มไปด้วยความสามารถ สายถ่ายรูปคาเฟ่ ฝึกท่านั่ง หมอบ คลาน วิ่ง Agility จนได้รางวัล เรียบร้อย ใจดี สุขุม เฟรนลี่ เข้ากับเด็กง่าย',
     array['Agility', 'สายคาเฟ่'], '/images/parents/mona.webp'),
    (4, 'Cynthia', 'ซินเทีย', 'female', 'Black & White (ขาวดำ)',
     'ตัวเล็ก น่ารัก พกพาง่าย วิ่งตัวเบาเหมือนนินจา ชอบเล่น Agility',
     array['Agility', 'ตัวเล็ก'], '/images/parents/cynthia.webp'),
    (5, 'Dior', 'ดิออ', 'female', 'Tri Merle (ไตรเมิร์ล)',
     'สายคาเฟ่ เรียบร้อย ขี้อ้อน อยู่เป็น นิสัยเฟรนลี่ รักเด็ก',
     array['สายคาเฟ่', 'รักเด็ก'], '/images/parents/dior.webp')
),
inserted as (
  insert into dogs (name, name_th, sex, color, category, description, tags, sort_order)
  select name, name_th, sex, color, 'parent', description, tags, sort_order from parents
  returning id, sort_order
)
insert into dog_photos (dog_id, storage_path, is_cover)
select i.id, p.photo, true from inserted i join parents p using (sort_order);

-- Halfmoon Family gallery: one entry per photo from the old site.
-- Names and statuses are filled in later from /admin.
with photos (n, category) as (
  select n, case when n <= 9 then 'newborn' when n <= 24 then 'young' else 'adult' end
  from generate_series(1, 39) as n
),
inserted as (
  insert into dogs (category, sort_order)
  select category, n from photos
  returning id, category, sort_order
)
insert into dog_photos (dog_id, storage_path, is_cover)
select id, format('/images/family/%s-%s.webp', category, lpad(sort_order::text, 2, '0')), true
from inserted;
