/* eslint-disable global-require */
import '../../../vendors/libs/normalize/normalize.css'
import '../../../scss/fonts.scss'
import '../../../scss/other/index.scss'
import '../../../scss/pages/browser-warning.scss'

if (process.env.NODE_ENV !== 'production') {
  require('./index.pug')
}
