module.exports = (api) => {
  const isProduction = api.cache(() => process.env.NODE_ENV === 'production')

  return {
    plugins: ['@babel/plugin-syntax-dynamic-import'],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'entry',
          // targets: {
          //   esmodules: !isProd
          // }
        },
      ],
    ],
  }
}
