import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 👈 enables SSG build
  images: { unoptimized: true, },
  trailingSlash: true,
  assetPrefix: "/",
  basePath: "",
  // env: {
  //   NEXT_PUBLIC_BASE_URL: 'https://sapnashrijewellers.in',
  //   NEXT_PUBLIC_WHATSAPP: '918234042231',
  // }, 
};

export default nextConfig;
