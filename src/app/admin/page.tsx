import Image from "next/image";
import Link from "next/link";
import { AdminHeader, Notice, primaryButton } from "@/components/admin/ui";
import { DogQuickActions } from "@/components/admin/dog-quick-actions";
import { listDogs } from "@/lib/admin-dogs";
import { requireAdmin } from "@/lib/auth";
import { categoryLabel } from "@/lib/dogs";
import { categories, isCategory } from "@/lib/validate";

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const params = await searchParams;
  const category = isCategory(params.c) ? params.c : null;
  const dogs = await listDogs(category);

  const filters = [{ id: null, label: "ทั้งหมด" }, ...categories.map((c) => ({ id: c, label: categoryLabel[c] }))];

  return (
    <>
      <AdminHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
        {params.password === "changed" && <Notice>เปลี่ยนรหัสผ่านเรียบร้อยแล้ว</Notice>}
        {params.deleted === "1" && <Notice>ลบข้อมูลเรียบร้อยแล้ว</Notice>}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading m-0 text-3xl font-bold">สุนัขทั้งหมด</h1>
          <Link href={`/admin/dogs/new${category ? `?c=${category}` : ""}`} className={primaryButton}>
            + เพิ่มสุนัข
          </Link>
        </div>

        <nav aria-label="กรองตามหมวด" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {filters.map((f) => {
            const active = f.id === category;
            return (
              <Link
                key={f.label}
                href={f.id ? `/admin?c=${f.id}` : "/admin"}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-[15px] font-semibold ${
                  active ? "bg-black text-white" : "bg-white text-black ring-1 ring-border"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </nav>

        {dogs.length === 0 && <p className="text-text-2">ยังไม่มีข้อมูลในหมวดนี้</p>}

        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {dogs.map((d) => (
            <li key={d.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-3">
              <Link href={`/admin/dogs/${d.id}`} className="flex items-center gap-3 text-ink">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-placeholder">
                  {d.coverPhoto && (
                    <Image src={d.coverPhoto} alt="" fill sizes="80px" className="object-cover" />
                  )}
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-lg font-semibold">
                    {d.name || <span className="text-text-3">(ยังไม่ตั้งชื่อ)</span>}
                    {d.nameTh && <span className="ml-2 text-[15px] font-normal text-text-3">{d.nameTh}</span>}
                  </span>
                  <span className="text-sm text-text-3">
                    {categoryLabel[d.category]} · {d.photoCount} รูป
                    {!d.isPublished && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-xs text-white">ซ่อนอยู่</span>}
                  </span>
                  <span className="text-sm font-semibold text-black underline underline-offset-4">แก้ไข</span>
                </div>
              </Link>
              <DogQuickActions
                id={d.id}
                status={d.status}
                isPublished={d.isPublished}
                canHaveStatus={d.category !== "parent"}
              />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
