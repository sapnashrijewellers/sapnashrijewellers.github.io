export const dynamic = 'force-static';

import products from '@/data/products.json';

const BASE_URL = 'https://sapnashrijewellers.in';
const BRAND_NAME = 'SSJ Brand';
const SELLER_NAME = 'SapnaShri Jewellers';

/**
 * Remove HTML and normalize whitespace.
 */
function cleanText(value?: string | null): string {
  if (!value) return '';

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatPrice(value: number): string {
  return `${value.toFixed(2)} INR`;
}

export async function GET() {
  const feed = products
    .filter((product) => {
      // Exclude inactive products
      if (!product.active) return false;

      // Require valid product pricing
      if (product.price == null || !Number.isFinite(Number(product.price)) || Number(product.price) <= 0) {
        return false;
      }

      // A main image is mandatory in OpenAI's schema
      return Boolean(product.images?.[0]);
    })
    .map((product) => {
      const productUrl = `${BASE_URL}/p/${product.id}/`;

      const imageUrls = (product.images || []).map(
        (image) => `${BASE_URL}/static/img/products/optimized/${encodeURIComponent(image)}`,
      );

      const sellingPrice = Number(product.price);
      const mrp = Number(product.MRP);

      // Use MRP as regular price when it exceeds selling price.
      const hasSalePrice = Number.isFinite(mrp) && mrp > sellingPrice;

      const regularPrice = hasSalePrice ? mrp : sellingPrice;

      const item: Record<string, unknown> = {
        item_id: String(product.id),

        title: cleanText(product.name).slice(0, 150),

        description: cleanText(
          [
            product.description || product.name,
            product.brandText,
            ...(Array.isArray(product.highlights) ? product.highlights : []),
          ].join(' '),
        ).slice(0, 5000),

        url: productUrl,

        brand: BRAND_NAME,

        seller_name: SELLER_NAME,

        seller_url: BASE_URL,

        image_url: imageUrls[0],

        additional_image_urls: imageUrls.slice(1),

        price: formatPrice(regularPrice),

        availability: product.available ? 'in_stock' : 'out_of_stock',

        target_countries: ['IN'],

        store_country: 'IN',

        is_eligible_search: true,

        condition: 'new',

        product_category: product.collection
          ? `Apparel & Accessories > Jewelry > ${cleanText(product.collection)}`
          : 'Apparel & Accessories > Jewelry',

        material: product.metal ? cleanText(product.metal) : undefined,

        weight: Number(product.weight) > 0 ? String(product.weight) : undefined,

        item_weight_unit: Number(product.weight) > 0 ? 'g' : undefined,

        gender: product.for === 'him' ? 'male' : product.for === 'her' ? 'female' : 'unisex',
      };

      // Include sale price only when genuinely discounted.
      if (hasSalePrice) {
        item.sale_price = formatPrice(sellingPrice);
      }

      return item;
    });

  // OpenAI expects JSONL: one complete JSON object per line.
  const jsonl = feed.map((item) => JSON.stringify(item)).join('\n');

  return new Response(jsonl, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
