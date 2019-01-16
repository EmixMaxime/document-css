const {src, watch, series, dest} = require('gulp')
const htmlclean = require('gulp-htmlclean')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const twig = require('gulp-twig')
const marked = require('marked')

marked.setOptions({
  breaks: true
})

const markdown = require('./gulp-markdown')(marked)
const hbs = require('handlebars')
const handlebars = require('./gulp-handlebars')(hbs)
const rename = require('gulp-rename')

const browserSync = require('browser-sync').create()

const config = {
  sass: {
    // src: ['./lib/scss/**/**/*.scss', './src/scss/**/**/*.scss'],
    src: './lib/scss/**/**/*.scss',
    dest: './dist/css'
  },

  html: {
    src: './src/writing/**/**/*.twig',
    dest: './dist'
  },

  md: {
    src: './src/writing/**/**/*.md',
    dest: './dist'
  },

  doc: {
    src: './src/layout.hbs',
    dest: './dist'
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

const javascript = () => {
  return src(config.js.src)
    .pipe(dest(config.js.dest))
}

const twigToHtml = () => {
  return src(config.html.src)
    .pipe(twig())
    .pipe(htmlclean())
    .pipe(dest(config.html.dest))
}

const markdownToHtml = () => {
  return src(config.md.src)
    .pipe(markdown())
    .pipe(rename('tmp.html'))
    .pipe(dest(config.md.dest))
}

const Fs = require('fs')

const assembleDoc = () => {
  const templateData = {
    body: Fs.readFileSync('./dist/tmp.html')
  }

  return src(config.doc.src)
    .pipe(handlebars({templateData}))
    .pipe(rename('index.html'))
    .pipe(dest(config.doc.dest))
}

const w = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    notify: false
  })

  watch(config.sass.src, sassToCss)
  watch(config.html.src, twigToHtml)
  watch(config.js.src, javascript)
  watch(config.md.src, markdownToHtml)

  watch(config.html.src).on('change', browserSync.reload)
  watch(config.js.src).on('change', browserSync.reload)
  return watch(config.sass.src).on('change', browserSync.reload)
}

exports.default = series(sassToCss, twigToHtml, markdownToHtml, assembleDoc, w)
