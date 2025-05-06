/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ['@chakra-ui/react', '@chakra-ui/next-js'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'http', hostname: 'tong.visitkorea.or.kr' },
      { protocol: 'https', hostname: 'tong.visitkorea.or.kr' },
      { protocol: 'https', hostname: 'api.visitkorea.or.kr' },
      { protocol: 'https', hostname: 'korean.visitkorea.or.kr' },
      { protocol: 'https', hostname: 'www.visitkorea.or.kr' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' }
    ],
    domains: ['cdn.pixabay.com', 'apis.data.go.kr', 'tong.visitkorea.or.kr', '43.200.177.95'],
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://3.39.0.103/api/:path*', // 실제 API 서버
      },
    ];
  },
}

module.exports = nextConfig;
