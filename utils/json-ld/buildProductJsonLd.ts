import type { Product as SchemaProduct, Offer as SchemaOffer, WithContext } from "schema-dts";
import type { Product } from "@/types/catalog";


/**
 * Sanitizes plain text for JSON-LD:
 * - Strips HTML tags
 * - Replaces multiple newlines/tabs with a single space
 * - Removes problematic unescaped control characters
 */
function sanitizeDescription(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[\r\n\t]+/g, " ") // Normalize newlines & tabs to spaces
    .replace(/"/g, "'") // Convert unescaped double quotes to single quotes
    .trim();
}

export default function buildProductJsonLd(
  product: Product
): WithContext<SchemaProduct> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
  const imageBaseUrl = `${baseURL}/static/img/products/optimized/`;  
  const productUrl = `${baseURL}/p/${product.id}`;

  const productImages: string[] = product.images?.length
    ? product.images.map((img: string) => `${imageBaseUrl}${img}`)
    : [`${baseURL}/icons/icon-512x512.png`];
  const primaryImageUrl = productImages[0];
  const hasValidPrice = product.price !== null && product.price !== undefined;

  const now = new Date();
  const validFrom = hasValidPrice ? now.toISOString().split("T")[0] : undefined;
  const priceValidUntil = hasValidPrice 
    ? new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : undefined;

  const brandName = "SSJ Brand";

  /* Offer Definition */
  const offer: SchemaOffer = {
    "@type": "Offer",
    url: productUrl,
    priceCurrency: "INR",
    availability: product.available
      ? "https://schema.org/InStock"
      : "https://schema.org/PreOrder",

    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      applicableCountry: "IN",
    },

    shippingDetails: [
      {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 60,
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 5,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    ],
  };

  if (hasValidPrice && product.price !== undefined) {
    offer.price = product.price;
    offer.validFrom = validFrom; // Correct Schema.org attribute
    offer.priceValidUntil = priceValidUntil;

    if (product.MRP) {
      offer.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price: product.price,
        priceCurrency: "INR",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "EA",
        },
      };
    }
  }

  /* Product Schema */
  const productJsonLd: WithContext<SchemaProduct> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    image: [
      {
        "@type": "ImageObject",
        url: primaryImageUrl,
        contentUrl: primaryImageUrl,
        caption: `${product.name} - Sapna Shri Jewellers`,
      },
      ...productImages.slice(1),
    ],
    description: sanitizeDescription(product.description),
    sku: String(product.id),
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers: offer,
  };

  /* Aggregate Rating */
  if (product.rating > 0 && product.ratingCount > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      ratingCount: product.ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return productJsonLd;
}