import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
  webpack(config) {
    // Force webpack to use framer-motion's CJS bundle instead of ESM.
    // The ESM bundle uses internal dynamic import() splits that cause
    // "Lazy element type resolves to undefined" in Chrome's V8.
    config.resolve.alias = {
      ...config.resolve.alias,
      "framer-motion": path.resolve(
        "./node_modules/framer-motion/dist/cjs/index.js"
      ),
    };
    return config;
  },
};

export default nextConfig;
