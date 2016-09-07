var path = require('path');
var webpack = require('webpack');

var PROD = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
      OpenApi: ['whatwg-fetch', './src/api/OpenApi.js'],
      Tracking: './src/tracking/Cookie.js',
      All: ['./src/squatch.js']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        // filename: PROD ? 'bundle.min.js' : 'bundle.js',
        filename: PROD ? "Squatch.[name].min.js" : "Squatch.[name].js",
        library: "[name]",
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                query: {
                  presets: 'es2015',
                },
            },
            { test: /\.json$/, loader: 'json' }
        ]
    },
    plugins: PROD ? [
        new webpack.optimize.UglifyJsPlugin({
          minimize: true,
          output: {comments: false},
          compress: { warnings: false }
        })
    ] : [],
    stats: {
        // Nice colored output
        colors: true
    },
};
