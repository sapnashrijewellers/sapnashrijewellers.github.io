import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {

    name: "Sapna Shri Jewellers",
    short_name: "SSJ",
    description: "सपना श्री ज्वैलर्स, नागदा की आधिकारिक वेबसाइट। हमारे नवीनतम आभूषण संग्रह देखें।",
    lang: "hi-IN",
    dir: "ltr",
    id: "/?source=pwa",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "any",
    display_override: ["window-controls-overlay", "standalone"],
    /* Light theme (default) */
    /* Brand-aligned colors (from CSS variables) */
    background_color: "#FEF8DE", // --color-bg (light theme)
    theme_color: "#A37F2C",      // --color-primary (brand gold)

    /* Hint to browser: this PWA supports both */
    categories: ["shopping", "lifestyle", "business"],

    icons: [
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icons/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
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
            src: "/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],

    screenshots: [
      {
        src: "/screenshots/homepage.png",
        sizes: "1476x3200",
        type: "image/png",
        label: "Homepage",
      },
      {
        src: "/screenshots/product.png",
        sizes: "1476x3200",
        type: "image/png",
        label: "Product Detail Page",
      },
      {
        src: "/screenshots/homepage-wide.png",
        sizes: "2560x1440",
        type: "image/png",
        label: "Homepage",
      },
      {
        src: "/screenshots/product-wide.png",
        sizes: "2560x1440",
        type: "image/png",
        label: "Product Detail Page",
      },
    ],

    prefer_related_applications: false,
  };
}
