# Halfmoon Border Collie Thailand

เว็บไซต์ฟาร์มบอร์เดอร์คอลลี่ Halfmoon Border Collie Thailand (โปรเจคของ Hero Pet Farm, จ.ระนอง)

- Next.js (App Router) + TypeScript + Tailwind CSS
- Neon Postgres, migrations ใน `db/migrations/` รันอัตโนมัติก่อน build
- Deploy อัตโนมัติบน Vercel จาก branch `main`
- รายละเอียดโปรเจคและลำดับงานอยู่ใน [`CLAUDE.md`](./CLAUDE.md)

## รันบนเครื่อง

ต้องมี Postgres และตั้งค่า `DATABASE_URL` ใน `.env.local` ก่อน (บน Vercel ได้จาก Neon integration อัตโนมัติ)

```bash
npm install
npm run db:migrate   # สร้างตารางและใส่ข้อมูลตั้งต้น
npm run dev
```

เปิด http://localhost:3000
