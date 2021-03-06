'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const absolutePath = require('./path');
const os = require('os');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    // alias: {
    //   'vue$': 'vue/dist/vue.esm.js',
    //   '@': resolve('src'),
    // }
    alias: Object.assign({
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'element-ui': 'ls-master-element',
      'jquery-ui': path.resolve('./node_modules/jquery-ui/ui'),
    }, absolutePath)
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        use: 'vue-loader',
        include:[resolve('src')],
        exclude: /node_modules/,
        // options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        use: {
          loader:'babel-loader',
          options:{
            cacheDirectory: true
          }
        },
        include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
      },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   exclude: file => (
      //     /node_modules/.test(file) &&
      //     !/\.vue\.js/.test(file)
      //   )
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader:'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        }],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        }]
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     'vue-style-loader',
      //     'css-loader'
      //   ]
      // },
      // {
      //   test: /\.scss$/,
      //   use: [{loader:"style-loader"}, {loader:"css-loader"}, {loader:"sass-loader"}],
      // },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }]
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins:[
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "windows.jQuery": "jquery"
    })
  ]
}
