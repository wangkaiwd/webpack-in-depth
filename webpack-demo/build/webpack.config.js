const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  entry: {
    main: './src/main.ts',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash].[ext]',
              outputPath: 'images/',
              limit: 8192,
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
      }
    ]
  },
  optimization: {
    splitChunks: { // spitChunks的参数在没有配置的情况下，会有一些默认配置： https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
      // chunks: 'async', // 用来优化打包生成`chunks`的配置,支持： 'all','async','initial'
      chunks: 'all',
      minSize: 30000, // 需要进行代码分割模块的chunk的最小体积，这里的意思是不会对小于30kb的模块进行打包。
      // minSize: 0,
      // maxSize: 0, // 当需要进行代码分割模块的体积超过该配置项时会继续进行拆分，一般情况我们不会对该项进行配置
      // 打包生成的chunks中，最少有几个chunk使用到了需要分割的模块
      minChunks: 1, // 模块被最少使用的次数，当小于该次数时不会进行代码分割
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        // 满足上述分组条件的时候会之下边的配置.
        // cacheGroups:大概意思就是说在进行代码打包的时候，会先将内容进行缓存，之后在根据下边的配置进行分组处理
        // 而不会说在我们引入多个模块时分别为每个模块生成打包文件
        vendors: { // 当打包代码满足test的正则时，该配置生效
          test: /[\\/]node_modules[\\/]/, // 检测import 引入的模块是否在node_modules下
          priority: -10, // 打包chunks的优先级，在满足分组条件后优先使用的分组打包方式
          // filename: 'vendors.js', // 将所有分割出来的文件生成到指定文件中
        },
        default: { // vendors中不满足test的正则的文件的代码分割在这里配置
          // minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          // filename: 'common.js'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      // 使用全局变量_来代替lodash: shimming globals:https://webpack.js.org/guides/shimming/#shimming-globals
      // 这样就不用再通import lodash
      // 一般不推荐这样使用，但是碰到一些不支持模块化的第三方文件可以用这种方法
      _: 'lodash'
    }),
    new webpack.DefinePlugin({

    })
  ]
}