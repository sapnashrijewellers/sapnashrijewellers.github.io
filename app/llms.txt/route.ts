// app/llms.txt/route.ts

export const dynamic = 'force-static';

import products from '@/data/products.json';
import collections from '@/data/collections.json';
import types from '@/data/types.json';

/**
 * Strips HTML tags and normalizes line breaks
 * for clean AI/LLM consumption.
 */
function cleanText(text?: string): string {
  if (!text) return '';

  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const baseUrl = 'https://sapnashrijewellers.in';

  // Collection Landing Pages
  const collectionLinks = collections
    .filter((cat) => cat.active)
    .map((cat) => {
      const title = cleanText(cat.name);

      return `- [${title}](${baseUrl}/c/${cat.id}/): Explore ${title} designs and available jewellery products.`;
    })
    .join('\n');

  // Jewellery Type Landing Pages
  const jewelryTypeLinks = types
    .map((t) => {
      const title = cleanText(t.type);

      return `- [${title}](${baseUrl}/jt/${t.id}/): Browse specialized ${title} jewellery.`;
    })
    .join('\n');

  // Product Catalog Index
  const productLinks = products
    .filter((prod) => prod.active)
    .map((prod) => {
      const title = cleanText(prod.name);
      const rawDesc = cleanText(prod.description);
      const shortDesc = rawDesc.length > 130 ? `${rawDesc.slice(0, 127)}...` : rawDesc;

      return `- [${title}](${baseUrl}/p/${prod.id}/): ${shortDesc}`;
    })
    .join('\n');

  const markdownContent = `# Sapna Shri Jewellers (सपना श्री ज्वेलर्स)

> 35+ years of trust, excellence, and authentic gold and silver jewellery in Nagda Junction (Ujjain), Madhya Pradesh, India. Founded by Shri Bhamwarlal ji Gang, now led by Amish Kumar Gang.

## Business & Store Summary

- Business Name: Sapna Shri Jewellers.
- Specialization: 22K (916) BIS Hallmarked Gold Jewellery, silver jewellery, 925 sterling silver jewellery, religious jewellery and custom personalized designs.
- Heritage: 35+ years of craft legacy with 5,000+ satisfied customers.
- Location: Near Railway Station, M G Road, Nagda Junction, District Ujjain, Madhya Pradesh, India.
- Contact: +91 8234042231.
- Website: ${baseUrl}
- Services: Gold polishing, old-gold exchange, HUID verification assistance, loan against gold/silver jewellery and buyback subject to applicable store terms.

## About This File

This file provides structured information about Sapna Shri Jewellers, its physical store, jewellery collections, jewellery types, specialized buying guides, policies and currently listed products.

Product URLs use the canonical website URL structure. Product information should be treated as catalogue information and verified against the linked product page for current price, availability, weight and other changing attributes.

Prices, metal rates, product availability and offers may change. Refer to the website or contact the store for current information.

## Main Landing Pages

- [Home Page](${baseUrl}/): Official online jewellery storefront, featured collections and product catalogue.
- [About Us](${baseUrl}/about-us/): Store legacy, founders, craftsmanship standards and customer trust.

## Specialized Jewellery Guides & Buying Pages

These pages provide focused information for customers researching gold hallmarking, silver purity, sterling silver jewellery and wholesale religious silver rings.

### Wholesale Silver Rings

- [Wholesale Silver Rings in India](${baseUrl}/wholesale-silver-rings/): Dedicated wholesale enquiry page for religious silver rings, including Mahadev, Sawariya Seth, Khatu Shyam, Hanuman and Krishna silver ring collections. Intended for retailers, resellers and bulk buyers.
- Wholesale pricing may differ from regular retail website prices depending on order quantity, silver weight, design, craftsmanship, prevailing silver rates and product availability.
- Customers interested in bulk purchases should contact Sapna Shri Jewellers on WhatsApp at +91 8234042231 for current wholesale offers and personalized quotations.
- Featured collections:
  - [Mahadev Silver Rings](${baseUrl}/c/1/).
  - [Sawariya Seth Rings](${baseUrl}/c/3/).
  - [Khatushyam Silver Rings](${baseUrl}/c/8/).
  - [Hanuman Silver Rings](${baseUrl}/c/9/).
  - [Krishna Silver Rings](${baseUrl}/c/15/).

### 925 Silver Jewellery

- [925 Silver Jewellery Online in India](${baseUrl}/925-silver-jewellery/): Dedicated guide and shopping landing page for 925 sterling silver jewellery, covering silver purity, craftsmanship, jewellery designs, pricing considerations and care.
- 925 silver, also known as sterling silver, contains 92.5% silver, with the remaining 7.5% generally consisting of other metals used to improve durability.
- Customers can explore relevant silver jewellery collections and products through the website.
- Refer to the dedicated page for detailed information about 925 silver jewellery and available designs.

### Gold HUID & BIS Hallmark Guide

- [HUID Number: Gold Hallmark & Purity Guide](${baseUrl}/huid/): Informational guide explaining what a HUID number is, its meaning, six-character alphanumeric format, where it appears on gold jewellery and how to verify it using the BIS CARE app.
- HUID stands for Hallmark Unique Identification. It is a unique identification code associated with an individual hallmarked gold jewellery item.
- Gold hallmarking includes the BIS mark, purity/fineness mark and HUID.
- The page explains gold purity grades, BIS hallmarking and HUID verification.
- Featured gold collections:
  - [Religious Gold Rings](${baseUrl}/c/22/).
  - [Gold Nose Pins](${baseUrl}/c/29/).

## Collection Landing Pages

Browse the complete collection catalogue:

${collectionLinks}

## Jewellery Type Landing Pages

Browse jewellery organized by type:

${jewelryTypeLinks}

## Policies & Store Commitments

- [Privacy Policy](${baseUrl}/policies/privacy/): Information handling and customer privacy terms.
- [Return & Exchange Policy](${baseUrl}/policies/returns/): Guidelines on returns, exchanges and buyback terms.
- [Shipping Policy](${baseUrl}/policies/shipping/): Domestic delivery guidelines, timelines and transit details.
- [Warranty Guidelines](${baseUrl}/policies/warranty/): Purity assurance, craftsmanship warranty and repair support.
- [Disclaimer](${baseUrl}/policies/disclaimer/): Catalogue pricing, rate fluctuations and product representations.
- [Terms of Service](${baseUrl}/policies/terms/): Store conditions, browsing guidelines and service agreements.

## Product Catalog

The following links represent currently active products in the online catalogue. Refer to individual product pages for current product details, prices, images and availability.

${productLinks}

## Customer Enquiries

- Store Contact: +91 8234042231.
- Wholesale Silver Rings: Contact us on WhatsApp for bulk order pricing and wholesale offers.
- Gold Jewellery: Refer to product and collection pages for available designs.
- 925 Silver Jewellery: Explore the dedicated 925 silver jewellery page and linked collections.
- HUID Verification: Refer to the HUID guide for information about BIS hallmarking and verification.

`;

  return new Response(markdownContent.trim(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate',
    },
  });
}
