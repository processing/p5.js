// Browsers use error strings to build their error messages. These can be
// different across different browsers. We can build a list of these strings
// so that the FES is able to extract the required info from the errors given
// by the browser
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
