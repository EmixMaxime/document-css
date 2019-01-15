const gulp = require('gulp')
const htmlclean = require('gulp-htmlclean')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const twig = require('gulp-twig')
const browserSync = require('browser-sync').create()

const config = {
  sass: {
    src: './src/scss/**/**/*.scss',
    dest: './dist/css'
  },

  html: {
    src: './tpl/**/**/*.twig',
    dest: './dist'
  },

  js: {
    src: './src/js/**/**/*.js',
    dest: './dist/js'
  }
}

gulp.task('sassToCss', () => {
  return gulp.src(config.sass.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(config.sass.dest))
    // .pipe(browserSync.stream())
})

gulp.task('javascript', () => {
  return gulp.src(config.js.src)
    .pipe(gulp.dest(config.js.dest))
})

gulp.task('twigToHtml', () => {
  gulp.src(config.html.src)
    .pipe(twig())
    .pipe(htmlclean())
    .pipe(gulp.dest(config.html.dest))
})

gulp.task('watch', function () {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    notify: false
  })

  gulp.watch(config.sass.src, ['sassToCss'])
  gulp.watch(config.html.src, ['twigToHtml'])
  gulp.watch(config.js.src, ['javascript'])

  gulp.watch(config.html.src).on('change', browserSync.reload)
  gulp.watch(config.js.src).on('change', browserSync.reload)
  gulp.watch(config.sass.src).on('change', browserSync.reload)
})

gulp.task('default', ['sassToCss', 'twigToHtml', 'watch'])