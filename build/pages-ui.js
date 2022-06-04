const path = require('path')

const parts = require('./webpack.parts')

const paths = require('./pathsApp')

module.exports = [
  parts.page({
    title: 'index',
    path: 'pages/index',
    entry: {
      blockList: path.join(paths.app, 'pug/pages/index')
    },
    template: path.join(paths.app, 'pug/pages/index/index.pug'),

    // Подключаемые зависимости на страницу
    chunks: ['runtime', 'vendors', 'app', 'blockList']
  })
]
