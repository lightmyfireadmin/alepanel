import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external images (Convex storage, company logos, etc.)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "**.alecia.fr",
      },
      {
        protocol: "https",
        hostname: "**.alecia.markets",
      },
    ],
  },
};

export default nextConfig;

