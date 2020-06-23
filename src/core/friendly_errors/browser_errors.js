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
    }
  ]
};

export default strings;
