"use client";

import { useActionState, useState } from "react";
import { saveDogAction } from "@/app/admin/actions";
import { inputClass, keepFieldsOnSubmit, labelClass, Notice, primaryButton } from "@/components/admin/ui-client";
import type { AdminDog } from "@/lib/admin-dogs";
import { categoryLabel, type DogCategory, statusLabel } from "@/lib/dogs";

const categories: DogCategory[] = ["parent", "newborn", "young", "adult"];

export function DogForm({ dog, defaultCategory }: { dog?: AdminDog; defaultCategory?: DogCategory }) {
  const [state, action, pending] = useActionState(saveDogAction, undefined);
  const [category, setCategory] = useState<DogCategory>(dog?.category ?? defaultCategory ?? "newborn");

  return (
    <form
      onSubmit={keepFieldsOnSubmit(action)}
      className="flex flex-col gap-4"
    >
      {dog && <input type="hidden" name="id" value={dog.id} />}
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      {state?.saved && <Notice>บันทึกแล้ว หน้าเว็บอัปเดตเรียบร้อย</Notice>}

      <label className={labelClass}>
        หมวด
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as DogCategory)}
          className={inputClass}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel[c]}
            </option>
          ))}
        </select>
      </label>

      {category !== "parent" && (
        <label className={labelClass}>
          สถานะ
          <select name="status" defaultValue={dog?.status ?? ""} className={inputClass}>
            <option value="">ไม่ระบุ</option>
            <option value="available">{statusLabel.available}</option>
            <option value="reserved">{statusLabel.reserved}</option>
            <option value="homed">{statusLabel.homed}</option>
          </select>
        </label>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          ชื่อ (อังกฤษ)
          <input name="name" defaultValue={dog?.name} className={inputClass} />
        </label>
        <label className={labelClass}>
          ชื่อไทย
          <input name="name_th" defaultValue={dog?.nameTh ?? ""} className={inputClass} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          เพศ
          <select name="sex" defaultValue={dog?.sex ?? ""} className={inputClass}>
            <option value="">ไม่ระบุ</option>
            <option value="male">เพศผู้</option>
            <option value="female">เพศเมีย</option>
          </select>
        </label>
        <label className={labelClass}>
          สี
          <input name="color" defaultValue={dog?.color ?? ""} placeholder="เช่น Blue Merle (บลูเมิร์ล)" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          วันเกิด
          <input name="birth_date" type="date" defaultValue={dog?.birthDate ?? ""} className={inputClass} />
        </label>
        <label className={labelClass}>
          ครอก
          <input name="litter" defaultValue={dog?.litter ?? ""} placeholder="เช่น Mona x Dakota 2569" className={inputClass} />
        </label>
      </div>

      <label className={labelClass}>
        คำอธิบาย
        <textarea
          name="description"
          defaultValue={dog?.description ?? ""}
          rows={4}
          className={`${inputClass} py-3 leading-relaxed`}
        />
      </label>

      <label className={labelClass}>
        แท็ก (คั่นด้วยจุลภาค ,)
        <input name="tags" defaultValue={dog?.tags.join(", ")} placeholder="เช่น Agility, รักเด็ก" className={inputClass} />
      </label>

      <label className="flex min-h-12 items-center gap-3 text-[17px] font-semibold">
        <input name="is_published" type="checkbox" defaultChecked={dog?.isPublished ?? true} className="size-6 accent-black" />
        แสดงบนหน้าเว็บ
      </label>

      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "กำลังบันทึก..." : dog ? "บันทึก" : "บันทึกแล้วไปเพิ่มรูป"}
      </button>
    </form>
  );
}
