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
  webpack: (config, { isServer }) => {
    // Stub out the WebGPU backend - we only use WebGL
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tensorflow/tfjs-backend-webgpu': false,
    };
    return config;
  },
};

export default nextConfig;
