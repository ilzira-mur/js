const requireAll = (r) => r.keys().forEach(r)
// include svg-sprite
requireAll(require.context('./', true, /\.svg$/))
