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
   * Can run in "global" or "instance" mode:
   *   "global" - 
   *   "instance" - 
   *
   * Public fields on a p5 instance:
   * 
   *
   * @param  {HTMLElement}  node - to attach the instance to
   * @param  {Function}     sketch - with a setup() and draw() properties
   * @return {p5}
   */
  var p5 = function(sketch, node) {

    // ******************************************
    // PUBLIC p5 PROTOTYPE PROPERTIES
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

    // Curves
    this._bezierDetail = 20;
    this._curveDetail = 20;

    // TODO: ???
    this.curElement = null;
    this.matrices = [[1,0,0,1,0,0]];

    // TODO: ???
    this.settings = {
      // Structure
      loop: true,
      fill: false,
      updateInterval: 0,
      rectMode: constants.CORNER,
      imageMode: constants.CORNER,
      ellipseMode: constants.CENTER,
      colorMode: constants.RGB,
      mousePressed: false,
      angleMode: constants.RADIANS
    };

    // ******************************************
    // PRIVATE p5 PROTOTYPE PROPERTIES
    //

    // Keep a reference to when this instance was created
    this._startTime = new Date().getTime(); // private?

    this._userNode = node;

    // TODO: ???
    this._preloadCount = 0; // private?

    // Tracks whether p5 is running in "global" or "instance" mode
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

    // Curves
    this._curveDetail = 20;

    // TODO: ???
    this.styles = [];

    // If the user has created a global setup or draw function,
    // assume "global" mode and make everything global
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

  // ******************************************
  // PRIVATE p5 PROTOTYPE METHODS
  //

  /**
   * _start
   *
   * TODO: ???
   * looks for "preload" on sketch or on window
   * 
   * @return {Undefined}
   */
  p5.prototype._start = function () {
    // Always create a default canvas.
    // Later on if the user calls createCanvas, this default one
    // will be replaced
    this.createCanvas(800, 600, true);

    // Set input node if there was one
    if (this._userNode) {
      if (typeof this._userNode === 'string') {
        this._userNode = document.getElementById(this._userNode);
      }
    }

    var userPreload = this.preload || window.preload; // look for "preload"
    var context = this._isGlobal ? window : this;
    if (userPreload) {
      context.loadJSON = function (path) {
        return context._preload('loadJSON', path); // _preload?
      };
      context.loadStrings = function (path) {
        return context._preload('loadStrings', path); // _preload?
      };
      context.loadXML = function (path) {
        return context._preload('loadXML', path); // _preload?
      };
      context.loadImage = function (path) {
        return context._preload('loadImage', path); // _preload?
      };
      userPreload();
      context.loadJSON = p5.prototype.loadJSON;
      context.loadStrings = p5.prototype.loadStrings;
      context.loadXML = p5.prototype.loadXML;
      context.loadImage = p5.prototype.loadImage;
    } else {
      this._setup();
      this._runFrames();
      this._draw();
    }
  };

  /**
   * _preload
   *
   * TODO: ???
   * 
   * @return {Undefined}
   */
  p5.prototype._preload = function (func, path) {
    var context = this._isGlobal ? window : this;
    context._setProperty('preload-count', context._preloadCount + 1);
    return this[func](path, function (resp) {
      context._setProperty('preload-count', context._preloadCount - 1);
      if (context._preloadCount === 0) {
        context._setup();
        context._runFrames();
        context._draw();
      }
    });
  };

  /**
   * _setup
   *
   * TODO: ???
   * 
   * @return {Undefined}
   */
  p5.prototype._setup = function() {
    // Short-circuit on this, in case someone used the library in "global" mode earlier
    var userSetup = this.setup || window.setup;
    if (typeof userSetup === 'function') {
      userSetup();
    }
  };

  /**
   * _draw
   * 
   * TODO: ???
   * 
   * @return {Undefined}
   */
  p5.prototype._draw = function () {
    var now = new Date().getTime();
    this._frameRate = 1000.0/(now - this._lastFrameTime);
    this._lastFrameTime = now;

    var userDraw = this.draw || window.draw;

    if (this.settings.loop) {
      setTimeout(function() {
        window.requestDraw(this._draw.bind(this));
      }.bind(this), 1000 / this._targetFrameRate);
    }
    // call user's draw
    if (typeof userDraw === 'function') {
      userDraw();
    }

    this.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
  };

  /**
   * _runFrames
   *
   * TODO: ???
   * 
   * @return {Undefined}
   */
  p5.prototype._runFrames = function() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(function(){
      this._setProperty('frameCount', this.frameCount + 1);
    }.bind(this), 1000/this._targetFrameRate);
  };

  /**
   * _applyDefaults
   *
   * TODO: ???
   * 
   * @return {Undefined}
   */
  p5.prototype._applyDefaults = function() {
    this.curElement.context.fillStyle = '#FFFFFF';
    this.curElement.context.strokeStyle = '#000000';
    this.curElement.context.lineCap = constants.ROUND;
  };

  /**
   * _setProperty
   *
   * TODO: ???
   * 
   * @return {Undefined}
   */
  p5.prototype._setProperty = function(prop, value) {
    this[prop] = value;
    if (this._isGlobal) {
      window[prop] = value;
    }
  };

  return p5;

});