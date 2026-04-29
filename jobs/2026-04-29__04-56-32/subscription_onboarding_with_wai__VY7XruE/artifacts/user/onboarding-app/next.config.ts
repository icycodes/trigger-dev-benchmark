import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY!,
    TRIGGER_PROJECT_REF: process.env.TRIGGER_PROJECT_REF!,
  },
};

export default nextConfig;
