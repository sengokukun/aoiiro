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
  }))
});

gulp.task('cmq', function () {
  gulp.src('css/**/*css')
  .pipe(cmq({log: true}))
  .pipe(gulp.dest('./dist/css'));
});

gulp.task("uglify", function() {
  gulp.src(["./src/js/**/*.js","!./js/min/**/*.js"])
  .pipe(uglify())
  .pipe(gulp.dest("./dist/js"));
});


// gulp.task('imagemin', function(){
//   return gulp.src('src/img/*')
//     .pipe(plumber())
//     .pipe(imagemin([
//        pngquant({
//          quality: '65-80',
//          speed: 1,
//          floyd:0
//        }),
//        imagemin.svgo(),
//        imagemin.optipng(),
//        imagemin.gifsicle()
//      ]
//   ))
//   .pipe(gulp.dest('dist/img'));
// });

gulp.task('imagemin', function() {
  return gulp.src('src/img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('htmlmin', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/'));
});

// gulp.task('htmlmin', function() {
//   gulp.src('src/*.html')
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest('./dist/'))
//     .pipe(reload({stream:true}));
// });


// default
gulp.task("default", ["server"], function() {
  gulp.watch(['./src/scss/**/*.scss'], ["sass"]);
  gulp.watch(["./src/js/**/*.js", "!js/min/**/*.js"], ["uglify"]);
  gulp.watch('./dist/css/**/*css',['cmq']);
  gulp.watch('./src/*.html', ['htmlmin']);
  gulp.watch('./src/img/*',['imagemin']);
});
