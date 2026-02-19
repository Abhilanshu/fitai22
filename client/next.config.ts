import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@tensorflow/tfjs', '@tensorflow-models/pose-detection'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5002/api/:path*',
      },
    ];
  },
  turbopack: {
    root: '../',
    resolveAlias: {
      '@tensorflow/tfjs-backend-webgpu': { browser: '' },
    },
  },
};

export default nextConfig;

