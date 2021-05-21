// Different browsers may use different error strings for the same error.
// Extracting info from them is much easier and cleaner if we have a predefined
// lookup against which we try and match the errors obtained from the browser,
// classify them into types and extract the required information. The contents
// of this file serve as that lookup. The FES can use this to give a simplified
// explanation for all kinds of errors.
const strings = {
  ReferenceError: [
    {
      msg: '{{}} is not defined',
      type: 'NOTDEFINED',
      browser: 'all'
    },
    {
      msg: "Can't find variable: {{}}",
      type: 'NOTDEFINED',
      browser: 'Safari'
    },
    {
      msg: "Cannot access '{{.}}' before initialization",
      type: 'CANNOTACCESS',
      browser: 'Chrome'
    }
  ],
  SyntaxError: [
    {
      msg: 'illegal character',
      type: 'INVALIDTOKEN',
      browser: 'Firefox'
    },
    {
      msg: 'Invalid character',
      type: 'INVALIDTOKEN',
      browser: 'Safari'
    },
    {
      msg: 'Invalid or unexpected token',
      type: 'INVALIDTOKEN',
      browser: 'Chrome'
    },
    {
      msg: "Unexpected token '{{.}}'",
      type: 'UNEXPECTEDTOKEN',
      browser: 'Chrome'
    },
    {
      msg: "expected {{.}}, got '{{.}}'",
      type: 'UNEXPECTEDTOKEN',
      browser: 'Chrome'
    },
    {
      msg: "Identifier '{{.}}' has already been declared",
      type: 'REDECLAREDVARIABLE',
      browser: 'Chrome'
    },
    {
      msg: 'Missing initializer in const declaration',
      type: 'MISSINGINITIALIZER',
      browser: 'Chrome'
    },
    {
      msg: 'Illegal return statement',
      type: 'BADRETURNORYIELD',
      browser: 'Chrome'
    }
  ],
  TypeError: [
    {
      msg: '{{.}} is not a function',
      type: 'NOTFUNC',
      browser: 'all'
    },
    {
      msg: "Cannot read property '{{.}}' of null",
      type: 'READNULL',
      browser: 'chrome'
    },
    {
      msg: "Cannot read property '{{.}}' of undefined",
      type: 'READUDEFINED',
      browser: 'chrome'
    },
    {
      msg: 'Assignment to constant variable',
      type: 'CONSTASSIGN',
      browser: 'chrome'
    }
  ]
};

export default strings;
