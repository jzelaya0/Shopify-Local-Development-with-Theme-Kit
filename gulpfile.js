"use strict";

const gulp        = require('gulp');
const gss         = require('gulp-shopify-sass');
const sasslint    = require('gulp-sass-lint');
const concat      = require('gulp-concat');
const jshint      = require('gulp-jshint');
const notify      = require('gulp-notify');
const plumber     = require('gulp-plumber');
const rename      = require('gulp-rename');


// ==================================================
// PATHS
// ==================================================
const paths =  {
  src: {
    mainSass: './sass/main.scss',
    sass: './sass/**/*.scss',
    js: './js/*.js'
  },
  dist: {
    assets: './assets/'
  }
};

// ==================================================
// TASKS
// ==================================================

// DEFAULT TASK
gulp.task('default', ['allTasks']);


// TASK: ALL TASKS & WATCH FOR CHANGES
gulp.task('allTasks', ['sass-lint','sass', 'js'], function(){
  gulp.watch(paths.src.sass, ['sass-lint','sass']);
  gulp.watch(paths.src.js, ['js']);
});

// TASK: SASS
gulp.task('sass', function () {
  return gulp.src(paths.src.mainSass)
    .pipe(gss())
    .pipe(rename({
      basename: "custom-styles",
      extname: ".scss.liquid"
    }))
    .pipe(gulp.dest(paths.dist.assets));
});


// TASK: SASS LINTER
gulp.task('sass-lint', function(){
    return gulp.src(paths.src.sass)
      .pipe(plumber({
        errorHandler: notify.onError({
          title: "Sass Error",
          message: "Error: <%= error.message %>",
          sound: "Frog"
        })
      }))
      .pipe(sasslint())
      .pipe(sasslint.format())
      .pipe(sasslint.failOnError());
});


// TASK: JAVASCRIPT
gulp.task('js', function(){
  return gulp.src(paths.src.js)
    .pipe(jshint())
    .pipe(notify({
      sound: "Hero",
      message: function(file){
        if (file.jshint.success) {
            // Report nothing if it's all good
            return false;
        }
        var errors = file.jshint.results.map(function(data){
          if (data.error) {
            return "(" + data.error.line + data.error.character + ")" + data.error.reason;
          }
        }).join("\n");

        return file.relative + "(" + file.jshint.results.length + " errors)\n" + errors;
      }
    }))
    .pipe(concat('custom.js'))
    .pipe(gulp.dest(paths.dist.assets));
});
