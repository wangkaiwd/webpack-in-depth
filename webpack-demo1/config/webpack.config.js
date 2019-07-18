const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const absPath = (dir) => path.resolve(__dirname, dir)
module.exports = {
  entry: {
    main: absPath('../src/main.js') // 入口文件对应的源代码位置，key值为打包生成后的chunkNames
  },
  output: {
    path: absPath('../dist'), // 打包生成文件存放的位置
    // 使用每次构建过程中，唯一的hash生成
    filename: '[name]_[hash:8].js', // 每个打包输出文件的名称
    // publicPath: 'https://cdn.example.com/assets/', // 会在引入的资源前加入该路径，例：将资源托管到cnd
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // 开启css模块化
              modules: true,
              // 在css-loader前应用的loader的数量：确保在使用import语法前先经过sass-loader和postcss-loader的处理
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         // placeholders:
      //         //    [ext]: 资源扩展名,默认file.extname
      //         //    [name]: 资源的基本名称,默认file.basename
      //         //    [hash]: 内容hash值,默认md5
      //         //    [path]: 资源相对于context的路径,默认值file.dirname
      //         // 默认值： [hash].[ext]
      //         name: '[name]_[hash:8].[ext]',
      //         // 打包文件存放到出口目录下的images文件中
      //         outputPath: 'images/'
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // placeholders:
              //    [ext]: 资源扩展名,默认file.extname
              //    [name]: 资源的基本名称,默认file.basename
              //    [hash]: 内容hash值,默认md5
              //    [path]: 资源相对于context的路径,默认值file.dirname
              // 默认值： [hash].[ext]
              name: '[name]_[hash:8].[ext]',
              // 打包文件存放到出口目录下的images文件中
              outputPath: 'images/',
              limit: 8192, // 单位byte,文件小于8kb时返回base64文件，大于这个限制会返回地址
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 自动引入打包后的文件到html中：
    //    对于每次打包都会重新通过hash值来生成文件名的情况特别适用
    //    也可以通过template来生成一个我们自己定义的html模板，然后帮我们把打包后生成的文件引入
    new HtmlWebpackPlugin({
      filename: 'index.html', // 生成html文件的文件名
      template: absPath('../index.html') // 使用的html模板
    })
  ]
};