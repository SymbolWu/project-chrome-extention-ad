const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const resolve = dir => path.resolve(__dirname, '..', dir);
module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.[hash].js',
    path: path.join(__dirname, '../build')
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]'
              },
            },
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin([{
      from: path.resolve(__dirname, "../public"),
      to: '../build',
      ignore: ['*.html']
  }]),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    // 设置别名
    alias: {
      '@': resolve('src')// 这样配置后 @ 可以指向 src 目录
    }
  }
};
