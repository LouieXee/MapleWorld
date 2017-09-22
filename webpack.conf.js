'use strict';

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: path.resolve(__dirname, 'development/index.js'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle_[hash:8].js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                exclude: [/node_modules/],
                loader: 'style-loader!css-loader!postcss-loader?browsers=last 2 version!less-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|eot|ttf|svg)$/,
                exclude: [/node_modules/],
                loader: 'url-loader?limit=1024&name=[name]_[hash:8].[ext]'
            },
            {
                test: /\.html$/,
                exclude: [/node_modules/],
                loader: 'html-loader'
            }
        ]
    },

    devtool: 'cheap-source-map',

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'development/index.html'),
            filename: 'index.html'
        })
    ]

};
