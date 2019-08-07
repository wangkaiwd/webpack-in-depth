const path = require('path');
const webpack = require('webpack');
const absPath = (dir) => path.resolve(__dirname, dir);
const package = require('../package.json');
const generateVendor = () => {
  const result = {};
  Object.keys(package.dependencies).forEach(item => {
    let temp = item;
    if (item.includes('-')) {
      temp = item.replace('-', '')
    }
    result[temp] = [item]
  })
  return result;
}
module.exports = {
  mode: 'production',
  entry: {
    ...generateVendor()
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
      path: absPath("../dll/manifest.json"),
    })
  ]
}