const path = require('path');
const webpack = require('webpack');
const absPath = (dir) => path.resolve(__dirname, dir);
const package = require('../package.json');
module.exports = {
  mode: 'production',
  entry: {
    // 将所有生产环境依赖项都进行提前打包：react,react-dom,lodash,dayjs,core-js
    vendor: Object.keys(package.dependencies)
  },
  // 设置打包生成文件存放目录
  output: {
    path: absPath('../dll'),
    filename: '[name]_[hash].dll.js',
    // 这里要将打包内容进行暴露
    library: '[name]_[hash]'
  },
  plugins: [
    // 
    new webpack.DllPlugin({
      // name: 对应output中library暴露的全局变量，分析生成manifest.json
      name: "[name]_[hash]",
      path: absPath("../dll/manifest.json"),
    })
  ]
}