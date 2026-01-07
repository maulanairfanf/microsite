import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "scontent-cgk1-2.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "instagram.fbdo7-1.fna.fbcdn.net"
      }
    ],
  },
};

export default nextConfig;
