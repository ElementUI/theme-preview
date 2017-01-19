var path = require('path');
var cooking = require('cooking');
var saladConfig = require('./salad.config.json');

cooking.set({
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  dist: './docs',
  template: './index.tpl',

  devServer: {
    port: 8001,
    publicPath: '/'
  },

  // production
  clean: true,
  hash: true,
  sourceMap: true,
  minimize: true,
  chunk: true, // see https://cookingjs.github.io/zh-cn/configuration.html#chunk
  postcss: [
    require('postcss-salad')(saladConfig)
  ],
  publicPath: './',
  assetsPath: 'static',
  urlLoaderLimit: 10000,
  static: true,
  extractCSS: '[name].[contenthash:7].css',
  alias: {
    'src': path.join(__dirname, 'src')
  },
  extends: ['vue2', 'lint', 'saladcss']
});

module.exports = cooking.resolve();
