import React from "react";

export function renderSEOTags(title, description, imageUrl, productUrl, baseUrl, product) {
  // Construct meta configuration
  const metaConfig = [
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:url", content: productUrl },
    { property: "og:type", content: "product" },
    { property: "og:site_name", content: "Sapna Shri Jewellers" },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },

    // General SEO
    { name: "description", content: description },
    { name: "keywords", content: `${title}, jewellery, gold, silver` },
  ];

  // Structured data (if product available)
  const ldJson =
    product && {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      image: product.images?.map((img) => `${baseUrl}/static/img/optimized/${img}`),
      description,
      brand: {
        "@type": "Organization",
        name: "Sapna Shri Jewellers",
      },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "INR",
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock",
      },
    };

  // Render head tags (for SSR/SSG)
  return (
    <>
      <title>{title}</title>

      {/* Canonical link */}
      <link rel="canonical" href={productUrl} />

      {/* Meta tags */}
      {metaConfig.map(({ property, name, content }) =>
        property ? (
          <meta key={property} property={property} content={content} />
        ) : (
          <meta key={name} name={name} content={content} />
        )
      )}

      {/* Structured data */}
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson, null, 2) }}
        />
      )}
    </>
  );
}