'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync')

gulp.task('sass', () => {
  gulp.src('./app/scss/*.scss')
        .pipe(sass({
          outputStyle: 'expanded',
          sourceComments: false
        }))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream())
})

gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: './public'
  })

  gulp.watch('./app/scss/*.scss', ['sass'])
  gulp.watch('./public/*.html').on('change', browserSync.reload)
  gulp.watch('./public/js/*.js').on('change', browserSync.reload)
})

gulp.task('default', ['serve'])
