const merge = require('webpack-merge');
const baseConfig = require('./webpack.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = (env) => {
  return merge(baseConfig(env), {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
      new CleanWebpackPlugin(),
      env.MODE === 'analysis' && new BundleAnalyzerPlugin(),
    ].filter(Boolean)
  })
}