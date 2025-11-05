import React from "react";

export function renderSEOTags(title, description, imageUrl, productUrl, keywords, baseUrl, product) {
  // Construct meta configuration
  const metaConfig = [
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:url", content: productUrl },
    { property: "og:type", content: product ? "product" : "website" },
    { property: "og:site_name", content: "Sapna Shri Jewellers" },
    { property: "og:locale", content: "hi_IN" },
    { property: "og:image:alt", content: title },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },

    // General SEO
    { name: "description", content: description },
    { name: "keywords", content: keywords },
  ];

  // Structured data
  const ldJson = product
    ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: product.images?.map((img) => `${baseUrl}/static/img/optimized/${img}`),
        description,
        brand: {
          "@type": "Brand",
          name: "Sapna Shri Jewellers",
        },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "INR",
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        url: productUrl,
        description,
        publisher: {
          "@type": "JewelryStore",
          name: "Sapna Shri Jewellers Nagda",
          image: "https://sapnashrijewellers.github.io/logo.png",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Railway Station Main Road, Near Jain Mandir",
            addressLocality: "Nagda",
            addressRegion: "Ujjain",
            postalCode: "456335",
            addressCountry: "IN",
          },
          telephone: "+91-8234042231",
        },
      };

  // Render tags (for SSR/SSG)
  return (
    <>
      <title>{title}</title>

      {/* Canonical */}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson, null, 2) }}
      />
    </>
  );
}
