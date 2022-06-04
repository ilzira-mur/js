//КОНФИГ ДЛЯ РАЗРАБОТКИ
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const paths = require('./pathsApp')
const parts = require('./webpack.parts')

module.exports = merge([
  {
    mode: 'development',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': require('./config/dev.env'),
      }),
    ],
  },
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS({
    use: [parts.postcssPlugins(), parts.cssUrlLoader, parts.cssPreprocessorLoader.scssDefault],
  }),
  parts.loadImages({
    exclude: [
      path.resolve(paths.app, 'svg-sprite/'),
      path.resolve(paths.app, '../app/svg-sprite/'),
    ],
  }),
  parts.loadJS({}),
])
