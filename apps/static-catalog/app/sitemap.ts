export const dynamic = "force-static";

// app/sitemap.ts
import { toSlug } from "@/utils/slug";
import type { NewCatalog, Product,Category } from "@/types/catalog";
import dataRaw from "@/data/data1.json";

const data = dataRaw as NewCatalog;

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // --- Category URLs ---
  const categoryUrls = data.categories.map((cat: Category) => ({
    url: `${baseUrl}/category/${toSlug(cat.slug)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // --- Product URLs ---
  const productUrls =data.products.map((product:Product)=> ({
        url: `${baseUrl}/product/${product.slug}/`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    

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