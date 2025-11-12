export const dynamic = "force-static";

// app/sitemap.ts
import { toSlug } from "@/utils/slug";
import type { CatalogData, Product } from "@/types/catalog";
import dataRaw from "@/data/data.json";

const data = dataRaw as CatalogData;

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // --- Category URLs ---
  const categoryUrls = data.sub_categories.map((cat: string) => ({
    url: `${baseUrl}/category/${toSlug(cat)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // --- Product URLs ---
  const productUrls = Object.keys(data.categorizedProducts || {}).flatMap(
    (category) => {
      const catSlug = toSlug(category);
      return data.categorizedProducts[category].map((product: Product) => ({
        url: `${baseUrl}/product/${catSlug}/${product.id}/`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  );

  // --- Static pages ---
  const staticUrls = [
    "",
    "/about-us",
    "/calculator",
    "/huid",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // --- Combine all ---
  return [...staticUrls, ...categoryUrls, ...productUrls];
}