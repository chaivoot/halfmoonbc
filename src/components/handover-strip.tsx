import Image from "next/image";
import Link from "next/link";
import { dogPath } from "@/lib/dogs";
import type { HandoverPhoto } from "@/lib/queries";

// "วันส่งมอบน้อง": the latest photos from the day puppies went home, as a
// swipeable row. Each photo opens that dog's page.
export function HandoverStrip({ photos }: { photos: HandoverPhoto[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex max-w-[720px] flex-col gap-3">
        <span className="font-heading text-sm font-semibold text-yellow-text">วันส่งมอบน้อง</span>
        <h2 className="font-heading m-0 text-[30px] font-bold leading-[1.2] md:text-[40px]">ส่งถึงมือครอบครัวใหม่</h2>
        <p className="m-0 text-text-2">บรรยากาศวันส่งมอบ ทั้งขับรถไปส่งถึงบ้าน และครอบครัวที่มารับน้องที่ฟาร์ม</p>
      </div>
      <ul className="-mx-4 m-0 flex list-none snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] md:-mx-12 md:px-12">
        {photos.map((p) => {
          const img = (
            <Image
              src={p.url}
              alt={p.name ? `วันรับ ${p.name} กลับบ้าน` : "วันส่งมอบน้องบอร์เดอร์คอลลี่จาก Halfmoon"}
              fill
              sizes="(max-width: 768px) 75vw, 320px"
              className="object-cover"
            />
          );
          return (
            <li key={p.url} className="w-[75%] shrink-0 snap-start sm:w-[45%] md:w-[300px]">
              <figure className="m-0 flex flex-col gap-2">
                {p.slug ? (
                  <Link
                    href={dogPath(p.slug)}
                    className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-placeholder"
                    aria-label={`ดูหน้าของ ${p.name}`}
                  >
                    {img}
                  </Link>
                ) : (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-placeholder">{img}</div>
                )}
                {p.name && <figcaption className="text-[15px] font-semibold text-ink">{p.name}</figcaption>}
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
