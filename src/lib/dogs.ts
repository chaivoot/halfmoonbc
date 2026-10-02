// Static data for now. Mirrors the planned Supabase `dogs` / `dog_photos`
// tables so swapping in DB queries later only changes where data comes from.

export type DogCategory = "parent" | "newborn" | "young" | "adult";
export type DogStatus = "available" | "reserved" | "homed" | null;

export type Dog = {
  id: string;
  name: string;
  nameTh: string | null;
  sex: "male" | "female" | null;
  color: string | null;
  category: DogCategory;
  status: DogStatus;
  description: string | null;
  tags: string[];
  coverPhoto: string;
};

export const sexLabel = { male: "เพศผู้", female: "เพศเมีย" } as const;

export const statusLabel: Record<Exclude<DogStatus, null>, string> = {
  available: "ว่าง",
  reserved: "จองแล้ว",
  homed: "มีบ้านแล้ว",
};

export const galleryTabs = [
  { id: "newborn", label: "New born" },
  { id: "young", label: "Young" },
  { id: "adult", label: "Adult" },
] as const;

export const parents: Dog[] = [
  {
    id: "halfmoon",
    name: "Halfmoon",
    nameTh: "ฮาฟมูน",
    sex: "male",
    color: "Blue Merle (บลูเมิร์ล)",
    category: "parent",
    status: null,
    description:
      "สุนัขตัวแรกของบ้าน น่ารัก เรียบร้อย ขี้อ้อน กินจุ สายประกวด ขนยาวสวยงาม เข้ากับเด็กๆ และน้องหมาตัวใหม่ได้ง่าย",
    tags: ["สายประกวด", "เข้ากับเด็ก"],
    coverPhoto: "/images/parents/halfmoon.webp",
  },
  {
    id: "dakota",
    name: "Dakota",
    nameTh: "ดาโคด้า",
    sex: "male",
    color: "Tri Color (ไตรคัลเลอร์)",
    category: "parent",
    status: null,
    description:
      "สุดหล่อขี้อ้อน สาย Agility ทรงสปอร์ต แข็งแรง Active ชอบวิ่งเล่น พลังงานสูง เรียนรู้ไว คว้ารางวัลมาให้บ้านมากมาย",
    tags: ["Agility", "พลังงานสูง"],
    coverPhoto: "/images/parents/dakota.webp",
  },
  {
    id: "mona",
    name: "Mona",
    nameTh: "โมนา",
    sex: "female",
    color: "Black & White (ขาวดำ)",
    category: "parent",
    status: null,
    description:
      "สาวที่เต็มไปด้วยความสามารถ สายถ่ายรูปคาเฟ่ ฝึกท่านั่ง หมอบ คลาน วิ่ง Agility จนได้รางวัล เรียบร้อย ใจดี สุขุม เฟรนลี่ เข้ากับเด็กง่าย",
    tags: ["Agility", "สายคาเฟ่"],
    coverPhoto: "/images/parents/mona.webp",
  },
  {
    id: "cynthia",
    name: "Cynthia",
    nameTh: "ซินเทีย",
    sex: "female",
    color: "Black & White (ขาวดำ)",
    category: "parent",
    status: null,
    description: "ตัวเล็ก น่ารัก พกพาง่าย วิ่งตัวเบาเหมือนนินจา ชอบเล่น Agility",
    tags: ["Agility", "ตัวเล็ก"],
    coverPhoto: "/images/parents/cynthia.webp",
  },
  {
    id: "dior",
    name: "Dior",
    nameTh: "ดิออ",
    sex: "female",
    color: "Tri Merle (ไตรเมิร์ล)",
    category: "parent",
    status: null,
    description: "สายคาเฟ่ เรียบร้อย ขี้อ้อน อยู่เป็น นิสัยเฟรนลี่ รักเด็ก",
    tags: ["สายคาเฟ่", "รักเด็ก"],
    coverPhoto: "/images/parents/dior.webp",
  },
];

// Photos imported from the old Google Sites page, one entry per photo.
// Names and statuses get filled in later from /admin.
function galleryEntries(category: DogCategory, from: number, to: number): Dog[] {
  return Array.from({ length: to - from + 1 }, (_, i) => {
    const n = String(from + i).padStart(2, "0");
    return {
      id: `${category}-${n}`,
      name: "",
      nameTh: null,
      sex: null,
      color: null,
      category,
      status: null,
      description: null,
      tags: [],
      coverPhoto: `/images/family/${category}-${n}.webp`,
    };
  });
}

export const family: Dog[] = [
  ...galleryEntries("newborn", 1, 9),
  ...galleryEntries("young", 10, 24),
  ...galleryEntries("adult", 25, 39),
];
