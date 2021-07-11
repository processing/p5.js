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
    },
    {
      msg: "can't access lexical declaration '{{.}}' before initialization",
      type: 'CANNOTACCESS',
      browser: 'Firefox'
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
      msg: 'redeclaration of {} {{.}}',
      type: 'REDECLAREDVARIABLE',
      browser: 'Firefox'
    },
    {
      msg: 'Missing initializer in const declaration',
      type: 'MISSINGINITIALIZER',
      browser: 'Chrome'
    },
    {
      msg: 'missing = in const declaration',
      type: 'MISSINGINITIALIZER',
      browser: 'Firefox'
    },
    {
      msg: 'Illegal return statement',
      type: 'BADRETURNORYIELD',
      browser: 'Chrome'
    },
    {
      msg: 'return not in function',
      type: 'BADRETURNORYIELD',
      browser: 'Firefox'
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
      browser: 'Chrome'
    },
    {
      msg: '{{.}} is null',
      type: 'READNULL',
      browser: 'Firefox'
    },
    {
      msg: "Cannot read property '{{.}}' of undefined",
      type: 'READUDEFINED',
      browser: 'Chrome'
    },
    {
      msg: '{{.}} is undefined',
      type: 'READUDEFINED',
      browser: 'Firefox'
    },
    {
      msg: 'Assignment to constant variable',
      type: 'CONSTASSIGN',
      browser: 'Chrome'
    },
    {
      msg: "invalid assignment to const '{{.}}'",
      type: 'CONSTASSIGN',
      browser: 'Firefox'
    }
  ]
};

export default strings;
