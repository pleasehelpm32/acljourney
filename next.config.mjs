/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Since you're using .mjs format, you need to explicitly set the module type
  output: "standalone",
};

export default nextConfig;
