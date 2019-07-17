const path = require('path');
const merge = require('webpack-merge');
const absPath = (dir) => path.resolve(__dirname, dir);
const webpack = require('webpack');
const baseConfig = require('./webpack.config')
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
    contentBase: absPath('../dist'),
    // 是否在启动服务时自动打开浏览器
    open: true,
    // 端口在没有设置的时候默认为8080
    port: 3000,
    // 启用webpack的模块热替换特性
    hot: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})