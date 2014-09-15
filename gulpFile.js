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


var shim = {

};

es6ify.traceurOverrides = { blockBinding: true };

gulp.task('compress', function() {
  gulp.src('lib/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

gulp.task('scripts', function () {
  browserify('./src/js/app.js')
    //.transform(reactify)
    //add(es6ify.runtime)
    .transform(es6ify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist/js/'));
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
        baseDir: "./dist/"
      }
    });
});



gulp.task('watch', function() {
  gulp.watch(['./src/js/app.js'], ['scripts']);
  gulp.watch(['src/**/*.jade'], ['jade']);
  gulp.watch(['src/**/*.less'], ['styles']);
});

gulp.task('default', ['scripts', 'jade', 'styles', 'watch', 'browser-sync'])
