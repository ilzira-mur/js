const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const globImporter = require('node-sass-glob-importer')
const pxtoremOpts = {
  rootValue: 16,
  unitPrecision: 5,
  propList: ['*', '!background-position'],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0,
}
const publicPath = ''

exports.publicPath = publicPath

exports.extractPug = ({ include, exclude, contextFolder, options, nameFile }) => ({
  module: {
    rules: [
      {
        test: /\.pug$/,
        include,
        exclude,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: nameFile,
              context: contextFolder,
            },
          },
          {
            loader: 'extract-loader',
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'html-loader',
            options: {
              attrs: [''],
              interpolate: true,
            },
          },
          {
            loader: 'pug-html-loader',
            options,
          },
        ],
      },
    ],
  },
})

exports.loadPug = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.pug$/,
        include,
        exclude,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: [''],
              interpolate: true,
            },
          },
          {
            loader: 'pug-html-loader',
            options,
          },
        ],
      },
    ],
  },
})

exports.loadPlainPug = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.pug$/,
        include,
        exclude,
        loader: 'pug-plain-loader',
      },
    ],
  },
})

exports.loadSvgIcons = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.svg$/,
        include,
        exclude,
        use: [
          'svg-sprite-loader',
          {
            loader: 'svgo-loader',
            options,
          },
        ],
      },
    ],
  },
})

exports.lintJS = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        enforce: 'pre',
        loader: 'eslint-loader',
        options,
      },
    ],
  },
})

//CSS
exports.cssUrlLoader = {
  loader: 'resolve-url-loader',
}

exports.cssPreprocessorLoader = {
  scssFast: {
    loader: 'fast-sass-loader',
  },
  scssDefault: {
    loader: 'sass-loader',
    options: {
      importer: globImporter(),
      sourceMap: true,
    },
  },
}

exports.postcssPlugins = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: [autoprefixer, pxtorem(pxtoremOpts)],
  },
})

exports.minifyCSS = ({ options }) => ({
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: options,
        canPrint: true, // false for analyzer
      }),
    ],
  },
})
const sharedCSSLoaders = [
  {
    loader: 'css-loader',
    options: {
      localIdentName: '[hash:base64:5]',
    },
  },
]

exports.loadCSS = ({ include, exclude, use } = {}) => ({
  module: {
    rules: [
      {
        test: /\.s?css$/,

        include,
        exclude,

        use: [
          {
            loader: 'style-loader',
          },
          ...sharedCSSLoaders.concat(use),
        ],
      },
    ],
  },
})

exports.extractCSS = ({ include, exclude, options, use = [] } = {}) => ({
  module: {
    rules: [
      {
        test: /\.s?css$/,

        include,
        exclude,

        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          ...sharedCSSLoaders,
          ...use,
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin(options)],
})
exports.extractStylus = ({ include, exclude, options, use = [] } = {}) => ({
  module: {
    rules: [
      {
        test: /\.styl$/,

        include,
        exclude,

        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          ...sharedCSSLoaders,
          ...use,
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin(options)],
})
//CSS

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|png|jpg|svg)$/,

        include,
        exclude,

        use: {
          loader: 'url-loader',
          options,
        },
      },
    ],
  },
})

exports.optimizeImages = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,

        include,
        exclude,

        use: {
          loader: 'image-webpack-loader',

          options: {
            svgo: {},
            mozjpeg: {
              progressive: true,
              quality: 65,
            },
            optipng: {
              enabled: false,
            },
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
            gifsicle: {
              interlaced: false,
            },
            webp: {
              quality: 75,
            },
          },
        },
      },
    ],
  },
})

exports.loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        // Capture eot, ttf, woff, and woff2
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,

        include,
        exclude,

        use: {
          loader: 'file-loader',
          options,
        },
      },
    ],
  },
})

exports.loadJS = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.js$/,

        include,
        exclude,

        loader: 'babel-loader',
        options,
      },
    ],
  },
})

exports.minifyJS = (options) => ({
  optimization: {
    minimizer: [new TerserPlugin(options)],
  },
})

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    watchOptions: {
      ignored: /node_modules/,
    },
    publicPath,
    // Enable history API fallback so HTML5 History API based
    // routing works. Good for complex setups.
    historyApiFallback: true,

    // Display only errors to reduce the amount of output.
    stats: 'errors-only',

    // Parse host and port from env to allow customization.
    //
    // If you use Docker, Vagrant or Cloud9, set
    // host: options.host || '0.0.0.0';
    //
    // 0.0.0.0 is available to all network devices
    // unlike default `localhost`.
    host, // Defaults to `localhost`
    port, // Defaults to 8080

    // overlay: true is equivalent
    overlay: {
      errors: true,
      warnings: false,
    },
  },
})

exports.page = ({
  path = '',
  template = require.resolve('html-webpack-plugin/default_index.ejs'),
  title,
  entry,
  chunks,
} = {}) => ({
  entry,
  plugins: [
    new HtmlWebpackPlugin({
      filename: `${path && path.split('/').pop()}.html`,
      template,
      title,
      chunks,
    }),
  ],
})
