define(function (require) {

  'use strict';

  var p5 = require('core');

  var frames = [];

  /**
   *  Save the current canvas as an image.
   *  
   *  @param  {[type]} filename  [description]
   *  @param  {[type]} extension [description]
   *  @return {[type]}           [description]
   */
  p5.prototype.save = function(filename, extension, _cnv) {
    var cnv;
    if (this) {
      cnv = this._curElement.elt;
    } else {
      cnv = _cnv;
    }
    var mimeType;
    if (!extension) {
      extension = 'png';
      mimeType = 'image/png';
    }
    else {
      switch(extension.toLowerCase()){
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      default:
        mimeType = 'image/png';
        break;
      }
    }

    var downloadMime = 'image/octet-stream';
    var imageData = cnv.toDataURL(mimeType);
    imageData = imageData.replace(mimeType, downloadMime);

    p5.prototype.downloadFile(imageData, filename, extension);
  };

  // duration (in seconds), maximum 15
  p5.prototype.saveFrames = function(filename, extension, _duration, _fps) {
    var duration = _duration || 3;
    duration = p5.prototype.constrain(duration, 0, 15);
    duration = duration * 1000;
    var fps = _fps || 15;
    fps = p5.prototype.constrain(fps, 0, 22);
    var count = 0;

    var makeFrame = p5.prototype._makeFrame;
    var cnv = this._curElement.elt;
    var frameFactory = setInterval(function(){
      makeFrame(filename + count, extension, cnv);
      count++;
    },1000/fps);

    setTimeout(function(){
      clearInterval(frameFactory);
      for (var i = 0; i < frames.length; i++) {
        var f = frames[i];
        p5.prototype.downloadFile(f.imageData, f.filename, f.ext);
      }
      frames = []; // clear frames
    }, duration + 0.01);
  };

  p5.prototype._makeFrame = function(filename, extension, _cnv) {
    var cnv;
    if (this) {
      cnv = this._curElement.elt;
    } else {
      cnv = _cnv;
    }
    var mimeType;
    if (!extension) {
      extension = 'png';
      mimeType = 'image/png';
    }
    else {
      switch(extension.toLowerCase()){
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      default:
        mimeType = 'image/png';
        break;
      }
    }
    var downloadMime = 'image/octet-stream';
    var imageData = cnv.toDataURL(mimeType);
    imageData = imageData.replace(mimeType, downloadMime);

    var thisFrame = {};
    thisFrame.imageData = imageData;
    thisFrame.filename = filename;
    thisFrame.ext = extension;
    frames.push(thisFrame);
  };

  return p5;
});

