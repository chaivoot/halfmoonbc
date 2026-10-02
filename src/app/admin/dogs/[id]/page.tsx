import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader, Notice } from "@/components/admin/ui";
import { DeleteDogButton } from "@/components/admin/delete-dog-button";
import { DogForm } from "@/components/admin/dog-form";
import { PhotoManager } from "@/components/admin/photo-manager";
import { getDog, getPhotos } from "@/lib/admin-dogs";
import { requireAdmin } from "@/lib/auth";
import { isUuid } from "@/lib/validate";

export default async function EditDogPage({ params, searchParams }: PageProps<"/admin/dogs/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [dog, photos, query] = await Promise.all([getDog(id), getPhotos(id), searchParams]);
  if (!dog) notFound();

  return (
    <>
      <AdminHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
        <Link href={`/admin?c=${dog.category}`} className="text-[15px] text-black underline underline-offset-4">
          กลับไปรายการ
        </Link>
        <h1 className="font-heading m-0 text-3xl font-bold">{dog.name || "แก้ไขข้อมูล"}</h1>
        {query.created === "1" && <Notice>เพิ่มข้อมูลแล้ว เพิ่มรูปด้านล่างได้เลย</Notice>}

        <section className="flex flex-col gap-3">
          <h2 className="font-heading m-0 text-xl font-semibold">รูป</h2>
          <PhotoManager dogId={dog.id} initialPhotos={photos} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading m-0 text-xl font-semibold">ข้อมูล</h2>
          <DogForm dog={dog} />
        </section>

        <section className="mt-4 flex flex-col gap-3 border-t border-border pt-6">
          <h2 className="font-heading m-0 text-xl font-semibold">ลบข้อมูล</h2>
          <p className="m-0 text-[15px] text-text-2">
            ถ้าแค่ไม่อยากให้แสดงบนหน้าเว็บ ใช้ปุ่ม &quot;ซ่อนจากหน้าเว็บ&quot; แทนได้ การลบจะลบรูปทั้งหมดของตัวนี้ด้วย และกู้คืนไม่ได้
          </p>
          <DeleteDogButton id={dog.id} />
        </section>
      </main>
    </>
  );
}
