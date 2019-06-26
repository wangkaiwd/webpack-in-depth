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
      // {
      //   test: /\.(png|jpg|jpeg|gif)$/, // 匹配 .png,.jpg,.jpeg,.gif结尾的文件
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         // placeholders: 
      //         //  [ext] 资源扩展名, 默认file.extname
      //         //  [name] 资源的基本名称, 默认file.basename
      //         //  [path] 资源相对于context的路径,默认file.dirname
      //         //  [hash] 内容的哈希值，默认md5
      //         name: '[name]_[hash].[ext]', // 为你的文件配置自定义文件名模板，默认值：'[hash].[ext]'
      //         outputPath: 'images/', // 为你的文件配置自定义的output输出目录：这里指定为打包目录下的images文件夹
      //       }
      //     }
      //   ]
      // },
      // url-loader的功能类似于`file-loader`，但是在文件大小(单位byte)低于指定的限制时，可以返回一个DataURL(base64)
      {
        test: /\.(png|jpg|jpeg|gif)$/, // 匹配 .png,.jpg,.jpeg,.gif结尾的文件
        use: [
          {
            loader: 'url-loader',
            options: {
              // placeholders: 
              //  [ext] 资源扩展名, 默认file.extname
              //  [name] 资源的基本名称, 默认file.basename
              //  [path] 资源相对于context的路径,默认file.dirname
              //  [hash] 内容的哈希值，默认md5
              name: '[name]_[hash].[ext]', // 为你的文件配置自定义文件名模板，默认值：'[hash].[ext]'
              outputPath: 'images/', // 为你的文件配置自定义的output输出目录：这里指定为打包目录下的images文件夹
              // 当限制的数值过大时，会返回很大的base64字符串
              limit: 8192, // 单位`byte`,文件小于8192kb时返回base64文件，大于这个限制时会返回地址
            }
          }
        ]
      },
      {
        test: /\.css$/,
        // 解析css文件的时候要用到2个loader
        // css-loader: 会帮我们分析出几个css文件之间的关系,最终把css合并成一个css文件
        // style-loader: 会将css-loader最终合成的css挂载到head下的style标签里
        // 所以是通过style标签添加css的一种方式
        use: ['style-loader','css-loader','sass-loader']
      }
    ]
  }
}