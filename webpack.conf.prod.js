'use strict';

const webpack = require('webpack');

const base = require('./webpack.conf.base.js');

(base.plugins || (base.plugins = [])).push(
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin()
)

module.exports = base;
