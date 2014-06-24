define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.save = function() {
    window.open(this._curElement.elt.toDataURL('image/png'));
  };

  p5.prototype.testRender = function(file, callback) {
    this.loadPixels();
    var p = this.pixels;
    var ctx = this;

    this.clear();

    this.loadImage(file, function(img) {
      ctx.image(img, 0, 0, 100, 100);

      ctx.loadPixels();
      var n = 0;
      for (var i=0; i<p.length; i++) {
        for (var j=0; j<4; j++) {
          var diff = Math.abs(p[i][j] - ctx.pixels[i][j]);
          n += diff;
        }
      }
      var same = (n/(256*4*p.length)) < 0.015;
      callback(same);
    });
  };
  return p5;
});

