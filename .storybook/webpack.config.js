/* eslint-disable */

const path = require('path');

theme = path.join(__dirname, '../src/styles/theme.scss');

module.exports = {
  module: {
    loaders: [
      { test: /\.json$/, loader: "json"},
      {
        test: /\.module.scss$/,
        loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!sass-loader!sass-resources'
      },
      {
        test: /^((?!\.module).)*scss$/,
        loader: 'style!css!sass-loader'
      }
    ]
  },
  resolve: {
    alias: {
      ['theme.scss']: theme,
    }
  },
  sassResources: theme
};
