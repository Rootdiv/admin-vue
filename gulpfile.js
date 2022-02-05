'use strict'

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const sass = require('gulp-sass')(require('sass'));

const dist = '/home/maindiv/localhost/vue/admin';
const distProd = './build'

gulp.task('copy-html', () => gulp.src('./app/src/index.html').pipe(gulp.dest(dist)));

gulp.task('copy-api', () => gulp.src('./app/api/**/*', { dot: true }).pipe(gulp.dest(dist + '/api')));

gulp.task('copy-assets', () => gulp.src('./app/assets/**/*.*').pipe(gulp.dest(dist + '/assets')));

gulp.task('build-js', () => browserify('./app/src/main.js', { debug: true }).transform('babelify', {
  presets: [
    '@babel/preset-env',
  ],
  sourceMaps: true,
}).bundle().pipe(source('bundle.js')).pipe(gulp.dest(dist)));

gulp.task('build-sass', () => gulp.src('./app/scss/style.scss').pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(dist)));

gulp.task('watch', () => {
  gulp.watch('./app/src/index.html', gulp.parallel('copy-html'));
  gulp.watch('./app/api/**/*.*', gulp.parallel('copy-api'));
  gulp.watch('./app/assets/**/*.*', gulp.parallel('copy-assets'));
  gulp.watch('./app/src/**/*.js', gulp.parallel('build-js'));
  gulp.watch('./app/scss/**/*.scss', gulp.parallel('build-sass'));
});

gulp.task('build', gulp.parallel('copy-html', 'copy-api', 'copy-assets', 'build-js', 'build-sass'));

gulp.task('build-prod', () => {
  gulp.src('./app/src/index.html').pipe(gulp.dest(distProd));
  gulp.src('./app/api/**/*', { dot: true }).pipe(gulp.dest(distProd + '/api'));
  gulp.src('./app/assets/**/*.*').pipe(gulp.dest(distProd + '/assets'));
  browserify('./app/src/main.js', { debug: false }).transform('babelify', {
    presets: [
      '@babel/preset-env',
    ],
    sourceMaps: false,
  }).bundle().pipe(source('bundle.js')).pipe(buffer()).pipe(uglify()).pipe(gulp.dest(distProd));
  return gulp.src('./app/scss/style.scss').pipe(sass().on('error', sass.logError)).pipe(autoprefixer())
    .pipe(cleanCSS()).pipe(gulp.dest(distProd));
})

gulp.task('default', gulp.parallel('watch', 'build'));
