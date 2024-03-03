const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();

/* Перенос html в папку dist */
function html() {
  return gulp
    .src('./src/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

/* Склейка css в папку dist */
function css() {
  return gulp
    .src('src/**/*.css')
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

/* Перенос картинок в папку dist */
function images() {
  return gulp
    .src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({ stream: true }));
}

/* Перенос шрифтов в папку dist */
function fonts() {
  return gulp
    .src('src/fonts/**/*.woff')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
}

const build = gulp.series(
  clean,
  gulp.parallel(html, css, images, fonts)
); /* Сначала при вызове команды gulp build из терминала мы удалим папку dist/, а потом в параллельном режиме выполним задачи сборки HTML, CSS и изображений. */
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp; // строчка, которая позволит вызвать эту задачу из терминала
exports.default = watchapp; // Теперь функция watchapp будет вызываться из терминала просто по команде gulp
