import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/iconcile-website" : "",
  assetPrefix: isProd ? "/iconcile-website/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
