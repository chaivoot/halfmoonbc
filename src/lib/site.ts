export const farm = {
  name: "Halfmoon Border Collie Thailand",
  phoneDisplay: "091-826-8488",
  phoneHref: "tel:+66918268488",
  phoneContact: "คุณเข็ม",
  lineId: "@HalfmoonBordercollie",
  lineUrl: "https://line.me/R/ti/p/@375wobeo",
  facebookName: "Halfmoon BorderCollie Thailand",
  facebookUrl: "https://www.facebook.com/HalfMoon.BorderCollie",
  instagramHandle: "@halfmoonbordercollie",
  instagramUrl: "https://instagram.com/halfmoonbordercollie",
  geo: { lat: 9.985429, lng: 98.648455 },
};

export const mapsEmbedUrl = `https://www.google.com/maps?q=${farm.geo.lat},${farm.geo.lng}&z=17&hl=th&output=embed`;
export const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${farm.geo.lat},${farm.geo.lng}`;

export const navLinks = [
  { href: "#about", label: "เกี่ยวกับฟาร์ม" },
  { href: "#parents", label: "พ่อแม่พันธุ์" },
  { href: "#puppies", label: "ลูกสุนัข" },
  { href: "#family", label: "Halfmoon Family" },
  { href: "#faq", label: "คำถามที่พบบ่อย" },
];

export const trust = [
  { big: "FCI", small: "ฟาร์มจดทะเบียนกับสมาคมฯ" },
  { big: "DNA", small: "พ่อแม่ตรวจโรคทางพันธุกรรม" },
  { big: "2 เข็ม", small: "วัคซีนครบก่อนส่งมอบ" },
  { big: "LINE กลุ่ม", small: "ดูแลต่อหลังรับน้อง" },
];

export const puppyBenefits: { title: string; desc: string; link?: { href: string; label: string } }[] = [
  { title: "ใบเพดดิกรี", desc: "จดทะเบียนจากสมาคมพัฒนาพันธุ์สุนัขแห่งประเทศไทย" },
  { title: "วัคซีน 2 เข็ม", desc: "ครบก่อนส่งมอบเมื่ออายุ 2 เดือน" },
  {
    title: "การฝึกพื้นฐาน",
    desc: "ปูพื้นฐานนิสัยและระบบประสาทตั้งแต่แรกเกิด (ดูรายการฝึก)",
    link: { href: "https://www.dogbooster.net/", label: "กดดูรายละเอียดการฝึก" },
  },
  { title: "ไลน์กลุ่มผู้ปกครอง", desc: "ปรึกษาฟาร์มและผู้เลี้ยงรุ่นก่อนได้ตลอด" },
];

export const training = [
  "Early Neurological Stimulation (ENS)",
  "การอยู่ในพื้นที่จำกัด",
  "การอยู่ลำพัง",
  "การขับถ่าย",
  "การเล่น",
  "การทานอาหารเม็ด",
  "การทานน้ำจากขวด",
  "การควบคุมอารมณ์",
  "ทดสอบระบบประสาท การมอง การได้ยิน",
];

export const steps = [
  { title: "ทักสอบถาม และจอง", desc: "เช็คคิวครอกถัดไปทาง LINE วางมัดจำเริ่มต้น 5,000 บาท" },
  { title: "วิดีโอคอลดูน้อง", desc: "ดูน้องและพ่อแม่ได้ระหว่างรอ" },
  { title: "เยี่ยมฟาร์มได้", desc: "หลังน้องได้วัคซีนครบ 2 เข็ม" },
  { title: "รับน้องกลับบ้าน", desc: "อายุครบ 2 เดือน ส่งฟรีกรุงเทพฯ และปริมณฑล" },
];

export const pricing = {
  startingPrice: "35,000 บาท",
  deposit: "5,000 บาท",
};

export const faqs = [
  {
    q: "ไปดูน้องที่ฟาร์มได้ไหม?",
    a: "ได้ครับ แต่ต้องรอให้น้องได้รับวัคซีนครบ 2 เข็มก่อน เพื่อความปลอดภัยและลดความเสี่ยงในการติดเชื้อ ระหว่างนั้นวิดีโอคอลมาดูน้องได้เลย",
  },
  {
    q: "รับน้องได้ตอนไหน ยังไงบ้าง?",
    a: "น้องพร้อมส่งมอบเมื่ออายุครบ 2 เดือน\n1. ส่งฟรีภายในกรุงเทพฯ และปริมณฑล\n2. ต่างจังหวัด ตามตกลง",
  },
  {
    q: "ราคาและมัดจำประมาณเท่าไร?",
    a: "ราคาเริ่มต้น 35,000 บาท มัดจำเริ่มต้น 5,000 บาท",
  },
  {
    q: "พ่อแม่น้องเป็นยังไงบ้าง?",
    a: "1. ตรวจ DNA ไม่มีโรคทางพันธุกรรม\n2. ได้รับวัคซีนเป็นประจำ\n3. เลี้ยงและฝึกให้อยู่ในสังคม\n4. ดูแลให้มีจิตใจสดใสตลอดเวลา\n5. มีรางวัลจากการประกวดความสวยงาม\n6. มีรางวัลจากการแข่งขัน Agility Dog\n7. นิสัยดี ไม่ก่อปัญหา จิตประสาทดี",
  },
  {
    q: "รับน้องไปแล้ว มีช่องทางให้ปรึกษาไหม?",
    a: "ฟาร์มมีไลน์กลุ่มผู้ปกครองของน้องๆ ตั้งแต่รุ่นแรกถึงรุ่นปัจจุบัน ไว้แลกเปลี่ยน สอบถาม และติดตามความน่ารัก เราจะดึงเข้ากลุ่มทันทีเมื่อส่งมอบน้องเรียบร้อย",
  },
];

// Production URL for canonical links, sitemap and structured data. Vercel sets
// VERCEL_PROJECT_PRODUCTION_URL, so this follows a custom domain once one is added.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://halfmoonbc.vercel.app");

export const seo = {
  title: "Halfmoon Border Collie Thailand - ฟาร์มบอร์เดอร์คอลลี่ จ.ระนอง",
  description:
    "ฟาร์มบอร์เดอร์คอลลี่ จ.ระนอง จดทะเบียนกับสมาคมพัฒนาพันธุ์สุนัขแห่งประเทศไทย (FCI) ลูกสุนัขบอร์เดอร์คอลลี่มีใบเพดดิกรี วัคซีน 2 เข็ม ฝึกพื้นฐานก่อนส่งมอบ ราคาเริ่มต้น 35,000 บาท ส่งฟรีกรุงเทพฯ และปริมณฑล",
  keywords: [
    "บอร์เดอร์คอลลี่",
    "ฟาร์มบอร์เดอร์คอลลี่",
    "ลูกสุนัขบอร์เดอร์คอลลี่",
    "ลูกสุนัขบอร์เดอร์คอลลี่ ระนอง",
    "บอร์เดอร์คอลลี่ ราคา",
    "border collie thailand",
    "border collie",
    "Halfmoon Border Collie",
    "Hero Pet Farm",
  ],
};
