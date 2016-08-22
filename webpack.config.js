var path = require('path');
var webpack = require('webpack');

var PROD = process.env.NODE_ENV === 'production';

module.exports = {
    entry: ['whatwg-fetch', './api/main.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: PROD ? 'bundle.min.js' : 'bundle.js',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: path.join(__dirname, 'api'),
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
