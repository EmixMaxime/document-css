const gulp = require('gulp')
const Fs = require('fs')
const {src, watch, series, dest} = require('gulp')
const htmlclean = require('gulp-htmlclean')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const marked = require('marked')
const concat = require('gulp-concat')
const del = require('del')
const markdown = require('gulp-markdown')

marked.setOptions({
  breaks: true
})

// const markdown = require('./gulp-markdown')(marked)
const hbs = require('handlebars')
const handlebars = require('./gulp-handlebars')(hbs)
const rename = require('gulp-rename')

const browserSync = require('browser-sync').create()

const IMAGES_REGEX = '*.+(jpg|jpgeg|png|gif|svg)'

const config = {
  dest: './dist',

  sass: {
    src: ['./lib/scss/**/**/*.scss', './src/scss/**/**/*.scss'],
    // src: './lib/scss/**/**/*.scss',
    dest: './dist/css'
  },

  images: {
    src: [`./lib/**/**/${IMAGES_REGEX}`, `./src/**/${IMAGES_REGEX}`],
    dest: './dist'
  },

  md: {
    src: './src/writing/**/**/**.md',
    dest: './dist/writing'
  },

  html: {
    src: './dist/writing/*.html'
  },

  doc: {
    layout: './src/layout.hbs',
    htmlSourceFileName: 'tmp.html',
    finalFileName: 'index.html'
  },

  js: {
    src: './lib/js/**/**/*.js',
    dest: './dist/js'
  }
}

const sassToCss = () => {
  return src(config.sass.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(config.sass.dest))
    // .pipe(browserSync.stream())
}

const images = () => {
  return src(config.images.src)
    .pipe(dest(config.images.dest))
}

const javascript = () => {
  return src(config.js.src)
    .pipe(dest(config.js.dest))
}

const markdownToHtml = () => {
  return src(config.md.src)
    .pipe(markdown())
    .pipe(dest(config.md.dest))
}

const mergeHTML = () => {
  return src(config.html.src)
    .pipe(concat(config.doc.htmlSourceFileName))
    .pipe(dest(config.dest))
}

const assembleDoc = () => {
  const templateData = {
    body: Fs.readFileSync(`./dist/${config.doc.htmlSourceFileName}`)
  }

  return src(config.doc.layout)
    .pipe(handlebars({templateData}))
    .pipe(rename(config.doc.finalFileName))
    .pipe(dest(config.dest))
}

const clean = () => {
  return del([
    'dist/*',
  ])
}

const w = () => {

  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    notify: false
  })

  watch(config.sass.src, sassToCss)
  watch(config.js.src, javascript)
  watch(config.md.src, gulp.series(markdownToHtml, mergeHTML, assembleDoc))

  watch(config.dest + '/index.html').on('change', browserSync.reload)
  watch(config.js.src).on('change', browserSync.reload)
  return watch(config.sass.src).on('change', browserSync.reload)
}

exports.default = series(clean, sassToCss, images, markdownToHtml, mergeHTML, assembleDoc, w)
