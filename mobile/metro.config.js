const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add any custom configuration here
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Optimize bundling
config.transformer = {
  ...config.transformer,
  minifierPath: 'metro-minify-terser',
  minifierConfig: {
    // Terser options
    compress: {
      drop_console: false,
    },
  },
};

// Increase max workers
config.maxWorkers = 4;

module.exports = config; 