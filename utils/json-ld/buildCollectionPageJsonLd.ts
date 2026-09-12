import type { Product, Collection } from "@/types/catalog";
import buildProductJsonLd from "@/utils/json-ld/buildProductJsonLd";

export function buildCollectionPageJsonLd(
  products: Product[],
  collection: Collection
  
) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseURL}/c/${collection.id}/#itemlist`,
    "name": `${collection.title || collection.name} | Sapna Shri Jewellers`,
    "description": collection.description,
    "url": `${baseURL}/c/${collection.id}/`,
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => {
      const fullProductJsonLd = buildProductJsonLd(product);

      // Create a clean item payload without top-level @context
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