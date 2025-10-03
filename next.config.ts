import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/Blog', destination: '/blog', permanent: true },
      { source: '/Blog/:slug', destination: '/blog/:slug', permanent: true },
      { source: '/Login', destination: '/login', permanent: true },
      { source: '/Flow', destination: '/flow', permanent: true },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "pub-919e2ef2fbf24a87a322e4c70fb7a554.r2.dev",
      },
    ],
  },
};

export default withMDX(nextConfig);