// load the default config generator.
var genDefaultConfig = require('@kadira/storybook/dist/server/config/defaults/webpack.config.js');

module.exports = function(config, env) {
  config = genDefaultConfig(config, env);

  // Add the less loader
  config.module.loaders.push(
    { test: /\.less$/, loaders: [ 'style-loader', 'css-loader', 'less-loader' ] }
  );

  return config;
};
