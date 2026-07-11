module.exports = {
  presets: ['module:@react-native/babel-preset'],
  overrides: [
    {
      test: /\.js$/,
      plugins: ['@babel/plugin-transform-flow-strip-types'],
    },
  ],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};
