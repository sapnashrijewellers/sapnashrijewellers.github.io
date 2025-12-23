import type { Product, Category } from "@/types/catalog";

export function buildCategoryPageJsonLd(products: Product[], category: Category) {
  const baseURL = process.env.BASE_URL;
  const driveURL = `${baseURL}/img/products/optimized/`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList", 
    "@id": `${baseURL}/category/${category.slug}`,
    "name": `${category.englishName} | ${category.name} by Sapna Shri Jewellers`,
    "description": category.description,
    "url": `${baseURL}/category/${category.slug}`,
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
  };
}
