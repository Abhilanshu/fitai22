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

  // ─── Webpack config (used when Turbopack is NOT active) ──────────────────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    // Exclude @mediapipe/pose from webpack bundling.
    // @tensorflow-models/pose-detection imports it, but MoveNet doesn't need it.
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : []),
      { '@mediapipe/pose': 'MPPose' },
    ];

    return config;
  },

  // ─── Turbopack config (Next.js 16 uses this for both dev & production) ───
  turbopack: {
    resolveAlias: {
      // Redirect @mediapipe/pose to an empty mock module.
      // MoveNet doesn't need MediaPipe at runtime — only BlazePose does.
      '@mediapipe/pose': './mocks/mediapipe-pose.js',
    },
  },
};

export default nextConfig;
