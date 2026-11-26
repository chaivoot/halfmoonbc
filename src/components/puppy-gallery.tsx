"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type Dog, dogPath, statusLabel } from "@/lib/dogs";
import { farm } from "@/lib/site";

const statusStyle = {
  available: "bg-yellow text-ink",
  reserved: "bg-black text-white",
  homed: "bg-white text-black",
} as const;

// Puppies still at the farm (available or reserved). Homed puppies are listed
// under ครอบครัว Halfmoon instead.
export function PuppyGallery({ dogs }: { dogs: Dog[] }) {
  const [availableOnly, setAvailableOnly] = useState(false);
  const availableCount = dogs.filter((d) => d.status === "available").length;
  const shown = availableOnly ? dogs.filter((d) => d.status === "available") : dogs;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="font-heading text-sm font-semibold text-yellow-text">ลูกสุนัข</span>
        <h2 className="font-heading m-0 text-[30px] font-bold leading-[1.2] md:text-[40px]">น้องๆ ที่กำลังหาบ้าน</h2>
      </div>

      {dogs.length > 0 && (
        <button
          type="button"
          aria-pressed={availableOnly}
          aria-controls="puppy-panel"
          onClick={() => setAvailableOnly((v) => !v)}
          className="-mt-3 inline-flex min-h-11 cursor-pointer items-center gap-3 self-start rounded-full bg-bg py-1.5 pr-4 pl-1.5 text-[15px] font-semibold text-ink"
        >
          <span
            aria-hidden="true"
            className={`relative h-7 w-12 rounded-full transition-colors ${availableOnly ? "bg-black" : "bg-border"}`}
          >
            <span
              className={`absolute top-1 left-1 size-5 rounded-full bg-white transition-transform ${
                availableOnly ? "translate-x-5 bg-yellow" : ""
              }`}
            />
          </span>
          ดูเฉพาะน้องที่ว่าง ({availableCount})
        </button>
      )}

      <div
        id="puppy-panel"
        className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-3.5"
      >
        {shown.length === 0 &&
          (availableOnly || dogs.length === 0 ? (
            <div className="col-span-full flex flex-col items-start gap-3 rounded-2xl bg-bg p-6">
              <p className="m-0 text-text-2">
                {dogs.length === 0 ? "ตอนนี้ยังไม่มีลูกสุนัข" : "ตอนนี้ยังไม่มีน้องที่ว่าง"} ทักมาเช็คคิวครอกถัดไปได้เลย
              </p>
              <a
                href={farm.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-full bg-black px-6 font-semibold text-white hover:bg-ink"
              >
                เช็คคิวทาง LINE
              </a>
            </div>
          ) : null)}
        {shown.map((d) => (
          <figure
            key={d.id}
            className="relative m-0 aspect-square overflow-hidden rounded-2xl bg-placeholder"
          >
            {d.coverPhoto && (
              <Image
                src={d.coverPhoto}
                alt={d.name ? `${d.name} ${d.nameTh ?? ""}`.trim() : "น้องบอร์เดอร์คอลลี่จาก Halfmoon"}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            )}
            {d.slug && (
              <span
                aria-hidden="true"
                className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-[13px] font-semibold text-white"
              >
                ดูรายละเอียด
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            )}
            {(d.status || d.name) && (
              <figcaption className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2">
                {d.name ? (
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[13px] font-semibold text-ink">
                    {d.name}
                  </span>
                ) : (
                  <span />
                )}
                {d.status && (
                  <span
                    className={`rounded-full px-3 py-1 text-[13px] font-semibold ${statusStyle[d.status]}`}
                  >
                    {statusLabel[d.status]}
                  </span>
                )}
              </figcaption>
            )}
            {d.slug && (
              <Link
                href={dogPath(d.slug)}
                aria-label={`ดูรายละเอียด ${d.name}`}
                className="absolute inset-0 rounded-2xl ring-black ring-offset-2 focus-visible:ring-2"
              />
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
