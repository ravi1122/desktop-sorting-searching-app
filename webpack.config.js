const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = require('./config/paths');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: PATHS.ENTRY_FILE,
  output: {
    path: PATHS.BUILD_DIR,
    publicPath: '/',
    filename: '[name].[hash:6].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          customize: require.resolve(
            'babel-preset-react-app/webpack-overrides'
          ),
          presets: ['react-app'],
          cacheDirectory: true,
          cacheCompression: true,
          compact: true,
        }
      }, {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: false
          }
        }]
      }, {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        include: PATHS.SRC_DIR
      }
    ]
  },
  plugins: [
    new ManifestPlugin({
      fileName: 'manifest.json'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:6].css',
      chunkFilename: '[id].[hash:6].css',
      minimize: true
    }),
    new HtmlWebPackPlugin({
      template: path.join(PATHS.SRC_DIR, 'index.html'),
      filename: 'index.html'
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css', '.scss']
  }
}
