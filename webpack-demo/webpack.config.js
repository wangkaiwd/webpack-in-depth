const path = require('path');
module.exports = {
  mode: 'production', // 要为webpack指定打包模式来使用内置优化，不指定默认为`production`，但是会在命令行出现黄色警告
  // 简写：相当于 => entry: {main:'./src/main.js'}
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist')
  }
}