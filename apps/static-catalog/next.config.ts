import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   output: "export", // 👈 enables SSG build
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  assetPrefix: "/",
  basePath: "",
};

export default nextConfig;
