import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ['@tensorflow/tfjs', '@tensorflow-models/pose-detection'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname, '..'),
    resolveAlias: {
      '@tensorflow/tfjs-backend-webgpu': { browser: '' },
    },
  },
};

export default nextConfig;


