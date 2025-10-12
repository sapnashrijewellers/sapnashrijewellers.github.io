import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from "vite-plugin-pwa";
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "/",
      filename: "/service-worker.js", // output SW filename
      injectRegister: "auto", // automatically register SW
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    },
    port: 5173
  }
});
