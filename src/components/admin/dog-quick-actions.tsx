"use client";

import { useOptimistic, useTransition } from "react";
import { setPublishedAction, setStatusAction } from "@/app/admin/actions";
import { type DogStatus, statusLabel } from "@/lib/dogs";

const options: { value: DogStatus; label: string }[] = [
  { value: "available", label: statusLabel.available },
  { value: "reserved", label: statusLabel.reserved },
  { value: "homed", label: statusLabel.homed },
  { value: null, label: "ไม่ระบุ" },
];

export function DogQuickActions({
  id,
  status,
  isPublished,
  canHaveStatus,
}: {
  id: string;
  status: DogStatus;
  isPublished: boolean;
  canHaveStatus: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [state, setOptimistic] = useOptimistic({ status, isPublished });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canHaveStatus && (
        <div role="group" aria-label="สถานะ" className="flex flex-wrap gap-1 rounded-full bg-bg p-1">
          {options.map((o) => {
            const active = state.status === o.value;
            return (
              <button
                key={o.label}
                type="button"
                aria-pressed={active}
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    setOptimistic({ ...state, status: o.value });
                    await setStatusAction(id, o.value);
                  })
                }
                className={`min-h-10 cursor-pointer rounded-full px-3 text-sm font-semibold ${
                  active ? "bg-black text-white" : "text-black hover:bg-border/60"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setOptimistic({ ...state, isPublished: !state.isPublished });
            await setPublishedAction(id, !state.isPublished);
          })
        }
        className="ml-auto min-h-10 cursor-pointer rounded-full px-3 text-sm font-semibold text-black ring-1 ring-border hover:bg-bg"
      >
        {state.isPublished ? "ซ่อนจากหน้าเว็บ" : "แสดงบนหน้าเว็บ"}
      </button>
    </div>
  );
}
