/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure allowed image domains with remotePatterns (more secure approach)
  images: {
    domains: [
      "filedn.com",
      "web-api.textin.com",
      "yycgbavlnjadwpsynqhl.supabase.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "filedn.com",
        pathname: "/lPmOLyYLDG0bQGSveFAL3WB/bjj%20logos/**",
      },
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "yycgbavlnjadwpsynqhl.supabase.co",
        pathname: "/storage/v1/object/public/events/**",
      },
    ],
  },
  // i18n configuration removed as it's not compatible with App Router
};

module.exports = nextConfig;
