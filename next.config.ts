import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.aws.element84.com" },
      { protocol: "https", hostname: "**.sentinel-hub.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "**.railway.app" },
    ],
  },
};

export default nextConfig;
