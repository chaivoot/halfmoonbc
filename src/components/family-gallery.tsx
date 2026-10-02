"use client";

import Image from "next/image";
import { useState } from "react";
import { type Dog, galleryTabs, statusLabel } from "@/lib/dogs";
import { farm } from "@/lib/site";

type TabId = (typeof galleryTabs)[number]["id"];

const statusStyle = {
  available: "bg-yellow text-ink",
  reserved: "bg-black text-white",
  homed: "bg-white text-black",
} as const;

export function FamilyGallery({ dogs }: { dogs: Dog[] }) {
  const [tab, setTab] = useState<TabId>("newborn");
  const [availableOnly, setAvailableOnly] = useState(false);
  const inTab = dogs.filter((d) => d.category === tab);
  const availableCount = inTab.filter((d) => d.status === "available").length;
  const shown = availableOnly ? inTab.filter((d) => d.status === "available") : inTab;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <span className="font-heading text-sm font-semibold tracking-[0.12em] text-yellow-text">
            HALFMOON FAMILY
          </span>
          <h2 className="font-heading m-0 text-[30px] font-bold leading-[1.2] md:text-[40px]">
            น้องๆ จากฟาร์มของเรา
          </h2>
        </div>
        <div role="tablist" aria-label="ช่วงวัย" className="flex gap-2 rounded-full bg-bg p-1.5">
          {galleryTabs.map((t) => {
            const selected = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls="family-panel"
                onClick={() => setTab(t.id)}
                className={`min-h-11 cursor-pointer rounded-full px-5 text-[15px] font-semibold ${
                  selected ? "bg-black text-white" : "bg-transparent text-black hover:bg-border/60"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        aria-pressed={availableOnly}
        aria-controls="family-panel"
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

      <div
        id="family-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-3.5"
      >
        {shown.length === 0 &&
          (availableOnly ? (
            <div className="col-span-full flex flex-col items-start gap-3 rounded-2xl bg-bg p-6">
              <p className="m-0 text-text-2">ตอนนี้ยังไม่มีน้องที่ว่างในหมวดนี้ ทักมาเช็คคิวครอกถัดไปได้เลย</p>
              <a
                href={farm.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-full bg-black px-6 font-semibold text-white hover:bg-ink"
              >
                เช็คคิวทาง LINE
              </a>
            </div>
          ) : (
            <p className="col-span-full m-0 text-text-2">ยังไม่มีรูปในหมวดนี้</p>
          ))}
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
          </figure>
        ))}
      </div>
    </div>
  );
}
