var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var prefix = require('gulp-autoprefixer');
var path = require('path');
var stylus = require('gulp-stylus');
var watchify = require('watchify');
var nib = require('nib');

gulp.task('compress', function() {
  gulp.src('lib/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

gulp.task('copy-assets', function() {
  gulp.src('./src/fonts/**', {base: './src'})
  .pipe(gulp.dest('dist/'));

  gulp.src('./src/images/**', {base: './src'})
  .pipe(gulp.dest('dist/'));
});



gulp.task('scripts', function() {
  var src = './src/js/app.js';
  var dest = './dist/js/';

  var bundler = watchify(browserify(src, watchify.args));
  bundler.on('update', rebundle);
  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest('./dist/js/'))
      .pipe(browserSync.reload({stream:true, once: true}));
  }

  return rebundle();
});

gulp.task('jade', function () {
  var YOUR_LOCALS = {

  };
  gulp.src('./src/*.jade')
    .pipe(jade({
      pretty: false,
      locals: YOUR_LOCALS
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('styles', function () {
  gulp.src('./src/styles/style.styl')
    .pipe(stylus({
      compress: true,
      "include css": true,
      use: nib(),
      set:[
        'include css',
        'compress'
      ]
    }))
    .on('error', gutil.log)
    .pipe(prefix())
    .pipe(gulp.dest('./dist/styles'))
    .pipe(browserSync.reload({stream:true}));
});

// Static server
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './dist/'
    }
  });
});



gulp.task('watch', function() {
  gulp.watch(['./src/js/app.js'], ['scripts']);
  gulp.watch(['src/**/*.jade'], ['jade']);
  gulp.watch(['src/**/*.styl'], ['styles']);
  gulp.watch(['src/images/**', 'src/fonts/**'], ['copy-assets']);
});

gulp.task('default', ['scripts', 'jade', 'styles', 'watch', 'browser-sync'])
