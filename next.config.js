/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production
  output: 'standalone',
  
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Compress images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Reduce memory usage during build
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize for production builds
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Disable source maps in production to save space
  productionBrowserSourceMaps: false,
  
  // Optimize CSS
  swcMinify: true,
  
  // Reduce memory usage
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;