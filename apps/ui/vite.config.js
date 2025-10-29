// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa'; // 👈 Import PWA plugin

import fs from 'fs'; // No longer needed unless you re-enable HTTPS server config

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    // 👈 PWA Configuration
    VitePWA({
      // Use injectManifest to keep your custom event listeners (fetch, message)
      id: "https://sapnashrijewellers.github.io/",
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
      },
      manifest: {
        name: "Sapna Shri Jewellers",
        short_name: "SSJ",
        description: "सपना श्री ज्वैलर्स, नागदा की आधिकारिक वेबसाइट। हमारे नवीनतम आभूषण संग्रह देखें।",
        lang: "en",
        dir: "ltr",
        start_url: "/#/",
        scope: "/",
        display: "standalone",
        orientation: "any",
        background_color: "#000000",
        theme_color: "#FFD700",
        categories: ["shopping", "lifestyle", "business"],
        icons: [
          { src: "/icons/android-chrome-192x192-v1.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "/icons/android-chrome-512x512-v1.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
          { src: "/icons/apple-touch-icon-v1.png", sizes: "180x180", type: "image/png" },
          { src: "/icons/favicon-16x16-v1.png", sizes: "16x16", type: "image/png" },
          { src: "/icons/favicon-32x32-v1.png", sizes: "32x32", type: "image/png" },
          { src: "/icons/favicon-v1.ico", sizes: "48x48", type: "image/x-icon" },
          { src: "/icons/favicon-v1.svg", sizes: "any", type: "image/svg+xml" },
        ],
        shortcuts: [
          {
            name: "Jewellery",
            short_name: "Gold",
            description: "Explore our gold jewellery collection",
            url: "/#/",
            icons: [{ src: "/icons/android-chrome-192x192-v1.png", sizes: "192x192", type: "image/png" }],
          }
        ],
        screenshots: [
          { src: "/screenshots/homepage.jpeg", sizes: "738X1600", type: "image/jpeg", label: "Homepage" },
          { src: "/screenshots/product-detail.jpeg", sizes: "738X1600", type: "image/jpeg", label: "Product Detail Page" },
        ],
        prefer_related_applications: false,
        related_applications: [],
      },
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/static/img'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-images-cache-v1',
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ]
      }
    }),
  ]
});