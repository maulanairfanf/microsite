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
        hostname: "instagram.fcgk18-2.fna.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;
