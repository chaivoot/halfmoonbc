"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/admin/actions";
import { inputClass, keepFieldsOnSubmit, labelClass, Notice, primaryButton } from "@/components/admin/ui-client";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);
  return (
    <form onSubmit={keepFieldsOnSubmit(action)} className="flex flex-col gap-4">
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      <label className={labelClass}>
        รหัสผ่านปัจจุบัน
        <input name="current" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      <label className={labelClass}>
        รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)
        <input name="next" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
      </label>
      <label className={labelClass}>
        พิมพ์รหัสผ่านใหม่อีกครั้ง
        <input name="confirm" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
      </label>
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
      </button>
    </form>
  );
}
