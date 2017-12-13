const webpack = require('webpack');
const path = require('path');
const ExtractTestWebpackPlugin = require('extract-text-webpack-plugin');

let config = {
    entry: './src/index.js', // entry file
    output: {
        path: path.resolve(__dirname, './public'), //output path
        filename: 'output.js' // output filename
    },
    module: {
        rules: [
            {
                test: /\.js$/, // files ending with .js
                exclude: /node_modules/, // exclude the node_modules directory
                loader: "babel-loader" // use this (babel-core) loader
            },
            {
                test: /\.scss$/, // files ending with .scss
                use: ExtractTestWebpackPlugin.extract({ // call our plugin with extract method
                    use: ['css-loader', 'sass-loader'], // use these loaders
                    fallback: 'style-loader' // fallback for any css not extracted
                })
            }
        ] // end rules
    },
    plugins: [
        new ExtractTestWebpackPlugin('styles.css') // call the ExtractTestWebpackPlugin constructor and name our css file
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './public'), // a dir to URL to serve HTML content from
        historyApiFallback: true, // fallback to index.html for SPA
        inline: true, //inline mode set to false to disable including client scripts like livereload
        open: true // open default browser while launching
    },
    devtool: 'eval-source-map' // enable devtool for better debugging experience
}

module.exports = config;
