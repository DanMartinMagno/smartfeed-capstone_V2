const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
  resolver: {
    blockList: exclusionList([
      // Exclude any project-specific files you want here, if necessary
    ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    assetRegistryPath: "react-native/Libraries/Image/AssetRegistry", // This line is okay to keep
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
