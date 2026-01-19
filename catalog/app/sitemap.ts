export const dynamic = "force-static";

import products from "@/data/products.json";
import categories from "@/data/categories.json";
import types from "@/data/types.json";

export default async function sitemap() {
  const baseUrl = "https://sapnashrijewellers.in";
  const now = new Date().toISOString();

  return [
    // Home
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },

    // Categories
    ...categories.map(cat => ({
      url: `${baseUrl}/category/${cat.slug}/`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),

    // Jewelry Types
    ...types.map(t => ({
      url: `${baseUrl}/jewelry-type/${t.slug}/`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),

    // Products
    ...products.map(product => ({
      url: `${baseUrl}/product/${product.slug}/`,
      changeFrequency: "weekly",
      priority: 0.7,
    })),

    // Static / policy pages
    ...[
      "/about-us/",
      "/calculator/",
      "/huid/",
      "/policies/privacy/",
      "/policies/terms/",
      "/policies/shipping/",
      "/policies/disclaimer/",
      "/policies/returns/",
    ].map(path => ({
      url: `${baseUrl}${path}`,
      changeFrequency: "yearly",
      priority: 0.3,
    })),
  ];
}
