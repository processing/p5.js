/*! p5.js v0.3.12 November 23, 2014 */
var shim = function (require) {
    window.requestDraw = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
        window.setTimeout(callback, 1000 / 60);
      };
    }();
  }({});
var constants = function (require) {
    var PI = Math.PI;
    return {
      ARROW: 'default',
      CROSS: 'crosshair',
      HAND: 'pointer',
      MOVE: 'move',
      TEXT: 'text',
      WAIT: 'wait',
      HALF_PI: PI / 2,
      PI: PI,
      QUARTER_PI: PI / 4,
      TAU: PI * 2,
      TWO_PI: PI * 2,
      DEGREES: 'degrees',
      RADIANS: 'radians',
      CORNER: 'corner',
      CORNERS: 'corners',
      RADIUS: 'radius',
      RIGHT: 'right',
      LEFT: 'left',
      CENTER: 'center',
      POINTS: 'points',
      LINES: 'lines',
      TRIANGLES: 'triangles',
      TRIANGLE_FAN: 'triangles_fan',
      TRIANGLE_STRIP: 'triangles_strip',
      QUADS: 'quads',
      QUAD_STRIP: 'quad_strip',
      CLOSE: 'close',
      OPEN: 'open',
      CHORD: 'chord',
      PIE: 'pie',
      PROJECT: 'square',
      SQUARE: 'butt',
      ROUND: 'round',
      BEVEL: 'bevel',
      MITER: 'miter',
      RGB: 'rgb',
      HSB: 'hsb',
      AUTO: 'auto',
      ALT: 18,
      BACKSPACE: 8,
      CONTROL: 17,
      DELETE: 46,
      DOWN_ARROW: 40,
      ENTER: 13,
      ESCAPE: 27,
      LEFT_ARROW: 37,
      OPTION: 18,
      RETURN: 13,
      RIGHT_ARROW: 39,
      SHIFT: 16,
      TAB: 9,
      UP_ARROW: 38,
      BLEND: 'normal',
      ADDITIVE: 'lighter',
      DARKEST: 'darken',
      LIGHTEST: 'lighten',
      DIFFERENCE: 'difference',
      EXCLUSION: 'exclusion',
      MULTIPLY: 'multiply',
      SCREEN: 'screen',
      REPLACE: 'source-over',
      OVERLAY: 'overlay',
      HARD_LIGHT: 'hard-light',
      SOFT_LIGHT: 'soft-light',
      DODGE: 'color-dodge',
      BURN: 'color-burn',
      NORMAL: 'normal',
      ITALIC: 'italic',
      BOLD: 'bold',
      LINEAR: 'linear',
      QUADRATIC: 'quadratic',
      BEZIER: 'bezier',
      CURVE: 'curve'
    };
  }({});
var core = function (require, shim, constants) {
    'use strict';
    var constants = constants;
    var p5 = function (sketch, node) {
      this._setupDone = false;
      this._pixelDensity = window.devicePixelRatio || 1;
      this._startTime = new Date().getTime();
      this._userNode = node;
      this._curElement = null;
      this._elements = [];
      this._preloadCount = 0;
      this._updateInterval = 0;
      this._isGlobal = false;
      this._loop = true;
      this._styles = [];
      this._defaultCanvasSize = {
        width: 100,
        height: 100
      };
      this._events = {
        'mousemove': null,
        'mousedown': null,
        'mouseup': null,
        'click': null,
        'mousewheel': null,
        'mouseover': null,
        'mouseout': null,
        'keydown': null,
        'keyup': null,
        'keypress': null,
        'touchstart': null,
        'touchmove': null,
        'touchend': null,
        'resize': null
      };
      this._loadingScreenId = 'p5_loading';
      this._start = function () {
        if (this._userNode) {
          if (typeof this._userNode === 'string') {
            this._userNode = document.getElementById(this._userNode);
          }
        }
        this._loadingScreen = document.getElementById(this._loadingScreenId);
        if (!this._loadingScreen) {
          this._loadingScreen = document.createElement('loadingDiv');
          this._loadingScreen.innerHTML = 'loading...';
          this._loadingScreen.style.position = 'absolute';
          var node = this._userNode || document.body;
          node.appendChild(this._loadingScreen);
        }
        this.createCanvas(this._defaultCanvasSize.width, this._defaultCanvasSize.height, true);
        var userPreload = this.preload || window.preload;
        var context = this._isGlobal ? window : this;
        if (userPreload) {
          this._preloadMethods.forEach(function (f) {
            context[f] = function (path) {
              return context._preload(f, path);
            };
          });
          userPreload();
          if (this._preloadCount === 0) {
            this._setup();
            this._runFrames();
            this._draw();
          }
        } else {
          this._setup();
          this._runFrames();
          this._draw();
        }
      }.bind(this);
      this._preload = function (func, path) {
        var context = this._isGlobal ? window : this;
        context._setProperty('_preloadCount', context._preloadCount + 1);
        return p5.prototype[func].call(context, path, function (resp) {
          context._setProperty('_preloadCount', context._preloadCount - 1);
          if (context._preloadCount === 0) {
            context._setup();
            context._runFrames();
            context._draw();
          }
        });
      }.bind(this);
      this._setup = function () {
        var context = this._isGlobal ? window : this;
        if (typeof context.preload === 'function') {
          this._preloadMethods.forEach(function (f) {
            context[f] = p5.prototype[f];
          });
        }
        if (typeof context.setup === 'function') {
          context.setup();
        }
        this.canvas.style.visibility = '';
        this.canvas.className = this.canvas.className.replace('p5_hidden', '');
        this._setupDone = true;
        this._loadingScreen.parentNode.removeChild(this._loadingScreen);
      }.bind(this);
      this._draw = function () {
        var userSetup = this.setup || window.setup;
        var now = new Date().getTime();
        this._frameRate = 1000 / (now - this._lastFrameTime);
        this._lastFrameTime = now;
        var userDraw = this.draw || window.draw;
        if (this._loop) {
          if (this._drawInterval) {
            clearInterval(this._drawInterval);
          }
          this._drawInterval = setTimeout(function () {
            window.requestDraw(this._draw.bind(this));
          }.bind(this), 1000 / this._targetFrameRate);
        }
        if (typeof userDraw === 'function') {
          this.push();
          if (typeof userSetup === 'undefined') {
            this.scale(this._pixelDensity, this._pixelDensity);
          }
          this._registeredMethods.pre.forEach(function (f) {
            f.call(this);
          });
          userDraw();
          this._registeredMethods.post.forEach(function (f) {
            f.call(this);
          });
          this.pop();
        }
        this._updatePMouseCoords();
        this._updatePTouchCoords();
      }.bind(this);
      this._runFrames = function () {
        if (this._updateInterval) {
          clearInterval(this._updateInterval);
        }
        this._updateInterval = setInterval(function () {
          this._setProperty('frameCount', this.frameCount + 1);
        }.bind(this), 1000 / this._targetFrameRate);
      }.bind(this);
      this._setProperty = function (prop, value) {
        this[prop] = value;
        if (this._isGlobal) {
          window[prop] = value;
        }
      }.bind(this);
      this.remove = function () {
        if (this._curElement) {
          this._loop = false;
          if (this._drawInterval) {
            clearTimeout(this._drawInterval);
          }
          if (this._updateInterval) {
            clearTimeout(this._updateInterval);
          }
          for (var ev in this._events) {
            window.removeEventListener(ev, this._events[ev]);
          }
          for (var i = 0; i < this._elements.length; i++) {
            var e = this._elements[i];
            if (e.elt.parentNode) {
              e.elt.parentNode.removeChild(e.elt);
            }
            for (var elt_ev in e._events) {
              e.elt.removeEventListener(elt_ev, e._events[elt_ev]);
            }
          }
          var self = this;
          this._registeredMethods.remove.forEach(function (f) {
            if (typeof f !== 'undefined') {
              f.call(self);
            }
          });
          if (this._isGlobal) {
            for (var p in p5.prototype) {
              try {
                delete window[p];
              } catch (x) {
                window[p] = undefined;
              }
            }
            for (var p2 in this) {
              if (this.hasOwnProperty(p2)) {
                try {
                  delete window[p2];
                } catch (x) {
                  window[p2] = undefined;
                }
              }
            }
          }
        }
      }.bind(this);
      for (var k in constants) {
        p5.prototype[k] = constants[k];
      }
      if (!sketch) {
        this._isGlobal = true;
        for (var p in p5.prototype) {
          if (typeof p5.prototype[p] === 'function') {
            var ev = p.substring(2);
            if (!this._events.hasOwnProperty(ev)) {
              window[p] = p5.prototype[p].bind(this);
            }
          } else {
            window[p] = p5.prototype[p];
          }
        }
        for (var p2 in this) {
          if (this.hasOwnProperty(p2)) {
            window[p2] = this[p2];
          }
        }
      } else {
        sketch(this);
      }
      for (var e in this._events) {
        var f = this['on' + e];
        if (f) {
          var m = f.bind(this);
          window.addEventListener(e, m);
          this._events[e] = m;
        }
      }
      var self = this;
      window.addEventListener('focus', function () {
        self._setProperty('focused', true);
      });
      window.addEventListener('blur', function () {
        self._setProperty('focused', false);
      });
      if (document.readyState === 'complete') {
        this._start();
      } else {
        window.addEventListener('load', this._start.bind(this), false);
      }
    };
    p5.prototype._preloadMethods = [
      'loadJSON',
      'loadImage',
      'loadStrings',
      'loadXML',
      'loadShape',
      'loadTable'
    ];
    p5.prototype._registeredMethods = {
      pre: [],
      post: [],
      remove: []
    };
    p5.prototype.registerPreloadMethod = function (m) {
      p5.prototype._preloadMethods.push(m);
    }.bind(this);
    p5.prototype.registerMethod = function (name, m) {
      if (!p5.prototype._registeredMethods.hasOwnProperty(name)) {
        p5.prototype._registeredMethods[name] = [];
      }
      p5.prototype._registeredMethods[name].push(m);
    }.bind(this);
    return p5;
  }({}, shim, constants);
var p5Color = function (require, core, constants) {
    var p5 = core;
    var constants = constants;
    p5.Color = function (pInst, vals) {
      if (vals instanceof Array) {
        this.rgba = vals;
      } else {
        var formatted = p5.Color._getFormattedColor.apply(pInst, vals);
        if (pInst._colorMode === constants.HSB) {
          this.hsba = formatted;
          this.rgba = p5.Color._getRGB(formatted);
        } else {
          this.rgba = formatted;
        }
      }
      var c = p5.Color._normalizeColorArray.call(pInst, this.rgba);
      this.colorString = p5.Color._getColorString(c);
      return this;
    };
    p5.Color._getFormattedColor = function () {
      if (arguments[0] instanceof Array) {
        return p5.Color.getNormalizedColor.apply(this, arguments[0]);
      }
      var r, g, b, a;
      if (arguments.length >= 3) {
        r = arguments[0];
        g = arguments[1];
        b = arguments[2];
        a = typeof arguments[3] === 'number' ? arguments[3] : 255;
      } else {
        if (this._colorMode === constants.RGB) {
          r = g = b = arguments[0];
        } else {
          r = b = arguments[0];
          g = 0;
        }
        a = typeof arguments[1] === 'number' ? arguments[1] : 255;
      }
      return [
        r,
        g,
        b,
        a
      ];
    };
    p5.Color._normalizeColorArray = function (arr) {
      var isRGB = this._colorMode === constants.RGB;
      var maxArr = isRGB ? this._maxRGB : this._maxHSB;
      arr[0] *= 255 / maxArr[0];
      arr[1] *= 255 / maxArr[1];
      arr[2] *= 255 / maxArr[2];
      arr[3] *= 255 / maxArr[3];
      return arr;
    };
    p5.Color._getRGB = function (hsba) {
      var h = hsba[0];
      var s = hsba[1];
      var v = hsba[2];
      h /= 255;
      s /= 255;
      v /= 255;
      var RGBA = [];
      if (s === 0) {
        RGBA = [
          Math.round(v * 255),
          Math.round(v * 255),
          Math.round(v * 255),
          hsba[3]
        ];
      } else {
        var var_h = h * 6;
        if (var_h === 6) {
          var_h = 0;
        }
        var var_i = Math.floor(var_h);
        var var_1 = v * (1 - s);
        var var_2 = v * (1 - s * (var_h - var_i));
        var var_3 = v * (1 - s * (1 - (var_h - var_i)));
        var var_r;
        var var_g;
        var var_b;
        if (var_i === 0) {
          var_r = v;
          var_g = var_3;
          var_b = var_1;
        } else if (var_i === 1) {
          var_r = var_2;
          var_g = v;
          var_b = var_1;
        } else if (var_i === 2) {
          var_r = var_1;
          var_g = v;
          var_b = var_3;
        } else if (var_i === 3) {
          var_r = var_1;
          var_g = var_2;
          var_b = v;
        } else if (var_i === 4) {
          var_r = var_3;
          var_g = var_1;
          var_b = v;
        } else {
          var_r = v;
          var_g = var_1;
          var_b = var_2;
        }
        RGBA = [
          Math.round(var_r * 255),
          Math.round(var_g * 255),
          Math.round(var_b * 255),
          hsba[3]
        ];
      }
      return RGBA;
    };
    p5.Color._getHSB = function (rgba) {
      var var_R = rgba[0] / 255;
      var var_G = rgba[1] / 255;
      var var_B = rgba[2] / 255;
      var var_Min = Math.min(var_R, var_G, var_B);
      var var_Max = Math.max(var_R, var_G, var_B);
      var del_Max = var_Max - var_Min;
      var H;
      var S;
      var V = var_Max;
      if (del_Max === 0) {
        H = 0;
        S = 0;
      } else {
        S = del_Max / var_Max;
        var del_R = ((var_Max - var_R) / 6 + del_Max / 2) / del_Max;
        var del_G = ((var_Max - var_G) / 6 + del_Max / 2) / del_Max;
        var del_B = ((var_Max - var_B) / 6 + del_Max / 2) / del_Max;
        if (var_R === var_Max) {
          H = del_B - del_G;
        } else if (var_G === var_Max) {
          H = 1 / 3 + del_R - del_B;
        } else if (var_B === var_Max) {
          H = 2 / 3 + del_G - del_R;
        }
        if (H < 0) {
          H += 1;
        }
        if (H > 1) {
          H -= 1;
        }
      }
      return [
        Math.round(H * 255),
        Math.round(S * 255),
        Math.round(V * 255),
        rgba[3]
      ];
    };
    p5.Color._getColorString = function (a) {
      for (var i = 0; i < 3; i++) {
        a[i] = Math.floor(a[i]);
      }
      var alpha = typeof a[3] !== 'undefined' ? a[3] / 255 : 1;
      return 'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + alpha + ')';
    };
    p5.Color._getCanvasColor = function () {
      if (arguments[0] instanceof p5.Color) {
        if (arguments.length === 1) {
          return arguments[0].colorString;
        } else {
          var c = arguments[0].rgba;
          c[3] = arguments[1];
          c = p5.Color._normalizeColorArray.call(this, c);
          return p5.Color._getColorString(c);
        }
      } else if (arguments[0] instanceof Array) {
        if (arguments.length === 1) {
          return p5.Color._getColorString(arguments[0]);
        } else {
          var isRGB = this._colorMode === constants.RGB;
          var maxA = isRGB ? this._maxRGB[3] : this._maxHSB[3];
          arguments[0][3] = 255 * arguments[1] / maxA;
          return p5.Color._getColorString(arguments[0]);
        }
      } else {
        var e = p5.Color._getFormattedColor.apply(this, arguments);
        e = p5.Color._normalizeColorArray.call(this, e);
        if (this._colorMode === constants.HSB) {
          e = p5.Color._getRGB(e);
        }
        return p5.Color._getColorString(e);
      }
    };
    return p5.Color;
  }({}, core, constants);
var p5Element = function (require, core) {
    var p5 = core;
    p5.Element = function (elt, pInst) {
      this.elt = elt;
      this._pInst = pInst;
      this._events = {};
      this.width = this.elt.offsetWidth;
      this.height = this.elt.offsetHeight;
    };
    p5.Element.prototype.parent = function (p) {
      if (typeof p === 'string') {
        p = document.getElementById(p);
      } else if (p instanceof p5.Element) {
        p = p.elt;
      }
      p.appendChild(this.elt);
      return this;
    };
    p5.Element.prototype.id = function (id) {
      this.elt.id = id;
      return this;
    };
    p5.Element.prototype.class = function (c) {
      this.elt.className += ' ' + c;
      return this;
    };
    p5.Element.prototype.mousePressed = function (fxn) {
      attachListener('mousedown', fxn, this);
      return this;
    };
    p5.Element.prototype.mouseWheel = function (fxn) {
      attachListener('mousewheel', fxn, this);
      return this;
    };
    p5.Element.prototype.mouseReleased = function (fxn) {
      attachListener('mouseup', fxn, this);
      return this;
    };
    p5.Element.prototype.mouseClicked = function (fxn) {
      attachListener('click', fxn, this);
      return this;
    };
    p5.Element.prototype.mouseMoved = function (fxn) {
      attachListener('mousemove', fxn, this);
      return this;
    };
    p5.Element.prototype.mouseOver = function (fxn) {
      attachListener('mouseover', fxn, this);
      return this;
    };
    p5.Element.prototype.mouseOut = function (fxn) {
      attachListener('mouseout', fxn, this);
      return this;
    };
    function attachListener(ev, fxn, ctx) {
      var f = fxn.bind(ctx);
      ctx.elt.addEventListener(ev, f, false);
      ctx._events[ev] = f;
    }
    p5.Element.prototype._setProperty = function (prop, value) {
      this[prop] = value;
    };
    return p5.Element;
  }({}, core);
var p5Graphics = function (require, core, constants) {
    var p5 = core;
    var constants = constants;
    p5.Graphics = function (elt, pInst, isMainCanvas) {
      p5.Element.call(this, elt, pInst);
      this.canvas = elt;
      this.drawingContext = this.canvas.getContext('2d');
      this._pInst = pInst;
      if (isMainCanvas) {
        this._isMainCanvas = true;
        this._pInst._setProperty('_curElement', this);
        this._pInst._setProperty('canvas', this.canvas);
        this._pInst._setProperty('drawingContext', this.drawingContext);
        this._pInst._setProperty('width', this.width);
        this._pInst._setProperty('height', this.height);
      } else {
        this.canvas.style.display = 'none';
        this._styles = [];
      }
    };
    p5.Graphics.prototype = Object.create(p5.Element.prototype);
    p5.Graphics.prototype._applyDefaults = function () {
      this.drawingContext.fillStyle = '#FFFFFF';
      this.drawingContext.strokeStyle = '#000000';
      this.drawingContext.lineCap = constants.ROUND;
      this.drawingContext.font = 'normal 12px sans-serif';
    };
    p5.Graphics.prototype.resize = function (w, h) {
      this.width = w;
      this.height = h;
      this.elt.width = w * this._pInst._pixelDensity;
      this.elt.height = h * this._pInst._pixelDensity;
      this.elt.style.width = w + 'px';
      this.elt.style.height = h + 'px';
      if (this._isMainCanvas) {
        this._pInst._setProperty('width', this.width);
        this._pInst._setProperty('height', this.height);
      }
      this.drawingContext.scale(this._pInst._pixelDensity, this._pInst._pixelDensity);
    };
    return p5.Graphics;
  }({}, core, constants);
var filters = function (require) {
    'use strict';
    var Filters = {};
    Filters._toPixels = function (canvas) {
      if (canvas instanceof ImageData) {
        return canvas.data;
      } else {
        return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      }
    };
    Filters._getARGB = function (data, i) {
      var offset = i * 4;
      return data[offset + 3] << 24 & 4278190080 | data[offset] << 16 & 16711680 | data[offset + 1] << 8 & 65280 | data[offset + 2] & 255;
    };
    Filters._setPixels = function (pixels, data) {
      var offset = 0;
      for (var i = 0, al = pixels.length; i < al; i++) {
        offset = i * 4;
        pixels[offset + 0] = (data[i] & 16711680) >>> 16;
        pixels[offset + 1] = (data[i] & 65280) >>> 8;
        pixels[offset + 2] = data[i] & 255;
        pixels[offset + 3] = (data[i] & 4278190080) >>> 24;
      }
    };
    Filters._toImageData = function (canvas) {
      if (canvas instanceof ImageData) {
        return canvas;
      } else {
        return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
      }
    };
    Filters._createImageData = function (width, height) {
      Filters._tmpCanvas = document.createElement('canvas');
      Filters._tmpCtx = Filters._tmpCanvas.getContext('2d');
      return this._tmpCtx.createImageData(width, height);
    };
    Filters.apply = function (canvas, func, filterParam) {
      var ctx = canvas.getContext('2d');
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var newImageData = func(imageData, filterParam);
      if (newImageData instanceof ImageData) {
        ctx.putImageData(newImageData, 0, 0, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
      }
    };
    Filters.threshold = function (canvas, level) {
      var pixels = Filters._toPixels(canvas);
      if (level === undefined) {
        level = 0.5;
      }
      var thresh = Math.floor(level * 255);
      for (var i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];
        var grey = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        var val;
        if (grey >= thresh) {
          val = 255;
        } else {
          val = 0;
        }
        pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
      }
    };
    Filters.gray = function (canvas) {
      var pixels = Filters._toPixels(canvas);
      for (var i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];
        var gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
      }
    };
    Filters.opaque = function (canvas) {
      var pixels = Filters._toPixels(canvas);
      for (var i = 0; i < pixels.length; i += 4) {
        pixels[i + 3] = 255;
      }
      return pixels;
    };
    Filters.invert = function (canvas) {
      var pixels = Filters._toPixels(canvas);
      for (var i = 0; i < pixels.length; i += 4) {
        pixels[i] = 255 - pixels[i];
        pixels[i + 1] = 255 - pixels[i + 1];
        pixels[i + 2] = 255 - pixels[i + 2];
      }
    };
    Filters.posterize = function (canvas, level) {
      var pixels = Filters._toPixels(canvas);
      if (level < 2 || level > 255) {
        throw new Error('Level must be greater than 2 and less than 255 for posterize');
      }
      var levels1 = level - 1;
      for (var i = 0; i < pixels.length; i += 4) {
        var rlevel = pixels[i];
        var glevel = pixels[i + 1];
        var blevel = pixels[i + 2];
        pixels[i] = (rlevel * level >> 8) * 255 / levels1;
        pixels[i + 1] = (glevel * level >> 8) * 255 / levels1;
        pixels[i + 2] = (blevel * level >> 8) * 255 / levels1;
      }
    };
    Filters.dilate = function (canvas) {
      var pixels = Filters._toPixels(canvas);
      var currIdx = 0;
      var maxIdx = pixels.length ? pixels.length / 4 : 0;
      var out = new Int32Array(maxIdx);
      var currRowIdx, maxRowIdx, colOrig, colOut, currLum;
      var idxRight, idxLeft, idxUp, idxDown, colRight, colLeft, colUp, colDown, lumRight, lumLeft, lumUp, lumDown;
      while (currIdx < maxIdx) {
        currRowIdx = currIdx;
        maxRowIdx = currIdx + canvas.width;
        while (currIdx < maxRowIdx) {
          colOrig = colOut = Filters._getARGB(pixels, currIdx);
          idxLeft = currIdx - 1;
          idxRight = currIdx + 1;
          idxUp = currIdx - canvas.width;
          idxDown = currIdx + canvas.width;
          if (idxLeft < currRowIdx) {
            idxLeft = currIdx;
          }
          if (idxRight >= maxRowIdx) {
            idxRight = currIdx;
          }
          if (idxUp < 0) {
            idxUp = 0;
          }
          if (idxDown >= maxIdx) {
            idxDown = currIdx;
          }
          colUp = Filters._getARGB(pixels, idxUp);
          colLeft = Filters._getARGB(pixels, idxLeft);
          colDown = Filters._getARGB(pixels, idxDown);
          colRight = Filters._getARGB(pixels, idxRight);
          currLum = 77 * (colOrig >> 16 & 255) + 151 * (colOrig >> 8 & 255) + 28 * (colOrig & 255);
          lumLeft = 77 * (colLeft >> 16 & 255) + 151 * (colLeft >> 8 & 255) + 28 * (colLeft & 255);
          lumRight = 77 * (colRight >> 16 & 255) + 151 * (colRight >> 8 & 255) + 28 * (colRight & 255);
          lumUp = 77 * (colUp >> 16 & 255) + 151 * (colUp >> 8 & 255) + 28 * (colUp & 255);
          lumDown = 77 * (colDown >> 16 & 255) + 151 * (colDown >> 8 & 255) + 28 * (colDown & 255);
          if (lumLeft > currLum) {
            colOut = colLeft;
            currLum = lumLeft;
          }
          if (lumRight > currLum) {
            colOut = colRight;
            currLum = lumRight;
          }
          if (lumUp > currLum) {
            colOut = colUp;
            currLum = lumUp;
          }
          if (lumDown > currLum) {
            colOut = colDown;
            currLum = lumDown;
          }
          out[currIdx++] = colOut;
        }
      }
      Filters._setPixels(pixels, out);
    };
    Filters.erode = function (canvas) {
      var pixels = Filters._toPixels(canvas);
      var currIdx = 0;
      var maxIdx = pixels.length ? pixels.length / 4 : 0;
      var out = new Int32Array(maxIdx);
      var currRowIdx, maxRowIdx, colOrig, colOut, currLum;
      var idxRight, idxLeft, idxUp, idxDown, colRight, colLeft, colUp, colDown, lumRight, lumLeft, lumUp, lumDown;
      while (currIdx < maxIdx) {
        currRowIdx = currIdx;
        maxRowIdx = currIdx + canvas.width;
        while (currIdx < maxRowIdx) {
          colOrig = colOut = Filters._getARGB(pixels, currIdx);
          idxLeft = currIdx - 1;
          idxRight = currIdx + 1;
          idxUp = currIdx - canvas.width;
          idxDown = currIdx + canvas.width;
          if (idxLeft < currRowIdx) {
            idxLeft = currIdx;
          }
          if (idxRight >= maxRowIdx) {
            idxRight = currIdx;
          }
          if (idxUp < 0) {
            idxUp = 0;
          }
          if (idxDown >= maxIdx) {
            idxDown = currIdx;
          }
          colUp = Filters._getARGB(pixels, idxUp);
          colLeft = Filters._getARGB(pixels, idxLeft);
          colDown = Filters._getARGB(pixels, idxDown);
          colRight = Filters._getARGB(pixels, idxRight);
          currLum = 77 * (colOrig >> 16 & 255) + 151 * (colOrig >> 8 & 255) + 28 * (colOrig & 255);
          lumLeft = 77 * (colLeft >> 16 & 255) + 151 * (colLeft >> 8 & 255) + 28 * (colLeft & 255);
          lumRight = 77 * (colRight >> 16 & 255) + 151 * (colRight >> 8 & 255) + 28 * (colRight & 255);
          lumUp = 77 * (colUp >> 16 & 255) + 151 * (colUp >> 8 & 255) + 28 * (colUp & 255);
          lumDown = 77 * (colDown >> 16 & 255) + 151 * (colDown >> 8 & 255) + 28 * (colDown & 255);
          if (lumLeft < currLum) {
            colOut = colLeft;
            currLum = lumLeft;
          }
          if (lumRight < currLum) {
            colOut = colRight;
            currLum = lumRight;
          }
          if (lumUp < currLum) {
            colOut = colUp;
            currLum = lumUp;
          }
          if (lumDown < currLum) {
            colOut = colDown;
            currLum = lumDown;
          }
          out[currIdx++] = colOut;
        }
      }
      Filters._setPixels(pixels, out);
    };
    var blurRadius;
    var blurKernelSize;
    var blurKernel;
    var blurMult;
    function buildBlurKernel(r) {
      var radius = r * 3.5 | 0;
      radius = radius < 1 ? 1 : radius < 248 ? radius : 248;
      if (blurRadius !== radius) {
        blurRadius = radius;
        blurKernelSize = 1 + blurRadius << 1;
        blurKernel = new Int32Array(blurKernelSize);
        blurMult = new Array(blurKernelSize);
        for (var l = 0; l < blurKernelSize; l++) {
          blurMult[l] = new Int32Array(256);
        }
        var bk, bki;
        var bm, bmi;
        for (var i = 1, radiusi = radius - 1; i < radius; i++) {
          blurKernel[radius + i] = blurKernel[radiusi] = bki = radiusi * radiusi;
          bm = blurMult[radius + i];
          bmi = blurMult[radiusi--];
          for (var j = 0; j < 256; j++) {
            bm[j] = bmi[j] = bki * j;
          }
        }
        bk = blurKernel[radius] = radius * radius;
        bm = blurMult[radius];
        for (var k = 0; k < 256; k++) {
          bm[k] = bk * k;
        }
      }
    }
    function blurARGB(canvas, radius) {
      var pixels = Filters._toPixels(canvas);
      var width = canvas.width;
      var height = canvas.height;
      var numPackedPixels = width * height;
      var argb = new Int32Array(numPackedPixels);
      for (var j = 0; j < numPackedPixels; j++) {
        argb[j] = Filters._getARGB(pixels, j);
      }
      var sum, cr, cg, cb, ca;
      var read, ri, ym, ymi, bk0;
      var a2 = new Int32Array(numPackedPixels);
      var r2 = new Int32Array(numPackedPixels);
      var g2 = new Int32Array(numPackedPixels);
      var b2 = new Int32Array(numPackedPixels);
      var yi = 0;
      buildBlurKernel(radius);
      var x, y, i;
      var bm;
      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          cb = cg = cr = ca = sum = 0;
          read = x - blurRadius;
          if (read < 0) {
            bk0 = -read;
            read = 0;
          } else {
            if (read >= width) {
              break;
            }
            bk0 = 0;
          }
          for (i = bk0; i < blurKernelSize; i++) {
            if (read >= width) {
              break;
            }
            var c = argb[read + yi];
            bm = blurMult[i];
            ca += bm[(c & -16777216) >>> 24];
            cr += bm[(c & 16711680) >> 16];
            cg += bm[(c & 65280) >> 8];
            cb += bm[c & 255];
            sum += blurKernel[i];
            read++;
          }
          ri = yi + x;
          a2[ri] = ca / sum;
          r2[ri] = cr / sum;
          g2[ri] = cg / sum;
          b2[ri] = cb / sum;
        }
        yi += width;
      }
      yi = 0;
      ym = -blurRadius;
      ymi = ym * width;
      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          cb = cg = cr = ca = sum = 0;
          if (ym < 0) {
            bk0 = ri = -ym;
            read = x;
          } else {
            if (ym >= height) {
              break;
            }
            bk0 = 0;
            ri = ym;
            read = x + ymi;
          }
          for (i = bk0; i < blurKernelSize; i++) {
            if (ri >= height) {
              break;
            }
            bm = blurMult[i];
            ca += bm[a2[read]];
            cr += bm[r2[read]];
            cg += bm[g2[read]];
            cb += bm[b2[read]];
            sum += blurKernel[i];
            ri++;
            read += width;
          }
          argb[x + yi] = ca / sum << 24 | cr / sum << 16 | cg / sum << 8 | cb / sum;
        }
        yi += width;
        ymi += width;
        ym++;
      }
      Filters._setPixels(pixels, argb);
    }
    Filters.blur = function (canvas, radius) {
      blurARGB(canvas, radius);
    };
    return Filters;
  }({});
var p5Image = function (require, core, filters) {
    'use strict';
    var p5 = core;
    var Filters = filters;
    p5.Image = function (width, height) {
      this.width = width;
      this.height = height;
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.drawingContext = this.canvas.getContext('2d');
      this.pixels = [];
    };
    p5.Image.prototype._setProperty = function (prop, value) {
      this[prop] = value;
    };
    p5.Image.prototype.loadPixels = function () {
      p5.prototype.loadPixels.call(this);
    };
    p5.Image.prototype.updatePixels = function (x, y, w, h) {
      p5.prototype.updatePixels.call(this, x, y, w, h);
    };
    p5.Image.prototype.get = function (x, y, w, h) {
      return p5.prototype.get.call(this, x, y, w, h);
    };
    p5.Image.prototype.set = function (x, y, imgOrCol) {
      p5.prototype.set.call(this, x, y, imgOrCol);
    };
    p5.Image.prototype.resize = function (width, height) {
      width = width || this.canvas.width;
      height = width || this.canvas.height;
      var tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      tempCanvas.getContext('2d').drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, tempCanvas.width, tempCanvas.width);
      this.canvas.width = this.width = width;
      this.canvas.height = this.height = height;
      this.drawingContext.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);
      if (this.pixels.length > 0) {
        this.loadPixels();
      }
    };
    p5.Image.prototype.copy = function () {
      p5.prototype.copy.apply(this, arguments);
    };
    p5.Image.prototype.mask = function (p5Image) {
      if (p5Image === undefined) {
        p5Image = this;
      }
      var currBlend = this.drawingContext.globalCompositeOperation;
      var scaleFactor = 1;
      if (p5Image instanceof p5.Graphics) {
        scaleFactor = p5Image._pInst._pixelDensity;
      }
      var copyArgs = [
          p5Image,
          0,
          0,
          scaleFactor * p5Image.width,
          scaleFactor * p5Image.height,
          0,
          0,
          this.width,
          this.height
        ];
      this.drawingContext.globalCompositeOperation = 'destination-out';
      this.copy.apply(this, copyArgs);
      this.drawingContext.globalCompositeOperation = currBlend;
    };
    p5.Image.prototype.filter = function (operation, value) {
      Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
    };
    p5.Image.prototype.blend = function () {
      p5.prototype.blend.apply(this, arguments);
    };
    p5.Image.prototype.save = function (filename, extension) {
      var mimeType;
      if (!extension) {
        extension = 'png';
        mimeType = 'image/png';
      } else {
        switch (extension.toLowerCase()) {
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
      var imageData = this.canvas.toDataURL(mimeType);
      imageData = imageData.replace(mimeType, downloadMime);
      p5.prototype.downloadFile(imageData, filename, extension);
    };
    return p5.Image;
  }({}, core, filters);
var polargeometry = function (require) {
    return {
      degreesToRadians: function (x) {
        return 2 * Math.PI * x / 360;
      },
      radiansToDegrees: function (x) {
        return 360 * x / (2 * Math.PI);
      }
    };
  }({});
var p5Vector = function (require, core, polargeometry, constants) {
    'use strict';
    var p5 = core;
    var polarGeometry = polargeometry;
    var constants = constants;
    p5.Vector = function () {
      var x, y, z;
      if (arguments[0] instanceof p5) {
        this.p5 = arguments[0];
        x = arguments[1][0] || 0;
        y = arguments[1][1] || 0;
        z = arguments[1][2] || 0;
      } else {
        x = arguments[0] || 0;
        y = arguments[1] || 0;
        z = arguments[2] || 0;
      }
      this.x = x;
      this.y = y;
      this.z = z;
    };
    p5.Vector.prototype.set = function (x, y, z) {
      if (x instanceof p5.Vector) {
        this.x = x.x || 0;
        this.y = x.y || 0;
        this.z = x.z || 0;
        return this;
      }
      if (x instanceof Array) {
        this.x = x[0] || 0;
        this.y = x[1] || 0;
        this.z = x[2] || 0;
        return this;
      }
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      return this;
    };
    p5.Vector.prototype.get = function () {
      if (this.p5) {
        return new p5.Vector(this.p5, [
          this.x,
          this.y,
          this.z
        ]);
      } else {
        return new p5.Vector(this.x, this.y, this.z);
      }
    };
    p5.Vector.prototype.add = function (x, y, z) {
      if (x instanceof p5.Vector) {
        this.x += x.x || 0;
        this.y += x.y || 0;
        this.z += x.z || 0;
        return this;
      }
      if (x instanceof Array) {
        this.x += x[0] || 0;
        this.y += x[1] || 0;
        this.z += x[2] || 0;
        return this;
      }
      this.x += x || 0;
      this.y += y || 0;
      this.z += z || 0;
      return this;
    };
    p5.Vector.prototype.sub = function (x, y, z) {
      if (x instanceof p5.Vector) {
        this.x -= x.x || 0;
        this.y -= x.y || 0;
        this.z -= x.z || 0;
        return this;
      }
      if (x instanceof Array) {
        this.x -= x[0] || 0;
        this.y -= x[1] || 0;
        this.z -= x[2] || 0;
        return this;
      }
      this.x -= x || 0;
      this.y -= y || 0;
      this.z -= z || 0;
      return this;
    };
    p5.Vector.prototype.mult = function (n) {
      this.x *= n || 0;
      this.y *= n || 0;
      this.z *= n || 0;
      return this;
    };
    p5.Vector.prototype.div = function (n) {
      this.x /= n;
      this.y /= n;
      this.z /= n;
      return this;
    };
    p5.Vector.prototype.mag = function () {
      return Math.sqrt(this.magSq());
    };
    p5.Vector.prototype.magSq = function () {
      var x = this.x, y = this.y, z = this.z;
      return x * x + y * y + z * z;
    };
    p5.Vector.prototype.dot = function (x, y, z) {
      if (x instanceof p5.Vector) {
        return this.dot(x.x, x.y, x.z);
      }
      return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
    };
    p5.Vector.prototype.cross = function (v) {
      var x = this.y * v.z - this.z * v.y;
      var y = this.z * v.x - this.x * v.z;
      var z = this.x * v.y - this.y * v.x;
      if (this.p5) {
        return new p5.Vector(this.p5, [
          x,
          y,
          z
        ]);
      } else {
        return new p5.Vector(x, y, z);
      }
    };
    p5.Vector.prototype.dist = function (v) {
      var d = v.get().sub(this);
      return d.mag();
    };
    p5.Vector.prototype.normalize = function () {
      return this.div(this.mag());
    };
    p5.Vector.prototype.limit = function (l) {
      var mSq = this.magSq();
      if (mSq > l * l) {
        this.div(Math.sqrt(mSq));
        this.mult(l);
      }
      return this;
    };
    p5.Vector.prototype.setMag = function (n) {
      return this.normalize().mult(n);
    };
    p5.Vector.prototype.heading = function () {
      var h = Math.atan2(this.y, this.x);
      if (this.p5) {
        if (this.p5._angleMode === constants.RADIANS) {
          return h;
        } else {
          return polarGeometry.radiansToDegrees(h);
        }
      } else {
        return h;
      }
    };
    p5.Vector.prototype.rotate = function (a) {
      if (this.p5) {
        if (this.p5._angleMode === constants.DEGREES) {
          a = polarGeometry.degreesToRadians(a);
        }
      }
      var newHeading = this.heading() + a;
      var mag = this.mag();
      this.x = Math.cos(newHeading) * mag;
      this.y = Math.sin(newHeading) * mag;
      return this;
    };
    p5.Vector.prototype.lerp = function (x, y, z, amt) {
      if (x instanceof p5.Vector) {
        return this.lerp(x.x, x.y, x.z, y);
      }
      this.x += (x - this.x) * amt || 0;
      this.y += (y - this.y) * amt || 0;
      this.z += (z - this.z) * amt || 0;
      return this;
    };
    p5.Vector.prototype.array = function () {
      return [
        this.x || 0,
        this.y || 0,
        this.z || 0
      ];
    };
    p5.Vector.fromAngle = function (angle) {
      if (this.p5) {
        if (this.p5._angleMode === constants.DEGREES) {
          angle = polarGeometry.degreesToRadians(angle);
        }
      }
      if (this.p5) {
        return new p5.Vector(this.p5, [
          Math.cos(angle),
          Math.sin(angle),
          0
        ]);
      } else {
        return new p5.Vector(Math.cos(angle), Math.sin(angle), 0);
      }
    };
    p5.Vector.random2D = function () {
      var angle;
      if (this.p5) {
        if (this.p5._angleMode === constants.DEGREES) {
          angle = this.p5.random(360);
        } else {
          angle = this.p5.random(constants.TWO_PI);
        }
      } else {
        angle = Math.random() * Math.PI * 2;
      }
      return this.fromAngle(angle);
    };
    p5.Vector.random3D = function () {
      var angle, vz;
      if (this.p5) {
        angle = this.p5.random(0, constants.TWO_PI);
        vz = this.p5.random(-1, 1);
      } else {
        angle = Math.random() * Math.PI * 2;
        vz = Math.random() * 2 - 1;
      }
      var vx = Math.sqrt(1 - vz * vz) * Math.cos(angle);
      var vy = Math.sqrt(1 - vz * vz) * Math.sin(angle);
      if (this.p5) {
        return new p5.Vector(this.p5, [
          vx,
          vy,
          vz
        ]);
      } else {
        return new p5.Vector(vx, vy, vz);
      }
    };
    p5.Vector.add = function (v1, v2) {
      return v1.get().add(v2);
    };
    p5.Vector.sub = function (v1, v2) {
      return v1.get().sub(v2);
    };
    p5.Vector.mult = function (v, n) {
      return v.get().mult(n);
    };
    p5.Vector.div = function (v, n) {
      return v.get().div(n);
    };
    p5.Vector.dot = function (v1, v2) {
      return v1.dot(v2);
    };
    p5.Vector.cross = function (v1, v2) {
      return v1.cross(v2);
    };
    p5.Vector.dist = function (v1, v2) {
      return v1.dist(v2);
    };
    p5.Vector.lerp = function (v1, v2, amt) {
      return v1.get().lerp(v2, amt);
    };
    p5.Vector.angleBetween = function (v1, v2) {
      var angle = Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
      if (this.p5) {
        if (this.p5._angleMode === constants.DEGREES) {
          angle = polarGeometry.radiansToDegrees(angle);
        }
      }
      return angle;
    };
    return p5.Vector;
  }({}, core, polargeometry, constants);
var p5TableRow = function (require, core) {
    'use strict';
    var p5 = core;
    p5.TableRow = function (str, separator) {
      var arr = [];
      var obj = {};
      if (str) {
        separator = separator || ',';
        arr = str.split(separator);
      }
      for (var i = 0; i < arr.length; i++) {
        var key = i;
        var val = arr[i];
        obj[key] = val;
      }
      this.arr = arr;
      this.obj = obj;
      this.table = null;
    };
    p5.TableRow.prototype.set = function (column, value) {
      if (typeof column === 'string') {
        var cPos = this.table.columns.indexOf(column);
        if (cPos >= 0) {
          this.obj[column] = value;
          this.arr[cPos] = value;
        } else {
          throw 'This table has no column named "' + column + '"';
        }
      } else {
        if (column < this.table.columns.length) {
          this.arr[column] = value;
          var cTitle = this.table.columns[column];
          this.obj[cTitle] = value;
        } else {
          throw 'Column #' + column + ' is out of the range of this table';
        }
      }
    };
    p5.TableRow.prototype.setNum = function (column, value) {
      var floatVal = parseFloat(value, 10);
      this.set(column, floatVal);
    };
    p5.TableRow.prototype.setString = function (column, value) {
      var stringVal = value.toString();
      this.set(column, stringVal);
    };
    p5.TableRow.prototype.get = function (column) {
      if (typeof column === 'string') {
        return this.obj[column];
      } else {
        return this.arr[column];
      }
    };
    p5.TableRow.prototype.getNum = function (column) {
      var ret;
      if (typeof column === 'string') {
        ret = parseFloat(this.obj[column], 10);
      } else {
        ret = parseFloat(this.arr[column], 10);
      }
      if (ret.toString() === 'NaN') {
        throw 'Error: ' + this.obj[column] + ' is NaN (Not a Number)';
      }
      return ret;
    };
    p5.TableRow.prototype.getString = function (column) {
      if (typeof column === 'string') {
        return this.obj[column].toString();
      } else {
        return this.arr[column].toString();
      }
    };
    return p5.TableRow;
  }({}, core);
var p5Table = function (require, core) {
    'use strict';
    var p5 = core;
    p5.Table = function (rows) {
      this.columns = [];
      this.rows = [];
    };
    p5.Table.prototype.addRow = function (row) {
      var r = row || new p5.TableRow();
      if (typeof r.arr === 'undefined' || typeof r.obj === 'undefined') {
        throw 'invalid TableRow: ' + r;
      }
      r.table = this;
      this.rows.push(r);
      return r;
    };
    p5.Table.prototype.removeRow = function (id) {
      this.rows[id].table = null;
      var chunk = this.rows.splice(id + 1, this.rows.length);
      this.rows.pop();
      this.rows = this.rows.concat(chunk);
    };
    p5.Table.prototype.getRow = function (r) {
      return this.rows[r];
    };
    p5.Table.prototype.getRows = function () {
      return this.rows;
    };
    p5.Table.prototype.findRow = function (value, column) {
      if (typeof column === 'string') {
        for (var i = 0; i < this.rows.length; i++) {
          if (this.rows[i].obj[column] === value) {
            return this.rows[i];
          }
        }
      } else {
        for (var j = 0; j < this.rows.length; j++) {
          if (this.rows[j].arr[column] === value) {
            return this.rows[j];
          }
        }
      }
      return null;
    };
    p5.Table.prototype.findRows = function (value, column) {
      var ret = [];
      if (typeof column === 'string') {
        for (var i = 0; i < this.rows.length; i++) {
          if (this.rows[i].obj[column] === value) {
            ret.push(this.rows[i]);
          }
        }
      } else {
        for (var j = 0; j < this.rows.length; j++) {
          if (this.rows[j].arr[column] === value) {
            ret.push(this.rows[j]);
          }
        }
      }
      return ret;
    };
    p5.Table.prototype.matchRow = function (regexp, column) {
      if (typeof column === 'number') {
        for (var j = 0; j < this.rows.length; j++) {
          if (this.rows[j].arr[column].match(regexp)) {
            return this.rows[j];
          }
        }
      } else {
        for (var i = 0; i < this.rows.length; i++) {
          if (this.rows[i].obj[column].match(regexp)) {
            return this.rows[i];
          }
        }
      }
      return null;
    };
    p5.Table.prototype.matchRows = function (regexp, column) {
      var ret = [];
      if (typeof column === 'number') {
        for (var j = 0; j < this.rows.length; j++) {
          if (this.rows[j].arr[column].match(regexp)) {
            ret.push(this.rows[j]);
          }
        }
      } else {
        for (var i = 0; i < this.rows.length; i++) {
          if (this.rows[i].obj[column].match(regexp)) {
            ret.push(this.rows[i]);
          }
        }
      }
      return ret;
    };
    p5.Table.prototype.getColumn = function (value) {
      var ret = [];
      if (typeof value === 'string') {
        for (var i = 0; i < this.rows.length; i++) {
          ret.push(this.rows[i].obj[value]);
        }
      } else {
        for (var j = 0; j < this.rows.length; j++) {
          ret.push(this.rows[j].arr[value]);
        }
      }
      return ret;
    };
    p5.Table.prototype.clearRows = function () {
      delete this.rows;
      this.rows = [];
    };
    p5.Table.prototype.addColumn = function (title) {
      var t = title || null;
      this.columns.push(t);
    };
    p5.Table.prototype.getColumnCount = function () {
      return this.columns.length;
    };
    p5.Table.prototype.getRowCount = function () {
      return this.rows.length;
    };
    p5.Table.prototype.removeTokens = function (chars, column) {
      var escape = function (s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      };
      var charArray = [];
      for (var i = 0; i < chars.length; i++) {
        charArray.push(escape(chars.charAt(i)));
      }
      var regex = new RegExp(charArray.join('|'), 'g');
      if (typeof column === 'undefined') {
        for (var c = 0; c < this.columns.length; c++) {
          for (var d = 0; d < this.rows.length; d++) {
            var s = this.rows[d].arr[c];
            s = s.replace(regex, '');
            this.rows[d].arr[c] = s;
            this.rows[d].obj[this.columns[c]] = s;
          }
        }
      } else if (typeof column === 'string') {
        for (var j = 0; j < this.rows.length; j++) {
          var val = this.rows[j].obj[column];
          val = val.replace(regex, '');
          this.rows[j].obj[column] = val;
          var pos = this.columns.indexOf(column);
          this.rows[j].arr[pos] = val;
        }
      } else {
        for (var k = 0; k < this.rows.length; k++) {
          var str = this.rows[k].arr[column];
          str = str.replace(regex, '');
          this.rows[k].arr[column] = str;
          this.rows[k].obj[this.columns[column]] = str;
        }
      }
    };
    p5.Table.prototype.trim = function (column) {
      var regex = new RegExp(' ', 'g');
      if (typeof column === 'undefined') {
        for (var c = 0; c < this.columns.length; c++) {
          for (var d = 0; d < this.rows.length; d++) {
            var s = this.rows[d].arr[c];
            s = s.replace(regex, '');
            this.rows[d].arr[c] = s;
            this.rows[d].obj[this.columns[c]] = s;
          }
        }
      } else if (typeof column === 'string') {
        for (var j = 0; j < this.rows.length; j++) {
          var val = this.rows[j].obj[column];
          val = val.replace(regex, '');
          this.rows[j].obj[column] = val;
          var pos = this.columns.indexOf(column);
          this.rows[j].arr[pos] = val;
        }
      } else {
        for (var k = 0; k < this.rows.length; k++) {
          var str = this.rows[k].arr[column];
          str = str.replace(regex, '');
          this.rows[k].arr[column] = str;
          this.rows[k].obj[this.columns[column]] = str;
        }
      }
    };
    p5.Table.prototype.removeColumn = function (c) {
      var cString;
      var cNumber;
      if (typeof c === 'string') {
        cString = c;
        cNumber = this.columns.indexOf(c);
        console.log('string');
      } else {
        cNumber = c;
        cString = this.columns[c];
      }
      var chunk = this.columns.splice(cNumber + 1, this.columns.length);
      this.columns.pop();
      this.columns = this.columns.concat(chunk);
      for (var i = 0; i < this.rows.length; i++) {
        var tempR = this.rows[i].arr;
        var chip = tempR.splice(cNumber + 1, tempR.length);
        tempR.pop();
        this.rows[i].arr = tempR.concat(chip);
        delete this.rows[i].obj[cString];
      }
    };
    return p5.Table;
  }({}, core);
var colorcreating_reading = function (require, core, p5Color) {
    'use strict';
    var p5 = core;
    p5.prototype.alpha = function (c) {
      if (c instanceof p5.Color) {
        return c.rgba[3];
      } else if (c instanceof Array) {
        return c[3];
      } else {
        throw new Error('Needs p5.Color or pixel array as argument.');
      }
    };
    p5.prototype.blue = function (c) {
      if (c instanceof Array) {
        return c[2];
      } else if (c instanceof p5.Color) {
        return c.rgba[2];
      } else {
        throw new Error('Needs p5.Color or pixel array as argument.');
      }
    };
    p5.prototype.brightness = function (c) {
      if (!c instanceof p5.Color) {
        throw new Error('Needs p5.Color as argument.');
      }
      if (!c.hsba) {
        c.hsba = p5.Color.getRGB(c.rgba);
        c.hsba = c.hsba.concat(c.rgba[3]);
      }
      return c.hsba[2];
    };
    p5.prototype.color = function () {
      if (arguments[0] instanceof Array) {
        return new p5.Color(this, arguments[0], true);
      } else {
        return new p5.Color(this, arguments);
      }
    };
    p5.prototype.green = function (c) {
      if (c instanceof Array) {
        return c[1];
      } else if (c instanceof p5.Color) {
        return c.rgba[1];
      } else {
        throw new Error('Needs p5.Color or pixel array as argument.');
      }
    };
    p5.prototype.hue = function (c) {
      if (!c instanceof p5.Color) {
        throw new Error('Needs p5.Color as argument.');
      }
      if (!c.hsba) {
        c.hsba = p5.Color.getRGB(c.rgba);
      }
      return c.hsba[0];
    };
    p5.prototype.lerpColor = function (c1, c2, amt) {
      if (c1 instanceof Array) {
        var c = [];
        for (var i = 0; i < c1.length; i++) {
          c.push(p5.prototype.lerp(c1[i], c2[i], amt));
        }
        return c;
      } else if (c1 instanceof p5.Color) {
        var pc = [];
        for (var j = 0; j < 4; j++) {
          pc.push(p5.prototype.lerp(c1.rgba[j], c2.rgba[j], amt));
        }
        return new p5.Color(this, pc);
      } else {
        return p5.prototype.lerp(c1, c2, amt);
      }
    };
    p5.prototype.red = function (c) {
      if (c instanceof Array) {
        return c[0];
      } else if (c instanceof p5.Color) {
        return c.rgba[0];
      } else {
        throw new Error('Needs p5.Color or pixel array as argument.');
      }
    };
    p5.prototype.saturation = function (c) {
      if (!c instanceof p5.Color) {
        throw new Error('Needs p5.Color as argument.');
      }
      if (!c.hsba) {
        c.hsba = p5.Color.getRGB(c.rgba);
        c.hsba = c.hsba.concat(c.rgba[3]);
      }
      return c.hsba[1];
    };
    return p5;
  }({}, core, p5Color);
var colorsetting = function (require, core, constants, p5Color) {
    'use strict';
    var p5 = core;
    var constants = constants;
    p5.prototype._doStroke = true;
    p5.prototype._doFill = true;
    p5.prototype._colorMode = constants.RGB;
    p5.prototype._maxRGB = [
      255,
      255,
      255,
      255
    ];
    p5.prototype._maxHSB = [
      255,
      255,
      255,
      255
    ];
    p5.prototype.background = function () {
      if (arguments[0] instanceof p5.Image) {
        this.image(arguments[0], 0, 0, this.width, this.height);
      } else {
        var curFill = this.drawingContext.fillStyle;
        var ctx = this.drawingContext;
        ctx.fillStyle = p5.Color._getCanvasColor.apply(this, arguments);
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = curFill;
      }
    };
    p5.prototype.clear = function () {
      this.drawingContext.clearRect(0, 0, this.width, this.height);
    };
    p5.prototype.colorMode = function () {
      if (arguments[0] === constants.RGB || arguments[0] === constants.HSB) {
        this._colorMode = arguments[0];
        var isRGB = this._colorMode === constants.RGB;
        var maxArr = isRGB ? this._maxRGB : this._maxHSB;
        if (arguments.length === 2) {
          maxArr[0] = arguments[1];
          maxArr[1] = arguments[1];
          maxArr[2] = arguments[1];
        } else if (arguments.length > 2) {
          maxArr[0] = arguments[1];
          maxArr[1] = arguments[2];
          maxArr[2] = arguments[3];
        }
        if (arguments.length === 5) {
          maxArr[3] = arguments[4];
        }
      }
    };
    p5.prototype.fill = function () {
      this._setProperty('_doFill', true);
      var ctx = this.drawingContext;
      ctx.fillStyle = p5.Color._getCanvasColor.apply(this, arguments);
    };
    p5.prototype.noFill = function () {
      this._setProperty('_doFill', false);
    };
    p5.prototype.noStroke = function () {
      this._setProperty('_doStroke', false);
    };
    p5.prototype.stroke = function () {
      this._setProperty('_doStroke', true);
      var ctx = this.drawingContext;
      ctx.strokeStyle = p5.Color._getCanvasColor.apply(this, arguments);
    };
    return p5;
  }({}, core, constants, p5Color);
var dataconversion = function (require, core) {
    'use strict';
    var p5 = core;
    p5.prototype.float = function (str) {
      return parseFloat(str);
    };
    p5.prototype.int = function (n, radix) {
      if (typeof n === 'string') {
        radix = radix || 10;
        return parseInt(n, radix);
      } else if (typeof n === 'number') {
        return n | 0;
      } else if (typeof n === 'boolean') {
        return n ? 1 : 0;
      } else if (n instanceof Array) {
        return n.map(p5.prototype.int);
      }
    };
    return p5;
  }({}, core);
var dataarray_functions = function (require, core) {
    'use strict';
    var p5 = core;
    p5.prototype.append = function (array, value) {
      array.push(value);
      return array;
    };
    p5.prototype.arrayCopy = function (src, srcPosition, dst, dstPosition, length) {
      var start, end;
      if (typeof length !== 'undefined') {
        end = Math.min(length, src.length);
        start = dstPosition;
        src = src.slice(srcPosition, end + srcPosition);
      } else {
        if (typeof dst !== 'undefined') {
          end = dst;
          end = Math.min(end, src.length);
        } else {
          end = src.length;
        }
        start = 0;
        dst = srcPosition;
        src = src.slice(0, end);
      }
      Array.prototype.splice.apply(dst, [
        start,
        end
      ].concat(src));
    };
    p5.prototype.concat = function (list0, list1) {
      return list0.concat(list1);
    };
    p5.prototype.reverse = function (list) {
      return list.reverse();
    };
    p5.prototype.shorten = function (list) {
      list.pop();
      return list;
    };
    p5.prototype.sort = function (list, count) {
      var arr = count ? list.slice(0, Math.min(count, list.length)) : list;
      var rest = count ? list.slice(Math.min(count, list.length)) : [];
      if (typeof arr[0] === 'string') {
        arr = arr.sort();
      } else {
        arr = arr.sort(function (a, b) {
          return a - b;
        });
      }
      return arr.concat(rest);
    };
    p5.prototype.splice = function (list, value, index) {
      Array.prototype.splice.apply(list, [
        index,
        0
      ].concat(value));
      return list;
    };
    p5.prototype.subset = function (list, start, count) {
      if (typeof count !== 'undefined') {
        return list.slice(start, start + count);
      } else {
        return list.slice(start, list.length);
      }
    };
    return p5;
  }({}, core);
var datastring_functions = function (require, core) {
    'use strict';
    var p5 = core;
    p5.prototype.join = function (list, separator) {
      return list.join(separator);
    };
    p5.prototype.match = function (str, reg) {
      return str.match(reg);
    };
    p5.prototype.matchAll = function (str, reg) {
      var re = new RegExp(reg, 'g');
      var match = re.exec(str);
      var matches = [];
      while (match !== null) {
        matches.push(match);
        match = re.exec(str);
      }
      return matches;
    };
    p5.prototype.nf = function () {
      if (arguments[0] instanceof Array) {
        var a = arguments[1];
        var b = arguments[2];
        return arguments[0].map(function (x) {
          return doNf(x, a, b);
        });
      } else {
        return doNf.apply(this, arguments);
      }
    };
    function doNf() {
      var num = arguments[0];
      var neg = num < 0;
      var n = neg ? num.toString().substring(1) : num.toString();
      var decimalInd = n.indexOf('.');
      var intPart = decimalInd !== -1 ? n.substring(0, decimalInd) : n;
      var decPart = decimalInd !== -1 ? n.substring(decimalInd + 1) : '';
      var str = neg ? '-' : '';
      if (arguments.length === 3) {
        for (var i = 0; i < arguments[1] - intPart.length; i++) {
          str += '0';
        }
        str += intPart;
        str += '.';
        str += decPart;
        for (var j = 0; j < arguments[2] - decPart.length; j++) {
          str += '0';
        }
        return str;
      } else {
        for (var k = 0; k < Math.max(arguments[1] - intPart.length, 0); k++) {
          str += '0';
        }
        str += n;
        return str;
      }
    }
    p5.prototype.nfc = function () {
      if (arguments[0] instanceof Array) {
        var a = arguments[1];
        return arguments[0].map(function (x) {
          return doNfc(x, a);
        });
      } else {
        return doNfc.apply(this, arguments);
      }
    };
    function doNfc() {
      var num = arguments[0].toString();
      var dec = num.indexOf('.');
      var rem = dec !== -1 ? num.substring(dec) : '';
      var n = dec !== -1 ? num.substring(0, dec) : num;
      n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (arguments.length > 1) {
        rem = rem.substring(0, arguments[1] + 1);
      }
      return n + rem;
    }
    p5.prototype.nfp = function () {
      var nfRes = this.nf(arguments);
      if (nfRes instanceof Array) {
        return nfRes.map(addNfp);
      } else {
        return addNfp(nfRes);
      }
    };
    function addNfp() {
      return parseFloat(arguments[0]) > 0 ? '+' + arguments[0].toString() : arguments[0].toString();
    }
    p5.prototype.nfs = function () {
      var nfRes = this.nf(arguments);
      if (nfRes instanceof Array) {
        return nfRes.map(addNfs);
      } else {
        return addNfs(nfRes);
      }
    };
    function addNfs() {
      return parseFloat(arguments[0]) > 0 ? ' ' + arguments[0].toString() : arguments[0].toString();
    }
    p5.prototype.split = function (str, delim) {
      return str.split(delim);
    };
    p5.prototype.splitTokens = function () {
      var d = arguments.length > 0 ? arguments[1] : /\s/g;
      return arguments[0].split(d).filter(function (n) {
        return n;
      });
    };
    p5.prototype.trim = function (str) {
      if (str instanceof Array) {
        return str.map(this.trim);
      } else {
        return str.trim();
      }
    };
    return p5;
  }({}, core);
var environment = function (require, core, constants) {
    'use strict';
    var p5 = core;
    var C = constants;
    var standardCursors = [
        C.ARROW,
        C.CROSS,
        C.HAND,
        C.MOVE,
        C.TEXT,
        C.WAIT
      ];
    p5.prototype._frameRate = 0;
    p5.prototype._lastFrameTime = new Date().getTime();
    p5.prototype._targetFrameRate = 60;
    p5.prototype.frameCount = 0;
    p5.prototype.focused = true;
    p5.prototype.cursor = function (type, x, y) {
      var cursor = 'auto';
      var canvas = this._curElement.elt;
      if (standardCursors.indexOf(type) > -1) {
        cursor = type;
      } else if (typeof type === 'string') {
        var coords = '';
        if (x && y && (typeof x === 'number' && typeof y === 'number')) {
          coords = x + ' ' + y;
        }
        if (type.substring(0, 6) !== 'http://') {
          cursor = 'url(' + type + ') ' + coords + ', auto';
        } else if (/\.(cur|jpg|jpeg|gif|png|CUR|JPG|JPEG|GIF|PNG)$/.test(type)) {
          cursor = 'url(' + type + ') ' + coords + ', auto';
        } else {
          cursor = type;
        }
      }
      canvas.style.cursor = cursor;
    };
    p5.prototype.frameRate = function (fps) {
      if (typeof fps === 'undefined') {
        return this._frameRate;
      } else {
        this._setProperty('_targetFrameRate', fps);
        this._runFrames();
        return this;
      }
    };
    p5.prototype.getFrameRate = function () {
      return this.frameRate();
    };
    p5.prototype.setFrameRate = function (fps) {
      return this.frameRate(fps);
    };
    p5.prototype.noCursor = function () {
      this._curElement.elt.style.cursor = 'none';
    };
    p5.prototype.displayWidth = screen.width;
    p5.prototype.displayHeight = screen.height;
    p5.prototype.windowWidth = window.innerWidth;
    p5.prototype.windowHeight = window.innerHeight;
    p5.prototype.onresize = function (e) {
      this._setProperty('windowWidth', window.innerWidth);
      this._setProperty('windowHeight', window.innerHeight);
      var context = this._isGlobal ? window : this;
      var executeDefault;
      if (typeof context.windowResized === 'function') {
        executeDefault = context.windowResized(e);
        if (executeDefault !== undefined && !executeDefault) {
          e.preventDefault();
        }
      }
    };
    p5.prototype.width = 0;
    p5.prototype.height = 0;
    p5.prototype.fullscreen = function (val) {
      if (typeof val === 'undefined') {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      } else {
        if (val) {
          launchFullscreen(document.documentElement);
        } else {
          exitFullscreen();
        }
      }
    };
    function launchFullscreen(element) {
      var enabled = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
      if (!enabled) {
        throw new Error('Fullscreen not enabled in this browser.');
      }
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
    function exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    return p5;
  }({}, core, constants);
var imageimage = function (require, core, constants) {
    'use strict';
    var p5 = core;
    var constants = constants;
    p5.prototype._imageMode = constants.CORNER;
    p5.prototype._tint = null;
    p5.prototype.createImage = function (width, height) {
      return new p5.Image(width, height);
    };
    return p5;
  }({}, core, constants);
var canvas = function (require, constants) {
    var constants = constants;
    return {
      modeAdjust: function (a, b, c, d, mode) {
        if (mode === constants.CORNER) {
          return {
            x: a,
            y: b,
            w: c,
            h: d
          };
        } else if (mode === constants.CORNERS) {
          return {
            x: a,
            y: b,
            w: c - a,
            h: d - b
          };
        } else if (mode === constants.RADIUS) {
          return {
            x: a - c,
            y: b - d,
            w: 2 * c,
            h: 2 * d
          };
        } else if (mode === constants.CENTER) {
          return {
            x: a - c * 0.5,
            y: b - d * 0.5,
            w: c,
            h: d
          };
        }
      },
      arcModeAdjust: function (a, b, c, d, mode) {
        if (mode === constants.CORNER) {
          return {
            x: a + c * 0.5,
            y: b + d * 0.5,
            w: c,
            h: d
          };
        } else if (mode === constants.CORNERS) {
          return {
            x: a,
            y: b,
            w: c + a,
            h: d + b
          };
        } else if (mode === constants.RADIUS) {
          return {
            x: a,
            y: b,
            w: 2 * c,
            h: 2 * d
          };
        } else if (mode === constants.CENTER) {
          return {
            x: a,
            y: b,
            w: c,
            h: d
          };
        }
      }
    };
  }({}, constants);
var imageloading_displaying = function (require, core, filters, canvas, constants) {
    'use strict';
    var p5 = core;
    var Filters = filters;
    var canvas = canvas;
    var constants = constants;
    p5.prototype.loadImage = function (path, callback) {
      var img = new Image();
      var pImg = new p5.Image(1, 1, this);
      img.onload = function () {
        pImg.width = pImg.canvas.width = img.width;
        pImg.height = pImg.canvas.height = img.height;
        pImg.canvas.getContext('2d').drawImage(img, 0, 0);
        if (typeof callback !== 'undefined') {
          callback(pImg);
        }
      };
      if (path.indexOf('data:image/') !== 0) {
        img.crossOrigin = 'Anonymous';
      }
      img.src = path;
      return pImg;
    };
    p5.prototype.image = function (img, x, y, width, height) {
      var frame = img.canvas || img.elt;
      x = x || 0;
      y = y || 0;
      width = width || img.width;
      height = height || img.height;
      var vals = canvas.modeAdjust(x, y, width, height, this._imageMode);
      if (this._tint && img.canvas) {
        this.drawingContext.drawImage(this._getTintedImageCanvas(img), vals.x, vals.y, vals.w, vals.h);
      } else {
        this.drawingContext.drawImage(frame, vals.x, vals.y, vals.w, vals.h);
      }
    };
    p5.prototype.tint = function () {
      var c = p5.Color._getFormattedColor.apply(this, arguments);
      c = p5.Color._normalizeColorArray.call(this, c);
      this._tint = c;
    };
    p5.prototype.noTint = function () {
      this._tint = null;
    };
    p5.prototype._getTintedImageCanvas = function (img) {
      if (!img.canvas) {
        return img;
      }
      var pixels = Filters._toPixels(img.canvas);
      var tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = img.canvas.width;
      tmpCanvas.height = img.canvas.height;
      var tmpCtx = tmpCanvas.getContext('2d');
      var id = tmpCtx.createImageData(img.canvas.width, img.canvas.height);
      var newPixels = id.data;
      for (var i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];
        var a = pixels[i + 3];
        newPixels[i] = r * this._tint[0] / 255;
        newPixels[i + 1] = g * this._tint[1] / 255;
        newPixels[i + 2] = b * this._tint[2] / 255;
        newPixels[i + 3] = a * this._tint[3] / 255;
      }
      tmpCtx.putImageData(id, 0, 0);
      return tmpCanvas;
    };
    p5.prototype.imageMode = function (m) {
      if (m === constants.CORNER || m === constants.CORNERS || m === constants.CENTER) {
        this._imageMode = m;
      }
    };
    return p5;
  }({}, core, filters, canvas, constants);
var imagepixels = function (require, core, filters, p5Color) {
    'use strict';
    var p5 = core;
    var Filters = filters;
    p5.prototype.pixels = [];
    p5.prototype.blend = function () {
      var currBlend = this.drawingContext.globalCompositeOperation;
      var blendMode = arguments[arguments.length - 1];
      var copyArgs = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
      this.drawingContext.globalCompositeOperation = blendMode;
      this.copy.apply(this, copyArgs);
      this.drawingContext.globalCompositeOperation = currBlend;
    };
    p5.prototype.copy = function () {
      var srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
      if (arguments.length === 9) {
        srcImage = arguments[0];
        sx = arguments[1];
        sy = arguments[2];
        sw = arguments[3];
        sh = arguments[4];
        dx = arguments[5];
        dy = arguments[6];
        dw = arguments[7];
        dh = arguments[8];
      } else if (arguments.length === 8) {
        sx = arguments[0];
        sy = arguments[1];
        sw = arguments[2];
        sh = arguments[3];
        dx = arguments[4];
        dy = arguments[5];
        dw = arguments[6];
        dh = arguments[7];
        srcImage = this;
      } else {
        throw new Error('Signature not supported');
      }
      this.drawingContext.drawImage(srcImage.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
    };
    p5.prototype.filter = function (operation, value) {
      Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
    };
    p5.prototype.get = function (x, y, w, h) {
      if (x === undefined && y === undefined && w === undefined && h === undefined) {
        x = 0;
        y = 0;
        w = this.width;
        h = this.height;
      } else if (w === undefined && h === undefined) {
        w = 1;
        h = 1;
      }
      if (x > this.width || y > this.height || x < 0 || y < 0) {
        return [
          0,
          0,
          0,
          255
        ];
      }
      var imageData = this.drawingContext.getImageData(x, y, w, h);
      var data = imageData.data;
      if (w === 1 && h === 1) {
        var pixels = [];
        for (var i = 0; i < data.length; i += 4) {
          pixels.push(data[i], data[i + 1], data[i + 2], data[i + 3]);
        }
        return pixels;
      } else {
        w = Math.min(w, this.width);
        h = Math.min(h, this.height);
        var region = new p5.Image(w, h);
        region.canvas.getContext('2d').putImageData(imageData, 0, 0, 0, 0, w, h);
        return region;
      }
    };
    p5.prototype.loadPixels = function () {
      var width = this.width;
      var height = this.height;
      var imageData = this.drawingContext.getImageData(0, 0, width, height);
      this._setProperty('imageData', imageData);
      this._setProperty('pixels', imageData.data);
    };
    p5.prototype.set = function (x, y, imgOrCol) {
      if (imgOrCol instanceof p5.Image) {
        this.drawingContext.drawImage(imgOrCol.canvas, x, y);
        this.loadPixels.call(this);
      } else {
        var idx = 4 * (y * this.width + x);
        if (!this.imageData) {
          this.loadPixels.call(this);
        }
        if (typeof imgOrCol === 'number') {
          if (idx < this.pixels.length) {
            this.pixels[idx] = imgOrCol;
            this.pixels[idx + 1] = imgOrCol;
            this.pixels[idx + 2] = imgOrCol;
            this.pixels[idx + 3] = 255;
          }
        } else if (imgOrCol instanceof Array) {
          if (imgOrCol.length < 4) {
            throw new Error('pixel array must be of the form [R, G, B, A]');
          }
          if (idx < this.pixels.length) {
            this.pixels[idx] = imgOrCol[0];
            this.pixels[idx + 1] = imgOrCol[1];
            this.pixels[idx + 2] = imgOrCol[2];
            this.pixels[idx + 3] = imgOrCol[3];
          }
        } else if (imgOrCol instanceof p5.Color) {
          if (idx < this.pixels.length) {
            this.pixels[idx] = imgOrCol.rgba[0];
            this.pixels[idx + 1] = imgOrCol.rgba[1];
            this.pixels[idx + 2] = imgOrCol.rgba[2];
            this.pixels[idx + 3] = imgOrCol.rgba[3];
          }
        }
      }
    };
    p5.prototype.updatePixels = function (x, y, w, h) {
      if (x === undefined && y === undefined && w === undefined && h === undefined) {
        x = 0;
        y = 0;
        w = this.width;
        h = this.height;
      }
      this.drawingContext.putImageData(this.imageData, x, y, 0, 0, w, h);
    };
    return p5;
  }({}, core, filters, p5Color);
!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports)
    module.exports = definition();
  else if (typeof define == 'function' && define.amd)
    define('reqwest', definition);
  else
    context[name] = definition();
}('reqwest', this, function () {
  var win = window, doc = document, twoHundo = /^(20\d|1223)$/, byTag = 'getElementsByTagName', readyState = 'readyState', contentType = 'Content-Type', requestedWith = 'X-Requested-With', head = doc[byTag]('head')[0], uniqid = 0, callbackPrefix = 'reqwest_' + +new Date(), lastValue, xmlHttpRequest = 'XMLHttpRequest', xDomainRequest = 'XDomainRequest', noop = function () {
    }, isArray = typeof Array.isArray == 'function' ? Array.isArray : function (a) {
      return a instanceof Array;
    }, defaultHeaders = {
      'contentType': 'application/x-www-form-urlencoded',
      'requestedWith': xmlHttpRequest,
      'accept': {
        '*': 'text/javascript, text/html, application/xml, text/xml, */*',
        'xml': 'application/xml, text/xml',
        'html': 'text/html',
        'text': 'text/plain',
        'json': 'application/json, text/javascript',
        'js': 'application/javascript, text/javascript'
      }
    }, xhr = function (o) {
      if (o['crossOrigin'] === true) {
        var xhr = win[xmlHttpRequest] ? new XMLHttpRequest() : null;
        if (xhr && 'withCredentials' in xhr) {
          return xhr;
        } else if (win[xDomainRequest]) {
          return new XDomainRequest();
        } else {
          throw new Error('Browser does not support cross-origin requests');
        }
      } else if (win[xmlHttpRequest]) {
        return new XMLHttpRequest();
      } else {
        return new ActiveXObject('Microsoft.XMLHTTP');
      }
    }, globalSetupOptions = {
      dataFilter: function (data) {
        return data;
      }
    };
  function handleReadyState(r, success, error) {
    return function () {
      if (r._aborted)
        return error(r.request);
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop;
        if (twoHundo.test(r.request.status))
          success(r.request);
        else
          error(r.request);
      }
    };
  }
  function setHeaders(http, o) {
    var headers = o['headers'] || {}, h;
    headers['Accept'] = headers['Accept'] || defaultHeaders['accept'][o['type']] || defaultHeaders['accept']['*'];
    if (!o['crossOrigin'] && !headers[requestedWith])
      headers[requestedWith] = defaultHeaders['requestedWith'];
    if (!headers[contentType])
      headers[contentType] = o['contentType'] || defaultHeaders['contentType'];
    for (h in headers)
      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h]);
  }
  function setCredentials(http, o) {
    if (typeof o['withCredentials'] !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o['withCredentials'];
    }
  }
  function generalCallback(data) {
    lastValue = data;
  }
  function urlappend(url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s;
  }
  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++, cbkey = o['jsonpCallback'] || 'callback', cbval = o['jsonpCallbackName'] || reqwest.getcallbackPrefix(reqId), cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)'), match = url.match(cbreg), script = doc.createElement('script'), loaded = 0, isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1;
    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval);
      } else {
        cbval = match[3];
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval);
    }
    win[cbval] = generalCallback;
    script.type = 'text/javascript';
    script.src = url;
    script.async = true;
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      script.event = 'onclick';
      script.htmlFor = script.id = '_reqwest_' + reqId;
    }
    script.onload = script.onreadystatechange = function () {
      if (script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded' || loaded) {
        return false;
      }
      script.onload = script.onreadystatechange = null;
      script.onclick && script.onclick();
      fn(lastValue);
      lastValue = undefined;
      head.removeChild(script);
      loaded = 1;
    };
    head.appendChild(script);
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null;
        err({}, 'Request is aborted: timeout', {});
        lastValue = undefined;
        head.removeChild(script);
        loaded = 1;
      }
    };
  }
  function getRequest(fn, err) {
    var o = this.o, method = (o['method'] || 'GET').toUpperCase(), url = typeof o === 'string' ? o : o['url'], data = o['processData'] !== false && o['data'] && typeof o['data'] !== 'string' ? reqwest.toQueryString(o['data']) : o['data'] || null, http, sendWait = false;
    if ((o['type'] == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data);
      data = null;
    }
    if (o['type'] == 'jsonp')
      return handleJsonp(o, fn, err, url);
    http = o.xhr && o.xhr(o) || xhr(o);
    http.open(method, url, o['async'] === false ? false : true);
    setHeaders(http, o);
    setCredentials(http, o);
    if (win[xDomainRequest] && http instanceof win[xDomainRequest]) {
      http.onload = fn;
      http.onerror = err;
      http.onprogress = function () {
      };
      sendWait = true;
    } else {
      http.onreadystatechange = handleReadyState(this, fn, err);
    }
    o['before'] && o['before'](http);
    if (sendWait) {
      setTimeout(function () {
        http.send(data);
      }, 200);
    } else {
      http.send(data);
    }
    return http;
  }
  function Reqwest(o, fn) {
    this.o = o;
    this.fn = fn;
    init.apply(this, arguments);
  }
  function setType(url) {
    var m = url.match(/\.(json|jsonp|html|xml)(\?|$)/);
    return m ? m[1] : 'js';
  }
  function init(o, fn) {
    this.url = typeof o == 'string' ? o : o['url'];
    this.timeout = null;
    this._fulfilled = false;
    this._successHandler = function () {
    };
    this._fulfillmentHandlers = [];
    this._errorHandlers = [];
    this._completeHandlers = [];
    this._erred = false;
    this._responseArgs = {};
    var self = this, type = o['type'] || setType(this.url);
    fn = fn || function () {
    };
    if (o['timeout']) {
      this.timeout = setTimeout(function () {
        self.abort();
      }, o['timeout']);
    }
    if (o['success']) {
      this._successHandler = function () {
        o['success'].apply(o, arguments);
      };
    }
    if (o['error']) {
      this._errorHandlers.push(function () {
        o['error'].apply(o, arguments);
      });
    }
    if (o['complete']) {
      this._completeHandlers.push(function () {
        o['complete'].apply(o, arguments);
      });
    }
    function complete(resp) {
      o['timeout'] && clearTimeout(self.timeout);
      self.timeout = null;
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp);
      }
    }
    function success(resp) {
      resp = type !== 'jsonp' ? self.request : resp;
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type), r = filteredResponse;
      try {
        resp.responseText = r;
      } catch (e) {
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')');
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err);
          }
          break;
        case 'js':
          resp = eval(r);
          break;
        case 'html':
          resp = r;
          break;
        case 'xml':
          resp = resp.responseXML && resp.responseXML.parseError && resp.responseXML.parseError.errorCode && resp.responseXML.parseError.reason ? null : resp.responseXML;
          break;
        }
      }
      self._responseArgs.resp = resp;
      self._fulfilled = true;
      fn(resp);
      self._successHandler(resp);
      while (self._fulfillmentHandlers.length > 0) {
        resp = self._fulfillmentHandlers.shift()(resp);
      }
      complete(resp);
    }
    function error(resp, msg, t) {
      resp = self.request;
      self._responseArgs.resp = resp;
      self._responseArgs.msg = msg;
      self._responseArgs.t = t;
      self._erred = true;
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t);
      }
      complete(resp);
    }
    this.request = getRequest.call(this, success, error);
  }
  Reqwest.prototype = {
    abort: function () {
      this._aborted = true;
      this.request.abort();
    },
    retry: function () {
      init.call(this, this.o, this.fn);
    },
    then: function (success, fail) {
      success = success || function () {
      };
      fail = fail || function () {
      };
      if (this._fulfilled) {
        this._responseArgs.resp = success(this._responseArgs.resp);
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t);
      } else {
        this._fulfillmentHandlers.push(success);
        this._errorHandlers.push(fail);
      }
      return this;
    },
    always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp);
      } else {
        this._completeHandlers.push(fn);
      }
      return this;
    },
    fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t);
      } else {
        this._errorHandlers.push(fn);
      }
      return this;
    }
  };
  function reqwest(o, fn) {
    return new Reqwest(o, fn);
  }
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : '';
  }
  function serial(el, cb) {
    var n = el.name, t = el.tagName.toLowerCase(), optCb = function (o) {
        if (o && !o['disabled'])
          cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']));
      }, ch, ra, val, i;
    if (el.disabled || !n)
      return;
    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type);
        ra = /radio/i.test(el.type);
        val = el.value;
        (!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val));
      }
      break;
    case 'textarea':
      cb(n, normalize(el.value));
      break;
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null);
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i]);
        }
      }
      break;
    }
  }
  function eachFormElement() {
    var cb = this, e, i, serializeSubtags = function (e, tags) {
        var i, j, fa;
        for (i = 0; i < tags.length; i++) {
          fa = e[byTag](tags[i]);
          for (j = 0; j < fa.length; j++)
            serial(fa[j], cb);
        }
      };
    for (i = 0; i < arguments.length; i++) {
      e = arguments[i];
      if (/input|select|textarea/i.test(e.tagName))
        serial(e, cb);
      serializeSubtags(e, [
        'input',
        'select',
        'textarea'
      ]);
    }
  }
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments));
  }
  function serializeHash() {
    var hash = {};
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]]);
        hash[name].push(value);
      } else
        hash[name] = value;
    }, arguments);
    return hash;
  }
  reqwest.serializeArray = function () {
    var arr = [];
    eachFormElement.apply(function (name, value) {
      arr.push({
        name: name,
        value: value
      });
    }, arguments);
    return arr;
  };
  reqwest.serialize = function () {
    if (arguments.length === 0)
      return '';
    var opt, fn, args = Array.prototype.slice.call(arguments, 0);
    opt = args.pop();
    opt && opt.nodeType && args.push(opt) && (opt = null);
    opt && (opt = opt.type);
    if (opt == 'map')
      fn = serializeHash;
    else if (opt == 'array')
      fn = reqwest.serializeArray;
    else
      fn = serializeQueryString;
    return fn.apply(null, args);
  };
  reqwest.toQueryString = function (o, trad) {
    var prefix, i, traditional = trad || false, s = [], enc = encodeURIComponent, add = function (key, value) {
        value = 'function' === typeof value ? value() : value == null ? '' : value;
        s[s.length] = enc(key) + '=' + enc(value);
      };
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++)
        add(o[i]['name'], o[i]['value']);
    } else {
      for (prefix in o) {
        if (o.hasOwnProperty(prefix))
          buildParams(prefix, o[prefix], traditional, add);
      }
    }
    return s.join('&').replace(/%20/g, '+');
  };
  function buildParams(prefix, obj, traditional, add) {
    var name, i, v, rbracket = /\[\]$/;
    if (isArray(obj)) {
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i];
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add);
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  reqwest.getcallbackPrefix = function () {
    return callbackPrefix;
  };
  reqwest.compat = function (o, fn) {
    if (o) {
      o['type'] && (o['method'] = o['type']) && delete o['type'];
      o['dataType'] && (o['type'] = o['dataType']);
      o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback'];
      o['jsonp'] && (o['jsonpCallback'] = o['jsonp']);
    }
    return new Reqwest(o, fn);
  };
  reqwest.ajaxSetup = function (options) {
    options = options || {};
    for (var k in options) {
      globalSetupOptions[k] = options[k];
    }
  };
  return reqwest;
});
var inputfiles = function (require, core, reqwest) {
    'use strict';
    var p5 = core;
    var reqwest = reqwest;
    p5.prototype.createInput = function () {
      throw 'not yet implemented';
    };
    p5.prototype.createReader = function () {
      throw 'not yet implemented';
    };
    p5.prototype.loadBytes = function () {
      throw 'not yet implemented';
    };
    p5.prototype.loadJSON = function (path, callback) {
      var ret = [];
      var t = path.indexOf('http') === -1 ? 'json' : 'jsonp';
      if (typeof arguments[2] === 'string') {
        if (arguments[2] === 'jsonp' || arguments[2] === 'json') {
          t = arguments[2];
        }
      }
      reqwest({
        url: path,
        type: t,
        crossOrigin: true
      }).then(function (resp) {
        for (var k in resp) {
          ret[k] = resp[k];
        }
        if (typeof callback !== 'undefined') {
          callback(resp);
        }
      });
      return ret;
    };
    p5.prototype.loadStrings = function (path, callback) {
      var ret = [];
      var req = new XMLHttpRequest();
      req.open('GET', path, true);
      req.onreadystatechange = function () {
        if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
          var arr = req.responseText.match(/[^\r\n]+/g);
          for (var k in arr) {
            ret[k] = arr[k];
          }
          if (typeof callback !== 'undefined') {
            callback(ret);
          }
        }
      };
      req.send(null);
      return ret;
    };
    p5.prototype.loadTable = function (path) {
      var callback = null;
      var options = [];
      var header = false;
      var sep = ',';
      for (var i = 1; i < arguments.length; i++) {
        if (typeof arguments[i] === 'function') {
          callback = arguments[i];
        } else if (typeof arguments[i] === 'string') {
          options.push(arguments[i]);
          if (arguments[i] === 'header') {
            header = true;
          }
          if (arguments[i] === 'csv') {
            sep = ',';
          } else if (arguments[i] === 'tsv') {
            sep = '\t';
          }
        }
      }
      var ret = [];
      var t = new p5.Table();
      var req = new XMLHttpRequest();
      req.open('GET', path, true);
      req.onreadystatechange = function () {
        if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
          var arr = req.responseText.match(/[^\r\n]+/g);
          for (var k in arr) {
            ret[k] = arr[k];
          }
          if (typeof callback !== 'undefined') {
            var i, row;
            if (header) {
              t.columns = new p5.TableRow(ret[0]).arr;
              for (i = 1; i < ret.length; i++) {
                row = new p5.TableRow(ret[i], sep);
                row.obj = makeObject(row.arr, t.columns);
                t.addRow(row);
              }
            } else {
              for (i = 0; i < ret[0].split(sep).length; i++) {
                t.columns[i] = i.toString();
              }
              for (i = 0; i < ret.length; i++) {
                row = new p5.TableRow(ret[i], sep);
                t.addRow(row);
              }
            }
            callback(t);
          }
        }
      };
      req.send(null);
      return t;
    };
    function makeObject(row, headers) {
      var ret = {};
      headers = headers || [];
      if (typeof headers === 'undefined') {
        for (var j = 0; j < row.length; j++) {
          headers[j.toString()] = j;
        }
      }
      for (var i = 0; i < headers.length; i++) {
        var key = headers[i];
        var val = row[i];
        ret[key] = val;
      }
      return ret;
    }
    p5.prototype.loadXML = function (path, callback) {
      var ret = [];
      reqwest({
        url: path,
        type: 'xml',
        crossOrigin: true
      }).then(function (resp) {
        callback(resp);
      });
      return ret;
    };
    p5.prototype.parseXML = function () {
      throw 'not yet implemented';
    };
    p5.prototype.selectFolder = function () {
      throw 'not yet implemented';
    };
    p5.prototype.selectInput = function () {
      throw 'not yet implemented';
    };
    return p5;
  }({}, core, reqwest);
var inputkeyboard = function (require, core) {
    'use strict';
    var p5 = core;
    p5.prototype.isKeyPressed = false;
    p5.prototype.keyIsPressed = false;
    p5.prototype.key = '';
    p5.prototype.keyCode = 0;
    p5.prototype.onkeydown = function (e) {
      this._setProperty('isKeyPressed', true);
      this._setProperty('keyIsPressed', true);
      this._setProperty('keyCode', e.which);
      var key = String.fromCharCode(e.which);
      if (!key) {
        key = e.which;
      }
      this._setProperty('key', key);
      var keyPressed = this.keyPressed || window.keyPressed;
      if (typeof keyPressed === 'function' && !e.charCode) {
        var executeDefault = keyPressed(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      }
    };
    p5.prototype.onkeyup = function (e) {
      var keyReleased = this.keyReleased || window.keyReleased;
      this._setProperty('isKeyPressed', false);
      this._setProperty('keyIsPressed', false);
      var key = String.fromCharCode(e.which);
      if (!key) {
        key = e.which;
      }
      this._setProperty('key', key);
      this._setProperty('keyCode', e.which);
      if (typeof keyReleased === 'function') {
        var executeDefault = keyReleased(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      }
    };
    p5.prototype.onkeypress = function (e) {
      this._setProperty('keyCode', e.which);
      this._setProperty('key', String.fromCharCode(e.which));
      var keyTyped = this.keyTyped || window.keyTyped;
      if (typeof keyTyped === 'function') {
        var executeDefault = keyTyped(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      }
    };
    return p5;
  }({}, core);
var inputmouse = function (require, core, constants) {
    'use strict';
    var p5 = core;
    var constants = constants;
    p5.prototype.mouseX = 0;
    p5.prototype.mouseY = 0;
    p5.prototype.pmouseX = 0;
    p5.prototype.pmouseY = 0;
    p5.prototype.winMouseX = 0;
    p5.prototype.winMouseY = 0;
    p5.prototype.pwinMouseX = 0;
    p5.prototype.pwinMouseY = 0;
    p5.prototype.mouseButton = 0;
    p5.prototype.mouseIsPressed = false;
    p5.prototype.isMousePressed = false;
    p5.prototype._updateMouseCoords = function (e) {
      if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend') {
        this._setProperty('mouseX', this.touchX);
        this._setProperty('mouseY', this.touchY);
      } else {
        if (this._curElement !== null) {
          var mousePos = getMousePos(this._curElement.elt, e);
          this._setProperty('mouseX', mousePos.x);
          this._setProperty('mouseY', mousePos.y);
        }
      }
      this._setProperty('winMouseX', e.pageX);
      this._setProperty('winMouseY', e.pageY);
    };
    p5.prototype._updatePMouseCoords = function (e) {
      this._setProperty('pmouseX', this.mouseX);
      this._setProperty('pmouseY', this.mouseY);
      this._setProperty('pwinMouseX', this.winMouseX);
      this._setProperty('pwinMouseY', this.winMouseY);
    };
    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }
    p5.prototype._setMouseButton = function (e) {
      if (e.button === 1) {
        this._setProperty('mouseButton', constants.CENTER);
      } else if (e.button === 2) {
        this._setProperty('mouseButton', constants.RIGHT);
      } else {
        this._setProperty('mouseButton', constants.LEFT);
        if (e.type === 'touchstart' || e.type === 'touchmove') {
          this._setProperty('mouseX', this.touchX);
          this._setProperty('mouseY', this.touchY);
        }
      }
    };
    p5.prototype.onmousemove = function (e) {
      var context = this._isGlobal ? window : this;
      var executeDefault;
      this._updateMouseCoords(e);
      if (!this.isMousePressed) {
        if (typeof context.mouseMoved === 'function') {
          executeDefault = context.mouseMoved(e);
          if (executeDefault === false) {
            e.preventDefault();
          }
        }
      } else {
        if (typeof context.mouseDragged === 'function') {
          executeDefault = context.mouseDragged(e);
          if (executeDefault === false) {
            e.preventDefault();
          }
        } else if (typeof context.touchMoved === 'function') {
          executeDefault = context.touchMoved(e);
          if (executeDefault === false) {
            e.preventDefault();
          }
          this._updateTouchCoords(e);
        }
      }
    };
    p5.prototype.onmousedown = function (e) {
      var context = this._isGlobal ? window : this;
      var executeDefault;
      this._setProperty('isMousePressed', true);
      this._setProperty('mouseIsPressed', true);
      this._setMouseButton(e);
      this._updateMouseCoords(e);
      if (typeof context.mousePressed === 'function') {
        executeDefault = context.mousePressed(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      } else if (typeof context.touchStarted === 'function') {
        executeDefault = context.touchStarted(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
        this._updateTouchCoords(e);
      }
    };
    p5.prototype.onmouseup = function (e) {
      var context = this._isGlobal ? window : this;
      var executeDefault;
      this._setProperty('isMousePressed', false);
      this._setProperty('mouseIsPressed', false);
      if (typeof context.mouseReleased === 'function') {
        executeDefault = context.mouseReleased(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      } else if (typeof context.touchEnded === 'function') {
        executeDefault = context.touchEnded(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
        this._updateTouchCoords(e);
      }
    };
    p5.prototype.onclick = function (e) {
      var context = this._isGlobal ? window : this;
      if (typeof context.mouseClicked === 'function') {
        var executeDefault = context.mouseClicked(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      }
    };
    p5.prototype.onmousewheel = function (e) {
      var context = this._isGlobal ? window : this;
      if (typeof context.mouseWheel === 'function') {
        var executeDefault = context.mouseWheel(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      }
    };
    return p5;
  }({}, core, constants);
var inputtime_date = function (require, core) {
    'use strict';
    var p5 = core;
    p5.prototype.day = function () {
      return new Date().getDate();
    };
    p5.prototype.hour = function () {
      return new Date().getHours();
    };
    p5.prototype.minute = function () {
      return new Date().getMinutes();
    };
    p5.prototype.millis = function () {
      return new Date().getTime() - this._startTime;
    };
    p5.prototype.month = function () {
      return new Date().getMonth() + 1;
    };
    p5.prototype.second = function () {
      return new Date().getSeconds();
    };
    p5.prototype.year = function () {
      return new Date().getFullYear();
    };
    return p5;
  }({}, core);
var inputtouch = function (require, core) {
    'use strict';
    var p5 = core;
    p5.prototype.touchX = 0;
    p5.prototype.touchY = 0;
    p5.prototype.ptouchX = 0;
    p5.prototype.ptouchY = 0;
    p5.prototype.touches = [];
    p5.prototype._updateTouchCoords = function (e) {
      if (e.type === 'mousedown' || e.type === 'mousemove' || e.type === 'mouseup') {
        this._setProperty('touchX', this.mouseX);
        this._setProperty('touchY', this.mouseY);
      } else {
        var touchPos = getTouchPos(this._curElement.elt, e, 0);
        this._setProperty('touchX', touchPos.x);
        this._setProperty('touchY', touchPos.y);
        var touches = [];
        for (var i = 0; i < e.changedTouches.length; i++) {
          var pos = getTouchPos(this._curElement.elt, e, i);
          touches[i] = {
            x: pos.x,
            y: pos.y
          };
        }
        this._setProperty('touches', touches);
      }
    };
    p5.prototype._updatePTouchCoords = function () {
      this._setProperty('ptouchX', this.touchX);
      this._setProperty('ptouchY', this.touchY);
    };
    function getTouchPos(canvas, e, i) {
      i = i || 0;
      var rect = canvas.getBoundingClientRect();
      return {
        x: e.changedTouches[i].pageX - rect.left,
        y: e.changedTouches[i].pageY - rect.top
      };
    }
    p5.prototype.ontouchstart = function (e) {
      var context = this._isGlobal ? window : this;
      var executeDefault;
      this._updateTouchCoords(e);
      if (typeof context.touchStarted === 'function') {
        executeDefault = context.touchStarted(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      } else if (typeof context.mousePressed === 'function') {
        executeDefault = context.mousePressed(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      }
    };
    p5.prototype.ontouchmove = function (e) {
      var context = this._isGlobal ? window : this;
      var executeDefault;
      this._updateTouchCoords(e);
      if (typeof context.touchMoved === 'function') {
        executeDefault = context.touchMoved(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      } else if (typeof context.mouseDragged === 'function') {
        executeDefault = context.mouseDragged(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
        this._updateMouseCoords(e);
      }
    };
    p5.prototype.ontouchend = function (e) {
      this._updateTouchCoords(e);
      var context = this._isGlobal ? window : this;
      var executeDefault;
      if (typeof context.touchEnded === 'function') {
        executeDefault = context.touchEnded(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
      } else if (typeof context.mouseReleased === 'function') {
        executeDefault = context.mouseReleased(e);
        if (executeDefault === false) {
          e.preventDefault();
        }
        this._updateMouseCoords(e);
      }
    };
    return p5;
  }({}, core);
var mathmath = function (require, core) {
    'use strict';
    var p5 = core;
    p5.prototype.createVector = function () {
      return new p5.Vector(this, arguments);
    };
    return p5;
  }({}, core);
var mathcalculation = function (require, core) {
    'use strict';
    var p5 = core;
    p5.prototype.abs = Math.abs;
    p5.prototype.ceil = Math.ceil;
    p5.prototype.constrain = function (n, low, high) {
      return Math.max(Math.min(n, high), low);
    };
    p5.prototype.dist = function (x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    };
    p5.prototype.exp = Math.exp;
    p5.prototype.floor = Math.floor;
    p5.prototype.lerp = function (start, stop, amt) {
      return amt * (stop - start) + start;
    };
    p5.prototype.log = Math.log;
    p5.prototype.mag = function (x, y) {
      return Math.sqrt(x * x + y * y);
    };
    p5.prototype.map = function (n, start1, stop1, start2, stop2) {
      return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    };
    p5.prototype.max = function () {
      if (arguments[0] instanceof Array) {
        return Math.max.apply(null, arguments[0]);
      } else {
        return Math.max.apply(null, arguments);
      }
    };
    p5.prototype.min = function () {
      if (arguments[0] instanceof Array) {
        return Math.min.apply(null, arguments[0]);
      } else {
        return Math.min.apply(null, arguments);
      }
    };
    p5.prototype.norm = function (n, start, stop) {
      return this.map(n, start, stop, 0, 1);
    };
    p5.prototype.pow = Math.pow;
    p5.prototype.round = Math.round;
    p5.prototype.sq = function (n) {
      return n * n;
    };
    p5.prototype.sqrt = Math.sqrt;
    return p5;
  }({}, core);
var mathrandom = function (require, core) {
    'use strict';
    var p5 = core;
    var seeded = false;
    var lcg = function () {
        var m = 4294967296, a = 1664525, c = 1013904223, seed, z;
        return {
          setSeed: function (val) {
            z = seed = val || Math.round(Math.random() * m);
          },
          getSeed: function () {
            return seed;
          },
          rand: function () {
            z = (a * z + c) % m;
            return z / m;
          }
        };
      }();
    p5.prototype.randomSeed = function (seed) {
      lcg.setSeed(seed);
      seeded = true;
    };
    p5.prototype.random = function (min, max) {
      var rand;
      if (seeded) {
        rand = lcg.rand();
      } else {
        rand = Math.random();
      }
      if (arguments.length === 0) {
        return rand;
      } else if (arguments.length === 1) {
        return rand * min;
      } else {
        if (min > max) {
          var tmp = min;
          min = max;
          max = tmp;
        }
        return rand * (max - min) + min;
      }
    };
    var y2;
    var previous = false;
    p5.prototype.randomGaussian = function (mean, sd) {
      var y1, x1, x2, w;
      if (previous) {
        y1 = y2;
        previous = false;
      } else {
        do {
          x1 = this.random(2) - 1;
          x2 = this.random(2) - 1;
          w = x1 * x1 + x2 * x2;
        } while (w >= 1);
        w = Math.sqrt(-2 * Math.log(w) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        previous = true;
      }
      var m = mean || 0;
      var s = sd || 1;
      return y1 * s + m;
    };
    return p5;
  }({}, core);
var mathnoise = function (require, core) {
    'use strict';
    var p5 = core;
    var PERLIN_YWRAPB = 4;
    var PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
    var PERLIN_ZWRAPB = 8;
    var PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
    var PERLIN_SIZE = 4095;
    var perlin_octaves = 4;
    var perlin_amp_falloff = 0.5;
    var SINCOS_PRECISION = 0.5;
    var SINCOS_LENGTH = Math.floor(360 / SINCOS_PRECISION);
    var sinLUT = new Array(SINCOS_LENGTH);
    var cosLUT = new Array(SINCOS_LENGTH);
    var DEG_TO_RAD = Math.PI / 180;
    for (var i = 0; i < SINCOS_LENGTH; i++) {
      sinLUT[i] = Math.sin(i * DEG_TO_RAD * SINCOS_PRECISION);
      cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
    }
    var perlin_PI = SINCOS_LENGTH;
    perlin_PI >>= 1;
    var perlin;
    p5.prototype.noise = function (x, y, z) {
      y = y || 0;
      z = z || 0;
      if (perlin == null) {
        perlin = new Array(PERLIN_SIZE + 1);
        for (var i = 0; i < PERLIN_SIZE + 1; i++) {
          perlin[i] = Math.random();
        }
      }
      if (x < 0) {
        x = -x;
      }
      if (y < 0) {
        y = -y;
      }
      if (z < 0) {
        z = -z;
      }
      var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
      var xf = x - xi;
      var yf = y - yi;
      var zf = z - zi;
      var rxf, ryf;
      var r = 0;
      var ampl = 0.5;
      var n1, n2, n3;
      var noise_fsc = function (i) {
        return 0.5 * (1 - cosLUT[Math.floor(i * perlin_PI) % SINCOS_LENGTH]);
      };
      for (var o = 0; o < perlin_octaves; o++) {
        var of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);
        rxf = noise_fsc(xf);
        ryf = noise_fsc(yf);
        n1 = perlin[of & PERLIN_SIZE];
        n1 += rxf * (perlin[of + 1 & PERLIN_SIZE] - n1);
        n2 = perlin[of + PERLIN_YWRAP & PERLIN_SIZE];
        n2 += rxf * (perlin[of + PERLIN_YWRAP + 1 & PERLIN_SIZE] - n2);
        n1 += ryf * (n2 - n1);
        of += PERLIN_ZWRAP;
        n2 = perlin[of & PERLIN_SIZE];
        n2 += rxf * (perlin[of + 1 & PERLIN_SIZE] - n2);
        n3 = perlin[of + PERLIN_YWRAP & PERLIN_SIZE];
        n3 += rxf * (perlin[of + PERLIN_YWRAP + 1 & PERLIN_SIZE] - n3);
        n2 += ryf * (n3 - n2);
        n1 += noise_fsc(zf) * (n2 - n1);
        r += n1 * ampl;
        ampl *= perlin_amp_falloff;
        xi <<= 1;
        xf *= 2;
        yi <<= 1;
        yf *= 2;
        zi <<= 1;
        zf *= 2;
        if (xf >= 1) {
          xi++;
          xf--;
        }
        if (yf >= 1) {
          yi++;
          yf--;
        }
        if (zf >= 1) {
          zi++;
          zf--;
        }
      }
      return r;
    };
    p5.prototype.noiseDetail = function (lod, falloff) {
      if (lod > 0) {
        perlin_octaves = lod;
      }
      if (falloff > 0) {
        perlin_amp_falloff = falloff;
      }
    };
    p5.prototype.noiseSeed = function (seed) {
      var lcg = function () {
          var m = 4294967296, a = 1664525, c = 1013904223, seed, z;
          return {
            setSeed: function (val) {
              z = seed = val || Math.round(Math.random() * m);
            },
            getSeed: function () {
              return seed;
            },
            rand: function () {
              z = (a * z + c) % m;
              return z / m;
            }
          };
        }();
      lcg.setSeed(seed);
      perlin = new Array(PERLIN_SIZE + 1);
      for (var i = 0; i < PERLIN_SIZE + 1; i++) {
        perlin[i] = lcg.rand();
      }
    };
    return p5;
  }({}, core);
var mathtrigonometry = function (require, core, polargeometry, constants) {
    'use strict';
    var p5 = core;
    var polarGeometry = polargeometry;
    var constants = constants;
    p5.prototype._angleMode = constants.RADIANS;
    p5.prototype.acos = function (ratio) {
      if (this._angleMode === constants.RADIANS) {
        return Math.acos(ratio);
      } else {
        return polarGeometry.radiansToDegrees(Math.acos(ratio));
      }
    };
    p5.prototype.asin = function (ratio) {
      if (this._angleMode === constants.RADIANS) {
        return Math.asin(ratio);
      } else {
        return polarGeometry.radiansToDegrees(Math.asin(ratio));
      }
    };
    p5.prototype.atan = function (ratio) {
      if (this._angleMode === constants.RADIANS) {
        return Math.atan(ratio);
      } else {
        return polarGeometry.radiansToDegrees(Math.atan(ratio));
      }
    };
    p5.prototype.atan2 = function (y, x) {
      if (this._angleMode === constants.RADIANS) {
        return Math.atan2(y, x);
      } else {
        return polarGeometry.radiansToDegrees(Math.atan2(y, x));
      }
    };
    p5.prototype.cos = function (angle) {
      if (this._angleMode === constants.RADIANS) {
        return Math.cos(angle);
      } else {
        return Math.cos(this.radians(angle));
      }
    };
    p5.prototype.sin = function (angle) {
      if (this._angleMode === constants.RADIANS) {
        return Math.sin(angle);
      } else {
        return Math.sin(this.radians(angle));
      }
    };
    p5.prototype.tan = function (angle) {
      if (this._angleMode === constants.RADIANS) {
        return Math.tan(angle);
      } else {
        return Math.tan(this.radians(angle));
      }
    };
    p5.prototype.degrees = function (angle) {
      return polarGeometry.radiansToDegrees(angle);
    };
    p5.prototype.radians = function (angle) {
      return polarGeometry.degreesToRadians(angle);
    };
    p5.prototype.angleMode = function (mode) {
      if (mode === constants.DEGREES || mode === constants.RADIANS) {
        this._angleMode = mode;
      }
    };
    return p5;
  }({}, core, polargeometry, constants);
var outputfiles = function (require, core) {
    'use strict';
    var p5 = core;
    window.URL = window.URL || window.webkitURL;
    p5.prototype._pWriters = [];
    p5.prototype.beginRaw = function () {
      throw 'not yet implemented';
    };
    p5.prototype.beginRecord = function () {
      throw 'not yet implemented';
    };
    p5.prototype.createOutput = function () {
      throw 'not yet implemented';
    };
    p5.prototype.createWriter = function (name, extension) {
      var newPW;
      for (var i in p5.prototype._pWriters) {
        if (p5.prototype._pWriters[i].name === name) {
          newPW = new p5.PrintWriter(name + window.millis(), extension);
          p5.prototype._pWriters.push(newPW);
          return newPW;
        }
      }
      newPW = new p5.PrintWriter(name, extension);
      p5.prototype._pWriters.push(newPW);
      return newPW;
    };
    p5.prototype.endRaw = function () {
      throw 'not yet implemented';
    };
    p5.prototype.endRecord = function () {
      throw 'not yet implemented';
    };
    p5.prototype.escape = function (content) {
      return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    };
    p5.PrintWriter = function (filename, extension) {
      var self = this;
      this.name = filename;
      this.content = '';
      this.print = function (data) {
        this.content += data;
      };
      this.println = function (data) {
        this.content += data + '\n';
      };
      this.flush = function () {
        this.content = '';
      };
      this.close = function () {
        var arr = [];
        arr.push(this.content);
        p5.prototype.writeFile(arr, filename, extension);
        for (var i in p5.prototype._pWriters) {
          if (p5.prototype._pWriters[i].name === this.name) {
            p5.prototype._pWriters.splice(i, 1);
          }
        }
        self.flush();
        self = {};
      };
    };
    p5.prototype.saveBytes = function () {
      throw 'not yet implemented';
    };
    p5.prototype.save = function (object, _filename, _options) {
      var args = arguments;
      var cnv = this._curElement.elt;
      if (args.length === 0) {
        p5.prototype.saveCanvas(cnv);
        return;
      } else if (args[0] instanceof p5.Graphics) {
        p5.prototype.saveCanvas(args[0].elt, args[1], args[2]);
        return;
      } else if (typeof args[0] === 'string') {
        p5.prototype.saveCanvas(cnv, args[0]);
      } else {
        var extension = _checkFileExtension(args[1], args[2])[1];
        switch (extension) {
        case 'json':
          p5.prototype.saveJSON(args[0], args[1], args[2]);
          break;
        case 'txt':
          p5.prototype.saveStrings(args[0], args[1], args[2]);
          break;
        default:
          if (args[0] instanceof Array) {
            p5.prototype.saveStrings(args[0], args[1], args[2]);
          } else if (args[0] instanceof p5.Table) {
            p5.prototype.saveTable(args[0], args[1], args[2], args[3]);
          } else if (args[0] instanceof p5.Image) {
            p5.prototype.saveCanvas(args[0].canvas, args[1]);
          } else if (args[0] instanceof p5.SoundFile) {
            p5.prototype.saveSound(args[0], args[1], args[2], args[3]);
          } else if (args[0] instanceof Object) {
            p5.prototype.saveJSON(args[0], args[1], args[2]);
          }
        }
      }
    };
    p5.prototype.saveJSON = function (json, filename, opt) {
      var stringify;
      if (opt) {
        stringify = JSON.stringify(json);
      } else {
        stringify = JSON.stringify(json, undefined, 2);
      }
      this.saveStrings(stringify.split('\n'), filename, 'json');
    };
    p5.prototype.saveJSONObject = p5.prototype.saveJSON;
    p5.prototype.saveJSONArray = p5.prototype.saveJSON;
    p5.prototype.saveStream = function () {
      throw 'not yet implemented';
    };
    p5.prototype.saveStrings = function (list, filename, extension) {
      var ext = extension || 'txt';
      var pWriter = this.createWriter(filename, ext);
      for (var i in list) {
        if (i < list.length - 1) {
          pWriter.println(list[i]);
        } else {
          pWriter.print(list[i]);
        }
      }
      pWriter.close();
      pWriter.flush();
    };
    p5.prototype.saveXML = function () {
      throw 'not yet implemented';
    };
    p5.prototype.selectOutput = function () {
      throw 'not yet implemented';
    };
    p5.prototype.saveTable = function (table, filename, options) {
      var pWriter = this.createWriter(filename, options);
      var header = table.columns;
      var sep = ',';
      if (options === 'tsv') {
        sep = '\t';
      }
      if (options !== 'html') {
        if (header[0] !== '0') {
          for (var h = 0; h < header.length; h++) {
            if (h < header.length - 1) {
              pWriter.print(header[h] + sep);
            } else {
              pWriter.println(header[h]);
            }
          }
        }
        for (var i = 0; i < table.rows.length; i++) {
          var j;
          for (j = 0; j < table.rows[i].arr.length; j++) {
            if (j < table.rows[i].arr.length - 1) {
              pWriter.print(table.rows[i].arr[j] + sep);
            } else if (i < table.rows.length - 1) {
              pWriter.println(table.rows[i].arr[j]);
            } else {
              pWriter.print(table.rows[i].arr[j]);
            }
          }
        }
      } else {
        pWriter.println('<html>');
        pWriter.println('<head>');
        var str = '  <meta http-equiv="content-type" content';
        str += '="text/html;charset=utf-8" />';
        pWriter.println(str);
        pWriter.println('</head>');
        pWriter.println('<body>');
        pWriter.println('  <table>');
        if (header[0] !== '0') {
          pWriter.println('    <tr>');
          for (var k = 0; k < header.length; k++) {
            var e = p5.prototype.escape(header[k]);
            pWriter.println('      <td>' + e);
            pWriter.println('      </td>');
          }
          pWriter.println('    </tr>');
        }
        for (var row = 0; row < table.rows.length; row++) {
          pWriter.println('    <tr>');
          for (var col = 0; col < table.columns.length; col++) {
            var entry = table.rows[row].getString(col);
            var htmlEntry = p5.prototype.escape(entry);
            pWriter.println('      <td>' + htmlEntry);
            pWriter.println('      </td>');
          }
          pWriter.println('    </tr>');
        }
        pWriter.println('  </table>');
        pWriter.println('</body>');
        pWriter.print('</html>');
      }
      pWriter.close();
      pWriter.flush();
    };
    p5.prototype.writeFile = function (dataToDownload, filename, extension) {
      var type = 'application/octet-stream';
      if (p5.prototype._isSafari()) {
        type = 'text/plain';
      }
      var blob = new Blob(dataToDownload, { 'type': type });
      var href = window.URL.createObjectURL(blob);
      p5.prototype.downloadFile(href, filename, extension);
    };
    p5.prototype.downloadFile = function (href, fName, extension) {
      var fx = _checkFileExtension(fName, extension);
      var filename = fx[0];
      var ext = fx[1];
      var a = document.createElement('a');
      a.href = href;
      a.download = filename;
      a.onclick = destroyClickedElement;
      a.style.display = 'none';
      document.body.appendChild(a);
      if (p5.prototype._isSafari()) {
        var aText = 'Hello, Safari user! To download this file...\n';
        aText += '1. Go to File --> Save As.\n';
        aText += '2. Choose "Page Source" as the Format.\n';
        aText += '3. Name it with this extension: ."' + ext + '"';
        alert(aText);
      }
      a.click();
      href = null;
    };
    function _checkFileExtension(filename, extension) {
      if (!extension) {
        extension = '';
      }
      if (!filename) {
        filename = 'untitled';
      }
      var ext = '';
      if (filename && filename.indexOf('.') > -1) {
        ext = filename.split('.').pop();
      }
      if (extension) {
        if (ext !== extension) {
          ext = extension;
          filename = filename + '.' + ext;
        }
      }
      return [
        filename,
        ext
      ];
    }
    p5.prototype._checkFileExtension = _checkFileExtension;
    p5.prototype._isSafari = function () {
      var x = Object.prototype.toString.call(window.HTMLElement);
      return x.indexOf('Constructor') > 0;
    };
    function destroyClickedElement(event) {
      document.body.removeChild(event.target);
    }
    return p5;
  }({}, core);
var outputimage = function (require, core) {
    'use strict';
    var p5 = core;
    var frames = [];
    p5.prototype.saveCanvas = function (_cnv, filename, extension) {
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
      if (p5.prototype._isSafari()) {
        var aText = 'Hello, Safari user!\n';
        aText += 'Now capturing a screenshot...\n';
        aText += 'To save this image,\n';
        aText += 'go to File --> Save As.\n';
        alert(aText);
        window.location.href = cnv.toDataURL();
      } else {
        var mimeType;
        if (typeof extension === 'undefined') {
          extension = 'png';
          mimeType = 'image/png';
        } else {
          switch (extension) {
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
    p5.prototype.saveFrames = function (fName, ext, _duration, _fps, callback) {
      var duration = _duration || 3;
      duration = p5.prototype.constrain(duration, 0, 15);
      duration = duration * 1000;
      var fps = _fps || 15;
      fps = p5.prototype.constrain(fps, 0, 22);
      var count = 0;
      var makeFrame = p5.prototype._makeFrame;
      var cnv = this._curElement.elt;
      var frameFactory = setInterval(function () {
          makeFrame(fName + count, ext, cnv);
          count++;
        }, 1000 / fps);
      setTimeout(function () {
        clearInterval(frameFactory);
        if (callback) {
          callback(frames);
        } else {
          for (var i = 0; i < frames.length; i++) {
            var f = frames[i];
            p5.prototype.downloadFile(f.imageData, f.filename, f.ext);
          }
        }
        frames = [];
      }, duration + 0.01);
    };
    p5.prototype._makeFrame = function (filename, extension, _cnv) {
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
      } else {
        switch (extension.toLowerCase()) {
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
  }({}, core);
var outputtext_area = function (require, core) {
    'use strict';
    var p5 = core;
    if (window.console && console.log) {
      p5.prototype.print = console.log.bind(console);
    } else {
      p5.prototype.print = function () {
      };
    }
    p5.prototype.println = p5.prototype.print;
    return p5;
  }({}, core);
var renderingrendering = function (require, core, constants) {
    var p5 = core;
    var constants = constants;
    p5.prototype.createCanvas = function (w, h, isDefault) {
      var c;
      if (isDefault) {
        c = document.createElement('canvas');
        c.id = 'defaultCanvas';
      } else {
        c = this.canvas;
      }
      if (!this._setupDone) {
        c.className += ' p5_hidden';
        c.style.visibility = 'hidden';
      }
      if (this._userNode) {
        this._userNode.appendChild(c);
      } else {
        document.body.appendChild(c);
      }
      if (!this._defaultGraphics) {
        this._defaultGraphics = new p5.Graphics(c, this, true);
        this._elements.push(this._defaultGraphics);
      }
      this._defaultGraphics.resize(w, h);
      this._defaultGraphics._applyDefaults();
      return this._defaultGraphics;
    };
    p5.prototype.resizeCanvas = function (w, h) {
      if (this._defaultGraphics) {
        this._defaultGraphics.resize(w, h);
        this._defaultGraphics._applyDefaults();
        this.redraw();
      }
    };
    p5.prototype.noCanvas = function () {
      if (this.canvas) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    };
    p5.prototype.createGraphics = function (w, h) {
      var c = document.createElement('canvas');
      var node = this._userNode || document.body;
      node.appendChild(c);
      var pg = new p5.Graphics(c, this, false);
      this._elements.push(pg);
      for (var p in p5.prototype) {
        if (!pg.hasOwnProperty(p)) {
          if (typeof p5.prototype[p] === 'function') {
            pg[p] = p5.prototype[p].bind(pg);
          } else {
            pg[p] = p5.prototype[p];
          }
        }
      }
      pg.resize(w, h);
      pg._applyDefaults();
      return pg;
    };
    p5.prototype.blendMode = function (mode) {
      if (mode === constants.BLEND || mode === constants.DARKEST || mode === constants.LIGHTEST || mode === constants.DIFFERENCE || mode === constants.MULTIPLY || mode === constants.EXCLUSION || mode === constants.SCREEN || mode === constants.REPLACE || mode === constants.OVERLAY || mode === constants.HARD_LIGHT || mode === constants.SOFT_LIGHT || mode === constants.DODGE || mode === constants.BURN || mode === constants.ADDITIVE || mode === constants.NORMAL) {
        this.drawingContext.globalCompositeOperation = mode;
      } else {
        throw new Error('Mode ' + mode + ' not recognized.');
      }
    };
    return p5;
  }({}, core, constants);
var shape2d_primitives = function (require, core, canvas, constants) {
    'use strict';
    var p5 = core;
    var canvas = canvas;
    var constants = constants;
    p5.prototype.arc = function (x, y, width, height, start, stop, mode) {
      if (!this._doStroke && !this._doFill) {
        return;
      }
      if (this._angleMode === constants.DEGREES) {
        start = this.radians(start);
        stop = this.radians(stop);
      }
      var ctx = this.drawingContext;
      var vals = canvas.arcModeAdjust(x, y, width, height, this._ellipseMode);
      var radius = vals.h > vals.w ? vals.h / 2 : vals.w / 2, xScale = vals.h > vals.w ? vals.w / vals.h : 1, yScale = vals.h > vals.w ? 1 : vals.h / vals.w;
      ctx.scale(xScale, yScale);
      ctx.beginPath();
      ctx.arc(vals.x, vals.y, radius, start, stop);
      if (this._doStroke) {
        ctx.stroke();
      }
      if (mode === constants.CHORD || mode === constants.OPEN) {
        ctx.closePath();
      } else if (mode === constants.PIE || mode === undefined) {
        ctx.lineTo(vals.x, vals.y);
        ctx.closePath();
      }
      if (this._doFill) {
        ctx.fill();
      }
      if (this._doStroke && mode !== constants.OPEN && mode !== undefined) {
        ctx.stroke();
      }
      return this;
    };
    p5.prototype.ellipse = function (x, y, w, h) {
      if (!this._doStroke && !this._doFill) {
        return;
      }
      w = Math.abs(w);
      h = Math.abs(h);
      var ctx = this.drawingContext;
      var vals = canvas.modeAdjust(x, y, w, h, this._ellipseMode);
      ctx.beginPath();
      if (w === h) {
        ctx.arc(vals.x + vals.w / 2, vals.y + vals.w / 2, vals.w / 2, 0, 2 * Math.PI, false);
      } else {
        var kappa = 0.5522848, ox = vals.w / 2 * kappa, oy = vals.h / 2 * kappa, xe = vals.x + vals.w, ye = vals.y + vals.h, xm = vals.x + vals.w / 2, ym = vals.y + vals.h / 2;
        ctx.moveTo(vals.x, ym);
        ctx.bezierCurveTo(vals.x, ym - oy, xm - ox, vals.y, xm, vals.y);
        ctx.bezierCurveTo(xm + ox, vals.y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, vals.x, ym + oy, vals.x, ym);
        ctx.closePath();
      }
      if (this._doFill) {
        ctx.fill();
      }
      if (this._doStroke) {
        ctx.stroke();
      }
      return this;
    };
    p5.prototype.line = function (x1, y1, x2, y2) {
      if (!this._doStroke) {
        return;
      }
      var ctx = this.drawingContext;
      if (ctx.strokeStyle === 'rgba(0,0,0,0)') {
        return;
      }
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      return this;
    };
    p5.prototype.point = function (x, y) {
      if (!this._doStroke) {
        return;
      }
      var ctx = this.drawingContext;
      var s = ctx.strokeStyle;
      var f = ctx.fillStyle;
      if (s === 'rgba(0,0,0,0)') {
        return;
      }
      x = Math.round(x);
      y = Math.round(y);
      ctx.fillStyle = s;
      if (ctx.lineWidth > 1) {
        ctx.beginPath();
        ctx.arc(x, y, ctx.lineWidth / 2, 0, constants.TWO_PI, false);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.fillStyle = f;
      return this;
    };
    p5.prototype.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
      if (!this._doStroke && !this._doFill) {
        return;
      }
      var ctx = this.drawingContext;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.closePath();
      if (this._doFill) {
        ctx.fill();
      }
      if (this._doStroke) {
        ctx.stroke();
      }
      return this;
    };
    p5.prototype.rect = function (a, b, c, d) {
      if (!this._doStroke && !this._doFill) {
        return;
      }
      var vals = canvas.modeAdjust(a, b, c, d, this._rectMode);
      var ctx = this.drawingContext;
      if (this._doStroke && ctx.lineWidth % 2 === 1) {
        ctx.translate(0.5, 0.5);
      }
      ctx.beginPath();
      ctx.rect(vals.x, vals.y, vals.w, vals.h);
      if (this._doFill) {
        ctx.fill();
      }
      if (this._doStroke) {
        ctx.stroke();
      }
      if (this._doStroke && ctx.lineWidth % 2 === 1) {
        ctx.translate(-0.5, -0.5);
      }
      return this;
    };
    p5.prototype.triangle = function (x1, y1, x2, y2, x3, y3) {
      if (!this._doStroke && !this._doFill) {
        return;
      }
      var ctx = this.drawingContext;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
      if (this._doFill) {
        ctx.fill();
      }
      if (this._doStroke) {
        ctx.stroke();
      }
      return this;
    };
    return p5;
  }({}, core, canvas, constants);
var shapeattributes = function (require, core, constants) {
    'use strict';
    var p5 = core;
    var constants = constants;
    p5.prototype._rectMode = constants.CORNER;
    p5.prototype._ellipseMode = constants.CENTER;
    p5.prototype.ellipseMode = function (m) {
      if (m === constants.CORNER || m === constants.CORNERS || m === constants.RADIUS || m === constants.CENTER) {
        this._ellipseMode = m;
      }
      return this;
    };
    p5.prototype.noSmooth = function () {
      this.drawingContext.mozImageSmoothingEnabled = false;
      this.drawingContext.webkitImageSmoothingEnabled = false;
      return this;
    };
    p5.prototype.rectMode = function (m) {
      if (m === constants.CORNER || m === constants.CORNERS || m === constants.RADIUS || m === constants.CENTER) {
        this._rectMode = m;
      }
      return this;
    };
    p5.prototype.smooth = function () {
      this.drawingContext.mozImageSmoothingEnabled = true;
      this.drawingContext.webkitImageSmoothingEnabled = true;
      return this;
    };
    p5.prototype.strokeCap = function (cap) {
      if (cap === constants.ROUND || cap === constants.SQUARE || cap === constants.PROJECT) {
        this.drawingContext.lineCap = cap;
      }
      return this;
    };
    p5.prototype.strokeJoin = function (join) {
      if (join === constants.ROUND || join === constants.BEVEL || join === constants.MITER) {
        this.drawingContext.lineJoin = join;
      }
      return this;
    };
    p5.prototype.strokeWeight = function (w) {
      if (typeof w === 'undefined' || w === 0) {
        this.drawingContext.lineWidth = 0.0001;
      } else {
        this.drawingContext.lineWidth = w;
      }
      return this;
    };
    return p5;
  }({}, core, constants);
var shapecurves = function (require, core) {
    'use strict';
    var p5 = core;
    p5.prototype._bezierDetail = 20;
    p5.prototype._curveDetail = 20;
    p5.prototype.bezier = function (x1, y1, x2, y2, x3, y3, x4, y4) {
      if (!this._doStroke) {
        return;
      }
      var ctx = this.drawingContext;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      for (var i = 0; i <= this._bezierDetail; i++) {
        var t = i / parseFloat(this._bezierDetail);
        var x = p5.prototype.bezierPoint(x1, x2, x3, x4, t);
        var y = p5.prototype.bezierPoint(y1, y2, y3, y4, t);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      return this;
    };
    p5.prototype.bezierDetail = function (d) {
      this._setProperty('_bezierDetail', d);
      return this;
    };
    p5.prototype.bezierPoint = function (a, b, c, d, t) {
      var adjustedT = 1 - t;
      return Math.pow(adjustedT, 3) * a + 3 * Math.pow(adjustedT, 2) * t * b + 3 * adjustedT * Math.pow(t, 2) * c + Math.pow(t, 3) * d;
    };
    p5.prototype.bezierTangent = function (a, b, c, d, t) {
      var adjustedT = 1 - t;
      return 3 * d * Math.pow(t, 2) - 3 * c * Math.pow(t, 2) + 6 * c * adjustedT * t - 6 * b * adjustedT * t + 3 * b * Math.pow(adjustedT, 2) - 3 * a * Math.pow(adjustedT, 2);
    };
    p5.prototype.curve = function (x1, y1, x2, y2, x3, y3, x4, y4) {
      if (!this._doStroke) {
        return;
      }
      var ctx = this.drawingContext;
      ctx.moveTo(x1, y1);
      ctx.beginPath();
      for (var i = 0; i <= this._curveDetail; i++) {
        var t = parseFloat(i / this._curveDetail);
        var x = p5.prototype.curvePoint(x1, x2, x3, x4, t);
        var y = p5.prototype.curvePoint(y1, y2, y3, y4, t);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.closePath();
      return this;
    };
    p5.prototype.curveDetail = function (d) {
      this._setProperty('_curveDetail', d);
      return this;
    };
    p5.prototype.curvePoint = function (a, b, c, d, t) {
      var t3 = t * t * t, t2 = t * t, f1 = -0.5 * t3 + t2 - 0.5 * t, f2 = 1.5 * t3 - 2.5 * t2 + 1, f3 = -1.5 * t3 + 2 * t2 + 0.5 * t, f4 = 0.5 * t3 - 0.5 * t2;
      return a * f1 + b * f2 + c * f3 + d * f4;
    };
    p5.prototype.curveTangent = function (a, b, c, d, t) {
      var t2 = t * t, f1 = -3 * t2 / 2 + 2 * t - 0.5, f2 = 9 * t2 / 2 - 5 * t, f3 = -9 * t2 / 2 + 4 * t + 0.5, f4 = 3 * t2 / 2 - t;
      return a * f1 + b * f2 + c * f3 + d * f4;
    };
    p5.prototype.curveTightness = function () {
      throw 'not yet implemented';
    };
    return p5;
  }({}, core);
var shapevertex = function (require, core, constants) {
    'use strict';
    var p5 = core;
    var constants = constants;
    p5.prototype._shapeKind = null;
    p5.prototype._shapeInited = false;
    p5.prototype._contourInited = false;
    p5.prototype._contourVertices = [];
    p5.prototype._curveVertices = [];
    p5.prototype.beginContour = function () {
      this._contourVertices = [];
      this._contourInited = true;
      return this;
    };
    p5.prototype.beginShape = function (kind) {
      if (kind === constants.POINTS || kind === constants.LINES || kind === constants.TRIANGLES || kind === constants.TRIANGLE_FAN || kind === constants.TRIANGLE_STRIP || kind === constants.QUADS || kind === constants.QUAD_STRIP) {
        this._shapeKind = kind;
      } else {
        this._shapeKind = null;
      }
      this._shapeInited = true;
      this.drawingContext.beginPath();
      return this;
    };
    p5.prototype.bezierVertex = function (x2, y2, x3, y3, x4, y4) {
      if (this._contourInited) {
        var pt = {};
        pt.x = x2;
        pt.y = y2;
        pt.x3 = x3;
        pt.y3 = y3;
        pt.x4 = x4;
        pt.y4 = y4;
        pt.type = constants.BEZIER;
        this._contourVertices.push(pt);
        return this;
      }
      this.drawingContext.bezierCurveTo(x2, y2, x3, y3, x4, y4);
      return this;
    };
    p5.prototype.curveVertex = function (x, y) {
      var pt = {};
      pt.x = x;
      pt.y = y;
      this._curveVertices.push(pt);
      if (this._curveVertices.length >= 4) {
        this.curve(this._curveVertices[0].x, this._curveVertices[0].y, this._curveVertices[1].x, this._curveVertices[1].y, this._curveVertices[2].x, this._curveVertices[2].y, this._curveVertices[3].x, this._curveVertices[3].y);
        this._curveVertices.shift();
      }
      return this;
    };
    p5.prototype.endContour = function () {
      this._contourVertices.reverse();
      this.drawingContext.moveTo(this._contourVertices[0].x, this._contourVertices[0].y);
      var ctx = this.drawingContext;
      this._contourVertices.slice(1).forEach(function (pt, i) {
        switch (pt.type) {
        case constants.LINEAR:
          ctx.lineTo(pt.x, pt.y);
          break;
        case constants.QUADRATIC:
          ctx.quadraticCurveTo(pt.x, pt.y, pt.x3, pt.y3);
          break;
        case constants.BEZIER:
          ctx.bezierCurveTo(pt.x, pt.y, pt.x3, pt.y3, pt.x4, pt.y4);
          break;
        case constants.CURVE:
          break;
        }
      });
      this.drawingContext.closePath();
      this._contourInited = false;
      return this;
    };
    p5.prototype.endShape = function (mode) {
      if (mode === constants.CLOSE) {
        this.drawingContext.closePath();
        if (this._doFill) {
          this.drawingContext.fill();
        }
      }
      if (this._doStroke && this._curveVertices.length <= 0) {
        this.drawingContext.stroke();
      } else {
        this._curveVertices = [];
      }
      return this;
    };
    p5.prototype.quadraticVertex = function (cx, cy, x3, y3) {
      if (this._contourInited) {
        var pt = {};
        pt.x = cx;
        pt.y = cy;
        pt.x3 = x3;
        pt.y3 = y3;
        pt.type = constants.QUADRATIC;
        this._contourVertices.push(pt);
        return this;
      }
      this.drawingContext.quadraticCurveTo(cx, cy, x3, y3);
      return this;
    };
    p5.prototype.vertex = function (x, y) {
      if (this._contourInited) {
        var pt = {};
        pt.x = x;
        pt.y = y;
        pt.type = constants.LINEAR;
        this._contourVertices.push(pt);
        return this;
      }
      if (this._shapeInited) {
        this.drawingContext.moveTo(x, y);
      } else {
        this.drawingContext.lineTo(x, y);
      }
      this._shapeInited = false;
      return this;
    };
    return p5;
  }({}, core, constants);
var structure = function (require, core) {
    'use strict';
    var p5 = core;
    p5.prototype.exit = function () {
      throw 'exit() not implemented, see remove()';
    };
    p5.prototype.noLoop = function () {
      this._loop = false;
      if (this._drawInterval) {
        clearInterval(this._drawInterval);
      }
    };
    p5.prototype.loop = function () {
      this._loop = true;
      this._draw();
    };
    p5.prototype.push = function () {
      this.drawingContext.save();
      this._styles.push({
        doStroke: this._doStroke,
        doFill: this._doFill,
        tint: this._tint,
        imageMode: this._imageMode,
        rectMode: this._rectMode,
        ellipseMode: this._ellipseMode,
        colorMode: this._colorMode,
        textFont: this.textFont,
        textLeading: this.textLeading,
        textSize: this.textSize,
        textStyle: this.textStyle
      });
    };
    p5.prototype.pop = function () {
      this.drawingContext.restore();
      var lastS = this._styles.pop();
      this._doStroke = lastS.doStroke;
      this._doFill = lastS.doFill;
      this._tint = lastS.tint;
      this._imageMode = lastS.imageMode;
      this._rectMode = lastS.rectMode;
      this._ellipseMode = lastS.ellipseMode;
      this._colorMode = lastS.colorMode;
      this.textFont = lastS.textFont;
      this.textLeading = lastS.textLeading;
      this.textSize = lastS.textSize;
      this.textStyle = lastS.textStyle;
    };
    p5.prototype.pushStyle = function () {
      throw new Error('pushStyle() not used, see push()');
    };
    p5.prototype.popStyle = function () {
      throw new Error('popStyle() not used, see pop()');
    };
    p5.prototype.redraw = function () {
      var context = this._isGlobal ? window : this;
      if (context.draw) {
        context.draw();
      }
    };
    p5.prototype.size = function () {
      throw 'size() not implemented, see createCanvas()';
    };
    return p5;
  }({}, core);
var transform = function (require, core, constants, outputtext_area) {
    'use strict';
    var p5 = core;
    var constants = constants;
    p5.prototype.applyMatrix = function (n00, n01, n02, n10, n11, n12) {
      this.drawingContext.transform(n00, n01, n02, n10, n11, n12);
      return this;
    };
    p5.prototype.popMatrix = function () {
      throw new Error('popMatrix() not used, see pop()');
    };
    p5.prototype.printMatrix = function () {
      throw new Error('printMatrix() not implemented');
    };
    p5.prototype.pushMatrix = function () {
      throw new Error('pushMatrix() not used, see push()');
    };
    p5.prototype.resetMatrix = function () {
      this.drawingContext.setTransform();
      return this;
    };
    p5.prototype.rotate = function (r) {
      if (this._angleMode === constants.DEGREES) {
        r = this.radians(r);
      }
      this.drawingContext.rotate(r);
      return this;
    };
    p5.prototype.rotateX = function () {
      throw 'not yet implemented';
    };
    p5.prototype.rotateY = function () {
      throw 'not yet implemented';
    };
    p5.prototype.scale = function () {
      var x = 1, y = 1;
      if (arguments.length === 1) {
        x = y = arguments[0];
      } else {
        x = arguments[0];
        y = arguments[1];
      }
      this.drawingContext.scale(x, y);
      return this;
    };
    p5.prototype.shearX = function (angle) {
      if (this._angleMode === constants.DEGREES) {
        angle = this.radians(angle);
      }
      this.drawingContext.transform(1, 0, this.tan(angle), 1, 0, 0);
      return this;
    };
    p5.prototype.shearY = function (angle) {
      if (this._angleMode === constants.DEGREES) {
        angle = this.radians(angle);
      }
      this.drawingContext.transform(1, this.tan(angle), 0, 1, 0, 0);
      return this;
    };
    p5.prototype.translate = function (x, y) {
      this.drawingContext.translate(x, y);
      return this;
    };
    return p5;
  }({}, core, constants, outputtext_area);
var typographyattributes = function (require, core, constants) {
    'use strict';
    var p5 = core;
    var constants = constants;
    p5.prototype._textLeading = 15;
    p5.prototype._textFont = 'sans-serif';
    p5.prototype._textSize = 12;
    p5.prototype._textStyle = constants.NORMAL;
    p5.prototype._textAscent = null;
    p5.prototype._textDescent = null;
    p5.prototype.textAlign = function (a) {
      if (a === constants.LEFT || a === constants.RIGHT || a === constants.CENTER) {
        this.drawingContext.textAlign = a;
      }
    };
    p5.prototype.textLeading = function (l) {
      this._setProperty('_textLeading', l);
    };
    p5.prototype.textSize = function (s) {
      this._setProperty('_textSize', s);
      this._applyTextProperties();
    };
    p5.prototype.textStyle = function (s) {
      if (s === constants.NORMAL || s === constants.ITALIC || s === constants.BOLD) {
        this._setProperty('_textStyle', s);
        this._applyTextProperties();
      }
    };
    p5.prototype.textWidth = function (s) {
      return this.drawingContext.measureText(s).width;
    };
    p5.prototype.textAscent = function () {
      if (this._textAscent == null) {
        this._updateTextMetrics();
      }
      return this._textAscent;
    };
    p5.prototype.textDescent = function () {
      if (this._textDescent == null) {
        this._updateTextMetrics();
      }
      return this._textDescent;
    };
    p5.prototype._applyTextProperties = function () {
      this._setProperty('_textAscent', null);
      this._setProperty('_textDescent', null);
      var str = this._textStyle + ' ' + this._textSize + 'px ' + this._textFont;
      this.drawingContext.font = str;
    };
    p5.prototype._updateTextMetrics = function () {
      var text = document.createElement('span');
      text.style.fontFamily = this._textFont;
      text.style.fontSize = this._textSize + 'px';
      text.innerHTML = 'ABCjgq|';
      var block = document.createElement('div');
      block.style.display = 'inline-block';
      block.style.width = '1px';
      block.style.height = '0px';
      var container = document.createElement('div');
      container.appendChild(text);
      container.appendChild(block);
      container.style.height = '0px';
      container.style.overflow = 'hidden';
      document.body.appendChild(container);
      block.style.verticalAlign = 'baseline';
      var blockOffset = this._calculateOffset(block);
      var textOffset = this._calculateOffset(text);
      var ascent = blockOffset[1] - textOffset[1];
      block.style.verticalAlign = 'bottom';
      blockOffset = this._calculateOffset(block);
      textOffset = this._calculateOffset(text);
      var height = blockOffset[1] - textOffset[1];
      var descent = height - ascent;
      document.body.removeChild(container);
      this._setProperty('_textAscent', ascent);
      this._setProperty('_textDescent', descent);
    };
    p5.prototype._calculateOffset = function (object) {
      var currentLeft = 0, currentTop = 0;
      if (object.offsetParent) {
        do {
          currentLeft += object.offsetLeft;
          currentTop += object.offsetTop;
        } while (object = object.offsetParent);
      } else {
        currentLeft += object.offsetLeft;
        currentTop += object.offsetTop;
      }
      return [
        currentLeft,
        currentTop
      ];
    };
    return p5;
  }({}, core, constants);
var typographyloading_displaying = function (require, core, canvas) {
    'use strict';
    var p5 = core;
    var canvas = canvas;
    p5.prototype.text = function () {
      if (arguments.length === 3) {
        if (this._doFill) {
          this.drawingContext.fillText(arguments[0], arguments[1], arguments[2]);
        }
        if (this._doStroke) {
          this.drawingContext.strokeText(arguments[0], arguments[1], arguments[2]);
        }
      } else if (arguments.length === 5) {
        var words = arguments[0].split(' ');
        var line = '';
        var vals = canvas.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], this._rectMode);
        var y = vals.y + this._textLeading;
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = this.drawingContext.measureText(testLine);
          var testWidth = metrics.width;
          if (y > vals.y + vals.h) {
            break;
          } else if (testWidth > vals.w && n > 0) {
            if (this._doFill) {
              this.drawingContext.fillText(line, vals.x, y);
            }
            if (this._doStroke) {
              this.drawingContext.strokeText(line, vals.x, y);
            }
            line = words[n] + ' ';
            y += this._textLeading;
          } else {
            line = testLine;
          }
        }
        if (y <= vals.y + vals.h) {
          if (this._doFill) {
            this.drawingContext.fillText(line, vals.x, y);
          }
          if (this._doStroke) {
            this.drawingContext.strokeText(line, vals.x, y);
          }
        }
      }
    };
    p5.prototype.textFont = function (str) {
      this._setProperty('_textFont', str);
      this._applyTextProperties();
    };
    return p5;
  }({}, core, canvas);
var src_app = function (require, core, p5Color, p5Element, p5Graphics, p5Image, p5Vector, p5TableRow, p5Table, colorcreating_reading, colorsetting, constants, dataconversion, dataarray_functions, datastring_functions, environment, imageimage, imageloading_displaying, imagepixels, inputfiles, inputkeyboard, inputmouse, inputtime_date, inputtouch, mathmath, mathcalculation, mathrandom, mathnoise, mathtrigonometry, outputfiles, outputimage, outputtext_area, renderingrendering, shape2d_primitives, shapeattributes, shapecurves, shapevertex, structure, transform, typographyattributes, typographyloading_displaying) {
    'use strict';
    var p5 = core;
    var _globalInit = function () {
      if (!window.PHANTOMJS) {
        if (window.setup && typeof window.setup === 'function' || window.draw && typeof window.draw === 'function') {
          new p5();
        }
      }
    };
    if (document.readyState === 'complete') {
      _globalInit();
    } else {
      window.addEventListener('load', _globalInit, false);
    }
    window.p5 = p5;
    return p5;
  }({}, core, p5Color, p5Element, p5Graphics, p5Image, p5Vector, p5TableRow, p5Table, colorcreating_reading, colorsetting, constants, dataconversion, dataarray_functions, datastring_functions, environment, imageimage, imageloading_displaying, imagepixels, inputfiles, inputkeyboard, inputmouse, inputtime_date, inputtouch, mathmath, mathcalculation, mathrandom, mathnoise, mathtrigonometry, outputfiles, outputimage, outputtext_area, renderingrendering, shape2d_primitives, shapeattributes, shapecurves, shapevertex, structure, transform, typographyattributes, typographyloading_displaying);
