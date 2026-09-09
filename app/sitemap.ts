import type { MetadataRoute } from "next";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import types from "@/data/types.json";

export const dynamic = "force-static";

export async function generateSitemaps() {
  return [{ id: "priority" }, { id: "products" }];
}

export default async function sitemap(
  {
    id,
  }: {
    id: Promise<string>;
  },
): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sapnashrijewellers.in".replace(/\/+$/, "");
  const buildDate = new Date();
  const sitemapId = await id;
  const policies = [
      "/about-us/",
      "/huid/",
      "/policies/privacy/",
      "/policies/terms/",
      "/policies/shipping/",
      "/policies/disclaimer/",
      "/policies/returns/",
      "/policies/warranty/",
    ];
  const landingEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: buildDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categories.map((cat) => ({
      url: `${baseUrl}/c/${cat.id}/`,
      lastModified: buildDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),    
  ];

  if (sitemapId === "priority") return landingEntries;

  return [
    ...landingEntries,
    ...types.map((t) => ({
      url: `${baseUrl}/jt/${t.id}/`,
      lastModified: buildDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/p/${product.id}/`,
      lastModified: buildDate,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...policies.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: buildDate,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];
}