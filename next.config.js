/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Ensure path mapping works correctly
    esmExternals: true,
  },
  // Ensure all files are included
  output: 'standalone',
};

module.exports = nextConfig;
