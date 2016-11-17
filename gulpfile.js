const gulp       = require("gulp");
const plumber    = require("gulp-plumber");
const slim       = require("gulp-slim");
const sass       = require("gulp-sass");
const browser    = require("browser-sync");
const prefix     = require("gulp-autoprefixer")
const browserify = require("gulp-browserify");
const rename     = require("gulp-rename");
const del        = require("del");
const fs         = require("fs");

// config
const config = {
  path : {
    slim          : "./src/**/*.slim",
    slim_includes : "./src/includes/",
    target_sass   : "./src/sass/main.scss",
    sass_files    : "./src/sass/**/*.scss",
    target_js     : "./src/javascript/app.js",
    javascripts   : "./src/javascript/*.js"
  },
  out : {
    html : "./html/",
    css : "./html/css/",
    all  : "./html/**",
    javascript: "./html/js/"
  }
}

// browser-sync
gulp.task("browser-sync", () => {
  browser({
    server: {
      baseDir: "./html"
    }
  });
});

gulp.task("reload", () => {
  browser.reload();
});

// javascript
gulp.task('browserify', () => {
  gulp.src(config.path.target_js)
      .pipe(browserify({
        insertGlobals: true
      }))
      .pipe(gulp.dest(config.out.javascript));
});

gulp.task('js:watch', () => {
  gulp.watch(config.path.javascripts, ['browserify']);
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
      .pipe(gulp.dest(config.out.html))
});

gulp.task('slim:watch', () => {
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
      .pipe(gulp.dest(config.out.css))
});

// rename
gulp.task('rename:build', () => {
  // rename
  del.sync([config.out.css + "main.css?*"]);

  let css = "main.css?" + Date.now();
  gulp.src(config.out.css + "main.css")
      .pipe(rename(css))
      .pipe(gulp.dest(config.out.css));

  let header = config.path.slim_includes + "header.slim";
  fs.readFile(header, 'utf8', (err, data) => {
    fs.writeFileSync(header, data.replace(/main\.css\?.*/gi, css+'"'), 'utf8');
  });
});

gulp.task('sass:watch', () => {
  gulp.watch(config.path.sass_files, ['sass', 'rename:build', 'slim']);
});

gulp.task('html:watch', () => {
  gulp.watch(config.out.all, ['reload']);
});

// watch
gulp.task('watch', ['browser-sync' ,'slim:watch', 'sass:watch', 'html:watch', 'js:watch']);

// task
gulp.task("default", ["slim", "sass", "rename:build"]);
