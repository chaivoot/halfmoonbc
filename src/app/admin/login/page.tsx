import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/ui";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/auth";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <>
      <AdminHeader showNav={false} />
      <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-12">
        <h1 className="font-heading m-0 text-3xl font-bold">เข้าสู่ระบบ</h1>
        <LoginForm />
        <Link href="/admin/help" className="self-start text-[15px] text-black underline underline-offset-4">
          ดูวิธีใช้หลังบ้าน
        </Link>
      </main>
    </>
  );
}
