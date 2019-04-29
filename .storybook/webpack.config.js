module.exports = (defaultConfig) => {
  defaultConfig.resolve.alias['jellyschema'] = 'jellyschema/jellyschema'
  defaultConfig.resolve.alias['balena-temen'] = 'balena-temen/balena_temen'

  defaultConfig.resolve.extensions.push('.ts')
  defaultConfig.resolve.extensions.push('.tsx')
  defaultConfig.resolve.extensions.push('.wasm')
  defaultConfig.module.rules.push(
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }
  )
  defaultConfig.module.rules.push(
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
    }
  )
  defaultConfig.module.rules.push(
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
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

  defaultConfig.externals = [
    {
      xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
    }
  ]

  return defaultConfig
}
