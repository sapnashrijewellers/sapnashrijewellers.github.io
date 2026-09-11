import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 👈 enables SSG build
  images: { unoptimized: true },
  trailingSlash: true,
  assetPrefix: "/",
  basePath: "",
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "firebase", "canvas-confetti"],
  },
};

export default nextConfig;
