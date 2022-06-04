/* eslint-disable global-require */
const path = require('path')
// const minimist = require('minimist')
// const arguments = minimist(process.argv.slice(2))

const merge = require('webpack-merge')

const paths = require('./build/pathsApp')

// eslint-disable-next-line import/no-dynamic-require
const pages = require(paths.pages)
const parts = require('./build/webpack.parts')

// Общий конфиг
const commonConfig = require('./build/webpack.common')
// Конфиг для прода
const productionConfig = merge([
  {
    entry: {
      app: path.resolve(paths.app, 'js/'),
    },
    output: {
      path: paths.build,
      publicPath: parts.publicPath,
    },
  },
  require('./build/webpack.prod'),
  ...pages,
])
// Конфиг для разработки
const developmentConfig = merge([
  {
    entry: {
      app: path.resolve(paths.app, 'js/'),
    },
    output: {
      path: paths.build,
      publicPath: parts.publicPath,
    },
  },
  require('./build/webpack.dev'),
  ...pages,
])
// Конфиг линтеров
const lintConfig = require('./build/webpack.lint')

module.exports = (environment) => {
  process.env.NODE_ENV = environment
  // Проверка на прод или дев сборку
  const config = environment === 'production' ? productionConfig : developmentConfig

  // Проверка на линт или не линт
  const lint = environment === 'lint' ? lintConfig : null

  // Создаем итоговый конфиг
  return merge(commonConfig, lint, config)
}
