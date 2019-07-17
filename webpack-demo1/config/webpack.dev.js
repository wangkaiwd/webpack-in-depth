const merge = require('webpack-merge');
const baseConfig = require('./webpack.config')
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map'
})