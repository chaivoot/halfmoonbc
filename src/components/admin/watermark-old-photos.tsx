"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  finishWatermarkingAction,
  photosWithoutWatermarkAction,
  replaceWithWatermarkedAction,
} from "@/app/admin/actions";
import { Notice, primaryButton } from "@/components/admin/ui-client";
import { photoExt, preparePhoto } from "@/lib/prepare-photo";

// One-off tool: burn the watermark into photos uploaded before watermarks existed.
export function WatermarkOldPhotos({ count }: { count: number }) {
  const router = useRouter();
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [failed, setFailed] = useState(0);

  async function run() {
    setFailed(0);
    const photos = await photosWithoutWatermarkAction();
    setProgress({ done: 0, total: photos.length });
    let errors = 0;
    for (const p of photos) {
      try {
        const res = await fetch(`/api/admin/photo-source/${p.id}`);
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const blob = await preparePhoto(await res.blob());
        const result = await upload(`dogs/${p.dogId}/photo.${photoExt(blob)}`, blob, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          clientPayload: p.dogId,
          contentType: blob.type,
        });
        await replaceWithWatermarkedAction(p.id, result.url);
      } catch (e) {
        console.error(e);
        errors++;
      }
      setProgress((s) => s && { ...s, done: s.done + 1 });
    }
    await finishWatermarkingAction();
    setProgress(null);
    setFailed(errors);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4">
      <p className="m-0 text-[15px] text-text-2">
        มีรูปเก่า <b className="text-ink">{count} รูป</b> ที่ยังไม่มีลายน้ำ Halfmoon กดปุ่มด้านล่างครั้งเดียว
        ระบบจะใส่ลายน้ำให้ทุกรูป ระหว่างทำอย่าปิดหน้านี้
      </p>
      {failed > 0 && <Notice tone="error">ใส่ลายน้ำไม่สำเร็จ {failed} รูป กดปุ่มอีกครั้งเพื่อลองใหม่</Notice>}
      <button
        type="button"
        onClick={run}
        disabled={progress !== null}
        className={`${primaryButton} cursor-pointer self-start disabled:opacity-60`}
      >
        {progress ? `กำลังใส่ลายน้ำ ${progress.done}/${progress.total}...` : "ใส่ลายน้ำรูปเก่าทั้งหมด"}
      </button>
    </div>
  );
}
