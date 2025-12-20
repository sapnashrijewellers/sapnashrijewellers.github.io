import type { Product } from "@/types/catalog";

export function buildProductJsonLd(
  product: Product,
  imageUrl: string,
  baseProductUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseProductUrl}#product`,
    name: product.name,
    image: imageUrl,
    description: product.description,
    sku: product.id,

    brand: {
      "@type": "Brand",
      name: "Sapna Shri Jewellers",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.ratingCount,
    },

    offers: {
      "@type": "Offer",
      url: baseProductUrl,
      priceCurrency: "INR",
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",

      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/NoReturnsAccepted",
        applicableCountry: "IN",
      },

      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
      },
    },
  };
}
