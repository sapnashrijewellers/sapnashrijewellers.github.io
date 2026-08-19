// app/llms.txt/route.ts
export const dynamic = "force-static";

import products from "@/data/products.json";
import categories from "@/data/categories.json";
import types from "@/data/types.json";

interface CatalogItem {
  slug: string;
  name?: string;
  title?: string;
  description?: string;
}

/**
 * Strips HTML tags and normalizes line breaks for clean AI/LLM consumption
 */
function cleanText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET() {
  const baseUrl = "https://sapnashrijewellers.in";

  // Category Landing Pages
  const categoryLinks = categories 
    .map((cat) => {
      const title = cat.name;
      return `- [${title}](${baseUrl}/category/${cat.slug}/): Explore all ${cleanText(title)} collections.`;
    })
    .join("\n");

  // Jewellery Type Landing Pages
  const jewelryTypeLinks = types
    .map((t) => {
      const title = t.type ;
      return `- [${title}](${baseUrl}/jewelry-type/${t.slug}/): Browse specialized ${cleanText(title)}.`;
    })
    .join("\n");

  // Product Catalog Index
  const productLinks = products
    .map((prod) => {
      const title = cleanText(prod.name);
      const rawDesc = cleanText(prod.description);
      const shortDesc = rawDesc.length > 130 ? `${rawDesc.slice(0, 127)}...` : rawDesc;
      return `- [${title}](${baseUrl}/product/${prod.slug}/): ${shortDesc}`;
    })
    .join("\n");

  const markdownContent = `# Sapnashri Jewellers (सपना श्री ज्वेलर्स)
> 35+ years of trust, excellence, and authentic 22K Gold & Silver Jewellery in Nagda Junction (Ujjain), India. Founded by Shri Bhamwarlalji Gang, now led by Amish Kumar Gang.

## Business & Store Summary
- Specialization: Pure 22K (916) BIS Hallmarked Gold jewellery, authentic silver ornaments, and custom personalized designs.
- Heritage: 35+ years of craft legacy with 5,000+ satisfied customers.
- Address: Near Railway Station, M G Road, Nagda Junction, District: Ujjain, Madhya Pradesh, India.
- Contact: +91 8234042231
- Services: Gold polishing, easy old-gold exchange, HUID verification, loan against gold/silver jewelry, guaranteed buyback.

## Main Landing Pages
- [Home Page](${baseUrl}/): Official storefront, live rate calculations, and featured collections.
- [About Us](${baseUrl}/about-us/): Store legacy, founders, craftsmanship standards, and customer trust.
- [HUID Purity Verification](${baseUrl}/huid/): BIS 916 Hallmark and unique HUID tracking code verification details.

## Category Landing Pages
${categoryLinks}

## Jewellery Type Landing Pages
${jewelryTypeLinks}

## Policies & Store Commitments
- [Privacy Policy](${baseUrl}/policies/privacy/): Information handling and customer privacy terms.
- [Return & Exchange Policy](${baseUrl}/policies/returns/): Transparent guidelines on returns, exchanges, and buyback terms.
- [Shipping Policy](${baseUrl}/policies/shipping/): Domestic delivery guidelines, timelines, and insured transit details.
- [Warranty Guidelines](${baseUrl}/policies/warranty/): Purity assurance, craftsmanship warranty, and repair support.
- [Disclaimer](${baseUrl}/policies/disclaimer/): Catalog pricing, rate fluctuations, and product representations.
- [Terms of Service](${baseUrl}/policies/terms/): Store conditions, browsing guidelines, and service agreements.

## Product Catalog
${productLinks}
`;

  return new Response(markdownContent.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate",
    },
  });
}