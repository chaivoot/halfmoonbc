"use client";

import Image from "next/image";
import { useState } from "react";
import { type Dog, galleryTabs, statusLabel } from "@/lib/dogs";

type TabId = (typeof galleryTabs)[number]["id"];

const statusStyle = {
  available: "bg-yellow text-ink",
  reserved: "bg-black text-white",
  homed: "bg-white text-black",
} as const;

export function FamilyGallery({ dogs }: { dogs: Dog[] }) {
  const [tab, setTab] = useState<TabId>("newborn");
  const shown = dogs.filter((d) => d.category === tab);

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

      <div
        id="family-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-3.5"
      >
        {shown.map((d) => (
          <figure
            key={d.id}
            className="relative m-0 aspect-square overflow-hidden rounded-2xl bg-placeholder"
          >
            <Image
              src={d.coverPhoto}
              alt={d.name ? `${d.name} ${d.nameTh ?? ""}`.trim() : "น้องบอร์เดอร์คอลลี่จาก Halfmoon"}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
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
