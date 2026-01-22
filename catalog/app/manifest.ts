import { MetadataRoute } from "next";
import types from "@/data/types.json";
import { Type } from "@/types/catalog";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  // Map the JSON types to the Shortcut format
  const dynamicShortcuts = (types as Type[])
    .filter((t) => t.active)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 4) // Optimization: Browsers usually cap shortcuts at 4-10
    .map((t) => ({
      name: `${t.type} collection`,
      short_name: t.type, // Use first word for brevity
      description: t.description || `Explore our ${t.type} collection`,
      url: `/jewelry-type/${t.slug}?source=pwa_shortcut`,
      icons: [
        {
          src: "/android-chrome-192x192.png", // Fallback to main icon
          sizes: "192x192",
          type: "image/png",
        },
      ],
    }));
  return {

    name: "Sapna Shri Jewellers",
    short_name: "Sapna Shri",
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
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-96x96.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },      
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],

    shortcuts: dynamicShortcuts,

    screenshots: [
      {
        src: "/screenshots/homepage.png",
        sizes: "1476x3200",
        type: "image/png",
        label: "Homepage",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/product.png",
        sizes: "1476x3200",
        type: "image/png",
        label: "Product Detail Page",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/homepage-wide.png",
        sizes: "2560x1440",
        type: "image/png",
        label: "Homepage",
        form_factor: "wide",
      },
      {
        src: "/screenshots/product-wide.png",
        sizes: "2560x1440",
        type: "image/png",
        label: "Product Detail Page",
        form_factor: "wide",
      },
    ],

    prefer_related_applications: false,
    "share_target": {
      "action": "/search",
      "method": "GET",
      "enctype": "application/x-www-form-urlencoded",
      "params": {
        "title": "q",
        "text": "q",
        "url": "url"
      }
    },
    "protocol_handlers": [
      {
        "protocol": "web+ssj",
        "url": "/search?q=%s"
      }
    ]
  };
}
