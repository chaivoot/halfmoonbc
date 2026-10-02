@AGENTS.md

# Halfmoon Border Collie Thailand - Project Brief for Claude Code

เว็บไซต์ใหม่ของฟาร์มสุนัขพันธุ์บอร์เดอร์คอลลี่ Halfmoon Border Collie Thailand (โปรเจคของ Hero Pet Farm, จ.ระนอง)
แทนที่เว็บเดิมบน Google Sites: https://sites.google.com/view/halfmoonbordercolliethailand

ไฟล์อ้างอิงดีไซน์: `docs/design-reference.dc.html` (mockup หน้าแรก ใช้ดูโครงหน้า สี ข้อความ ไม่ใช่โค้ด production)

---

## 1. Workflow (ต้องทำตามทุกครั้ง)

- ทำงานทั้งหมดใน Claude sandbox เจ้าของโปรเจคไม่เขียนโค้ดบนเครื่องตัวเอง
- ทุกการเปลี่ยนแปลง: commit, push และ merge เข้า `main` ทุกครั้ง
- Vercel เชื่อมกับ repo และ auto-deploy จาก `main` (ตั้งค่าผ่าน Vercel GUI ไม่ใช้ CLI)
- ห้ามเดา ถ้าไม่แน่ใจเรื่องไหน (ข้อมูลฟาร์ม, ราคา, การตั้งค่า) ให้ถามก่อน
- หลัง deploy ให้บอกว่าควรเช็คอะไรบน production
- ข้อความภาษาไทยบนเว็บ: ไม่ใช้ em dash (—) ใช้ hyphen (-) แทน และไม่ใช้อัญประกาศพร่ำเพรื่อ

## 2. Tech stack (ถ้าจะเปลี่ยนให้ถามก่อน)

- Next.js (App Router) + TypeScript + Tailwind CSS
- Neon Postgres (ข้อมูลสุนัข) ต่อผ่าน Vercel integration, driver `postgres` (`src/lib/db.ts`)
- Vercel Blob (รูปที่อัปจาก admin)
- ล็อกอิน admin: เขียนเอง (ยังรอเจ้าของเลือกวิธี)
- Deploy: Vercel
- รูป: ใช้ `next/image`, ย่อรูปฝั่ง client ก่อนอัปโหลด (กว้างสุด ~1600px, WebP/JPEG) เพราะเพื่อนจะอัปจากมือถือ

ขั้นที่เจ้าของโปรเจคต้องทำเอง (ให้ Claude Code บอกทีละขั้นเมื่อถึงเวลา):
1. เชื่อม Neon กับโปรเจคใน Vercel (Storage tab) - ทำแล้ว ค่า `DATABASE_URL` ฯลฯ ถูกใส่ใน Vercel env อัตโนมัติ ห้าม commit
2. Import repo เข้า Vercel และใส่ Environment Variables
3. สร้าง Vercel Blob store และเชื่อมกับโปรเจค (ก่อนทำหน้า admin)

## 3. Design

### สี (เหลือง-ดำเป็นหลัก)
| Token | Hex | ใช้กับ |
|---|---|---|
| yellow | `#F5C400` | พื้น hero, ราคา, ปุ่มบนพื้นดำ, ไอคอนบนพื้นดำ |
| yellow-soft | `#FFF1B8` | tag/chip บนการ์ด |
| yellow-text | `#7A5B00` | eyebrow label บนพื้นสว่าง (คอนทราสต์ผ่าน) |
| black | `#141414` | ปุ่มหลัก, ส่วน About/Contact, ลิงก์ |
| ink | `#0B0B0B` | หัวข้อ, footer, กล่องราคา |
| card-dark | `#262626` | การ์ดบนพื้นดำ |
| bg | `#F6F4EE` | พื้นหลังหลัก (ครีมอ่อน) |
| surface | `#FFFFFF` | การ์ด, section สลับ |
| border | `#E2DED3` | เส้นขอบ |
| text-2 | `#404040` | เนื้อความรอง |
| text-3 | `#5C5C5C` | caption |

ไม่มีโลโก้ ใช้ wordmark ตัวอักษร: "Halfmoon" (ตัวหนา) + "BORDER COLLIE THAILAND" (ตัวเล็ก letter-spacing กว้าง)

### ฟอนต์ (Google Fonts)
- หัวข้อ: Bai Jamjuree 600/700
- เนื้อความ: IBM Plex Sans Thai 400/500/600

### หลักการ
- Mobile-first (ลูกค้าส่วนใหญ่มาจาก Facebook/LINE บนมือถือ)
- ปุ่มแตะได้สูงอย่างน้อย 44px, ไอคอนเป็น inline SVG แบบเส้น ไม่ใช้ emoji
- ปุ่ม LINE ต้องเห็นตลอด (ใน header และควรมีปุ่มลอยบนมือถือ)

## 4. หน้าเว็บสาธารณะ (หน้าเดียว scroll + anchor)

ลำดับ section (ข้อความจริงอยู่ใน `design-reference.dc.html`):
1. Header sticky: wordmark, เมนู (เกี่ยวกับฟาร์ม / พ่อแม่พันธุ์ / ลูกสุนัข / Halfmoon Family / คำถามที่พบบ่อย), ปุ่ม ทัก LINE
2. Hero (พื้นเหลือง): หัวข้อ, จุดขาย (เพดดิกรี FCI, วัคซีน 2 เข็ม, ฝึกพื้นฐาน), ปุ่ม LINE + ดูพ่อแม่พันธุ์, badge จดทะเบียนฟาร์มกับสมาคมฯ
3. Trust strip 4 ช่อง: FCI / DNA / 2 เข็ม / LINE กลุ่ม
4. About (พื้นดำ): Hero Pet Farm ก่อตั้ง พ.ศ. 2566, จดทะเบียนกับสมาคมพัฒนาพันธุ์สุนัขแห่งประเทศไทย (ขึ้นตรงกับ FCI), ฟาร์มในตัวเมืองระนอง อากาศเย็นสบาย ไม่มีฝุ่น PM 2.5
5. พ่อแม่พันธุ์: การ์ดดึงจาก DB (category = parent)
6. สิ่งที่ลูกสุนัขจะได้รับ + รายการฝึก 9 ข้อ
7. ขั้นตอนรับน้อง 4 ขั้น + กล่องราคา
8. Halfmoon Family: แกลเลอรีดึงจาก DB มีแท็บ New born / Young / Adult และแสดงสถานะ (ว่าง/จองแล้ว)
9. FAQ แบบ accordion
10. ติดต่อ: โทร, LINE, Facebook, Instagram, Google Maps
11. Footer

### ข้อมูลฟาร์ม (จากเว็บเดิม)
- โทร: 091-826-8488 (คุณเข็ม) -> `tel:+66918268488`
- LINE: @HalfmoonBordercollie -> https://line.me/R/ti/p/@375wobeo
- Facebook: Halfmoon BorderCollie Thailand -> https://www.facebook.com/HalfMoon.BorderCollie
- Instagram: @halfmoonbordercollie -> https://instagram.com/halfmoonbordercollie
- ราคาเริ่มต้น 35,000 บาท, มัดจำเริ่มต้น 5,000 บาท
- ส่งมอบเมื่ออายุ 2 เดือน, ส่งฟรีกรุงเทพฯ และปริมณฑล, ต่างจังหวัดตามตกลง
- เยี่ยมฟาร์มได้หลังน้องได้วัคซีนครบ 2 เข็ม, ระหว่างนั้นวิดีโอคอลได้

### พ่อแม่พันธุ์ (seed data)
| ชื่อ | ชื่อไทย | เพศ | สี | คำอธิบาย |
|---|---|---|---|---|
| Halfmoon | ฮาฟมูน | ผู้ | Blue Merle (บลูเมิร์ล) | สุนัขตัวแรกของบ้าน น่ารัก เรียบร้อย ขี้อ้อน กินจุ สายประกวด ขนยาวสวยงาม เข้ากับเด็กๆ และน้องหมาตัวใหม่ได้ง่าย |
| Dakota | ดาโคด้า | ผู้ | Tri Color (ไตรคัลเลอร์) | สุดหล่อขี้อ้อน สาย Agility ทรงสปอร์ต แข็งแรง Active ชอบวิ่งเล่น พลังงานสูง เรียนรู้ไว คว้ารางวัลมาให้บ้านมากมาย |
| Mona | โมนา | เมีย | Black & White (ขาวดำ) | สาวที่เต็มไปด้วยความสามารถ สายถ่ายรูปคาเฟ่ ฝึกท่านั่ง หมอบ คลาน วิ่ง Agility จนได้รางวัล เรียบร้อย ใจดี สุขุม เฟรนลี่ เข้ากับเด็กง่าย |
| Cynthia | ซินเทีย | เมีย | Black & White (ขาวดำ) | ตัวเล็ก น่ารัก พกพาง่าย วิ่งตัวเบาเหมือนนินจา ชอบเล่น Agility |
| Dior | ดิออ | เมีย | Tri Merle (ไตรเมิร์ล) | สายคาเฟ่ เรียบร้อย ขี้อ้อน อยู่เป็น นิสัยเฟรนลี่ รักเด็ก |

### รายการฝึกก่อนส่งมอบ
Early Neurological Stimulation (ENS), การอยู่ในพื้นที่จำกัด, การอยู่ลำพัง, การขับถ่าย, การเล่น, การทานอาหารเม็ด, การทานน้ำจากขวด, การควบคุมอารมณ์, ทดสอบระบบประสาท การมอง การได้ยิน

### FAQ (จากเว็บเดิม)
1. น้องๆ จะได้รับอะไรบ้าง? - ใบเพดดิกรีจากสมาคมฯ, วัคซีน 2 เข็ม, การฝึกพื้นฐาน (รายการด้านบน)
2. ไปดูน้องที่ฟาร์มได้ไหม? - ได้ หลังน้องได้วัคซีนครบ 2 เข็ม เพื่อความปลอดภัย ระหว่างนั้นวิดีโอคอลได้
3. รับน้องได้ตอนไหน ยังไง? - อายุครบ 2 เดือน, ส่งฟรีกรุงเทพฯ และปริมณฑล, ต่างจังหวัดตามตกลง
4. ราคาและมัดจำ? - เริ่มต้น 35,000 บาท, มัดจำเริ่มต้น 5,000 บาท
5. พ่อแม่น้องเป็นยังไง? - ตรวจ DNA ไม่มีโรคทางพันธุกรรม, วัคซีนประจำ, เลี้ยงและฝึกให้อยู่ในสังคม, ดูแลให้จิตใจสดใส, รางวัลประกวดความสวยงาม, รางวัล Agility Dog, นิสัยดี จิตประสาทดี
6. รับน้องไปแล้วมีช่องทางปรึกษาไหม? - มีไลน์กลุ่มผู้ปกครองตั้งแต่รุ่นแรกถึงปัจจุบัน ดึงเข้ากลุ่มทันทีเมื่อส่งมอบ

## 5. ระบบหลังบ้าน (/admin)

ผู้ใช้: เจ้าของฟาร์ม (ไม่ถนัดเทคนิค ใช้มือถือเป็นหลัก) ต้องง่ายที่สุด

### ฟีเจอร์
- ล็อกอิน (email + password แยกคน หรือรหัสเดียวร่วมกัน - ถามเจ้าของก่อน)
- รายการสุนัขทั้งหมด กรองตามหมวด
- เพิ่ม / แก้ไข / ซ่อน / ลบ สุนัข
- อัปโหลดหลายรูปพร้อมกันจากมือถือ (ถ่ายรูปหรือเลือกจากคลัง), เลือกรูปปก, ลากเรียงลำดับ
- เปลี่ยนสถานะได้ในคลิกเดียว (ว่าง / จองแล้ว / มีบ้านแล้ว)
- หน้าเว็บอัปเดตทันทีหลังบันทึก (revalidate)

### Data model (เสนอ)
`dogs`
- id (uuid), name, name_th, sex (male/female), color
- category: `parent` | `newborn` | `young` | `adult`
- status: `available` | `reserved` | `homed` | null (null สำหรับพ่อแม่พันธุ์)
- description, tags (text[]), birth_date (nullable), litter (nullable, ชื่อครอก)
- is_published (bool), sort_order (int), created_at, updated_at

`dog_photos`
- id, dog_id (fk), storage_path, is_cover (bool), sort_order

Security: ไม่มี RLS เพราะ DB เข้าถึงได้จาก server เท่านั้น หน้า public query เฉพาะ `is_published = true` ทุก server action ที่เขียนข้อมูลต้องเช็ค session admin เอง

Migrations: ไฟล์ SQL ใน `db/migrations/` รันอัตโนมัติก่อน `next build` (`scripts/migrate.mjs`) แต่ละไฟล์รันครั้งเดียว ห้ามแก้ไฟล์ที่ apply แล้ว ให้เพิ่มไฟล์ใหม่แทน
`dog_photos.storage_path` เป็น path ใน `public/` (รูปจากเว็บเดิม) หรือ URL เต็มของ Vercel Blob

### Phase 2 (ยังไม่ยืนยัน ถามเจ้าของก่อนทำ)
- แก้ราคา, FAQ, ข้อความหน้าแรกจาก admin (ตาราง `site_settings`)
- หลาย admin

## 6. SEO / Local

- Metadata ภาษาไทย, OG image, `lang="th"`
- JSON-LD: `LocalBusiness` (ระนอง), `FAQPage`
- sitemap.xml, robots.txt
- คีย์เวิร์ดหลัก: บอร์เดอร์คอลลี่, ฟาร์มบอร์เดอร์คอลลี่, ลูกสุนัขบอร์เดอร์คอลลี่ ระนอง, border collie thailand

## 7. ข้อมูลที่ยังขาด (ถามเจ้าของ อย่าเดา)

- รูปจริง: พ่อแม่พันธุ์, ลูกสุนัข, บรรยากาศฟาร์ม, ใบรับรองสมาคมฯ
- ที่อยู่ / พิกัดฟาร์มสำหรับ Google Maps
- โดเมน
- วิธีล็อกอิน admin และจำนวนคนที่ใช้

## 8. ลำดับงาน

1. Scaffold Next.js + Tailwind + design tokens, push + merge main, ต่อ Vercel
2. หน้าสาธารณะแบบ static ตามดีไซน์ (ใช้ placeholder รูป)
3. ต่อ Neon: schema, seed พ่อแม่พันธุ์ 5 ตัว และรูปแกลเลอรีจากเว็บเดิม
4. ดึงข้อมูลพ่อแม่พันธุ์และแกลเลอรีจาก DB
5. หน้า /admin: login, CRUD, อัปโหลดรูป
6. SEO + schema
7. ทดสอบบนมือถือ, ส่งคู่มือสั้นๆ วิธีอัปโหลดให้เจ้าของฟาร์ม
