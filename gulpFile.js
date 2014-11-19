var browserify = require('browserify');
var es6ify = require('es6ify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var prefix = require('gulp-autoprefixer');
var path = require('path');
var watchify = require('watchify');

es6ify.traceurOverrides = { blockBinding: true };

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

  var bundler = watchify(browserify(es6ify.runtime, watchify.args));
  bundler.add(src);
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
  gulp.src('./src/styles/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .on('error', gutil.log)
    .pipe(prefix())
    .pipe(gulp.dest('./dist/styles'))
    .pipe(browserSync.reload({stream:true}));
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init(null, {
      server: {
        baseDir: './dist/'
      }
    });
});



gulp.task('watch', function() {
  gulp.watch(['./src/js/app.js'], ['scripts']);
  gulp.watch(['src/**/*.jade'], ['jade']);
  gulp.watch(['src/**/*.less'], ['styles']);
  gulp.watch(['src/images/**', 'src/fonts/**'], ['copy-assets']);
});

gulp.task('default', ['scripts', 'jade', 'styles', 'watch', 'browser-sync'])
