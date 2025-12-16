export const dynamic = "force-static";
import type { Product,Category,Type } from "@/types/catalog";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import types from "@/data/types.json"

export default async function sitemap() {
  const baseUrl = process.env.BASE_URL;

  // --- Category URLs ---
  const categoryUrls = categories.map((cat: Category) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const typesUrls = types.map((t: Type) => ({
    url: `${baseUrl}/jewelry-type/${t.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // --- Product URLs ---
  const productUrls =products.map((product:Product)=> ({
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
  return [...staticUrls, ...categoryUrls, ...productUrls, ...typesUrls];
}