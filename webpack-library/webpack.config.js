const path = require('path')
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    //  打包生成库
    library: 'library', // 通过script标签引入之后添加一个全局变量library，可以直接访问
    libraryTarget: 'umd', // umd: 将library暴露为所有的模块定义下都可运行的方式
  },
  // externals: 外面的，外部的
  //  该配置项提供了从输出的bundle中排除依赖的方法
  //  例：
  //    1. 有些项目中的依赖要通过cdn来进行来加载，所以需要在打包时排除
  //    2. 自己写第三方库的时候需要将内部的依赖进行排除，让用户自己安装
  //    3. 配置DLL插件,将一些不会变的依赖进行排除
  externals: {
    lodash: 'lodash'
  }
}