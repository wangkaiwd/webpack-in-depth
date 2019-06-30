const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
// 每次手动打包比较繁琐，可以通过Watch配置观察依赖文件(scr/)的变化，一旦有变化，则可以重新执行构建流程
module.exports = {
  mode: 'development', // 要为webpack指定打包模式来使用内置优化，不指定默认为`production`，但是会在命令行出现黄色警告
  // 简写：相当于 => entry: {main:'./src/main.js'}
  // entry: './src/main.js',
  entry: {
    // 配置入口文件
    main: './src/main.js',
    // sub: './src/main.js'
  },
  output: {
    // 对于单个入口起点，filename会是一个静态名称：filename: 'main.js'
    // filename: 'main.js'

    // 当通过多个入口起点、代码拆分(code splitting)或各种插件(plugin)创建多个bundle,应该使用以下方式，来赋予每个bundle一个唯一的名称
    // HtmlWebpackPlugin也会分别为我们自动引入打包好的每一个模块
    // 占位符placeholder: 
    //  [name]: 模块名称
    //  [hash]: 模块标识符(module identifier)的hash
    filename: '[name]_[hash].js',
    path: path.resolve(__dirname, './dist'),
    // 指定在浏览器中所引用的此输出目录对应的公开URL:具体表现就是在html的script的scr的地址增加了publicPath前缀：
    // https://cdn.example.com/assets/xxx
    // publicPath: 'https://cdn.example.com/assets/'
  },
  // sourceMap, source: 根源，本源
  // 它是一个映射关系，当打包代码报错后，会找到对应的源代码，并提示错误
  // 可以在开发的时候帮我们定位错误，而在打包部署时关闭，提升打包效率
  // @see: http://cheng.logdown.com/posts/2016/03/25/679045
  // cheap: 有没有列映射
  // module: 是否处理来自loader的映射
  // eval: 每一个模块使用eval和 // @ sourceURL来执行
  // inline: source map 转换为DataUrl后添加到bundle中
  // conclusion:  development: cheap-module-eval-source-map,   production: cheap-module-source-map:方便定位线上错误
  devtool: 'cheap-module-eval-source-map',
  // 为什么要是用devServer: 
  // 这些都是我们不使用server而使用本地file协议做不到的
  // 1. live reloading
  // 2. 方便我们内网联调，可以让其他人直接访问项目
  // 3. 可以实现接口代理，处理跨域
  devServer: {
    // 告诉服务器从哪里提供内容
    contentBase: path.resolve(__dirname, './dist'),
    // 是否自动打开浏览器
    open: true,
    // 配合webpack.HotModuleReplacement来实现模块热更新
    hot: true,
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
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      },
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
        test: /\.(svg|woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]',
              outputPath: 'fonts/'
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
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // 用于配置css-loader作用于@import的资源之前有多少个loader,确保对每个文件都应用postcss-loader和sass-loader
              importLoaders: 1,
              // 开启css模块化
              // modules: true
            }
          },
          'postcss-loader',
        ]
      },
      {
        test: /\.scss$/,
        // 解析css文件的时候要用到2个loader
        // css-loader: 会帮我们分析出几个css文件之间的关系,最终把css合并成一个css文件
        // style-loader: 会将css-loader最终合成的css挂载到head下的style标签里
        // 所以是通过style标签添加css的一种方式
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // 用于配置css-loader作用于@import的资源之前有多少个loader,确保对每个文件都应用postcss-loader和sass-loader
              importLoaders: 2,
              // 开启css模块化
              // modules: true
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
        // 在webpack中，loader的执行是有顺序的：从下到上，从右到左
        // 举例：打包sass文件时，会先通过sass-loader将scss文件处理成css文件，然后通过postcss-loaer为css规则添加供应商前缀，
        // 之后css问文件将所有css合并到一起通过style-loader以style标签的
        // 方式挂载到html页面中，实现样式的更改
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // HtmlWebpackPlugin插件会在打包结束后，自动生成一个html文件，并把打包生层的js文件自动引入到html中.
    // 这对于在文件名中包含每次会随着编译而发生变化哈希的webpack bundle（webpack打包文件）尤其有用
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
  ]
}