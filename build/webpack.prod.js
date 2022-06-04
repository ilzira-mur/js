const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const { StatsWriterPlugin } = require('webpack-stats-plugin')

const parts = require('./webpack.parts')
const paths = require('./pathsApp')

module.exports = merge([
  {
    mode: 'production',
    output: {
      chunkFilename: `${paths.js}/[name].[chunkhash:4].js`,
      filename: `${paths.js}/[name].[chunkhash:4].js`,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules|custom[\\/]/,
            name: 'vendors',
            enforce: true,
            chunks: 'all',
          },
          // commons: {
          //   name: 'commons',
          //   chunks: 'all',
          //   minChunks: 2,
          //   enforce: true
          // }
        },
      },
      runtimeChunk: 'single',
    },

    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000, // in bytes
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': require('./config/prod.env'),
      }),
      new StatsWriterPlugin({
        fields: null,
        filename: '../stats.json',
      }),
      new webpack.HashedModuleIdsPlugin({
        hashFunction: 'md4',
        hashDigest: 'base64',
        hashDigestLength: 8,
      }),
      new ManifestPlugin(),
      new CleanPlugin(paths.build, {
        root: path.dirname(paths.build),
      }),
    ],
  },

  parts.minifyJS({
    terserOptions: {
      parse: {
        ecma: 8,
      },
      compress: {
        ecma: 5,
        warnings: false,
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true,
      },
    },

    parallel: true,
    cache: true,
  }),
  parts.loadJS({
    options: {
      cacheDirectory: true,
    },
  }),
  parts.extractCSS({
    use: [parts.postcssPlugins(), parts.cssUrlLoader, parts.cssPreprocessorLoader.scssDefault],
    options: {
      filename: `${paths.css}/[name].[contenthash:4].css`,
      chunkFilename: `${paths.css}/[name].[contenthash:4].css`,
    },
  }),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
    },
  }),
  parts.loadImages({
    exclude: [
      path.resolve(paths.app, 'svg-sprite/'),
      path.resolve(paths.app, '../app/svg-sprite/'),
    ],
    options: {
      limit: 1024,
      name: `${paths.images}/[name].[hash:8].[ext]`,
    },
  }),
  parts.optimizeImages(),
])
