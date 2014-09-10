define(function (require) {

  'use strict';

  var p5 = require('core');
  var frames = [];

  /**
   *  Save the current canvas as an image. In Safari, will open the
   *  image in the window and the user must provide their own
   *  filename on save-as. Other browsers will either save the
   *  file immediately, or prompt the user with a dialogue window.
   *
   *  @param  {[String]} filename
   *  @param  {[String]} extension 'jpg' or 'png'
   *  @param  {[Canvas]} canvas a variable representing a
   *                             specific html5 canvas (optional).
   */
  p5.prototype.saveCanvas = function(_cnv, filename, extension) {
    if (!extension) {
      extension = p5.prototype._checkFileExtension(filename, extension)[1];
      if (extension === '') {
        extension = 'png';
      }
    }
    var cnv;
    if (_cnv) {
      cnv = _cnv;
    } else if (this._curElement && this._curElement.elt) {
      cnv = this._curElement.elt;
    }

    if ( p5.prototype._isSafari() ) {
      var aText = 'Hello, Safari user!\n';
      aText += 'Now capturing a screenshot...\n';
      aText += 'To save this image,\n';
      aText += 'go to File --> Save As.\n';
      alert(aText);
      window.location.href = cnv.toDataURL();
    } else {
      var mimeType;
      if (typeof(extension) === 'undefined') {
        extension = 'png';
        mimeType = 'image/png';
      }
      else {
        switch(extension){
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
    }
  };

  /**
   *  Capture a sequence of frames that can be used to create a movie.
   *  Accepts a callback. For example, you may wish to send the frames
   *  to a server where they can be stored or converted into a movie.
   *  If no callback is provided, the browser will attempt to download
   *  all of the images that have just been created.
   *  
   *  @param  {[type]}   filename  [description]
   *  @param  {[type]}   extension [description]
   *  @param  {[type]}   _duration [description]
   *  @param  {[type]}   _fps      [description]
   *  @param  {[Function]} callback  [description]
   *  @return {[type]}             [description]
   */
  p5.prototype.saveFrames = function(fName, ext, _duration, _fps, callback) {
    var duration = _duration || 3;
    duration = p5.prototype.constrain(duration, 0, 15);
    duration = duration * 1000;
    var fps = _fps || 15;
    fps = p5.prototype.constrain(fps, 0, 22);
    var count = 0;

    var makeFrame = p5.prototype._makeFrame;
    var cnv = this._curElement.elt;
    var frameFactory = setInterval(function(){
      makeFrame(fName + count, ext, cnv);
      count++;
    },1000/fps);

    setTimeout(function(){
      clearInterval(frameFactory);
      if (callback) {
        callback(frames);
      }
      else {
        for (var i = 0; i < frames.length; i++) {
          var f = frames[i];
          p5.prototype.downloadFile(f.imageData, f.filename, f.ext);
        }
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

