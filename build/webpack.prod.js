const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkHtmlPlugin = require('./InlineChunkHtmlPlugin')

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/])
  ]
})
