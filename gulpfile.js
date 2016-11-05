var gulp    = require("gulp");
var plumber = require("gulp-plumber");
var slim    = require("gulp-slim");
var sass    = require("gulp-sass")

// config
var config = {
  path : {
    slim        : "./src/**/*.slim",
    target_sass : "./src/sass/main.sass",
    sass_files  : "./src/**/*.sass"
  },
  out : {
    slim : "./htdocs/",
    sass : "./htdocs/css/"
  }
}

// slim 
gulp.task('slim', function() {
  gulp.src(config.path.slim)
      .pipe(plumber())
      .pipe(slim({
        pretty: true
      }))
      .pipe(gulp.dest(config.out.slim))
});

gulp.task('slim:watch', ['slim'], function() {
  gulp.watch(config.path.slim, ['slim']);
});

// sass
gulp.task('sass', function() {
  gulp.src(config.path.target_sass)
      .pipe(plumber())
      .pipe(sass())
      .pipe(gulp.dest(config.out.sass))
});

gulp.task('sass:watch', ['sass'], function() {
  gulp.watch(config.path.sass_files, ['sass'])
});

// watch
gulp.task('watch', ['slim:watch', 'sass:watch']);

// task
gulp.task("default", ["slim", "sass"]);