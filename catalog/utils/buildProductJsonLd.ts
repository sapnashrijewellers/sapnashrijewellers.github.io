import type { Product, Rates } from "@/types/catalog";
import { calculatePrice } from "@/utils/calculatePrice";

export default function buildProductJsonLd(
  product: Product,
  rates: Rates
) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const driveURL = `${baseURL}/img/products/optimized/`;
  const imageUrl = `${driveURL}${product.images?.[0]}`;
  const baseProductUrl = `${baseURL}/product/${product.slug}`;

  const vPop = calculatePrice({
    purity: product.purity,
    variant: product.variants?.[0],
    rates,
  });

  const hasValidPrice =
    vPop?.price !== null && vPop?.price !== undefined;

  // Price valid for next 24 hours
  const priceValidUntil = hasValidPrice
    ? new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
    : undefined;
  const brandName =
    product.brandText && product.brandText.trim().length > 0
      ? product.brandText.trim()
      : "SSJ Brand";

  const productJsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseProductUrl}#product`,
    name: product.name,
    image: imageUrl,
    description: product.description,
    sku: product.id,
    url: baseProductUrl,

    brand: {
      "@type": "Brand",
      name: brandName,
    },
  };

  /* ✅ Aggregate Rating (only if real data exists) */
  if (product.rating > 0 && product.ratingCount > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  /* ✅ Offers (price only when available) */
  const offer: any = {
    "@type": "Offer",
    url: baseProductUrl,
    priceCurrency: "INR",
    availability: product.available
      ? "https://schema.org/InStock"
      : "https://schema.org/PreOrder",

    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      returnPolicyCategory:
        "MerchantReturnNotPermitted",
      applicableCountry: "IN",
    },

    shippingDetails: {
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
  };

  if (hasValidPrice) {
    offer.price = vPop.price;
    offer.priceValidUntil = priceValidUntil;

    if (vPop.MRP) {
      offer.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price: vPop.price,
        priceCurrency: "INR",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "EA",
        },
      };
    }
  }

  productJsonLd.offers = offer;

  return productJsonLd;
}
