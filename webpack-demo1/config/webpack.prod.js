const merge = require('webpack-merge');
const baseConfig = require('./webpack.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxPlugin = require('workbox-webpack-plugin');
module.exports = (env) => {
  return merge(baseConfig(env), {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
      new CleanWebpackPlugin(),
      env.MODE === 'analysis' && new BundleAnalyzerPlugin(),
      new WorkboxPlugin.GenerateSW({
        // 这些选项帮助 ServiceWorkers 快速启用
        // 不允许遗留任何“旧的” ServiceWorkers
        clientsClaim: true,
        skipWaiting: true
      })
    ].filter(Boolean)
  })
}