import Image from "next/image";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/ui";
import { getAdmin } from "@/lib/auth";

export const metadata = { title: "วิธีใช้หลังบ้าน - Halfmoon" };

// Screenshots are 2x captures of a 390px-wide phone screen.
function Shot({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={w / 2}
      height={h / 2}
      sizes="(max-width: 480px) 100vw, 390px"
      className="h-auto w-full max-w-[390px] rounded-2xl border border-border"
    />
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5">
      <h2 className="font-heading m-0 flex items-center gap-3 text-xl font-bold">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-yellow text-base text-ink">
          {n}
        </span>
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-[16px] leading-relaxed text-text-2 [&_b]:text-ink [&_ol]:m-0 [&_ol]:list-decimal [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-1.5 [&_ol]:pl-5 [&_p]:m-0 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

export default async function HelpPage() {
  // Readable without signing in, so it also helps when logging in is the problem.
  const signedIn = (await getAdmin()) !== null;

  return (
    <>
      <AdminHeader showNav={signedIn} />
      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
        <Link href={signedIn ? "/admin" : "/admin/login"} className="text-[15px] text-black underline underline-offset-4">
          {signedIn ? "กลับไปรายการสุนัข" : "ไปหน้าเข้าสู่ระบบ"}
        </Link>
        <h1 className="font-heading m-0 text-3xl font-bold">วิธีใช้หลังบ้าน</h1>
        <p className="m-0 text-text-2">
          ใช้จากมือถือได้ทั้งหมด ทุกอย่างที่บันทึกจะขึ้นบนหน้าเว็บทันที ไม่ต้องรอ
        </p>

        <Step n={1} title="เข้าสู่ระบบ">
          <ol>
            <li>
              เปิด <b>halfmoonbc.vercel.app/admin</b> ในมือถือ
            </li>
            <li>
              ชื่อผู้ใช้ <b>admin</b> ใส่รหัสผ่าน แล้วกด <b>เข้าสู่ระบบ</b>
            </li>
            <li>เข้าครั้งแรกระบบจะให้ตั้งรหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร) จดเก็บไว้ให้ดี</li>
          </ol>
          <p>
            เคล็ดลับ: กด <b>แชร์</b> แล้วเลือก <b>เพิ่มไปยังหน้าจอโฮม</b> (iPhone) หรือเมนู <b>⋮</b> แล้วเลือก{" "}
            <b>เพิ่มไปยังหน้าจอหลัก</b> (Android) จะได้ไอคอนเปิดหลังบ้านได้ในแตะเดียว ระบบจำการเข้าสู่ระบบไว้ 30 วัน
          </p>
          <Shot src="/admin-help/login.webp" alt="หน้าเข้าสู่ระบบ" w={780} h={840} />
        </Step>

        <Step n={2} title="เพิ่มน้องตัวใหม่">
          <ol>
            <li>
              ที่หน้ารายการ กด <b>+ เพิ่มสุนัข</b>
            </li>
            <li>
              เลือก <b>หมวด</b>: New born, Young, Adult หรือพ่อแม่พันธุ์
            </li>
            <li>ใส่ชื่อ เพศ สี วันเกิด และสถานะ (ไม่ต้องกรอกครบทุกช่องก็ได้)</li>
            <li>
              กด <b>บันทึกแล้วไปเพิ่มรูป</b> ระบบจะพาไปหน้าเพิ่มรูปทันที
            </li>
          </ol>
          <Shot src="/admin-help/new.webp" alt="ฟอร์มเพิ่มสุนัข" w={780} h={1280} />
        </Step>

        <Step n={3} title="อัปโหลดรูป">
          <ol>
            <li>
              ในหน้าของน้องตัวนั้น กด <b>+ เพิ่มรูป</b>
            </li>
            <li>
              มือถือจะถามว่าจะ <b>ถ่ายรูป</b> หรือ <b>เลือกจากคลังรูปภาพ</b> เลือกจากคลังได้ทีละหลายรูป
            </li>
            <li>
              รอจนข้อความ <b>กำลังอัปโหลด 3/5...</b> หายไป ระหว่างนี้อย่าปิดหน้าหรือสลับแอป
            </li>
          </ol>
          <p>ไม่ต้องย่อรูปเอง ระบบย่อให้อัตโนมัติก่อนส่ง อัปผ่านเน็ตมือถือได้</p>
          <Shot src="/admin-help/photos.webp" alt="ส่วนจัดการรูป มีปุ่มเพิ่มรูป รูปปก และปุ่มลบ" w={780} h={794} />
        </Step>

        <Step n={4} title="รูปปก เรียงรูป และลบรูป">
          <ul>
            <li>
              รูปที่มีป้ายเหลือง <b>รูปปก</b> คือรูปที่ลูกค้าเห็นบนหน้าเว็บ
            </li>
            <li>
              อยากเปลี่ยนรูปปก กด <b>ตั้งเป็นรูปปก</b> ใต้รูปที่ต้องการ
            </li>
            <li>
              อยากเรียงรูปใหม่ <b>กดค้างที่รูป</b> สักครู่ แล้วลากไปวางตำแหน่งที่ต้องการ
            </li>
            <li>
              กด <b>ลบ</b> ใต้รูปเพื่อลบรูปนั้น (ระบบจะถามยืนยันก่อน)
            </li>
          </ul>
        </Step>

        <Step n={5} title="เปลี่ยนสถานะ และซ่อนน้อง">
          <ul>
            <li>
              ที่หน้ารายการ กด <b>ว่าง</b> <b>จองแล้ว</b> หรือ <b>มีบ้านแล้ว</b> ได้เลย มีผลทันที
            </li>
            <li>
              น้องที่ตั้งเป็น <b>ว่าง</b> จะขึ้นป้ายสีเหลือง และลูกค้ากดดูเฉพาะน้องที่ว่างได้
            </li>
            <li>
              กด <b>ซ่อนจากหน้าเว็บ</b> ถ้ายังไม่อยากให้ลูกค้าเห็น ข้อมูลและรูปยังอยู่ครบ กดแสดงกลับได้ตลอด
            </li>
            <li>
              กด <b>แก้ไข</b> เพื่อแก้ชื่อ คำอธิบาย หรือย้ายหมวด เช่น จาก New born ไป Young เมื่อน้องโตขึ้น
            </li>
          </ul>
          <Shot src="/admin-help/list.webp" alt="หน้ารายการสุนัข มีปุ่มสถานะและปุ่มซ่อน" w={780} h={1400} />
        </Step>

        <Step n={6} title="ถ่ายรูปให้ออกมาสวย">
          <ul>
            <li>แกลเลอรีบนหน้าเว็บตัดรูปเป็นสี่เหลี่ยมจัตุรัส ให้น้องอยู่กลางภาพ เว้นขอบไว้หน่อย</li>
            <li>ถ่ายในที่สว่าง แสงธรรมชาติ ไม่ย้อนแสง</li>
            <li>ถ่ายระดับสายตาน้อง จะเห็นหน้าและแววตาชัด</li>
            <li>รูปที่มีตัวหนังสือหรือกรอบตกแต่ง ไม่ควรใช้เป็นรูปปก</li>
          </ul>
        </Step>

        <Step n={7} title="ถ้ามีปัญหา">
          <ul>
            <li>
              <b>อัปโหลดไม่สำเร็จ:</b> เช็คสัญญาณเน็ต แล้วกดเพิ่มรูปใหม่อีกครั้ง รูปที่ขึ้นไปแล้วไม่หาย
            </li>
            <li>
              <b>ใส่รหัสผิดหลายครั้ง:</b> ระบบล็อกไว้ 15 นาที รอแล้วลองใหม่
            </li>
            <li>
              <b>ลืมรหัสผ่าน:</b> ติดต่อผู้ดูแลเว็บเพื่อตั้งรหัสใหม่
            </li>
          </ul>
        </Step>
      </main>
    </>
  );
}
