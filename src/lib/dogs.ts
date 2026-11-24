// Shared types and labels for the `dogs` table. Safe to import from client components.

// "newborn" is every puppy bred here. While available or reserved it shows under
// ลูกสุนัข; once homed it moves to ครอบครัว Halfmoon.
export type DogCategory = "parent" | "newborn";
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
  // Shown once the dog lives with its new family (ครอบครัว Halfmoon).
  instagram: string | null;
  province: string | null;
  ownerMessage: string | null;
};

export const sexLabel = { male: "เพศผู้", female: "เพศเมีย" } as const;

export const statusLabel: Record<Exclude<DogStatus, null>, string> = {
  available: "ว่าง",
  reserved: "จองแล้ว",
  homed: "มีบ้านแล้ว",
};

export const categoryLabel: Record<DogCategory, string> = {
  parent: "พ่อแม่พันธุ์",
  newborn: "ลูกสุนัข",
};

// A puppy that has gone to its new home belongs to ครอบครัว Halfmoon.
export const isFamily = (dog: { category: DogCategory; status: DogStatus }) =>
  dog.category !== "parent" && dog.status === "homed";

export const instagramUrl = (handle: string) => `https://instagram.com/${handle}`;

export const dogPath = (slug: string) => `/dogs/${slug}`;

// Display order inside a category: available, reserved, no status, then homed
// (the family). Mirrors the ORDER BY in src/lib/queries.ts and src/lib/admin-dogs.ts.
export const statusRank = (status: DogStatus) =>
  status === "available" ? 1 : status === "reserved" ? 2 : status === null ? 3 : 4;
