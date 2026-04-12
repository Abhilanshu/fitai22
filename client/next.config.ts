import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@tensorflow/tfjs', '@tensorflow-models/pose-detection'],

  // Removed rewrites() proxy to prevent 508 loop errors on Render
  // The frontend now makes direct requests to the backend API via NEXT_PUBLIC_API_URL.

  // ─── Webpack config (used when Turbopack is NOT active) ──────────────────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    // Instead of externalizing and causing ReferenceErrors, alias it to the mock file!
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mediapipe/pose': require('path').resolve(__dirname, 'mocks/mediapipe-pose.js'),
    };

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
