var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var jade = require('gulp-jade');
var browserSync = require('browser-sync');
var prefix = require('gulp-autoprefixer');
var riotify = require('riotify');
var path = require('path');
var stylus = require('gulp-stylus');
var watchify = require('watchify');
var babel = require('babelify');
var nib = require('nib');
var jadeify = require('jadeify');

gulp.task('copy-assets', function() {
  gulp.src('./src/fonts/**', {base: './src'})
  .pipe(gulp.dest('dist/'));

  gulp.src('./src/images/**', {base: './src'})
  .pipe(gulp.dest('dist/'));
});


console.log('starting');
var src = './src/js/app.js';
var dest = './dist/js/';

var bundler = watchify(browserify(src, {
  debug: true,
  noParse: ['jquery']
}).transform(jadeify).transform(babel).transform(riotify, { template: 'jade' }));

function rebundle() {
  console.log('rebundle')
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.reload({stream:true, once: true}));
}


bundler.on('update', rebundle);

gulp.task('scripts', function() {
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
    reloadDebounce: 4000,
    server: {
      baseDir: './dist/'
    }
  });
});



gulp.task('watch', function() {
  gulp.watch(['./src/js/**/*.js', './src/tags/**/*.tag'], ['scripts']);
  gulp.watch(['src/**/*.jade'], ['jade']);
  gulp.watch(['src/**/*.styl'], ['styles']);
  gulp.watch(['src/images/**', 'src/fonts/**'], ['copy-assets']);
});

gulp.task('default', ['copy-assets', 'scripts', 'jade', 'styles', 'watch', 'browser-sync'])
