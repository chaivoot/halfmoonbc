"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { inputClass, keepFieldsOnSubmit, labelClass, Notice, primaryButton } from "@/components/admin/ui-client";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form onSubmit={keepFieldsOnSubmit(action)} className="flex flex-col gap-4">
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      <label className={labelClass}>
        ชื่อผู้ใช้
        <input name="username" autoComplete="username" autoCapitalize="none" required className={inputClass} />
      </label>
      <label className={labelClass}>
        รหัสผ่าน
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
