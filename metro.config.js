const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Support .cjs files that some npm packages ship (like @iabtcf/core)
config.resolver.sourceExts = [
  'cjs',
  ...(config.resolver.sourceExts || []),
];

// On web, stub out react-native-google-mobile-ads (requires native code)
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-google-mobile-ads') {
    return {
      filePath: path.resolve(__dirname, 'mocks/react-native-google-mobile-ads.js'),
      type: 'sourceFile',
    };
  }
  // Fall through to default resolver
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
