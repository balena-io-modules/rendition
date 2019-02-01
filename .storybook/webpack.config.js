module.exports = {
  name: 'client',
  target: 'web',
  resolve: {
    extensions: ['.wasm', '.ts', '.tsx', '.js', '.jsx', '.json']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.wasm$/,
        loaders: ['wasm-loader']
      },
      {
        test: /\.(t|j)sx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  }
}
