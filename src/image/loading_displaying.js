(function(exports) {
  exports.image = function() { 
    var vals;
    if (arguments.length < 5) {
      vals = PHelper.modeAdjust(arguments[1], arguments[2], arguments[0].width, arguments[0].height, PVariables.imageMode);
    } else {
      vals = PHelper.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], PVariables.imageMode);
    }
    PVariables.curElement.context.drawImage(arguments[0].sourceImage, vals.x, vals.y, vals.w, vals.h);
  };

  exports.imageMode = function(m) {
    if (m == exports.CORNER || m == exports.CORNERS || m == exports.CENTER) PVariables.imageMode = m;
  };

  function getPixels(img) {
    var c = document.createElement('canvas');
    c.width = img.width; 
    c.height = img.height;
    var ctx = c.getContext('2d');
    ctx.drawImage(img);
    return ctx.getImageData(0,0,c.width,c.height);
  }
  //// PIXELS ////////////////////////////////

  exports.pixels = [];
  exports.blend = function() {
    // TODO
  };
  exports.copy = function() {
    // TODO
  };
  exports.filter = function() {
    // TODO
  };
  exports.get = function(x, y) {
    var pix = PVariables.curElement.context.getImageData(0, 0, width, height).data;
    /*if (typeof w !== 'undefined' && typeof h !== 'undefined') {
      var region = [];
      for (var j=0; j<h; j++) {
        for (var i=0; i<w; i++) {
          region[i*w+j] = pix[(y+j)*width+(x+i)]; 
        }
      }
      return region;
    }*/
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        var offset = 4*y*width+4*x;
        var c = [pix[offset], pix[offset+1], pix[offset+2], pix[offset+3]];
        return c;
      } else {
        return [0, 0, 0, 255];
      }
    } else {
      return [0, 0, 0, 255];
    }
  };
  exports.loadPixels = function() { 
    var a = PVariables.curElement.context.getImageData(0, 0, width, height).data;
    pixels = [];
    for (var i=0; i < a.length; i+=4) {
      pixels.push([a[i], a[i+1], a[i+2], a[i+3]]); // each pixels entry: [r, g, b, a]
    }
  };
  exports.set = function() {
    // TODO
  };
  exports.updatePixels = function() {
    /*if (typeof pixels !== 'undefined') {
      var imgd = PVariables.curElement.context.getImageData(x, y, width, height);
      imgd = pixels;
      context.putImageData(imgd, 0, 0);
    }*/
  };

}(window));
