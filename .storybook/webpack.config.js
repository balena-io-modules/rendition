module.exports = {
  name: 'client',
  target: 'web',
  resolve: {
    extensions: ['.js', 'jsx'],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
