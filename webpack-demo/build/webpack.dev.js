const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.config');
const merge = require('webpack-merge')
module.exports = (env) => {
  return merge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      contentBase: path.resolve(__dirname, './dist'),
      open: true,
      hot: true,
    },
    output: {
      filename: '[name]_[hash].js',
      chunkFilename: '[name]_[hash]_chunk.js', // 从入口文件中通过CodeSplitting分割出来的文件名称
      path: path.resolve(__dirname, '../dist'),
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.MODE': JSON.stringify(`${env.mode}`)
      })
    ]
  })
}