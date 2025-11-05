import React from "react";

export function renderSEOTags(title, description, imageUrl, productUrl, keywords, ldJson) { 
  const ogType = ldJson["@type"] ? ldJson["@type"].toLowerCase() : "website";
  const metaConfig = [
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:url", content: productUrl },
    { property: "og:type", content: ogType },
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
