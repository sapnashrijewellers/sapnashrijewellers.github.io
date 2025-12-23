import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sapna Shri Jewellers",
    short_name: "SSJ",
    description:
      "सपना श्री ज्वैलर्स, नागदा की आधिकारिक वेबसाइट। हमारे नवीनतम आभूषण संग्रह देखें।",
    lang: "hi",
    dir: "ltr",

    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "any",

    /* Light theme (default) */
    background_color: "#FEF8DE",
    theme_color: "#FEF8DE",

    /* Hint to browser: this PWA supports both */
    categories: ["shopping", "lifestyle", "business"],

    icons: [
      {
        src: "/icons/android-chrome-192x192-v1.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/android-chrome-512x512-v1.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/apple-touch-icon-v1.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icons/favicon-16x16-v1.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icons/favicon-32x32-v1.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icons/favicon-v1.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/icons/favicon-v1.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],

    shortcuts: [
      {
        name: "Jewellery",
        short_name: "Gold",
        description: "Explore our gold jewellery collection",
        url: "/",
        icons: [
          {
            src: "/icons/android-chrome-192x192-v1.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],

    screenshots: [
      {
        src: "/screenshots/homepage.jpeg",
        sizes: "738x1600",
        type: "image/jpeg",
        label: "Homepage",
      },
      {
        src: "/screenshots/product-detail.jpeg",
        sizes: "738x1600",
        type: "image/jpeg",
        label: "Product Detail Page",
      },
    ],

    prefer_related_applications: false,
  };
}
