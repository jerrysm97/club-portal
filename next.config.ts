import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
      skipDefaultConversion: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
