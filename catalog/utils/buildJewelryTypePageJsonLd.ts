import type { Type, Product } from "@/types/catalog";

export function buildJewelryTypePageJsonLd(
  products: Product[],
  t: Type
) {
  const baseURL = process.env.BASE_URL;
  const driveURL = `${baseURL}/img/products/optimized/`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseURL}/jewelry-type/${t.slug}`,
    "name": `${t.type} by Sapna Shri Jewellers`,
    "description": t.description,
    "url": `${baseURL}/jewelry-type/${t.slug}`,
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "url": `${baseURL}/product/${product.slug}`,
        "name": product.name,
        "image": `${driveURL}${product.images[0]}`,
        "sku": product.id
      }
    }))
  }
}
