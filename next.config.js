/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack configuration for better module resolution
  webpack: (config, { isServer }) => {
    // Ensure proper resolution of path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
