const baseConfig = require('./webpack.config');
const path = require('path')
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 每次手动打包比较繁琐，可以通过Watch配置观察依赖文件(scr/)的变化，一旦有变化，则可以重新执行构建流程
module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          'postcss-loader',
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      // 对css文件进行压缩
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    // HtmlWebpackPlugin会帮我们动态的通过link标签来引入打包好的css
    new MiniCssExtractPlugin({
      filename: '[name]_[hash:8].css',
      chunkFilename: '[name]_[hash:8]_chunk.css'
    })
  ]
}) 