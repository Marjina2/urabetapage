/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Explicitly disable app directory
  experimental: {
    appDir: false
  }
}

module.exports = nextConfig 