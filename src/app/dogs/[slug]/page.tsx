import type { Metadata } from "next";
import Link from "next/link";
import { DogPhotos } from "@/components/dog-photos";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { ChatIcon, PhoneIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { categoryLabel, dogPath, sexLabel, statusLabel } from "@/lib/dogs";
import { type DogPage, getDogPage, getDogSlugs } from "@/lib/queries";
import { farm, siteUrl } from "@/lib/site";

// Fallback refresh; admin saves revalidate dog pages immediately.
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getDogSlugs()).map(({ slug }) => ({ slug }));
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const statusStyle = {
  available: "bg-yellow text-ink",
  reserved: "bg-black text-white",
  homed: "bg-white text-black ring-1 ring-border",
} as const;

function fullName(dog: DogPage) {
  return dog.nameTh ? `${dog.name} (${dog.nameTh})` : dog.name;
}

// Thai long date with the Buddhist year, e.g. 5 มีนาคม 2569.
function thaiDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("th-TH", { dateStyle: "long", timeZone: "UTC" });
}

export async function generateMetadata({ params }: PageProps<"/dogs/[slug]">): Promise<Metadata> {
  const dog = await getDogPage((await params).slug);
  if (!dog) return {};
  const title = `${fullName(dog)} บอร์เดอร์คอลลี่${dog.color ? ` ${dog.color}` : ""} - ${farm.name}`;
  const description =
    dog.description ??
    `${fullName(dog)} บอร์เดอร์คอลลี่จากฟาร์ม Halfmoon จ.ระนอง ${categoryLabel[dog.category]}`;
  const path = dogPath(dog.slug!);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "th_TH",
      url: path,
      siteName: farm.name,
      title,
      description,
      ...(dog.coverPhoto ? { images: [{ url: dog.coverPhoto, alt: fullName(dog) }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function DogPageRoute({ params }: PageProps<"/dogs/[slug]">) {
  const dog = await getDogPage((await params).slug);
  if (!dog) notFound();

  const isParent = dog.category === "parent";
  const section = isParent ? { href: "/#parents", label: "พ่อแม่พันธุ์" } : { href: "/#family", label: "Halfmoon Family" };

  const facts = [
    { label: "หมวด", value: categoryLabel[dog.category] },
    dog.sex && { label: "เพศ", value: sexLabel[dog.sex] },
    dog.color && { label: "สี", value: dog.color },
    dog.birthDate && { label: "วันเกิด", value: thaiDate(dog.birthDate) },
    dog.litter && { label: "ครอก", value: dog.litter },
  ].filter(Boolean) as { label: string; value: string }[];

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      // Section anchors such as /#parents are the home page to Google, so list two levels.
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: siteUrl },
      { "@type": "ListItem", position: 2, name: fullName(dog), item: `${siteUrl}${dogPath(dog.slug!)}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so a value can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main className="px-4 py-8 md:px-12 md:py-12">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
          <nav aria-label="breadcrumb" className="text-[15px] text-text-3">
            <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
              <li>
                <Link href="/" className="text-black underline-offset-4 hover:underline">
                  หน้าแรก
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={section.href} className="text-black underline-offset-4 hover:underline">
                  {section.label}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{dog.name}</li>
            </ol>
          </nav>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-12">
            <DogPhotos photos={dog.photos} name={fullName(dog)} />

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="font-heading text-sm font-semibold text-yellow-text">
                  {isParent ? "พ่อแม่พันธุ์" : `Halfmoon Family · ${categoryLabel[dog.category]}`}
                </span>
                <h1 className="font-heading m-0 text-[36px] font-bold leading-[1.15] md:text-5xl">
                  {dog.name}{" "}
                  {dog.nameTh && <span className="text-[24px] font-medium text-text-3 md:text-3xl">{dog.nameTh}</span>}
                </h1>
                {dog.status && (
                  <span
                    className={`self-start rounded-full px-4 py-1.5 text-[15px] font-semibold ${statusStyle[dog.status]}`}
                  >
                    {statusLabel[dog.status]}
                  </span>
                )}
              </div>

              <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 rounded-2xl border border-border bg-surface p-5">
                {facts.map((f) => (
                  <div key={f.label} className="contents">
                    <dt className="text-[15px] text-text-3">{f.label}</dt>
                    <dd className="m-0 font-semibold text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>

              {dog.description && <p className="m-0 text-[17px] text-text-2">{dog.description}</p>}

              {dog.tags.length > 0 && (
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {dog.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-yellow-soft px-3 py-1 text-[14px] text-black">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col gap-3 rounded-2xl bg-ink p-5 text-bg">
                <p className="m-0 text-[#D9D9D9]">
                  {isParent
                    ? `สนใจลูกของ ${dog.name} ทักมาเช็คคิวครอกถัดไปได้เลย`
                    : dog.status === "available"
                      ? `${dog.name} ยังว่างอยู่ ทักมาสอบถามหรือนัดวิดีโอคอลดูน้องได้เลย`
                      : "สนใจน้องแบบนี้ ทักมาเช็คคิวครอกถัดไปได้เลย"}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={farm.lineUrl}
                    {...external}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-yellow px-6 font-semibold text-ink hover:brightness-95"
                  >
                    <ChatIcon size={20} />
                    สอบถามทาง LINE
                  </a>
                  <a
                    href={farm.phoneHref}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border-[1.5px] border-bg/60 px-6 font-semibold text-bg hover:bg-white/10"
                  >
                    <PhoneIcon size={20} />
                    {farm.phoneDisplay}
                  </a>
                </div>
              </div>

              <Link href={section.href} className="self-start text-[15px] font-semibold text-black underline underline-offset-4">
                ดู{isParent ? "พ่อแม่พันธุ์" : "น้อง"}ตัวอื่น
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
