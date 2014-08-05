// browserify
var browserify = require('browserify');
var es6ify = require('es6ify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');


es6ify.traceurOverrides = { blockBinding: true };

gulp.task('compress', function() {
  gulp.src('lib/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

gulp.task('scripts', function () {
  return browserify('./src/js/app.js')
    //.add(es6ify.runtime)
    .transform(es6ify)
    .bundle({
      debug: true
    })
    .on('error', gutil.log)
    .pipe(source('app.js'))
    //.pipe(streamify(uglify()))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
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
  gulp.src('./src/styles/**/*.styl')
    .pipe(stylus({
      use: ['nib'],
      set:[
        //'compress',
        'include css'
      ]
    }))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(browserSync.reload({stream:true}));
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./dist/"
        }
    });
});



gulp.task('watch', function() {
  gulp.watch(['./src/js/app.js'], ['scripts']);
  gulp.watch(['src/**/*.jade'], ['jade']);
  gulp.watch(['src/**/*.styl'], ['styles']);
});

gulp.task('default', ['scripts', 'jade', 'watch', 'browser-sync'])
