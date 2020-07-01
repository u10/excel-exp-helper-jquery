const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: Infinity
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Excel Exp Helper',
      template: path.join(__dirname, '..', 'src', 'index.html')
    }),
    new HtmlWebpackPlugin({
      title: 'Excel Func Manual',
      template: path.join(__dirname, '..', 'src', 'ExcelFuncManual.html'),
      filename: path.join(__dirname, '..', 'dist', 'ExcelFuncManual.html'),
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '..', 'dist')
  }
};
