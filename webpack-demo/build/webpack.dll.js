const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  mode: 'production',
  entry: {
    vendors: ['react', 'react-dom', 'lodash']
  },
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: '[name]_[hash].dll.js',
    library: '[name]_[hash]'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      // name: 对应output中library暴露的全局变量，分析生成manifest.json
      name: "[name]_[hash]",
      path: path.resolve(__dirname, "../dll/manifest.json"),
    })
  ]
}