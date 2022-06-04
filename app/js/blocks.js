const requireAll = (r) => r.keys().forEach(r)

// include blocks
requireAll(require.context('../blocks/', true, /scripts\.js$/))
