const webpack = require('webpack');
const path = require('path');
const ExtractTestWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin');

let config = {
    entry: './src/index.js', // entry file
    output: {
        path: path.resolve(__dirname, './public'), //output path
        filename: 'output.js' // output filename
    },
    resolve: { // These options change how modules are resolved
        extensions: ['.js', '.jsx', '.json', '.scss', '.css', '.jpeg', '.jpg', '.gif', '.png'], // Automatically resolve certain extensions
        alias: { // Create aliases
              images: path.resolve(__dirname, 'src/assets/images')  // src/assets/images alias
        }
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
                use: ['css-hot-loader'].concat(ExtractTestWebpackPlugin.extract({ // call our plugin with extract method
                    use: ['css-loader', 'sass-loader', 'postcss-loader'], // use these loaders
                    fallback: 'style-loader' // fallback for any css not extracted
                })),
            },
            {
                test: /\.jsx$/, // all files ending with .jsx
                loader: 'babel-loader', // use the babel-loader for all .jsx files
                exclude: /node_modules/ // exclude searching for files in the node_modules directory
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?context=src/assets/images/&name=images/[path][name].[ext]', { // images loader
                        loader: 'image-webpack-loader',
                        query: {
                            mozjpeg: {
                                progressive: true
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            optipng: {
                                optimizationLevel: 4
                            },
                            pngquant: {
                                quality: '75-90',
                                speed: 3
                            }
                        }
                    }
                ],
                exclude: /node_modules/,
                include: __dirname
            },
        ] // end rules
    },
    plugins: [
        new ExtractTestWebpackPlugin('styles.css'), // call the ExtractTestWebpackPlugin constructor and name our css file
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

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin(), // call the uglify plugin
        new OptimizeCSSAssets() // call the css optimizer
    );
}
