import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Disable Turbopack for builds due to known bug with large static files
  // https://github.com/vercel/next.js/issues - "Dependency tracking is disabled"
  turbopack: {
    // Only use Turbopack for dev, not for production builds
  },
  
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
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
