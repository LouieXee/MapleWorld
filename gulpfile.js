'use strict';

const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const ansiHtml = require('ansi-html');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

gulp.task('serve', () => {
    const bs = browserSync.create();
    const compiler = webpack(require('./webpack.conf.dev.js'));

    compiler.plugin('done', stats => {
        if (stats.hasErrors() || stats.hasWarnings()) {
            return bs.sockets.emit('fullscreen:message', {
                title: 'Webpack Error:',
                body: ansiHtml(stats.toString()),
                timeout: 100000
            });
        }

        bs.reload();
    });

    bs.init({
        online: false,
        notify: false,
        server: true,
        middleware: [
            webpackDevMiddleware(compiler, {
                noInfo: false,
                stats: {
                    colors: true
                }
            })
        ],
        plugins: [ require('bs-fullscreen-message') ]
    })

})

gulp.task('build', () => {
    del.sync([
        path.resolve(__dirname, 'dist'),
    ]);

    webpack(require('./webpack.conf.prod.js'), (err, stats) => {
        console.log(stats.toString({
            colors: true
        }))
    })
})
