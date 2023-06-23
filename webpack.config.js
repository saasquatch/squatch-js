var path = require("path");
var webpack = require("webpack");
var Visualizer = require("webpack-visualizer-plugin");

module.exports = {
  entry: {
    squatch: ["./src/squatch.ts"],
    '../demo/dist/squatchjs': ["./src/squatch.ts"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].min.js",
    library: "squatch",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
              plugins: [
                ["@babel/plugin-transform-runtime"]
              ]
            }
          }
        ],
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins:
    [
      // new MinifyPlugin({}, {}),
      new Visualizer()
    ],
  stats: {
    // Nice colored output
    colors: true
  },
  mode: "production"
};
