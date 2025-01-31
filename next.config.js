/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  webpack: (config) => {
    // Properly configure fallback with empty object
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
      util: false
    }

    return config
  },
}

module.exports = nextConfig 