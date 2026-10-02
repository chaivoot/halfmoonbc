import type { Metadata, Viewport } from "next";
import { Bai_Jamjuree, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
});

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Halfmoon Border Collie Thailand - ฟาร์มบอร์เดอร์คอลลี่ จ.ระนอง",
  description:
    "ฟาร์มบอร์เดอร์คอลลี่ จ.ระนอง ลูกสุนัขมีใบเพดดิกรีจากสมาคมพัฒนาพันธุ์สุนัขแห่งประเทศไทย (FCI) วัคซีน 2 เข็ม และผ่านการฝึกพื้นฐานก่อนส่งมอบ",
};

export const viewport: Viewport = {
  themeColor: "#F5C400",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${baiJamjuree.variable} ${plexThai.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
