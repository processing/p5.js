(function(exports) {

  exports.createImage = function(w, h, format) {
    return new PImage(w, h);
  }; //pend format?

  PHelper.loadImage = function(path, callback) {
    var pimg = new PImage();
    pimg.sourceImage = new Image();

    pimg.sourceImage.onload = function() {
      pimg.width = pimg.sourceImage.width;
      pimg.height = pimg.sourceImage.height;

      // draw to canvas to get image data
      var canvas = document.createElement('canvas');
      var ctx=canvas.getContext("2d");
      canvas.width=pimg.width;
      canvas.height=pimg.height;
      ctx.drawImage(pimg.sourceImage, 0, 0);
      // note: this only works with local files!
      // pimg.imageData = ctx.getImageData(0, 0, pimg.width, pimg.height); //PEND: taking it out for now to allow url loading
      if (typeof callback !== 'undefined') callback();

    };

    pimg.sourceImage.src = path; 
    return pimg;
  };
 
  PHelper.preloadImage = function(path) {
    PVariables.preload_count++;
    return PHelper.loadImage(path, function () {
      if (--PVariables.preload_count === 0) setup();
    });
  };

  function PImage(w, h) {
    this.width = w || 1;
    this.height = h || 1;
    this.imageData = PVariables.curElement.context.createImageData(this.width, this.height); 
    for (var i = 3, len = this.imageData.length; i < len; i += 4) {
      this.imageData[i] = 255;
    }
    this.pixels = [];
  }
  PImage.prototype.loadPixels = function() { 
    this.pixels = [];
    var data = this.imageData.data;
    for (var i=0; i<data.length; i+=4) {
      this.pixels.push([data[i], data[i+1], data[i+2], data[i+3]]);
    }
  };
  /*PImage.prototype.updatePixels = function() {
    this.sourceImage.getContext('2d').putImageData(this.imageData, 0, 0);
  };*/
  PImage.prototype.resize = function() {
    // TODO
  };
  PImage.prototype.get = function(x, y, w, h) {
    var wp = w ? w : 1;
    var hp = h ? h : 1;
    var vals = [];
    for (var j=y; j<y+hp; j++) {
      for (var i=x; i<x+wp; i++) {
        vals.push(this.pixels[j*this.width+i]);
      }
    }
  };
  PImage.prototype.set = function(x, y, val) {
    var ind = y*this.width+x;
    if (typeof val.image == 'undefined') {
      if (ind < this.pixels.length) {
        this.pixels[ind] = val;
      }
    } else {
      // TODO: copy image pixels
    }
  };
  /*PImage.prototype.mask = function(m) {
    // Masks part of an image with another image as an alpha channel
    var op = PVariables.curElement.context.globalCompositeOperation;
    PVariables.curElement.context.drawImage(m.image, 0, 0);
    PVariables.curElement.context.globalCompositeOperation = 'source-atop';
    PVariables.curElement.context.drawImage(this.image, 0, 0);
    PVariables.curElement.context.globalCompositeOperation = op;
  };*/
  PImage.prototype.filter = function() {
    // TODO
    // Converts the image to grayscale or black and white
  };
  PImage.prototype.copy = function() {
    // TODO
    // Copies the entire image
  };
  PImage.prototype.blend = function() {
    // TODO
    // Copies a pixel or rectangle of pixels using different blending modes
  };
  PImage.prototype.save = function() {
    // TODO
    // Saves the image to a TIFF, TARGA, PNG, or JPEG file*/
  };
  exports.PImage = PImage;
}(window));
