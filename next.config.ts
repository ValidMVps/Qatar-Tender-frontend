import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // skips ESLint during builds, saves build time
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    formats: ["image/avif", "image/webp"], // modern image formats for faster loading
    minimumCacheTTL: 60, // cache remote images for 60s (adjust if needed)
  },
  poweredByHeader: false, // removes "X-Powered-By" header for slightly faster responses
  experimental: {
    scrollRestoration: true, // improves navigation performance
    optimizeCss: true, // auto CSS optimization (Next 13+)
  },
  output: "standalone", // makes deployments lighter (especially for serverless)
};

export default nextConfig;
