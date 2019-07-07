const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.config');
const merge = require('webpack-merge')
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
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
          'style-loader',
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
    usedExports: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}) 