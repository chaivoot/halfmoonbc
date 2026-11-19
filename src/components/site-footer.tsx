import { Wordmark } from "@/components/header";
import { ChatIcon } from "@/components/icons";
import { farm } from "@/lib/site";

const pad = "px-4 md:px-12";
const container = "mx-auto max-w-[1200px]";
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// Footer plus the floating mobile LINE button, shared by every public page.
export function SiteFooter() {
  return (
    <>
      <footer className={`bg-ink pt-7 pb-24 text-sm text-[#A3A3A3] md:pb-7 ${pad}`}>
        <div className={`${container} flex flex-wrap items-center justify-between gap-4`}>
          <div className="text-bg">
            <Wordmark dark />
          </div>
          <div className="flex flex-col gap-1 md:items-end">
            <span>© 2026 Halfmoon Border Collie Thailand · โปรเจคของ Hero Pet Farm · ระนอง ประเทศไทย</span>
            <span>
              Website by{" "}
              {/* Followed backlink; keep the referrer so dogsanook.com sees the traffic source. */}
              <a href="https://dogsanook.com" target="_blank" rel="noopener" className="text-inherit no-underline">
                หมาสนุก
              </a>
            </span>
          </div>
        </div>
      </footer>

      {/* Floating LINE button for mobile */}
      <a
        href={farm.lineUrl}
        {...external}
        className="fixed right-4 bottom-4 z-20 inline-flex min-h-13 items-center gap-2 rounded-full bg-black px-5 font-semibold text-white ring-2 ring-yellow shadow-[0_8px_24px_rgba(20,20,20,0.25)] md:hidden"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <ChatIcon size={22} />
        ทัก LINE
      </a>
    </>
  );
}
