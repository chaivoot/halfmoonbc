import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export { inputClass, labelClass, Notice, primaryButton, secondaryButton } from "@/components/admin/ui-client";

export function AdminHeader({ showNav = true }: { showNav?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/95 px-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 py-3">
        <Link href="/admin" className="font-heading leading-tight text-ink">
          <span className="block text-lg font-bold">Halfmoon</span>
          <span className="block text-xs font-medium whitespace-nowrap text-text-3">หลังบ้าน</span>
        </Link>
        {showNav && (
          <nav className="flex items-center text-sm whitespace-nowrap sm:gap-1 sm:text-[15px]">
            <Link href="/" target="_blank" className="rounded-full px-2.5 py-3 text-black hover:bg-border/60">
              ดูหน้าเว็บ
            </Link>
            <Link href="/admin/password" className="rounded-full px-2.5 py-3 text-black hover:bg-border/60">
              รหัสผ่าน
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="cursor-pointer rounded-full px-2.5 py-3 text-black hover:bg-border/60">
                ออกจากระบบ
              </button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}
