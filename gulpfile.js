'use strict';
// @todo: add dev and prod settings

var gulp = require('gulp');
var minifycss = require('gulp-clean-css');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var browserify = require('browserify');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var imageResize = require('gulp-image-resize');
var webp = require('gulp-webp');
var uglify = require('gulp-uglify');
var mode = require('gulp-mode')({
    modes: ["production", "development"],
    default: "development",
    verbose: false
});
var rename = require("gulp-rename");
// var clonesink = require('gulp-clone').sink();
var stylelint = require('gulp-stylelint');
var eslint = require('gulp-eslint');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var log = require('fancy-log');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');

// Import our configured Metalsmith instance
var metalsmith = require("./metalsmith.js");

var destinationDir = './build';

/**
 * Set the watch process and the browserSync defaults
 *
 */
gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: destinationDir
    }
  });
  gulp.watch(['./layouts/**/**/*.hbs', './src/**/**/*.html'], gulp.series('metalsmith', 'browser-sync'));
  gulp.watch(['./js/app.js', './js/vendor/**/*.js'], gulp.series('eslint', 'browserify', 'browser-sync'));
  gulp.watch('./scss/*.scss', gulp.series('css', 'browser-sync'));
  gulp.watch('./images/**/*', gulp.series('images', 'webp', 'browser-sync'));
});

gulp.task('browser-sync', function(done) {
  browserSync.reload();
  done();
});

/**
 * Process Sass
 *
 */
gulp.task('css', function() {
  return gulp.src("./scss/*.scss")
    .pipe(stylelint({
      failAfterError: false,
      reporters: [
        {formatter: 'string', console: true}
      ]
    }))
    .pipe(mode.development(sourcemaps.init({loadMaps: true})))
    .pipe(sass().on('error', sass.logError))
    .pipe(mode.production(minifycss()))
    .pipe(concat("style.css"))
    .pipe(mode.development(sourcemaps.write('.')))
    .pipe(gulp.dest("./build"));
});

/**
 * Bundle all the files you need in browserify.
 *
 * @note: This will browserify all you have listed in app.js
 * See: https://blog.revathskumar.com/2016/02/browserify-with-gulp.html
 */

gulp.task('eslint', function (done) {
    return gulp.src([
        './js/app.js',
        './js/vendor/**/*.js'
    ])
        .pipe(eslint())
        .pipe(eslint.format());
    done();
});

gulp.task('browserify', function (done) {

  browserify({
    entries: './js/app.js',
    debug: true
  })
    .transform("babelify", {presets: ["@babel/preset-env"]})
    .bundle()
    .on('error', err => {
      log.error("Browserify Error" + err.message)
    })
    .pipe(source('app.bundle.js'))
    .pipe(buffer())
    .pipe(mode.production(uglify()))
    .pipe(mode.development(sourcemaps.init({loadMaps: true})))
    .pipe(mode.development(sourcemaps.write('.')))
    .pipe(gulp.dest("./build"));
  done();
});

/**
 * Optimize and create images
 * https://gist.github.com/ryantbrown/239dfdad465ce4932c81
 *
 */

var images = [
    { name: 'xs', width: 30 },
    { name: 's', width: 150 },
    { name: 'm', width: 500 },
    { name: 'l', width: 800 },
    { name: 'xl', width: 1200 }
];

// @todo: do not create bigger images unresized, how to check if bigger images exist on metalsmith task?
gulp.task('images', function (done) {

    // loop through image groups
    images.map((type) => {
        // build the resize object
        var resize_settings = {
            width: type.width
        };

        gulp.src('./images/**/*')
            .pipe(rename(function (path) {
                path.basename += '-' + type.name;
            }))
            .pipe(newer('./build/img/'))
            .pipe(imageResize(resize_settings))

            // .pipe(clonesink) not working
            // .pipe(webp())
            // .pipe(clonesink.tap()) // close stream and send both formats to dist

            .pipe(imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: false,
                            collapseGroups: true
                        }
                    ]
                })
            ]))
            .pipe(gulp.dest('./build/img/'))
    });

    done();
});

/**
 * create webp images
 * is not working in series. not all images get processed, might be an issue with gulp.
 *
 */
gulp.task('webp', function () {
    return gulp.src('./build/img/**/*')
        //.pipe(newer('./build/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./build/img/'));
});

/**
 * Start the Metalsmith build.
 *
 */
gulp.task('metalsmith', function(done){
  // delete build files for cleanup
  del(['build/index.html','build/**/*','!build','!build/img','!build/img/**','!build/fonts','!build/fonts/**']);

  metalsmith.build(function(err, files){
    if (err) throw err;
    //console.log(files);
    done();
  });
});

/**
 * The build task.
 *
 * */
gulp.task('build', gulp.parallel('images', gulp.series('metalsmith', 'css', 'eslint', 'browserify')));

/**
 * The dev task.
 *
 * */
gulp.task('dev', gulp.series('build', 'watch'));

/**
 * The default gulp task.
 *
 * */
gulp.task('default', gulp.series('dev'));


