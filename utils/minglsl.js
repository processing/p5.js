var path = require('path');
var fs = require('fs');
var quote = require('quote-stream');
var through = require('through2');
var staticModule = require('static-module');
var resolve = require('resolve');

var tokenStream = require('glsl-tokenizer/stream');
var parser = require('glsl-parser');
var deparser = require('glsl-deparser');
var minify = require('glsl-min-stream');

module.exports = function minglsl(file, opts) {
  if (/\.json$/.test(file)) return through();

  var vars = {
    __filename: file,
    __dirname: path.dirname(file),
    require: {
      resolve: function(p) {
        return resolve.sync(p, { basedir: path.dirname(file) });
      }
    }
  };
  if (!opts) opts = {};
  if (opts.vars)
    Object.keys(opts.vars).forEach(function(key) {
      vars[key] = opts.vars[key];
    });

  var sm = staticModule(
    {
      fs: {
        readFileSync: function(file, enc) {
          var isBuffer = enc === null || enc === undefined;
          if (isBuffer) {
            enc = 'base64';
          } else if (enc && typeof enc === 'object' && enc.encoding) {
            enc = enc.encoding;
          }
          var stream = fs
            .createReadStream(file, { encoding: enc })
            .on('error', function(err) {
              sm.emit('error', err);
            })
            .pipe(tokenStream())
            .pipe(parser())
            .pipe(minify(['main']))
            .pipe(deparser(false))
            .pipe(quote())
            .pipe(through(write, end));
          if (isBuffer) {
            stream.push('Buffer(');
          }
          return stream;

          function write(buf, enc, next) {
            this.push(buf);
            next();
          }
          function end(next) {
            if (isBuffer) this.push(',"base64")');
            this.push(null);
            sm.emit('file', file);
            next();
          }
        }
      }
    },
    {
      vars: vars,
      varModules: { path: path },
      parserOpts: opts && opts.parserOpts,
      sourceMap: opts && (opts.sourceMap || (opts._flags && opts._flags.debug))
    }
  );
  return sm;
};
