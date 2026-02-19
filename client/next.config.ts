import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@tensorflow/tfjs', '@tensorflow-models/pose-detection', '@tensorflow/tfjs-backend-webgpu'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5002/api/:path*',
      },
    ];
  },
};

export default nextConfig;
