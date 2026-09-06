import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  typedRoutes: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",

        hostname: "lh3.googleusercontent.com",

        pathname: "/aida-public/**",
      },
    ],
  },
};

export default nextConfig;
