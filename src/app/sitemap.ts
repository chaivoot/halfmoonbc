import type { MetadataRoute } from "next";
import { dogPath } from "@/lib/dogs";
import { getDogSlugs } from "@/lib/queries";
import { siteUrl } from "@/lib/site";

// Fallback refresh; admin saves revalidate the sitemap immediately.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dogs = await getDogSlugs();
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...dogs.map((d) => ({
      url: `${siteUrl}${dogPath(d.slug)}`,
      lastModified: d.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
