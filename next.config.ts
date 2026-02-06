import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // For GitHub Pages with custom repository name
  basePath: '/photography-portfolio',
  assetPrefix: '/photography-portfolio',
};

export default nextConfig;
