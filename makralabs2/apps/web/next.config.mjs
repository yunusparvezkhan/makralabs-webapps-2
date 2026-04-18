import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(appDir, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@makralabs/ui", "@makralabs/utils", "@makralabs/types"],
  outputFileTracingRoot: workspaceRoot,
  outputFileTracingIncludes: {
    "/*": ["./docs-config.yaml", "./docs/**/*"],
  },
  turbopack: {
    root: workspaceRoot,
  },
  env: {
    REACT_APP_BACKEND_BASE_URL: process.env.REACT_APP_BACKEND_BASE_URL
  }
};

export default nextConfig;
