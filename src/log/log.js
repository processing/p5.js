/* Log
    log()
*/

define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.log = function() {
    if (window.console && console.log) {
      console.log.bind(console);
    }
  };

  return p5;

});