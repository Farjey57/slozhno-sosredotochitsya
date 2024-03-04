const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier'); 

/* Перенос html в папку dist */
function html() {
  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyURLs: true,
    keepClosingSlash: true,
  };
  return gulp
    .src('./src/**/*.html')
    .pipe(plumber())
    .on('data', function(file) {
      const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
      return file.contents = buferFile
    })
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

/* Склейка css в папку dist */
function css() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano(),
  ]
  return gulp
    .src('./src/**/*.css')
    .pipe(plumber({
      errorHandler: false
      }))
    .pipe(concat('bundle.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function scripts() {
  return gulp
    .src('src/**/*.js')
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
  gulp.watch(['src/**/*.css'], css);
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
  gulp.parallel(html, css, scripts, images, fonts)
); /* Сначала при вызове команды gulp build из терминала мы удалим папку dist/, а потом в параллельном режиме выполним задачи сборки HTML, CSS и изображений. */
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp; // строчка, которая позволит вызвать эту задачу из терминала
exports.default = watchapp; // Теперь функция watchapp будет вызываться из терминала просто по команде gulp
