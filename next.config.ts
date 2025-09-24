import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;