const path = require('path');
module.exports = {
  mode: 'production', // 要为webpack指定打包模式来使用内置优化，不指定默认为`production`，但是会在命令行出现黄色警告
  // 简写：相当于 => entry: {main:'./src/main.js'}
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/, // 匹配 .png,.jpg,.jpeg,.gif结尾的文件
        use: [
          {
            loader: 'file-loader',
            options: {
              // placeholders: 
              name: '[name]_[hash].[ext]', // 为你的文件配置自定义文件名模板，默认值：'[hash].[ext]'
            }
          }
        ]
      }
    ]
  }
}