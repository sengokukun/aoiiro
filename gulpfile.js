////////////////////////////////////////////////////
// gulp module
////////////////////////////////////////////////////

var gulp = require("gulp");
var browser = require("browser-sync"); // ブラウザ更新
var autoprefixer = require("gulp-autoprefixer"); // ベンダープレフィックス
var plumber = require("gulp-plumber"); // エラーで止めない
var sass = require("gulp-sass"); // sass
var cmq = require('gulp-combine-media-queries'); //メディアクエリ
var uglify = require("gulp-uglify"); //js
var imagemin = require("gulp-imagemin"); //img
var imageminPngquant = require('imagemin-pngquant');
var htmlmin = require('gulp-htmlmin'); //html圧縮

////////////////////////////////////////////////////


// server
gulp.task("server", function() {
  browser({
    server: {
      baseDir: "./dist/"
    }
  })
});

// scss
gulp.task("sass", ['server'], function() {
    // gulp.src('./src/scss/**/!(_)*.scss')
  gulp.src('./src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browser.reload({
        stream: true
  }));
});

// メディアクエリ
gulp.task('cmq', function () {
  gulp.src('css/**/*css')
  .pipe(cmq({log: true}))
  .pipe(gulp.dest('./dist/css'));
});

// js圧縮
gulp.task("uglify", function() {
  gulp.src(["./src/js/**/*.js","!./src/js/min/**/*.js","./src/js/ie8/**/*.js"])
  .pipe(uglify())
  .pipe(gulp.dest("./dist/js"));
});

// img圧縮
gulp.task('imagemin', function() {
  return gulp.src('src/img/*.{png,jpg,svg,webp,ico}')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [imageminPngquant()]
    }))
    .pipe(gulp.dest('./dist/img'));
});

// html圧縮
gulp.task('htmlmin', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/'));
});

// default
gulp.task("default", ["server"], function() {
  gulp.watch(['./src/scss/**/*.scss'], ["sass"]);
  gulp.watch(["./src/js/**/*.js", "!./src/js/min/**/*.js"], ["uglify"]);
  gulp.watch('./dist/css/**/*css',['cmq']);
  gulp.watch('./src/*.html', ['htmlmin']);
  gulp.watch('./src/img/*',['imagemin']);
});
