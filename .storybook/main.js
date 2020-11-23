const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
  'stories': [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(ts|tsx)'
  ],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials'
  ],
  webpackFinal: async (config, { configType }) => {
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: ['json']
      })
    )

    return config;
  },
}
