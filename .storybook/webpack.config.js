module.exports = ({config}) => {
  config.module.rules = config.module.rules.filter(x => !(x.query && x.query.name.includes('static/media')))

  config.resolve.extensions.push('.ts')
  config.resolve.extensions.push('.tsx')
  config.resolve.extensions.push('.wasm')
  config.module.rules.push(
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }
  )

  config.module.rules.push(
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
    }
  )

  config.module.rules.push(
    {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }]
    }
  )

  return config
}
