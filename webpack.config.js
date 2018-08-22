var path = require("path");
var webpack = require("webpack");
var Visualizer = require("webpack-visualizer-plugin");
// webpack.config.js
const MinifyPlugin = require("babel-minify-webpack-plugin");

var PROD = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    "squatch.WidgetApi": ["./src/api/WidgetApi.ts"],
    squatch: ["./src/squatch.ts"]
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
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      // {
      //   test: /\.schema.json$/,
      //   use: ["json-loader"]
      // }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
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
  mode: "production"
};
