export function setSEOTags(title, description, imageUrl, productUrl)
{  

    document.title = title;

    const metaConfig = [
      // Open Graph tags
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: productUrl },
      { property: "og:type", content: "product" },
      { property: "og:site_name", content: "Sapna Shri Jewellers" },

      // Twitter Card tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ];

    metaConfig.forEach(({ property, name, content }) => {
      const selector = property
        ? `meta[property='${property}']`
        : `meta[name='${name}']`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        if (property) tag.setAttribute("property", property);
        if (name) tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });    
}