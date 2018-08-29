var path = require("path");
var webpack = require("webpack");
var Visualizer = require("webpack-visualizer-plugin");
// webpack.config.js
const MinifyPlugin = require("babel-minify-webpack-plugin");

var PROD = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    "squatch.WidgetApi": ["./src/api/WidgetApi.ts"],
    squatch: ["./src/index.ts"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: PROD ? "[name].min.js" : "[name].js",
    library: "squatch",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: [require('@babel/plugin-transform-runtime')]
          }
        },
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: PROD
    ? [
      new MinifyPlugin({}, {}),
      new Visualizer()
    ]
    : [
      new Visualizer()
    ],
  stats: {
    // Nice colored output
    colors: true
  },
  mode: "production"
};
