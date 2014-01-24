/* Log
    log()
*/

define(function (require) {

  'use strict';

  var Processing = require('core');

  Processing.prototype.log = function() {
    if (window.console && console.log) {
      console.log.apply(console, arguments);
    }
  };

  return Processing;

});