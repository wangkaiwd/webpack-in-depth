const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
module.exports = {
  entry: {
    main: './src/main.tsx',
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          // 通过syncLoader将js文件中的webpack同步替换为webpack-loader
          // 然后通过syncLoader将js中的webpack-loader异步替换为options中的name属性
          // {
          //   loader: absPath('../loaders/asyncLoader'),
          //   options: {
          //     name: 'wangkaiwd'
          //   }
          // },
          // {
          //   loader: absPath('../loaders/syncLoader'),
          // }
        ],

      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
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
              name: '[name]_[hash:8].[ext]',
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
      inject: true,
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
    new FriendlyErrorsWebpackPlugin(),
    // new AddAssetHtmlPlugin({
    //   filepath: path.resolve(__dirname, '../dll/*.dll.js'),
    // }),
    // new webpack.DllReferencePlugin({
    //   // 会在webpack.dll.js中output中设置的library暴露的全局变量中去寻找，为项目中引入模块的地方进行提供相应的文件
    //   manifest: require(path.resolve(__dirname, '../dll/manifest.json')),
    // })
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundle to index.html
      debug: true,
      filename: '[name]_[hash].js',
      path: './dll',
      entry: {
        vendor: [
          'react', 'react-dom', 'lodash'
        ]
      }
    })
  ]
};
