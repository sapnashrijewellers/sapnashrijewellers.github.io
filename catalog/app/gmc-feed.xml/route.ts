export const dynamic = "force-static";

import products from "@/data/products.json";

/**
 * Escapes XML entities and strips raw HTML tags to prevent schema breaks
 */
function sanitizeXml(str?: string): string {
  if (!str) return "";
  return str
    .replace(/<[^>]*>/g, "") // Remove HTML markup
    .replace(/[\r\n\t]+/g, " ") // Normalize line breaks & tabs to a single space
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .trim();
}

export async function GET() {
  const baseUrl = "https://sapnashrijewellers.in";
  const brandName = "SSJ Brand";

  const itemsXml = products
    .map((product) => {
      const productUrl = `${baseUrl}/product/${product.slug}/`;
      const imageUrl = product.images?.[0]
        ? `${baseUrl}/static/img/products/optimized/${product.images[0]}`
        : "";      
      
      const hasValidPrice = product.price !== undefined && product.price !== null;

      // Skip products without valid pricing
      if (!hasValidPrice) return "";

      const formattedPrice = `${Number(product.price).toFixed(2)} INR`;
      const availability = product.available ? "in_stock" : "out_of_stock";
      const title = sanitizeXml(product.name);
      const description = sanitizeXml(product.description || product.name);

      // Collect all store-defined types and category
      const storeProductTypes: string[] = [];

      // 1. Add Store Category
      if (product.category) {
        storeProductTypes.push(`Jewelry > ${product.category}`);
      }

      // 2. Add each custom Jewelry Type from your array
      const typesList: string[] = Array.isArray(product.type)
        ? product.type
        : product.type
        ? [product.type]
        : [];

      typesList.forEach((typeName) => {
        if (typeName && typeName !== product.category) {
          storeProductTypes.push(`Jewelry > ${typeName}`);
        }
      });

      // 3. Render individual <g:product_type> elements
      const productTypesXml = storeProductTypes
        .map((t) => `      <g:product_type>${sanitizeXml(t).replace(/>/g, "&gt;")}</g:product_type>`)
        .join("\n");

      return `
    <item>
      <g:id>${sanitizeXml(String(product.id))}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${productUrl}</g:link>
      ${imageUrl ? `<g:image_link>${imageUrl}</g:image_link>` : ""}
      <g:price>${formattedPrice}</g:price>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:brand>${sanitizeXml(brandName)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
${productTypesXml}
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard</g:service>
        <g:price>60.00 INR</g:price>
      </g:shipping>
    </item>`;
    })
    .join("");

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Sapnashri Jewellers - GMC Feed</title>
    <link>${baseUrl}</link>
    <description>Google Merchant Center Product Catalog</description>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(feedXml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}