import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.aws.element84.com" },
      { protocol: "https", hostname: "**.sentinel-hub.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
