define(function (require) {

  'use strict';

  require('shim');

  // Core needs the PVariables object
  // TODO: ???
  var constants = require('constants');

  /**
   * p5 instance constructor
   *
   * A p5 instance....
   *
   * Can run in 'global' or 'instance' mode.
   *
   * Public fields on a p5 instance:
   * 
   *
   * @param  {HTMLElement}  node
   * @param  {Function}     sketch
   * @return {p5}
   */
  var p5 = function(node, sketch) {

    // ******************************************
    // PUBLIC FIELDS
    //   

    // Environment
    this.frameCount = 0;
    this.focused = true;
    this.displayWidth = screen.width;
    this.displayHeight = screen.height;

    // Shape.Vertex
    this.shapeKind = null;
    this.shapeInited = false;

    // Input.Mouse
    this.mouseX = 0;
    this.mouseY = 0;
    this.pmouseX = 0;
    this.pmouseY = 0;
    this.mouseButton = 0;

    // Input.Keyboard
    this.key = '';
    this.keyCode = 0;
    this.keyDown = false;

    // Input.Touch
    this.touchX = 0;
    this.touchY = 0;

    // Output.Files
    this.pWriters = [];

    // Text

    // Curves
    this._bezierDetail = 20;
    this._curveDetail = 20;

    this.curElement = null;
    this.matrices = [[1,0,0,1,0,0]];

    this.settings = {
      // Structure
      loop: true,
      fill: false,
      startTime: 0,
      updateInterval: 0,
      rectMode: constants.CORNER,
      imageMode: constants.CORNER,
      ellipseMode: constants.CENTER,
      colorMode: constants.RGB,
      mousePressed: false,
      angleMode: constants.RADIANS
    };

    // ******************************************
    // PRIVATE FIELDS
    //

    // Keep a reference to when this instance was created
    this.startTime = new Date().getTime(); // private?

    // TODO: ???
    this._preloadCount = 0; // private?

    // Tracks whether p5 is running in 'global' or 'instance' mode
    this._isGlobal = false; // private?

    // Environment
    this._frameRate = 0;
    this._lastFrameTime = 0;
    this._targetFrameRate = 60;

    // Text
    this._textLeading = 15;
    this._textFont = 'sans-serif';
    this._textSize = 12;
    this._textStyle = constants.NORMAL;

    this.styles = [];

    // If the user has created a global setup function,
    // assume "beginner mode" and make everything global
    if (!sketch) {
      this._isGlobal = true;
      // Loop through methods on the prototype and attach them to the window
      for (var method in p5.prototype) {
        window[method] = p5.prototype[method].bind(this);
      }
      // Attach its properties to the window
      for (var prop in this) {
        if (this.hasOwnProperty(prop)) {
          window[prop] = this[prop];
        }
      }
      for (var constant in constants) {
        if (constants.hasOwnProperty(constant)) {
          window[constant] = constants[constant];
        }
      }
    } else {
      sketch(this);
    }

    if (document.readyState === 'complete') {
      this._start();
    } else {
      window.addEventListener('load', this._start.bind(this), false);
    }

  };

  // Create is called at window.onload
  p5._init = function() {
    // If the user has created a global setup function,
    // assume "beginner mode" and make everything global
    // Create a processing instance
    console.log('_init');
    new p5();
  };

  p5.prototype._start = function () {
    this.createCanvas(800, 600, true);
    var preload = this.preload || window.preload;
    var context = this._isGlobal ? window : this;
    if (preload) {
      context.loadJSON = function (path) {
        return context.preloadFunc('loadJSON', path);
      };
      context.loadStrings = function (path) {
        return context.preloadFunc('loadStrings', path);
      };
      context.loadXML = function (path) {
        return context.preloadFunc('loadXML', path);
      };
      context.loadImage = function (path) {
        return context.preloadFunc('loadImage', path);
      };
      preload();
      context.loadJSON = p5.prototype.loadJSON;
      context.loadStrings = p5.prototype.loadStrings;
      context.loadXML = p5.prototype.loadXML;
      context.loadImage = p5.prototype.loadImage;
    } else {
      this._setup();
      this._runFrames();
      this._drawSketch();
    }
  };

  p5.prototype.preloadFunc = function (func, path) {
    var context = this._isGlobal ? window : this;
    context._setProperty('preload-count', context.preloadCount + 1);
    return this[func](path, function (resp) {
      context._setProperty('preload-count', context.preloadCount - 1);
      if (context.preloadCount === 0) {
        context._setup();
        context._runFrames();
        context._drawSketch();
      }
    });
  };
  
  p5.prototype._setup = function() {
    // Short-circuit on this, in case someone used the library globally earlier
    var setup = this.setup || window.setup;
    if (typeof setup === 'function') {
      setup();
    } else {
      var context = this._isGlobal ? window : this;
      context.createCanvas(600, 400, true);
    }
  };

  p5.prototype._drawSketch = function () {

    var now = new Date().getTime();
    this._frameRate = 1000.0/(now - this._lastFrameTime);
    this._lastFrameTime = now;

    var userDraw = this.draw || window.draw;

    if (this.settings.loop) {
      setTimeout(function() {
        window.requestDraw(this._drawSketch.bind(this));
      }, 1000 / this._targetFrameRate);
    }
    // call draw
    if (typeof userDraw === 'function') {
      userDraw();
    }

    this.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
  };

  p5.prototype._runFrames = function() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(function(){
      this._setProperty('frameCount', this.frameCount + 1);
    }, 1000/this._targetFrameRate);
  };

  p5.prototype._applyDefaults = function() {
    this.curElement.context.fillStyle = '#FFFFFF';
    this.curElement.context.strokeStyle = '#000000';
    this.curElement.context.lineCap = constants.ROUND;
  };

  p5.prototype._setProperty = function(prop, value) {
    this[prop] = value;
    if (this._isGlobal) {
      window[prop] = value;
    }
  };

  return p5;

});