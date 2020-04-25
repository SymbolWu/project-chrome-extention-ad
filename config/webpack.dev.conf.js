const merge = require('webpack-merge');
const webpack=require('webpack');
const baseConfig = require('./webpack.base.conf.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,//不跳转
    inline: true,//实时刷新
    port: 3000,
    hot: true  //开启热更新
  },
  plugins: [
    //热更新,不是刷新
    new webpack.HotModuleReplacementPlugin(),
  ],
});
