"use client";

import { useTransition } from "react";
import { moveDogAction } from "@/app/admin/actions";

const button =
  "inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-black ring-1 ring-border hover:bg-bg disabled:cursor-default disabled:opacity-30";

function Arrow({ up }: { up?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={up ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
    </svg>
  );
}

// Move a dog one place up or down within its category and status group.
export function DogMoveButtons({ id, name, canUp, canDown }: { id: string; name: string; canUp: boolean; canDown: boolean }) {
  const [pending, startTransition] = useTransition();
  const move = (direction: "up" | "down") => startTransition(() => moveDogAction(id, direction));
  return (
    <div className="flex shrink-0 flex-col gap-1.5">
      <button type="button" className={button} disabled={!canUp || pending} onClick={() => move("up")} aria-label={`เลื่อน ${name} ขึ้น`}>
        <Arrow up />
      </button>
      <button type="button" className={button} disabled={!canDown || pending} onClick={() => move("down")} aria-label={`เลื่อน ${name} ลง`}>
        <Arrow />
      </button>
    </div>
  );
}
