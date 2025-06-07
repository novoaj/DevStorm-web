/** @type {import('next').NextConfig} */
import NextBundleAnalyzer from '@next/bundle-analyzer';
const nextConfig = {
    experimental: {
    // Enable the new caching behavior
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic routes
      static: 180, // 3 minutes for static routes
    },
  },
};


const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  })
   
export default withBundleAnalyzer(nextConfig)