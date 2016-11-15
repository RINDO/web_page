const gulp    = require("gulp");
const plumber = require("gulp-plumber");
const slim    = require("gulp-slim");
const sass    = require("gulp-sass");
const browser = require("browser-sync");
const prefix  = require("gulp-autoprefixer")


// config
const config = {
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
gulp.task("browser-sync", () => {
  browser({
    server: {
      baseDir: "./htdocs"
    }
  });
});

gulp.task("reload", () => {
  browser.reload();
});

// slim 
gulp.task('slim', () => {
  gulp.src(config.path.slim)
      .pipe(plumber())
      .pipe(slim({
        pretty:  true,
        require: 'slim/include',
        options: 'include_dirs=["./src/includes"]'
      }))
      .pipe(gulp.dest(config.out.slim))
});

gulp.task('slim:watch', ['slim'], () => {
  gulp.watch(config.path.slim, ['slim']);
});

// sass
gulp.task('sass', () => {
  gulp.src(config.path.target_sass)
      .pipe(plumber())
      .pipe(sass())
      .pipe(prefix({
            browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
            cascade: false
        }))
      .pipe(gulp.dest(config.out.sass))
});

gulp.task('sass:watch', ['sass'], () => {
  gulp.watch(config.path.sass_files, ['sass']);
});

gulp.task('html:watch', ['reload'], () => {
  gulp.watch(config.out.all, ['reload']);
});

// watch
gulp.task('watch', ['browser-sync' ,'slim:watch', 'sass:watch', 'html:watch']);

// task
gulp.task("default", ["slim", "sass"]);
