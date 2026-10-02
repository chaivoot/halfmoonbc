"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { addPhotosAction, deletePhotoAction, reorderPhotosAction, setCoverAction } from "@/app/admin/actions";
import { Notice, primaryButton } from "@/components/admin/ui-client";
import type { AdminPhoto } from "@/lib/admin-dogs";

const MAX_EDGE = 1600;

// Shrink phone photos before upload: faster on mobile data and well within page needs.
async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82));
  // Older Safari can't encode WebP and silently returns PNG instead.
  const webp = await toBlob("image/webp");
  if (webp?.type === "image/webp") return webp;
  const jpeg = await toBlob("image/jpeg");
  if (!jpeg) throw new Error("resize failed");
  return jpeg;
}

export function PhotoManager({ dogId, initialPhotos }: { dogId: string; initialPhotos: AdminPhoto[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // Long-press to drag on phones so normal scrolling still works.
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const list = Array.from(files).filter((f) => f.type.startsWith("image/") || f.name.match(/\.(heic|heif)$/i));
    setProgress({ done: 0, total: list.length });
    const urls: string[] = [];
    let failed = 0;
    for (const file of list) {
      try {
        const blob = await resizeImage(file);
        const ext = blob.type === "image/webp" ? "webp" : "jpg";
        const result = await upload(`dogs/${dogId}/photo.${ext}`, blob, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          clientPayload: dogId,
          contentType: blob.type,
        });
        urls.push(result.url);
      } catch (e) {
        console.error(e);
        failed++;
      }
      setProgress((p) => p && { ...p, done: p.done + 1 });
    }
    if (urls.length) {
      try {
        setPhotos(await addPhotosAction(dogId, urls));
      } catch {
        failed += urls.length;
      }
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    if (failed) setError(`อัปโหลดไม่สำเร็จ ${failed} รูป ลองใหม่อีกครั้ง`);
  }

  function run(task: () => Promise<AdminPhoto[]>) {
    startTransition(async () => {
      try {
        setPhotos(await task());
      } catch {
        setError("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
      }
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = photos.findIndex((p) => p.id === active.id);
    const to = photos.findIndex((p) => p.id === over.id);
    const next = arrayMove(photos, from, to);
    setPhotos(next);
    run(() => reorderPhotosAction(dogId, next.map((p) => p.id)));
  }

  const busy = progress !== null || pending;

  return (
    <div className="flex flex-col gap-4">
      {error && <Notice tone="error">{error}</Notice>}

      <label className={`${primaryButton} cursor-pointer self-start ${busy ? "pointer-events-none opacity-50" : ""}`}>
        {progress ? `กำลังอัปโหลด ${progress.done}/${progress.total}...` : "+ เพิ่มรูป (ถ่ายหรือเลือกจากคลัง)"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />
      </label>

      {photos.length === 0 ? (
        <p className="m-0 text-text-2">ยังไม่มีรูป</p>
      ) : (
        <>
          <p className="m-0 text-sm text-text-3">กดค้างที่รูปแล้วลากเพื่อเรียงลำดับ รูปปกคือรูปที่แสดงบนหน้าเว็บ</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
              <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
                {photos.map((p, i) => (
                  <SortablePhoto
                    key={p.id}
                    photo={p}
                    index={i}
                    disabled={busy}
                    onCover={() => run(() => setCoverAction(dogId, p.id))}
                    onDelete={() => {
                      if (confirm("ลบรูปนี้?")) run(() => deletePhotoAction(dogId, p.id));
                    }}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}

function SortablePhoto({
  photo,
  index,
  disabled,
  onCover,
  onDelete,
}: {
  photo: AdminPhoto;
  index: number;
  disabled: boolean;
  onCover: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex flex-col overflow-hidden rounded-xl border bg-white ${
        photo.isCover ? "border-black ring-2 ring-yellow" : "border-border"
      } ${isDragging ? "z-10 shadow-lg" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        aria-label={`รูปที่ ${index + 1} ลากเพื่อย้ายตำแหน่ง`}
        className="relative aspect-square cursor-grab touch-manipulation bg-placeholder active:cursor-grabbing"
      >
        <Image src={photo.url} alt="" fill sizes="(max-width: 640px) 50vw, 240px" className="pointer-events-none object-cover" />
        {photo.isCover && (
          <span className="absolute top-2 left-2 rounded-full bg-yellow px-2.5 py-0.5 text-xs font-semibold text-ink">
            รูปปก
          </span>
        )}
      </div>
      <div className="flex">
        {!photo.isCover && (
          <button
            type="button"
            disabled={disabled}
            onClick={onCover}
            className="min-h-11 flex-1 cursor-pointer text-sm font-semibold text-black hover:bg-bg disabled:opacity-50"
          >
            ตั้งเป็นรูปปก
          </button>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={onDelete}
          className="min-h-11 flex-1 cursor-pointer text-sm font-semibold text-[#B42318] hover:bg-[#FDE2E1] disabled:opacity-50"
        >
          ลบ
        </button>
      </div>
    </li>
  );
}
