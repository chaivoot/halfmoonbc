import Image from "next/image";
import { Header, Wordmark } from "@/components/header";
import { FamilyGallery } from "@/components/family-gallery";
import { JsonLd } from "@/components/json-ld";
import {
  ChatIcon,
  CheckIcon,
  ExternalIcon,
  FacebookIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import { sexLabel } from "@/lib/dogs";
import { getFamily, getParents } from "@/lib/queries";
import {
  faqs,
  farm,
  mapsEmbedUrl,
  mapsLinkUrl,
  pricing,
  puppyBenefits,
  steps,
  training,
  trust,
} from "@/lib/site";

const pad = "px-4 md:px-12";
const container = "mx-auto max-w-[1200px]";
const eyebrow = "font-heading text-sm font-semibold";
// Wide tracking suits Latin labels only; it breaks Thai vowel and tone marks
const latin = "tracking-[0.12em]";
const h2 = "font-heading m-0 text-[30px] font-bold leading-[1.2] md:text-[40px]";
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// Fallback refresh; admin saves revalidate the page immediately.
export const revalidate = 3600;

export default async function Home() {
  const [parents, family] = await Promise.all([getParents(), getFamily()]);

  return (
    <>
      <JsonLd />
      <Header />
      <main>
        {/* HERO */}
        <section id="top" className={`bg-yellow pt-12 pb-16 md:pt-18 md:pb-20 ${pad}`}>
          <div className={`${container} grid items-center gap-12 md:grid-cols-2 md:gap-14`}>
            <div className="flex flex-col gap-6">
              <span className={`${eyebrow} text-black`}>ฟาร์มบอร์เดอร์คอลลี่ จ.ระนอง</span>
              <h1 className="font-heading m-0 text-[36px] font-bold leading-[1.15] text-ink sm:text-[44px] lg:text-[56px]">
                บอร์เดอร์คอลลี่ที่โตมากับธรรมชาติ และการเลี้ยงดูอย่างใส่ใจ
              </h1>
              <p className="m-0 max-w-[520px] text-[18px] text-text-2 md:text-[19px]">
                ลูกสุนัขทุกตัวมีใบเพดดิกรีจากสมาคมพัฒนาพันธุ์สุนัขแห่งประเทศไทย (FCI)
                ได้รับวัคซีน 2 เข็ม และผ่านการฝึกพื้นฐานก่อนส่งมอบ
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={farm.lineUrl}
                  {...external}
                  className="inline-flex min-h-12 items-center rounded-full bg-black px-6 font-semibold text-white hover:bg-ink"
                >
                  สอบถามลูกสุนัขทาง LINE
                </a>
                <a
                  href="#parents"
                  className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-black px-6 font-semibold text-black hover:bg-black/5"
                >
                  ดูพ่อแม่พันธุ์
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3.4] overflow-hidden rounded-[28px] bg-placeholder">
                <Image
                  src="/images/site/hero.webp"
                  alt="บอร์เดอร์คอลลี่ขาวดำนอนเล่นในทุ่งหญ้า"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div className="absolute -bottom-5 left-3 flex items-center gap-3 rounded-[18px] bg-white px-5 py-4 shadow-[0_10px_30px_rgba(20,20,20,0.14)] md:-left-5">
                <ShieldCheckIcon size={28} className="shrink-0 text-black" />
                <div className="leading-[1.35]">
                  <div className="text-[15px] font-semibold">จดทะเบียนฟาร์มกับสมาคมฯ</div>
                  <div className="text-[13px] text-text-3">ขึ้นตรงกับ FCI ระดับสากล</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className={`pt-14 pb-16 md:pb-18 ${pad}`}>
          <ul className={`${container} m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4 md:gap-4`}>
            {trust.map((t) => (
              <li key={t.big} className="rounded-[18px] border border-border bg-surface p-5 md:p-[22px]">
                <div className="font-heading text-[22px] font-bold text-black">{t.big}</div>
                <div className="text-[15px] text-text-2">{t.small}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* ABOUT */}
        <section id="about" className={`bg-black py-16 text-bg md:py-22 ${pad}`}>
          <div className={`${container} grid items-center gap-12 md:grid-cols-2 md:gap-14`}>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-card-dark">
                <Image
                  src="/images/site/certificate.webp"
                  alt="ใบรับรองการจดทะเบียนฟาร์ม HERO PET FARM จากสมาคมพัฒนาพันธุ์สุนัข (ประเทศไทย)"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-3.5">
                <div className="relative grow overflow-hidden rounded-[20px] bg-card-dark">
                  <Image
                    src="/images/site/farm.webp"
                    alt="เจ้าของฟาร์มกับน้องบอร์เดอร์คอลลี่ที่รั้วไม้ วิวภูเขา"
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    className="object-cover"
                  />
                </div>
                <div className="relative grow overflow-hidden rounded-[20px] bg-card-dark">
                  <Image
                    src="/images/site/field-merle.webp"
                    alt="น้องบอร์เดอร์คอลลี่สีเมิร์ลวิ่งเล่นในทุ่งหญ้า"
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <span className={`${eyebrow} ${latin} text-yellow`}>HERO PET FARM</span>
              <h2 className={h2}>ฟาร์มในตัวเมืองระนอง อากาศเย็นสบาย ไม่มีฝุ่น PM 2.5</h2>
              <p className="m-0 text-[#D9D9D9]">
                ฟาร์มของเราก่อตั้งเมื่อปี พ.ศ. 2566 และจดทะเบียนภายใต้การดูแลของสมาคมพัฒนาพันธุ์สุนัขแห่งประเทศไทย
                ซึ่งขึ้นตรงกับ FCI สมาคมระดับสากล
              </p>
              <p className="m-0 text-[#D9D9D9]">
                น้องๆ เติบโตท่ามกลางธรรมชาติเขียวขจี มีพื้นที่วิ่งเล่น และได้อยู่ใกล้ชิดกับคนในบ้านทุกวัน
                Halfmoon Border Collie Thailand เป็นหนึ่งในโปรเจคของ Hero Pet Farm
              </p>
            </div>
          </div>
        </section>

        {/* PARENTS */}
        <section id="parents" className={`py-18 md:py-24 ${pad}`}>
          <div className={`${container} flex flex-col gap-10`}>
            <div className="flex max-w-[640px] flex-col gap-3">
              <span className={`${eyebrow} text-yellow-text`}>พ่อแม่พันธุ์</span>
              <h2 className={h2}>รู้จักครอบครัวของเรา</h2>
              <p className="m-0 text-text-2">
                พ่อแม่พันธุ์ทุกตัวตรวจ DNA ไม่มีโรคทางพันธุกรรม ได้รับวัคซีนสม่ำเสมอ
                และมีผลงานทั้งการประกวดความสวยงามและ Agility
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {parents.map((p) => (
                <article
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-[22px] border border-border bg-surface"
                >
                  <div className="relative aspect-[4/3] bg-placeholder">
                    {p.coverPhoto && (
                      <Image
                        src={p.coverPhoto}
                        alt={`${p.name}${p.nameTh ? ` (${p.nameTh})` : ""} บอร์เดอร์คอลลี่${p.color ? `สี ${p.color}` : ""}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2.5 p-[22px]">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-heading m-0 text-2xl font-bold">
                        {p.name}{" "}
                        <span className="text-[17px] font-medium text-text-3">{p.nameTh}</span>
                      </h3>
                      {p.sex && (
                        <span className="whitespace-nowrap text-sm text-text-3">{sexLabel[p.sex]}</span>
                      )}
                    </div>
                    <div className="text-[15px] font-semibold text-black">{p.color}</div>
                    <p className="m-0 text-[15px] text-text-2">{p.description}</p>
                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                      {p.tags.map((tag) => (
                        <li key={tag} className="rounded-full bg-yellow-soft px-3 py-1 text-[13px] text-black">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT PUPPIES GET */}
        <section id="puppies" className={`border-y border-border bg-surface py-18 md:py-24 ${pad}`}>
          <div className={`${container} grid gap-12 md:grid-cols-2 md:gap-14`}>
            <div className="flex flex-col gap-4">
              <span className={`${eyebrow} text-yellow-text`}>ลูกสุนัขจะได้รับ</span>
              <h2 className={h2}>พร้อมไปอยู่บ้านใหม่ ตั้งแต่วันแรก</h2>
              <ol className="mt-2 flex list-none flex-col gap-3.5 p-0">
                {puppyBenefits.map((b, i) => (
                  <li key={b.title} className="flex items-start gap-4">
                    <span className="font-heading w-10 shrink-0 text-[28px] font-bold text-black">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-semibold">{b.title}</div>
                      <div className="text-[15px] text-text-2">{b.desc}</div>
                      {b.link && (
                        <a
                          href={b.link.href}
                          {...external}
                          className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-black underline underline-offset-4 hover:text-ink"
                        >
                          {b.link.label}
                          <ExternalIcon size={16} />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl bg-bg p-6 md:p-8">
              <h3 className="font-heading mt-0 mb-[18px] text-xl font-semibold">สิ่งที่น้องได้ฝึกก่อนส่งมอบ</h3>
              <ul className="m-0 grid list-none gap-x-5 gap-y-3 p-0 sm:grid-cols-2">
                {training.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[15px]">
                    <CheckIcon size={20} className="mt-[3px] shrink-0 text-black" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PROCESS + PRICE */}
        <section className={`py-18 md:py-24 ${pad}`}>
          <div className={`${container} flex flex-col gap-10`}>
            <div className="flex max-w-[640px] flex-col gap-3">
              <span className={`${eyebrow} text-yellow-text`}>ขั้นตอนการรับน้อง</span>
              <h2 className={h2}>จากวันจอง ถึงวันพาน้องกลับบ้าน</h2>
            </div>
            <ol className="m-0 grid list-none grid-cols-2 gap-5 p-0 md:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex flex-col gap-2 border-t-[3px] border-black pt-[18px]">
                  <span className="font-heading text-sm font-semibold text-yellow-text">ขั้นที่ {i + 1}</span>
                  <div className="text-lg font-semibold leading-snug">{s.title}</div>
                  <div className="text-[15px] text-text-2">{s.desc}</div>
                </li>
              ))}
            </ol>
            <div className="grid overflow-hidden rounded-[26px] bg-ink text-bg md:grid-cols-2">
              <div className="flex flex-col gap-1.5 p-7 md:p-10">
                <span className="text-[15px] text-[#BDBDBD]">ราคาเริ่มต้น</span>
                <div className="font-heading text-[40px] font-bold leading-[1.1] text-yellow md:text-5xl">
                  {pricing.startingPrice}
                </div>
                <span className="text-[15px] text-[#BDBDBD]">มัดจำเริ่มต้น {pricing.deposit}</span>
              </div>
              <div className="flex flex-col justify-center gap-4 border-t border-[#333] p-7 md:border-t-0 md:border-l md:p-10">
                <p className="m-0 text-[#D9D9D9]">
                  ส่งฟรีในกรุงเทพฯ และปริมณฑล ต่างจังหวัดตามตกลง ทักมาเช็คคิวลูกสุนัขครอกถัดไปได้เลย
                </p>
                <a
                  href={farm.lineUrl}
                  {...external}
                  className="inline-flex min-h-12 items-center self-start rounded-full bg-yellow px-6 font-semibold text-ink hover:brightness-95"
                >
                  เช็คคิวลูกสุนัข
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAMILY GALLERY */}
        <section id="family" className={`border-t border-border bg-surface py-18 md:py-24 ${pad}`}>
          <div className={container}>
            <FamilyGallery dogs={family} />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className={`py-18 md:py-24 ${pad}`}>
          <div className={`${container} grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-14`}>
            <div className="flex flex-col gap-3">
              <span className={`${eyebrow} text-yellow-text`}>คำถามที่พบบ่อย</span>
              <h2 className={h2}>มีคำถาม? เราตอบไว้ให้แล้ว</h2>
              <p className="m-0 text-text-2">ถ้ายังไม่เจอคำตอบ ทัก LINE หรือโทรหาคุณเข็มได้เลย</p>
            </div>
            <div className="border-t border-[#D5D0C3]">
              {faqs.map((f, i) => (
                <details key={f.q} className="group border-b border-[#D5D0C3]" open={i === 0}>
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    <span>{f.q}</span>
                    <PlusIcon
                      size={24}
                      className="shrink-0 text-black transition-transform duration-200 group-open:rotate-45"
                    />
                  </summary>
                  <p className="mt-0 mb-[22px] whitespace-pre-line text-text-2">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className={`bg-black py-16 text-bg md:py-22 ${pad}`}>
          <div className={`${container} grid items-center gap-12 md:grid-cols-2 md:gap-14`}>
            <div className="flex flex-col gap-5">
              <h2 className={h2}>ติดต่อสอบถาม</h2>
              <p className="m-0 text-[#D9D9D9]">สอบถามคิวลูกสุนัข นัดวิดีโอคอลดูน้อง หรือนัดเยี่ยมฟาร์มที่ระนอง</p>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                <ContactLink href={farm.phoneHref} icon={<PhoneIcon size={22} />}>
                  <b>{farm.phoneDisplay}</b> ({farm.phoneContact})
                </ContactLink>
                <ContactLink href={farm.lineUrl} icon={<ChatIcon size={22} />} newTab>
                  LINE <b>{farm.lineId}</b>
                </ContactLink>
                <ContactLink href={farm.facebookUrl} icon={<FacebookIcon size={22} />} newTab>
                  Facebook <b>{farm.facebookName}</b>
                </ContactLink>
                <ContactLink href={farm.instagramUrl} icon={<InstagramIcon size={22} />} newTab>
                  Instagram <b>{farm.instagramHandle}</b>
                </ContactLink>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-card-dark">
                <iframe
                  src={mapsEmbedUrl}
                  title="แผนที่ฟาร์ม Halfmoon Border Collie Thailand จ.ระนอง"
                  className="size-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                href={mapsLinkUrl}
                {...external}
                className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-yellow hover:underline underline-offset-4"
              >
                <MapPinIcon size={20} />
                เปิดใน Google Maps
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={`bg-ink pt-7 pb-24 text-sm text-[#A3A3A3] md:pb-7 ${pad}`}>
        <div className={`${container} flex flex-wrap items-center justify-between gap-4`}>
          <div className="text-bg">
            <Wordmark dark />
          </div>
          <span>© 2026 Halfmoon Border Collie Thailand · โปรเจคของ Hero Pet Farm · ระนอง ประเทศไทย</span>
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

function ContactLink({
  href,
  icon,
  newTab = false,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  newTab?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        {...(newTab ? external : {})}
        className="flex min-h-14 items-center gap-3.5 rounded-2xl bg-card-dark px-5 py-4 text-white hover:bg-[#303030]"
      >
        <span className="shrink-0 text-yellow">{icon}</span>
        <span className="min-w-0 break-words">{children}</span>
      </a>
    </li>
  );
}
