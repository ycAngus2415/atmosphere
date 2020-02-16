const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // JavaScript 执行入口文件
  target: 'web',
  entry: {
  	app: './app.js',
  	vendor: ['./lib/jquery-2.1.1/jquery.min.js','./lib/Cesium/Sandcastle/Sandcastle-header.js','./lib/netcdfjs.js'],
  },
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: '[name].js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  module: {
        rules: [{
            test: /\.js$/,
            loader: "babel-loader",
        }]

    },
  plugins: [
  	new webpack.ProvidePlugin({
            $: path.resolve(__dirname,'./lib/jquery-2.1.1/jquery.min.js'),
            Util: path.resolve(__dirname,'./lib/windJS/util.js'),
            DataProcess: path.resolve(__dirname,'./lib/windJS/dataProcess.js'),
        }),
    new BundleAnalyzerPlugin(),
  	],
  mode: 'development',
  devServer:{
  	publicPath:'/dist',
  },
  optimization:{
  	splitChunks:{
  		chunks: 'all',
  	},
  	minimize: true,
  }
};
