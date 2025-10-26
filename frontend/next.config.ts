import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Image optimization configuration
  images: {
    unoptimized: true, // Disable image optimization for Vercel free tier
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    
    // Suppress warnings for React Native modules used by MetaMask SDK
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
    };
    
    // Ignore specific warnings
    config.ignoreWarnings = [
      { module: /node_modules\/@metamask\/sdk/ },
    ];
    
    return config;
  },
};

export default nextConfig;
