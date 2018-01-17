'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');

gulp.task('sass', () => {
    gulp.src('./app/scss/*.scss')
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: false
        }))
        .pipe(autoprefixer({
            versions: ['last 2 browsers']
        }))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./public"
    });

    gulp.watch("./app/scss/*.scss", ['sass']);
    gulp.watch("./public/*.html").on('change', browserSync.reload);
    gulp.watch("./public/js/*.js").on('change', browserSync.reload);
});

gulp.task('default', () => {
    gulp.watch('./scss/*.scss', ['sass']);
});

gulp.task('default', ['serve']);
