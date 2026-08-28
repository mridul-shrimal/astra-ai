const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const reactPath = path.resolve(__dirname, 'node_modules/react');
const sharedPath = path.resolve(__dirname, '../packages/shared');

config.watchFolders = [sharedPath];

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),

  // Force one React version for the mobile app
  react: reactPath,
  'react/jsx-runtime': path.join(reactPath, 'jsx-runtime.js'),
  'react/jsx-dev-runtime': path.join(reactPath, 'jsx-dev-runtime.js'),

  // Shared workspace
  '@astra/shared': sharedPath,
};

module.exports = config;