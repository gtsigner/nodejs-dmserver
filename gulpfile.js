/**
 * Created by zhaojunlike on 2017/4/19.
 */
'use strict';

let gulp = require('gulp');
let minify = require('gulp-clean-css');
let browserSync = require('browser-sync');
let nodemon = require('gulp-nodemon');
let cache = require('gulp-cache');
let uglify = require('gulp-uglify');
let pump = require('pump');
let htmlmin = require('gulp-htmlmin');
let imagemin = require('gulp-imagemin')
let sass = require('gulp-sass');
let path = require('path');
let livereload = require('gulp-livereload');
let notify = require('gulp-notify');
let del = require('del');


// 压缩hbs模版
gulp.task('hbs', function () {
    return gulp.src('views/**/*.hbs')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/views/'));
});


// 压缩打包scss
gulp.task('scss', function () {
    return gulp.src('public/scss/**/*.scss')
        .pipe(sass().on('error', function () {
            notify({message: 'sass build err'});
        }))
        .pipe(minify())
        .pipe(gulp.dest('dist/css/'));
});


// 压缩js
gulp.task('js', function (cb) {
    pump([
            gulp.src('public/js/*.js'),
            uglify(),
            gulp.dest('/dist/js/')
        ],
        cb
    );
});


// 压缩img
gulp.task('img', function () {
    return gulp.src('public/images/**/*')        //引入所有需处理的Img
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))      //压缩图片
        // 如果想对变动过的文件进行压缩，则使用下面一句代码
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('dist/images/'))
        .pipe(notify({message: '图片处理完成'}));
});


// 浏览器同步，用7000端口去代理Express的3000端口
gulp.task('browser-sync', ['nodemon'], function () {
    browserSync.init(null, {
        proxy: "http://localhost:3001",
        files: ["dist/views/*.*", "dist/css/*.*", "dist/js/*.*", "dist/img/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});

// 开启Express服务
gulp.task('nodemon', function (cb) {

    let started = false;

    return nodemon({
        script: 'bin/www'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('clean', function (cb) {
    del(['./dist/*'], cb)
});

gulp.task('default', ['browser-sync', 'scss', 'hbs', 'js', 'img'], function () {

    gulp.watch('public/scss/*.scss', ['scss']);

    gulp.watch('public/js/*.js', ['js']);

    gulp.watch('public/images/**/*', ['img']);

    gulp.watch('views/**/*.hbs', ['hbs']);

    let server = livereload();

    gulp.watch(['public/dist/**']).on('change', function (file) {
        server.changed(file.path);
    });
});