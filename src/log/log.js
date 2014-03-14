/* Log
    log()
*/

define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.log = function() {
    if (window.console && console.log) {
      console.log.apply(console, arguments);
    }
  };

  return p5;

});