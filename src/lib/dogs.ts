// Shared types and labels for the `dogs` table. Safe to import from client components.

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
  coverPhoto: string | null;
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

export const categoryLabel: Record<DogCategory, string> = {
  parent: "พ่อแม่พันธุ์",
  newborn: "New born",
  young: "Young",
  adult: "Adult",
};
