import Link from "next/link";
import { AdminHeader } from "@/components/admin/ui";
import { DogForm } from "@/components/admin/dog-form";
import { requireAdmin } from "@/lib/auth";
import { isCategory } from "@/lib/validate";

export default async function NewDogPage({ searchParams }: PageProps<"/admin/dogs/new">) {
  await requireAdmin();
  const { c } = await searchParams;
  return (
    <>
      <AdminHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
        <Link href="/admin" className="text-[15px] text-black underline underline-offset-4">
          กลับไปรายการ
        </Link>
        <h1 className="font-heading m-0 text-3xl font-bold">เพิ่มสุนัข</h1>
        <DogForm defaultCategory={isCategory(c) ? c : undefined} />
      </main>
    </>
  );
}
