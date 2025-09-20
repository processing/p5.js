// This contains a data table used by ./fes_core.js/fesErrorMonitor().
//
// Note: Different browsers use different error strings for the same error.
// Extracting info from the browser error messages is easier and cleaner
// if we have a predefined lookup. This file serves as that lookup.
// Using this lookup we match the errors obtained from the browser, classify
// them into types and extract the required information.
// The FES can use the extracted info to generate a friendly error message
// for the matching error.
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
      msg: 'Cannot read {{.}} null',
      type: 'READNULL',
      browser: 'Chrome'
    },
    {
      msg: '{{.}} is null',
      type: 'READNULL',
      browser: 'Firefox'
    },
    {
      msg: 'Cannot read {{.}} undefined',
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
