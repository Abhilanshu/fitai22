import type { NextConfig } from "next";

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

  // ─── Webpack config (used for production builds) ──────────────────────────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    // Exclude @mediapipe/pose from webpack bundling.
    // @tensorflow-models/pose-detection imports it, but we use MoveNet
    // which doesn't actually need it at runtime.
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : []),
      { '@mediapipe/pose': 'MPPose' },
    ];

    return config;
  },

  // ─── Turbopack config (used for `next dev`) ───────────────────────────────
  // Keep separate so Turbopack doesn't error on the mediapipe import either.
  turbopack: {
    resolveAlias: {
      '@mediapipe/pose': { browser: false },
    },
  },
};

export default nextConfig;
