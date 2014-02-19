define(function (require) {

  'use strict';

  require('shim');

  // Core needs the PVariables object
  var constants = require('constants');

  // Create the Processing constructor
  var Processing = function(canvs, sketchProc) {

    var self = this;

    // Keep a reference to when this instance was created
    this.startTime = new Date().getTime();
    this.preload_count = 0;

    this.isGlobal = false;

    // Environment
    this.frameCount = 0;
    this._frameRate = 30;
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
    this._textLeading = 15;
    this._textFont = 'sans-serif';
    this._textSize = 12;
    this._textStyle = constants.NORMAL;

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

    this.styles = [];


    // If the user has created a global setup function,
    // assume "beginner mode" and make everything global
    if (!sketchProc) {

      this.isGlobal = true;

      // Loop through methods on the prototype and attach them to the window
      for (var method in Processing.prototype) {
        window[method] = Processing.prototype[method].bind(this);
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

      sketchProc(this);

    }

    if (document.readyState === 'complete') {
      this._start();
    } else {
      window.addEventListener('load', self._start.bind(self), false);
    }

  };

  // Create is called at window.onload
  Processing._init = function() {

    // If the user has created a global setup function,
    // assume "beginner mode" and make everything global
    if (window.setup && typeof window.setup === 'function') {

      // Create a processing instance
      new Processing();

    }

  };

  Processing.prototype._start = function() {

    // Create the default canvas
    this.createGraphics(800, 600, true);

    var preload = this.preload || window.preload;
    var context = this.isGlobal ? window : this;

    if (preload) {

      context.loadJSON = function(path) { return this.preloadFunc('loadJSON', path); };
      context.loadStrings = function(path) { return this.preloadFunc('loadStrings', path); };
      context.loadXML = function(path) { return this.preloadFunc('loadXML', path); };
      context.loadImage = function(path) { return this.preloadFunc('loadImage', path); };

      preload();

      context.loadJSON = Processing.prototype.loadJSON;
      context.loadStrings = Processing.prototype.loadStrings;
      context.loadXML = Processing.prototype.loadXML;
      context.loadImage = Processing.prototype.loadImage;

    } else {

      this._setup();

      this._runFrames();

      this._drawSketch();

    }

  };

  Processing.prototype.preloadFunc = function(func, path) {

    this._setProperty('preload_count', this.preload_count + 1);

    return this[func](path, function (resp) {

      this._setProperty('preload_count', this.preload_count - 1);

      if (this.preload_count === 0) {

        this._setup();

        this._runFrames();

        this._drawSketch();

      }
    });
  };

  Processing.prototype._setup = function() {

    // Short-circuit on this, in case someone used the library globally earlier
    var setup = this.setup || window.setup;

    if (typeof setup === 'function') {

      setup();

    } else {

      throw 'sketch must include a setup function';

    }
  };

  Processing.prototype._drawSketch = function () {
    var self = this;
    var userDraw = self.draw || window.draw;

    if (self.settings.loop) {
      setTimeout(function() {
        window.requestDraw(self._drawSketch.bind(self));
      }, 1000 / self.frameRate());
    }
    // call draw
    if (typeof userDraw === 'function') {
      userDraw();
    }

    self.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
  };

  Processing.prototype._runFrames = function() {

    var self = this;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(function(){
      self._setProperty('frameCount', self.frameCount + 1);
    }, 1000/self.frameRate());

  };

  Processing.prototype._applyDefaults = function() {
    this.curElement.context.fillStyle = '#FFFFFF';
    this.curElement.context.strokeStyle = '#000000';
    this.curElement.context.lineCap = constants.ROUND;
  };

  Processing.prototype._setProperty = function(prop, value) {
    this[prop] = value;

    if (this.isGlobal) {
      window[prop] = value;
    }
  };

  return Processing;

});