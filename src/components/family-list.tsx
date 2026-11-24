"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { InstagramIcon, MapPinIcon } from "@/components/icons";
import { type Dog, dogPath, instagramUrl } from "@/lib/dogs";

// How many family cards show before "ดูทั้งหมด".
const FIRST = 8;

// ครอบครัว Halfmoon: puppies that have gone to their new homes, with where they
// live, a note from the family and their Instagram, so customers can ask
// the owners how the dogs are doing.
export function FamilyList({ dogs }: { dogs: Dog[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? dogs : dogs.slice(0, FIRST);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-[720px] flex-col gap-3">
        <span className="font-heading text-sm font-semibold tracking-[0.12em] text-yellow-text">HALFMOON FAMILY</span>
        <h2 className="font-heading m-0 text-[30px] font-bold leading-[1.2] md:text-[40px]">ครอบครัว Halfmoon</h2>
        <p className="m-0 text-text-2">
          น้องๆ ที่ย้ายไปอยู่บ้านใหม่แล้ว อยากรู้ว่าน้องเป็นยังไง สุขภาพดีไหม ทักไปถามเจ้าของทาง Instagram ได้เลย
        </p>
      </div>

      {dogs.length === 0 ? (
        <p className="m-0 text-text-2">เร็วๆ นี้</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4 md:gap-4">
          {shown.map((d) => (
            <li key={d.id} className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
              <div className="relative aspect-square bg-placeholder">
                {d.coverPhoto && (
                  <Image
                    src={d.coverPhoto}
                    alt={d.name ? `${d.name} ${d.nameTh ?? ""}`.trim() : "น้องบอร์เดอร์คอลลี่จาก Halfmoon"}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-3">
                <div className="font-heading text-[17px] font-bold leading-tight text-ink">
                  {d.slug ? (
                    // The whole card opens the dog's page; the Instagram button sits above this link.
                    <Link href={dogPath(d.slug)} className="text-ink no-underline after:absolute after:inset-0 after:content-['']">
                      {d.name}
                    </Link>
                  ) : (
                    d.name || "น้องจาก Halfmoon"
                  )}
                </div>
                {d.province && (
                  <div className="flex items-center gap-1 text-[14px] text-text-3">
                    <MapPinIcon size={14} className="shrink-0" />
                    {d.province}
                  </div>
                )}
                {d.ownerMessage && <p className="m-0 line-clamp-3 text-[14px] leading-snug text-text-2">{d.ownerMessage}</p>}
                {d.instagram && (
                  <a
                    href={instagramUrl(d.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-1 text-[14px] font-semibold text-black underline underline-offset-4"
                  >
                    <InstagramIcon size={18} className="shrink-0" />
                    <span className="break-all">@{d.instagram}</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!all && dogs.length > FIRST && (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="inline-flex min-h-12 cursor-pointer items-center self-center rounded-full bg-black px-6 font-semibold text-white hover:bg-ink"
        >
          ดูทั้งหมด ({dogs.length})
        </button>
      )}
    </div>
  );
}
