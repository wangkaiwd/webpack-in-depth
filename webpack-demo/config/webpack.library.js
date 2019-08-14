const path = require('path');
const merge = require('webpack-merge');
const absPath = (dir) => path.resolve(__dirname, dir);
const baseConfig = require('./webpack.config')
module.exports = (env) => {
  return merge(baseConfig(env), {
    output: {
      library: 'MyTools', // 通过script引入库文件后，会添加一个全局变量MyTools,可以直接进行访问
      // umd: universal module definition,通用模块定义
      libraryTarget: 'umd' // 将你的library暴露为所有的模块定义下都可运行的方式
    },
    // 这里用户会自己安装loadsh
    externals: { // 防止将某些import的包(package.json)打包到bundle中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)
      lodash: {
        commonjs: 'lodash', // 可以作为一个CommonJS模块访问
        commonjs2: 'loadash', // 和commonjs类似，但是到出的是module.exports.default
        amd: 'lodash', // 类似于commonjs，但是使用AMD模块系统
        root: '_' // 全局变量访问
      }
    }
  })
}