/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure allowed image domains
  images: {
    domains: ["filedn.com", "play-lh.googleusercontent.com"],
  },
};

module.exports = nextConfig;
