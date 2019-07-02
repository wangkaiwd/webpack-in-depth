const baseConfig = require('./webpack.config');
// 每次手动打包比较繁琐，可以通过Watch配置观察依赖文件(scr/)的变化，一旦有变化，则可以重新执行构建流程
module.exports = Object.assign(baseConfig, {
  mode: 'production',
  devtool: 'cheap-module-source-map'
}) 