define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.save = function() {
    this.open(this.curElement.elt.toDataURL('image/png'));
  };

  return p5;
});