import type { MetadataRoute } from "next";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import types from "@/data/types.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sapnashrijewellers.in";
  const buildDate = new Date();

  return [
    // 1. Homepage
    {
      url: `${baseUrl}/`,
      lastModified: buildDate,
      changeFrequency: "daily",
      priority: 1.0,
    },

    // 2. Categories
    ...categories.map((cat) => ({
      url: `${baseUrl}/c/${cat.id}/`,
      lastModified: buildDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // 3. Jewelry Types
    ...types.map((t) => ({
      url: `${baseUrl}/jt/${t.id}/`,
      lastModified: buildDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // 4. Products
    ...products.map((product) => ({
      url: `${baseUrl}/p/${product.id}/`,
      lastModified: buildDate,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),

    // 5. Static & Policy Pages
    ...[
      "/about-us/",
      "/huid/",
      "/policies/privacy/",
      "/policies/terms/",
      "/policies/shipping/",
      "/policies/disclaimer/",
      "/policies/returns/",
    ].map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: buildDate,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];
}