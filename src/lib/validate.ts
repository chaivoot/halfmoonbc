import type { DogCategory, DogStatus } from "@/lib/dogs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Only accept photo URLs that point at a public Vercel Blob store.
const BLOB_URL = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[^\s]+$/i;

export const isUuid = (v: unknown): v is string => typeof v === "string" && UUID.test(v);
export const isBlobUrl = (v: unknown): v is string => typeof v === "string" && BLOB_URL.test(v);

export const categories: DogCategory[] = ["parent", "newborn", "young", "adult"];
export const statuses: Exclude<DogStatus, null>[] = ["available", "reserved", "homed"];

export const isCategory = (v: unknown): v is DogCategory => categories.includes(v as DogCategory);
export const isStatus = (v: unknown): v is Exclude<DogStatus, null> =>
  statuses.includes(v as Exclude<DogStatus, null>);
