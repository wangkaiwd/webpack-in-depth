const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js' // 入口文件对应的源代码位置，key值为打包生成后的chunkNames
  },
  output: {
    path: path.resolve(__dirname, './dist'), // 打包生成文件存放的位置
    // 使用每次构建过程中，唯一的hash生成
    filename: '[name]_[hash].js', // 每个打包输出文件的名称
    // publicPath: 'https://cdn.example.com/assets/', // 会在引入的资源前加入该路径，例：将资源托管到cnd
  }
}