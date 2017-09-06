'ust strict';

const webpack = require('webpack');
const base = require('./webpack.conf.base.js');

base.devtool = 'cheap-source-map';

module.exports = base;
