// load the default config generator.
const genDefaultConfig = require('@kadira/storybook/dist/server/config/defaults/webpack.config.js');

module.exports = function(config, env) {
  config = genDefaultConfig(config, env);

  // Add the sass loader
  config.module.loaders.push(
    {
      test: /\.scss$/,
      loaders: [
      'style-loader',
      'css-loader',
      'resolve-url-loader',
      'sass-loader?sourceMap'
      ]
    }
  );

  return config;
};
