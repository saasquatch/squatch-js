var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['whatwg-fetch', './api/main.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
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
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
};
