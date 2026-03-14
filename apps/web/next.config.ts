import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Transpile monorepo packages
  transpilePackages: ['@bean/ui', '@bean/types'],

  // Strict React mode
  reactStrictMode: true,

  // Image optimization (add domains as needed)
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },

  // Experimental features
  experimental: {
    // Server Components
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
};

export default nextConfig;
