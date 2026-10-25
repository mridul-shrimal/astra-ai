const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const sharedPath = path.resolve(__dirname, "../packages/shared");
const reactPath = path.resolve(__dirname, "../node_modules/react");

config.watchFolders = [...new Set([...(config.watchFolders || []), sharedPath])];
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "@astra/shared": sharedPath,
  react: reactPath,
  "react/jsx-runtime": path.join(reactPath, "jsx-runtime.js"),
  "react/jsx-dev-runtime": path.join(reactPath, "jsx-dev-runtime.js")
};

module.exports = config;
