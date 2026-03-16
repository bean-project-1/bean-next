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
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },

  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

export default nextConfig;
