/** @type {import('next').NextConfig} */
import { resolve } from 'path';

const nextConfig = {
  transpilePackages: ['@chakra-ui/react', '@chakra-ui/next-js'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'http',
        hostname: 'tong.visitkorea.or.kr',
      },
      {
        protocol: 'https',
        hostname: 'tong.visitkorea.or.kr',
      },
      {
        protocol: 'https',
        hostname: 'api.visitkorea.or.kr',
      },
      {
        protocol: 'https',
        hostname: 'korean.visitkorea.or.kr',
      },
      {
        protocol: 'https',
        hostname: 'www.visitkorea.or.kr',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      }
    ],
    domains: ['cdn.pixabay.com', 'apis.data.go.kr'],
    unoptimized: true
  },
  experimental: {
    // Enable App Router with Server Components
    appDir: true,
    // Enable Turbopack
    turbo: {},
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, 'src'),
    };
    return config;
  },
}

export default nextConfig; 