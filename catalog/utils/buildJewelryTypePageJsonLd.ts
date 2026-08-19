import type { Type, Product, Rates } from "@/types/catalog";
import buildProductJsonLd from "@/utils/buildProductJsonLd"; // adjust import path as needed

export function buildJewelryTypePageJsonLd(
  products: Product[],
  t: Type,
  rates: Rates
) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseURL}/jewelry-type/${t.slug}/#itemlist`,
    "name": `${t.type} by Sapna Shri Jewellers`,
    "description": t.description,
    "url": `${baseURL}/jewelry-type/${t.slug}/`,
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => {
      // 1. Generate full, validated Product JSON-LD (includes offers, price, rating, etc.)
      const fullProductJsonLd = buildProductJsonLd(product, rates);

      // 2. Strip root @context to maintain a clean nested structure and avoid unused var ESLint warnings
      const productData = { ...fullProductJsonLd };
      delete (productData as Record<string, unknown>)["@context"];

      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": productData,
      };
    }),
  };
}