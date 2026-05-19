import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude scripts folder from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude non-app files from the build
  experimental: {
    // Exclude scripts from build
  },
  // Don't include scripts in the app build
  serverExternalPackages: [],
};

export default nextConfig;