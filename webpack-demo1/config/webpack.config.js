const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const absPath = (dir) => path.resolve(__dirname, dir);
module.exports = (env) => {
  return {
    entry: {
      main: absPath('../src/main.tsx') // 入口文件对应的源代码位置，key值为打包生成后的chunkNames
    },
    output: {
      path: absPath('../dist'), // 打包生成文件存放的位置
      // 使用每次构建过程中，唯一的hash生成
      filename: 'static/js/[name]_[hash:8].js', // 每个打包输出文件的名称
      chunkFilename: 'static/js/[name]_[hash:8]_chunk.js', // 非入口chunk文件的名称(及通过代码分割从入口文件分割出来的文件打包名称)
      // publicPath: 'https://cdn.example.com/assets/', // 会在引入的资源前加入该路径，例：将资源托管到cnd
    },
    stats: 'errors-only',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ]
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
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
    optimization: {
      splitChunks: {
        // 代码分割的类型，可以设置为'all','async','initial',默认是'async`
        // 'all': 对同步和异步引入模块都进行代码分割
        // 'async: 只对异步引入模块进行代码分割
        // 'initial': 只对同步代码进行代码分割
        chunks: 'all',
        // 代码分割模块的最小大小要求，不满足不会进行分割，单位byte
        minSize: 30000,
        // 如果分割模块大于该值，还会再继续分割，0表示不限制大小
        maxSize: 0,
        // 最小被引用次数，只有在模块上述条件并且至少被引用过一次才会进行分割
        minChunks: 1,
        // 最大的异步按需加载次数
        maxAsyncRequests: 5,
        // 最大的同步按需加载次数
        maxInitialRequests: 3,
        // 分割模块打包chunk文件名分割符：'~'
        automaticNameDelimiter: '~',
        automaticNameMaxLength: 30,
        // 分割文件名，设置为true会自动生成
        name: true,
        cacheGroups: { // 缓存组
          vendors: {
            // 分割模块匹配条件
            test: /[\\/]node_modules[\\/]/,
            // 权重
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            // 是否使用已有的chunk，设置为true表示如果使用到的文件已经被分割过了
            // 就不会再进行分割，生成新的分割文件
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      // 自动引入打包后的文件到html中：
      //    对于每次打包都会重新通过hash值来生成文件名的情况特别适用
      //    也可以通过template来生成一个我们自己定义的html模板，然后帮我们把打包后生成的文件引入
      new HtmlWebpackPlugin({
        filename: 'index.html', // 生成html文件的文件名
        template: absPath('../index.html') // 使用的html模板
      }),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name]_[hash:8].css',
        chunkFilename: 'static/css/[name]_[hash:8]_chunk.css',
      }),
      new webpack.DefinePlugin({
        // 写法规定：可以使用 '"production"' 或者使用 JSON.string('production')
        'process.env.MODE': JSON.stringify(`${env.MODE}`)
      }),
      new FriendlyErrorsWebpackPlugin(),
      new webpack.DllReferencePlugin({
        manifest: require(absPath('../dll/manifest.json'))
      })
    ]
  };
};
