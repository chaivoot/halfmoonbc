import { AdminHeader, Notice } from "@/components/admin/ui";
import { PasswordForm } from "@/components/admin/password-form";
import { requireAdmin } from "@/lib/auth";

export default async function PasswordPage() {
  const admin = await requireAdmin({ allowPendingPasswordChange: true });
  return (
    <>
      <AdminHeader showNav={!admin.mustChangePassword} />
      <main className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-10">
        <h1 className="font-heading m-0 text-3xl font-bold">เปลี่ยนรหัสผ่าน</h1>
        {admin.mustChangePassword && (
          <Notice>ล็อกอินครั้งแรก กรุณาตั้งรหัสผ่านใหม่ก่อนใช้งาน</Notice>
        )}
        <PasswordForm />
      </main>
    </>
  );
}
