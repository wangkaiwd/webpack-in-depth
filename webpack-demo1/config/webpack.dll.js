const path = require('path');
const webpack = require('webpack');
const absPath = (dir) => path.resolve(__dirname, dir);
module.exports = {
  mode: 'production',
  entry: {
    vendors: ['react', 'react-dom', 'lodash']
  },
  output: {
    path: absPath('../dll'),
    filename: '[name]_[hash].dll.js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      // name: 对应output中library暴露的全局变量，分析生成manifest.json
      name: "[name]_[hash]",
      path: path.resolve(__dirname, "../dll/manifest.json"),
    })
  ]
}