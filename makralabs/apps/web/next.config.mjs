/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@makralabs/ui", "@makralabs/utils", "@makralabs/types"],
  env: {
    REACT_APP_BACKEND_BASE_URL: process.env.REACT_APP_BACKEND_BASE_URL
  }
};

export default nextConfig;
