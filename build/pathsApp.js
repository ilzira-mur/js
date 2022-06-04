const path = require('path');
const minimist = require('minimist');
const arguments = minimist(process.argv.slice(2));

let paths = {};
/*
  Перемещение всех ресурсов в статическую папку
  getPaths({ staticDir: 'some-name' })

  Переименование папки
  getPaths({ js: 'some-name' })

  Перемещение ресурсов в корневую папку сборки
  getPaths({ css: '' })

  Значение по умолчанию:
     sourceDir - 'app',
      buildDir - 'dist',
     staticDir - '',

        images - 'images',
         fonts - 'fonts',
           css - 'styles',
            js - 'scripts'
*/

function getPaths({
  sourceDir = 'app',
  buildDir = 'dist',
  assetsDir = '',
  images = 'images',
  fonts = 'fonts',
  js = 'scripts',
  css = 'styles',
  pages = 'pages'
} = {}) {
  const assets = {
    images,
    fonts,
    js,
    css
  };

  return Object.keys(assets).reduce(
    (obj, assetName) => {
      const assetPath = assets[assetName];

      obj[assetName] = !assetsDir ? assetPath : `${assetsDir}/${assetPath}`;

      return obj;
    }, {
      app: path.join(path.dirname(__dirname), sourceDir),
      build: path.join(path.dirname(__dirname), buildDir),
      pages: path.join(__dirname, pages),
      assetsDir
    }
  );
}


if (arguments.buildStatus == 'project') {
  paths = Object.assign(getPaths(), {
    mainApp: getPaths()
  });
} else if (arguments.buildStatus == 'ui-kit') {
  paths = Object.assign(
    getPaths({
      sourceDir: 'app-ui',
      buildDir: 'dist-ui',
      pages: 'pages-ui',
    }), {
      mainApp: getPaths()
    }
  )
}



module.exports = paths;
