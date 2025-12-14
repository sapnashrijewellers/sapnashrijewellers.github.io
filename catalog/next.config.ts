import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   output: "export", // 👈 enables SSG build
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_URL: 'https://sapnashrijewellers.in',
  },
  trailingSlash: true,
  assetPrefix: "/",
  basePath: "",
};

export default nextConfig;
