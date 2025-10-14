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
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      injectManifest: {
        injectionPoint: undefined,
      },
      manifest: false,
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      }
    }),
  ]
  // ,
  // server: {
  //   https: {
  //     key: fs.readFileSync('./localhost-key.pem'),
  //     cert: fs.readFileSync('./localhost.pem')
  //   },
  //   port: 5173
  // }
});