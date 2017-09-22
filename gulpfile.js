'use strict';

const path = require('path');

const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const es3ify = require('gulp-es3ify');
const browserSync = require('browser-sync');
const ansiHtml = require('ansi-html');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

gulp.task('dev', () => {
    const bs = browserSync.create();
    const compiler = webpack(require('./webpack.conf.js'));

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
        server: ['res'],
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

gulp.task('publish', () => {
    del.sync([
        path.resolve(__dirname, 'dist'),
    ]);

    return gulp.src(path.resolve(__dirname, 'src/**/*.js'))
        .pipe(babel())
        .pipe(es3ify())
        .pipe(gulp.dest('dist'))
        .on('data', chunk => {
            console.log(chunk.history[1]);
        })
        .on('end', () => {
            console.log('publish done!');
        })
        .on('error', e => {
            console.log(e);
        })
})
