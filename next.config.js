require('dotenv').config({ path: './.env.local' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.com').hostname,
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      // Compatibilidade: URLs antigas como /storage/... passam a servir via /api/storage
      { source: '/storage/:path*', destination: '/api/storage/:path*' },
    ];
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
};

module.exports = nextConfig;
