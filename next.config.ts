import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid bundling native sqlite3 and sequelize native modules
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      // Mark sqlite3 and sequelize as external so they load from node_modules at runtime
      if (Array.isArray(config.externals)) {
        config.externals.push('sqlite3', 'sequelize');
      } else {
        config.externals = ['sqlite3', 'sequelize'];
      }
    }
    return config;
  },
};

export default nextConfig;
