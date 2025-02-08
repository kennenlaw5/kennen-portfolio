const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    app: path.resolve(__dirname, 'resources/js/App.tsx'),
    appStyles: path.resolve(__dirname, 'resources/sass/app.scss'),
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    chunkFilename: 'js/[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss'],
    alias: {
      Sass: path.resolve(__dirname, 'resources/sass'),
      JS: path.resolve(__dirname, 'resources/js'),
      Components: path.resolve(__dirname, 'resources/js/components'),
      Constants: path.resolve(__dirname, 'resources/js/constants'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
                exportLocalsConvention: 'camelCaseOnly',
              },
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: true,
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: true,
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    })
  ],
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
};