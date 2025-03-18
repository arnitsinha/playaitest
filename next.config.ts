import type { NextConfig } from 'next';

const config: NextConfig = {
  webpack: (config) => {
    // Support for PDF.js
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default config;