// Shared types and labels for the `dogs` table. Safe to import from client components.

export type DogCategory = "parent" | "newborn" | "young" | "adult";
export type DogStatus = "available" | "reserved" | "homed" | null;

export type Dog = {
  id: string;
  // Set for dogs with an English name; dogs without one have no page of their own.
  slug: string | null;
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

export const dogPath = (slug: string) => `/dogs/${slug}`;

// Display order inside a category: available first, then reserved, homed, and
// dogs without a status last. Mirrors the ORDER BY used in src/lib/queries.ts and src/lib/admin-dogs.ts.
export const statusRank = (status: DogStatus) =>
  status === "available" ? 1 : status === "reserved" ? 2 : status === "homed" ? 3 : 4;
