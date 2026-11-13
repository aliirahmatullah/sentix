import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/403",
        destination: "/error-403",
      },
      {
        source: "/404",
        destination: "/error-404",
      },
      {
        source: "/500",
        destination: "/error-500",
      },
    ];
  },
};

export default nextConfig;
