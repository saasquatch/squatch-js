var path = require("path");
var webpack = require("webpack");
var Visualizer = require("webpack-visualizer-plugin");
// webpack.config.js
const MinifyPlugin = require("babel-minify-webpack-plugin");

var PROD = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    "squatch.WidgetApi": ["./src/api/WidgetApi.js"],
    squatch: ["./src/squatch.js"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: PROD ? "[name].min.js" : "[name].js",
    library: "squatch",
    libraryTarget: "umd"
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: "es2015"
        }
      },
      {
        test: /\.schema.json$/,
        use: ["json-loader"]
      }
    ]
  },
  plugins: PROD
    ? [
        new MinifyPlugin({}, {}),
        // new webpack.optimize.UglifyJsPlugin({
        //   minimize: true,
        //   output: { comments: false },
        //   compress: { warnings: false }
        // }),
        new Visualizer()
      ]
    : [],
  stats: {
    // Nice colored output
    colors: true
  },
};
