var path = require('path');
const config = require('../config')
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    lib: [
      'vue', 
      'vuex', 
      'fullcalendar', 
      'vue-router',
      'ls-master-element',
      'quill', 
      'lodash',
      'jquery',
      'moment',
      'echarts'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist', 'dll'),
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    library: '[name]_library'
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.vue$/,
  //       loader: 'vue-loader'
  //     },
  //     {
  //       test: /\.js$/,
  //       loader: 'babel-loader',
  //       exclude: /node_modules/
  //     }
  //   ]
  // },
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       cache: true,
  //       parallel: true,
  //       sourceMap: false // set to true if you want JS source maps
  //     }),
  //     // Compress extracted CSS. We are using this plugin so that possible
  //     // duplicated CSS from different components can be deduped.
  //     // new OptimizeCSSAssetsPlugin({})
  //   ]
  // },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': '"production"'
    }),
    // new webpack.optimize.ModuleConcatenationPlugin(),
    /**
     * path: manifest.json输出文件路径
     * name: dll对象名，跟output.library保持一致
     */ 
    new webpack.DllPlugin({
      context: __dirname,
      path: path.resolve(__dirname, '../dist/dll', 'lib.manifest.json'),
      name: '[name]_library'
    })
  ]
}