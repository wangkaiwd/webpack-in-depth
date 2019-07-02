const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.config');
module.exports = Object.assign(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    open: true,
    hot: true,
  },
  optimization: {
    ...baseConfig.optimization,
    usedExports: true,
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin()
  ]
}) 