"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const iconButton =
  "inline-flex size-12 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25";

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

// Dog page photos: a cover and thumbnails that open a full-screen viewer.
// Swipe (scroll-snap) or use the arrows to move between photos.
export function DogPhotos({ photos, name }: { photos: string[]; name: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [cover, ...rest] = photos;
  if (!cover) return <div className="aspect-[4/3] rounded-3xl bg-placeholder" />;

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
    const track = trackRef.current;
    if (track) track.scrollTo({ left: i * track.clientWidth, behavior: "instant" });
  };
  const go = (step: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.min(photos.length - 1, Math.max(0, index + step));
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => open(0)}
        aria-label={`ดูรูป ${name} แบบเต็มจอ`}
        className="relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-3xl bg-placeholder p-0"
      >
        <Image
          src={cover}
          alt={`${name} บอร์เดอร์คอลลี่`}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-[13px] font-semibold text-white">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          {photos.length > 1 ? `ดูรูปทั้งหมด ${photos.length} รูป` : "แตะเพื่อดูรูปใหญ่"}
        </span>
      </button>
      {rest.length > 0 && (
        <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0">
          {rest.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => open(i + 1)}
                aria-label={`ดูรูปที่ ${i + 2} แบบเต็มจอ`}
                className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-placeholder p-0"
              >
                <Image
                  src={src}
                  alt={`${name} รูปที่ ${i + 2}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 210px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`รูปของ ${name}`}
        onClick={(e) => {
          // A tap on the dark background (not on a photo or button) closes the viewer.
          if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop) dialogRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-white backdrop:bg-ink"
      >
        <div
          ref={trackRef}
          onScroll={(e) => {
            const t = e.currentTarget;
            setIndex(Math.round(t.scrollLeft / t.clientWidth));
          }}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none]"
        >
          {photos.map((src, i) => (
            <div key={src} data-backdrop="1" className="relative h-full w-full shrink-0 snap-center">
              <Image src={src} alt={`${name} รูปที่ ${i + 1}`} fill sizes="100vw" className="object-contain" />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span className="rounded-full bg-black/60 px-3 py-1 text-[15px] font-semibold">
            {index + 1} / {photos.length}
          </span>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="ปิด"
            className={`${iconButton} pointer-events-auto`}
          >
            <Icon d="M6 6l12 12M18 6L6 18" />
          </button>
        </div>
        {photos.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-4">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label="รูปก่อนหน้า"
              className={`${iconButton} pointer-events-auto disabled:opacity-30`}
            >
              <Icon d="M15 6l-6 6 6 6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === photos.length - 1}
              aria-label="รูปถัดไป"
              className={`${iconButton} pointer-events-auto disabled:opacity-30`}
            >
              <Icon d="M9 6l6 6-6 6" />
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
