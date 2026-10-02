"use client";

import { useState } from "react";
import { farm, navLinks } from "@/lib/site";
import { CloseIcon, MenuIcon } from "@/components/icons";

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="font-heading flex flex-col leading-[1.1]">
      <span className="text-[19px] font-bold">Halfmoon</span>
      <span
        className={`text-[12px] font-medium tracking-[0.08em] ${dark ? "text-[#BDBDBD]" : "text-text-3"}`}
      >
        BORDER COLLIE THAILAND
      </span>
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/95 px-4 backdrop-blur-sm md:px-12">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 py-3">
        <a href="#top" className="text-ink no-underline" onClick={() => setOpen(false)}>
          <Wordmark />
        </a>

        <nav aria-label="เมนูหลัก" className="hidden gap-7 text-base lg:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-black hover:underline underline-offset-4">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={farm.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-black px-5 text-[15px] font-semibold text-white hover:bg-ink"
          >
            ทัก LINE
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-black hover:bg-border/60 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="เมนูหลัก"
          className="mx-auto max-w-[1200px] border-t border-border pb-4 lg:hidden"
        >
          <ul className="flex flex-col">
            {[...navLinks, { href: "#contact", label: "ติดต่อ" }].map((l) => (
              <li key={l.href} className="border-b border-border last:border-b-0">
                <a
                  href={l.href}
                  className="flex min-h-12 items-center text-[17px] font-medium text-black"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
