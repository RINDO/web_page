var gulp    = require("gulp");
var plumber = require("gulp-plumber");
var slim    = require("gulp-slim");
var sass    = require("gulp-sass");
var browser = require("browser-sync");
var prefix  = require("gulp-autoprefixer")

// config
var config = {
  path : {
    slim        : "./src/**/*.slim",
    target_sass : "./src/sass/main.sass",
    sass_files  : "./src/**/*.sass"
  },
  out : {
    slim : "./htdocs/",
    sass : "./htdocs/css/",
    all  : "./htdocs/**"
  }
}

// browser-sync
gulp.task("browser-sync", function() {
  browser({
    server: {
      baseDir: "./htdocs"
    }
  });
});

gulp.task("reload", function() {
  browser.reload();
});

// slim 
gulp.task('slim', function() {
  gulp.src(config.path.slim)
      .pipe(plumber())
      .pipe(slim({
        pretty:  true,
        require: 'slim/include',
        options: 'include_dirs=["./src/includes"]'
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
      .pipe(prefix({
            browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
            cascade: false
        }))
      .pipe(gulp.dest(config.out.sass))
});

gulp.task('sass:watch', ['sass'], function() {
  gulp.watch(config.path.sass_files, ['sass']);
});

gulp.task('html:watch', ['reload'], function() {
  gulp.watch(config.out.all, ['reload']);
});

// watch
gulp.task('watch', ['browser-sync' ,'slim:watch', 'sass:watch', 'html:watch']);

// task
gulp.task("default", ["slim", "sass"]);