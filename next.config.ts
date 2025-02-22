import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Optional: Ignore ESLint errors during production build
  },
  typescript: {
    ignoreBuildErrors: true, // Optional: Ignore TypeScript errors during build
  },
};

export default nextConfig;
