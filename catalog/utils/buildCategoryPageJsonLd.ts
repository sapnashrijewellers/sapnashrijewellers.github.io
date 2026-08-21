import type { Product, Category } from "@/types/catalog";
import buildProductJsonLd from "@/utils/buildProductJsonLd";

export function buildCategoryPageJsonLd(
  products: Product[],
  category: Category
  
) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseURL}/category/${category.slug}/#itemlist`,
    "name": `${category.title || category.name} | Sapna Shri Jewellers`,
    "description": category.description,
    "url": `${baseURL}/category/${category.slug}/`,
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