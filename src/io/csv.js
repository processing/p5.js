/*
The MIT License (MIT)

Copyright (c) 2019 Evan Plaice <evanplaice@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export function parse (csv, options, reviver = v => v) {
  const ctx = Object.create(null)
  ctx.options = options || {}
  ctx.reviver = reviver
  ctx.value = ''
  ctx.entry = []
  ctx.output = []
  ctx.col = 1
  ctx.row = 1

  ctx.options.delimiter = ctx.options.delimiter === undefined ? '"' : options.delimiter;
  if(ctx.options.delimiter.length > 1 || ctx.options.delimiter.length === 0)
    throw Error(`CSVError: delimiter must be one character [${ctx.options.separator}]`)

  ctx.options.separator = ctx.options.separator === undefined ? ',' : options.separator;
  if(ctx.options.separator.length > 1 || ctx.options.separator.length === 0)
    throw Error(`CSVError: separator must be one character [${ctx.options.separator}]`)

  const lexer = new RegExp(`${escapeRegExp(ctx.options.delimiter)}|${escapeRegExp(ctx.options.separator)}|\r\n|\n|\r|[^${escapeRegExp(ctx.options.delimiter)}${escapeRegExp(ctx.options.separator)}\r\n]+`, 'y')
  const isNewline = /^(\r\n|\n|\r)$/

  let matches = []
  let match = ''
  let state = 0

  while ((matches = lexer.exec(csv)) !== null) {
    match = matches[0]

    switch (state) {
      case 0: // start of entry
        switch (true) {
          case match === ctx.options.delimiter:
            state = 3
            break
          case match === ctx.options.separator:
            state = 0
            valueEnd(ctx)
            break
          case isNewline.test(match):
            state = 0
            valueEnd(ctx)
            entryEnd(ctx)
            break
          default:
            ctx.value += match
            state = 2
            break
        }
        break
      case 2: // un-delimited input
        switch (true) {
          case match === ctx.options.separator:
            state = 0
            valueEnd(ctx)
            break
          case isNewline.test(match):
            state = 0
            valueEnd(ctx)
            entryEnd(ctx)
            break
          default:
            state = 4
            throw Error(`CSVError: Illegal state [row:${ctx.row}, col:${ctx.col}]`)
        }
        break
      case 3: // delimited input
        switch (true) {
          case match === ctx.options.delimiter:
            state = 4
            break
          default:
            state = 3
            ctx.value += match
            break
        }
        break
      case 4: // escaped or closing delimiter
        switch (true) {
          case match === ctx.options.delimiter:
            state = 3
            ctx.value += match
            break
          case match === ctx.options.separator:
            state = 0
            valueEnd(ctx)
            break
          case isNewline.test(match):
            state = 0
            valueEnd(ctx)
            entryEnd(ctx)
            break
          default:
            throw Error(`CSVError: Illegal state [row:${ctx.row}, col:${ctx.col}]`)
        }
        break
    }
  }

  // flush the last value
  if (ctx.entry.length !== 0) {
    valueEnd(ctx)
    entryEnd(ctx)
  }

  return ctx.output
}

export function stringify (array, options = {}, replacer = v => v) {
  const ctx = Object.create(null)
  ctx.options = options
  ctx.options.eof = ctx.options.eof !== undefined ? ctx.options.eof : true
  ctx.row = 1
  ctx.col = 1
  ctx.output = ''

  ctx.options.delimiter = ctx.options.delimiter === undefined ? '"' : options.delimiter;
  if(ctx.options.delimiter.length > 1 || ctx.options.delimiter.length === 0)
    throw Error(`CSVError: delimiter must be one character [${ctx.options.separator}]`)

  ctx.options.separator = ctx.options.separator === undefined ? ',' : options.separator;
  if(ctx.options.separator.length > 1 || ctx.options.separator.length === 0)
    throw Error(`CSVError: separator must be one character [${ctx.options.separator}]`)

  const needsDelimiters = new RegExp(`${escapeRegExp(ctx.options.delimiter)}|${escapeRegExp(ctx.options.separator)}|\r\n|\n|\r`)

  array.forEach((row, rIdx) => {
    let entry = ''
    ctx.col = 1
    row.forEach((col, cIdx) => {
      if (typeof col === 'string') {
        col = col.replace(new RegExp(ctx.options.delimiter, 'g'), `${ctx.options.delimiter}${ctx.options.delimiter}`)
        col = needsDelimiters.test(col) ? `${ctx.options.delimiter}${col}${ctx.options.delimiter}` : col
      }
      entry += replacer(col, ctx.row, ctx.col)
      if (cIdx !== row.length - 1) {
        entry += ctx.options.separator
      }
      ctx.col++
    })
    switch (true) {
      case ctx.options.eof:
      case !ctx.options.eof && rIdx !== array.length - 1:
        ctx.output += `${entry}\n`
        break
      default:
        ctx.output += `${entry}`
        break
    }
    ctx.row++
  })

  return ctx.output
}

function valueEnd (ctx) {
  const value = ctx.options.typed ? inferType(ctx.value) : ctx.value
  ctx.entry.push(ctx.reviver(value, ctx.row, ctx.col))
  ctx.value = ''
  ctx.col++
}

function entryEnd (ctx) {
  ctx.output.push(ctx.entry)
  ctx.entry = []
  ctx.row++
  ctx.col = 1
}

function inferType (value) {
  const isNumber = /.\./

  switch (true) {
    case value === 'true':
    case value === 'false':
      return value === 'true'
    case isNumber.test(value):
      return parseFloat(value)
    case isFinite(value):
      return parseInt(value)
    default:
      return value
  }
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
