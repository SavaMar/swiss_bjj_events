/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure allowed image domains with remotePatterns (more secure approach)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "filedn.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
  // i18n configuration removed as it's not compatible with App Router
};

module.exports = nextConfig;
