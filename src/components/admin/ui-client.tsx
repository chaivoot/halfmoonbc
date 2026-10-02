// Shared admin styles and small components, safe for server and client components.
import { startTransition } from "react";

export const inputClass =
  "w-full min-h-12 rounded-xl border border-border bg-white px-4 text-[17px] text-ink outline-none focus:border-black focus:ring-2 focus:ring-yellow";
export const labelClass = "flex flex-col gap-1.5 text-[15px] font-semibold text-ink";
export const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-6 font-semibold text-white hover:bg-ink disabled:opacity-50";
export const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-black px-6 font-semibold text-black hover:bg-black/5 disabled:opacity-50";

export function Notice({ tone = "ok", children }: { tone?: "ok" | "error"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`m-0 rounded-xl px-4 py-3 text-[15px] font-medium ${
        tone === "error" ? "bg-[#FDE2E1] text-[#8A1C14]" : "bg-yellow-soft text-ink"
      }`}
    >
      {children}
    </p>
  );
}

/**
 * onSubmit handler for useActionState forms. A plain `action={...}` form makes React
 * reset every field after submit, wiping the user's input even when the server
 * returned a validation error.
 */
export function keepFieldsOnSubmit(dispatch: (fd: FormData) => void) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
}
