const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'Client',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({}), new OptimizeCssAssetsPlugin({})],
  },
  module: {
    rules: [
            {
              test: '/\.js$/',
              exclude: /node_modules/,
              loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                use: [
                  {
                    loader: 'url-loader',
                  },
                ],
            },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/client/views/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin ({filename: "[name].css"}),
    new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),
    new WorkboxPlugin.GenerateSW()
  ]
}
