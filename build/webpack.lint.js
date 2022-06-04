//КОНФИГ ДЛЯ ЛИНТЕРОВ
const path = require('path')
const merge = require('webpack-merge')
const paths = require('./pathsApp')
const parts = require('./webpack.parts')
const StylelintPlugin = require('stylelint-webpack-plugin')

const lintStylesOptions = {
  context: path.resolve(__dirname, `${paths.app}/styles`),
  syntax: 'scss',
  emitErrors: false,
  // fix: true,
}

const lintJSOptions = {
  emitWarning: true,
  // Fail only on errors
  failOnWarning: false,
  failOnError: true,

  // Toggle autofix
  fix: true,
  cache: true,

  formatter: require('eslint-friendly-formatter'),
}

module.exports = merge([
  {
    plugins: [new StylelintPlugin(lintStylesOptions)],
  },
  parts.lintJS({
    include: paths.app,
    options: lintJSOptions,
  }),
])
