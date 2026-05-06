/** @type {import('next').NextConfig} */
const nextConfig = {
  // Restart trigger
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Transpile monorepo packages
  transpilePackages: ['@bean/ui', '@bean/types'],

  // Strict React mode
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  serverExternalPackages: ['@prisma/client', 'openai'],
};

export default nextConfig;
