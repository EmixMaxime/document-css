const through2 = require('through2')
const PluginError = require('plugin-error')
const path = require('path')

function replaceExt(npath, ext) {
  if (typeof npath !== 'string') {
    return npath
  }

  if (npath.length === 0) {
    return npath
  }

  const nFileName = path.basename(npath, path.extname(npath)) + ext;
  return path.join(path.dirname(npath), nFileName);
}

const PLUGIN_NAME = 'gulp-handlebars'

module.exports = handlebars => opts => {

  opts = opts || {}
  const compilerOptions = opts.compilerOptions || {}

  return through2.obj((file, enc, callback) => {
    if (file.isNull()) {
      return callback(null, file)
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'))
      return callback()
    }

    const contents = file.contents.toString()
    let template = null

    try {
        template = handlebars.compile(contents, compilerOptions)
    }
    catch (err) {
      this.emit('error', new PluginError(PLUGIN_NAME, err, {
        fileName: file.path
      }))
      return callback()
    }

    const result = template(opts.templateData)

    file.contents = new Buffer(result)
    file.path = replaceExt(file.path, '.js')

    callback(null, file)
  })
}
