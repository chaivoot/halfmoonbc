import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "จัดการข้อมูล - Halfmoon Border Collie Thailand",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-bg">{children}</div>;
}
