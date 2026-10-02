"use client";

import { useTransition } from "react";
import { deleteDogAction } from "@/app/admin/actions";

export function DeleteDogButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("ลบสุนัขตัวนี้และรูปทั้งหมด? กู้คืนไม่ได้")) return;
        startTransition(() => deleteDogAction(id));
      }}
      className="inline-flex min-h-12 cursor-pointer items-center justify-center self-start rounded-full border-[1.5px] border-[#B42318] px-6 font-semibold text-[#B42318] hover:bg-[#FDE2E1] disabled:opacity-50"
    >
      {pending ? "กำลังลบ..." : "ลบสุนัขตัวนี้"}
    </button>
  );
}
