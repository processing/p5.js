/*! p5.js v0.4.5 June 02, 2015 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5', [], function () { return (root.returnExportsGlobal = factory());});
  else if (typeof exports === 'object')
    module.exports = factory();
  else
    root['p5'] = factory();
}(this, function () {
var amdclean = {};
amdclean['core_shim'] = function (require) {
  window.requestAnimationFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
  }();
  window.performance = window.performance || {};
  window.performance.now = function () {
    var load_date = Date.now();
    return window.performance.now || window.performance.mozNow || window.performance.msNow || window.performance.oNow || window.performance.webkitNow || function () {
      return Date.now() - load_date;
    };
  }();
  (function () {
    'use strict';
    if (typeof Uint8ClampedArray !== 'undefined') {
      Uint8ClampedArray.prototype.slice = Array.prototype.slice;
    }
  }());
}({});
amdclean['core_constants'] = function (require) {
  var PI = Math.PI;
  return {
    P2D: 'p2d',
    WEBGL: 'webgl',
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
    TOP: 'top',
    BOTTOM: 'bottom',
    BASELINE: 'alphabetic',
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
    HSL: 'hsl',
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
    ADD: 'lighter',
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
    THRESHOLD: 'threshold',
    GRAY: 'gray',
    OPAQUE: 'opaque',
    INVERT: 'invert',
    POSTERIZE: 'posterize',
    DILATE: 'dilate',
    ERODE: 'erode',
    BLUR: 'blur',
    NORMAL: 'normal',
    ITALIC: 'italic',
    BOLD: 'bold',
    _DEFAULT_TEXT_FILL: '#000000',
    _DEFAULT_LEADMULT: 1.25,
    _CTX_MIDDLE: 'middle',
    LINEAR: 'linear',
    QUADRATIC: 'quadratic',
    BEZIER: 'bezier',
    CURVE: 'curve',
    _DEFAULT_STROKE: '#000000',
    _DEFAULT_FILL: '#FFFFFF'
  };
}({});
amdclean['core_core'] = function (require, core_shim, core_constants) {
  'use strict';
  var constants = core_constants;
  var p5 = function (sketch, node, sync) {
    if (arguments.length === 2 && typeof node === 'boolean') {
      sync = node;
      node = undefined;
    }
    this._setupDone = false;
    this.pixelDensity = window.devicePixelRatio || 1;
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
      'mouseover': null,
      'mouseout': null,
      'keydown': null,
      'keyup': null,
      'keypress': null,
      'touchstart': null,
      'touchmove': null,
      'touchend': null,
      'resize': null,
      'blur': null
    };
    if (window.DeviceOrientationEvent) {
      this._events.deviceorientation = null;
    } else if (window.DeviceMotionEvent) {
      this._events.devicemotion = null;
    } else {
      this._events.MozOrientation = null;
    }
    if (/Firefox/i.test(navigator.userAgent)) {
      this._events.DOMMouseScroll = null;
    } else {
      this._events.mousewheel = null;
    }
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
      this.createCanvas(this._defaultCanvasSize.width, this._defaultCanvasSize.height, 'p2d', true);
      var userPreload = this.preload || window.preload;
      var context = this._isGlobal ? window : this;
      if (userPreload) {
        this._preloadMethods.forEach(function (f) {
          context[f] = function () {
            var argsArray = Array.prototype.slice.call(arguments);
            return context._preload(f, argsArray);
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
    this._preload = function (func, args) {
      var context = this._isGlobal ? window : this;
      context._setProperty('_preloadCount', context._preloadCount + 1);
      var preloadCallback = function (resp) {
        context._setProperty('_preloadCount', context._preloadCount - 1);
        if (context._preloadCount === 0) {
          context._setup();
          context._runFrames();
          context._draw();
        }
      };
      args.push(preloadCallback);
      return p5.prototype[func].apply(context, args);
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
      var reg = new RegExp(/(^|\s)p5_hidden(?!\S)/g);
      var canvases = document.getElementsByClassName('p5_hidden');
      for (var i = 0; i < canvases.length; i++) {
        var k = canvases[i];
        k.style.visibility = '';
        k.className = k.className.replace(reg, '');
      }
      this._setupDone = true;
      this._loadingScreen.parentNode.removeChild(this._loadingScreen);
    }.bind(this);
    this._draw = function () {
      var now = window.performance.now();
      var time_since_last = now - this._lastFrameTime;
      var target_time_between_frames = 1000 / this._targetFrameRate;
      var epsilon = 5;
      if (!this.loop || time_since_last >= target_time_between_frames - epsilon) {
        this._setProperty('frameCount', this.frameCount + 1);
        this.redraw();
        this._updatePAccelerations();
        this._updatePMouseCoords();
        this._updatePTouchCoords();
        this._frameRate = 1000 / (now - this._lastFrameTime);
        this._lastFrameTime = now;
      }
      if (this._loop) {
        window.requestAnimationFrame(this._draw);
      }
    }.bind(this);
    this._runFrames = function () {
      if (this._updateInterval) {
        clearInterval(this._updateInterval);
      }
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
      var f = this['_on' + e];
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
    if (sync) {
      this._start();
    } else {
      if (document.readyState === 'complete') {
        this._start();
      } else {
        window.addEventListener('load', this._start.bind(this), false);
      }
    }
  };
  p5.prototype._preloadMethods = [
    'loadJSON',
    'loadImage',
    'loadStrings',
    'loadXML',
    'loadShape',
    'loadTable',
    'loadFont'
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
}({}, amdclean['core_shim'], amdclean['core_constants']);
amdclean['color_color_utils'] = function (require, core_core) {
  var p5 = core_core;
  p5.ColorUtils = {};
  p5.ColorUtils.hsbaToRGBA = function (hsba, maxes) {
    var h = hsba[0];
    var s = hsba[1];
    var v = hsba[2];
    var a = hsba[3] || maxes[3];
    h /= maxes[0];
    s /= maxes[1];
    v /= maxes[2];
    a /= maxes[3];
    var RGBA = [];
    if (s === 0) {
      RGBA = [
        Math.round(v * 255),
        Math.round(v * 255),
        Math.round(v * 255),
        a * 255
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
      var r;
      var g;
      var b;
      if (var_i === 0) {
        r = v;
        g = var_3;
        b = var_1;
      } else if (var_i === 1) {
        r = var_2;
        g = v;
        b = var_1;
      } else if (var_i === 2) {
        r = var_1;
        g = v;
        b = var_3;
      } else if (var_i === 3) {
        r = var_1;
        g = var_2;
        b = v;
      } else if (var_i === 4) {
        r = var_3;
        g = var_1;
        b = v;
      } else {
        r = v;
        g = var_1;
        b = var_2;
      }
      RGBA = [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255),
        a * 255
      ];
    }
    return RGBA;
  };
  p5.ColorUtils.rgbaToHSBA = function (rgba, maxes) {
    var r = rgba[0] / maxes[0];
    var g = rgba[1] / maxes[1];
    var b = rgba[2] / maxes[2];
    var a = rgba[3] / maxes[3];
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta_max = max - min;
    var h;
    var s;
    var v = max;
    if (delta_max === 0) {
      h = 0;
      s = 0;
    } else {
      s = delta_max / max;
      var delta_r = ((max - r) / 6 + delta_max / 2) / delta_max;
      var delta_g = ((max - g) / 6 + delta_max / 2) / delta_max;
      var delta_b = ((max - b) / 6 + delta_max / 2) / delta_max;
      if (r === max) {
        h = delta_b - delta_g;
      } else if (g === max) {
        h = 1 / 3 + delta_r - delta_b;
      } else if (b === max) {
        h = 2 / 3 + delta_g - delta_r;
      }
      if (h < 0) {
        h += 1;
      }
      if (h > 1) {
        h -= 1;
      }
    }
    return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(v * 100),
      a * 1
    ];
  };
  p5.ColorUtils.hslaToRGBA = function (hsla, maxes) {
    var h = hsla[0];
    var s = hsla[1];
    var l = hsla[2];
    var a = hsla[3] || maxes[3];
    h /= maxes[0];
    s /= maxes[1];
    l /= maxes[2];
    a /= maxes[3];
    var rgba = [];
    if (s === 0) {
      rgba = [
        Math.round(l * 255),
        Math.round(l * 255),
        Math.round(l * 255),
        a
      ];
    } else {
      var m, n, r, g, b;
      n = l < 0.5 ? l * (1 + s) : l + s - s * l;
      m = 2 * l - n;
      var convert = function (x, y, hue) {
        if (hue < 0) {
          hue += 1;
        } else if (hue > 1) {
          hue -= 1;
        }
        if (6 * hue < 1) {
          return x + (y - x) * 6 * hue;
        } else if (2 * hue < 1) {
          return y;
        } else if (3 * hue < 2) {
          return x + (y - x) * (2 / 3 - hue) * 6;
        } else {
          return x;
        }
      };
      r = convert(m, n, h + 1 / 3);
      g = convert(m, n, h);
      b = convert(m, n, h - 1 / 3);
      rgba = [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255),
        Math.round(a * 255)
      ];
    }
    return rgba;
  };
  p5.ColorUtils.rgbaToHSLA = function (rgba, maxes) {
    var r = rgba[0] / maxes[0];
    var g = rgba[1] / maxes[1];
    var b = rgba[2] / maxes[2];
    var a = rgba[3] / maxes[3];
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta_max = max - min;
    var h;
    var s;
    var l = (max + min) / 2;
    var delta_r;
    var delta_g;
    var delta_b;
    if (delta_max === 0) {
      h = 0;
      s = 0;
    } else {
      delta_r = ((max - r) / 6 + delta_max / 2) / delta_max;
      delta_g = ((max - g) / 6 + delta_max / 2) / delta_max;
      delta_b = ((max - b) / 6 + delta_max / 2) / delta_max;
      if (r === max) {
        h = delta_b - delta_g;
      } else if (g === max) {
        h = 1 / 3 + delta_r - delta_b;
      } else if (b === max) {
        h = 2 / 3 + delta_g - delta_r;
      }
      if (h < 0) {
        h += 1;
      }
      if (h > 1) {
        h -= 1;
      }
      if (l < 0.5) {
        s = delta_max / (max + min);
      } else {
        s = delta_max / (2 - max - min);
      }
    }
    return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(l * 100),
      a * 1
    ];
  };
  return p5.ColorUtils;
}({}, amdclean['core_core']);
amdclean['color_p5Color'] = function (require, core_core, color_color_utils, core_constants) {
  var p5 = core_core;
  var color_utils = color_color_utils;
  var constants = core_constants;
  p5.Color = function (pInst, vals) {
    this.maxArr = pInst._colorMaxes[pInst._colorMode];
    this.color_array = p5.Color._getFormattedColor.apply(pInst, vals);
    var isHSB = pInst._colorMode === constants.HSB, isRGB = pInst._colorMode === constants.RGB, isHSL = pInst._colorMode === constants.HSL;
    if (isRGB) {
      this.rgba = this.color_array;
    } else if (isHSL) {
      this.hsla = this.color_array;
      this.rgba = color_utils.hslaToRGBA(this.color_array, this.maxArr);
    } else if (isHSB) {
      this.hsba = this.color_array;
      this.rgba = color_utils.hsbaToRGBA(this.color_array, this.maxArr);
    } else {
      throw new Error(pInst._colorMode + 'is an invalid colorMode.');
    }
    return this;
  };
  p5.Color.prototype.getHue = function () {
    if (this.hsla || this.hsba) {
      return this.hsla ? this.hsla[0] : this.hsba[0];
    } else {
      this.hsla = color_utils.rgbaToHSLA(this.color_array, this.maxArr);
      return this.hsla[0];
    }
  };
  p5.Color.prototype.getSaturation = function () {
    if (this.hsla) {
      return this.hsla[1];
    } else if (this.hsba) {
      return this.hsba[1];
    } else {
      this.hsla = color_utils.rgbaToHSLA(this.color_array, this.maxArr);
      return this.hsla[1];
    }
  };
  p5.Color.prototype.getBrightness = function () {
    if (this.hsba) {
      return this.hsba[2];
    } else {
      this.hsba = color_utils.rgbaToHSBA(this.color_array, this.maxArr);
      return this.hsba[2];
    }
  };
  p5.Color.prototype.getLightness = function () {
    if (this.hsla) {
      return this.hsla[2];
    } else {
      this.hsla = color_utils.rgbaToHSLA(this.color_array, this.maxArr);
      return this.hsla[2];
    }
  };
  p5.Color.prototype.getRed = function () {
    return this.rgba[0];
  };
  p5.Color.prototype.getGreen = function () {
    return this.rgba[1];
  };
  p5.Color.prototype.getBlue = function () {
    return this.rgba[2];
  };
  p5.Color.prototype.getAlpha = function () {
    if (this.hsba || this.hsla) {
      return this.hsla ? this.hsla[3] : this.hsba[3];
    } else {
      return this.rgba[3];
    }
  };
  p5.Color.prototype.toString = function () {
    var a = this.rgba;
    for (var i = 0; i < 3; i++) {
      a[i] = Math.floor(a[i]);
    }
    var alpha = typeof a[3] !== 'undefined' ? a[3] / 255 : 1;
    return 'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + alpha + ')';
  };
  var WHITESPACE = /\s*/;
  var INTEGER = /(\d{1,3})/;
  var DECIMAL = /((?:\d+(?:\.\d+)?)|(?:\.\d+))/;
  var PERCENT = new RegExp(DECIMAL.source + '%');
  var namedColors = {
      aliceblue: '#f0f8ff',
      antiquewhite: '#faebd7',
      aqua: '#00ffff',
      aquamarine: '#7fffd4',
      azure: '#f0ffff',
      beige: '#f5f5dc',
      bisque: '#ffe4c4',
      black: '#000000',
      blanchedalmond: '#ffebcd',
      blue: '#0000ff',
      blueviolet: '#8a2be2',
      brown: '#a52a2a',
      burlywood: '#deb887',
      cadetblue: '#5f9ea0',
      chartreuse: '#7fff00',
      chocolate: '#d2691e',
      coral: '#ff7f50',
      cornflowerblue: '#6495ed',
      cornsilk: '#fff8dc',
      crimson: '#dc143c',
      cyan: '#00ffff',
      darkblue: '#00008b',
      darkcyan: '#008b8b',
      darkgoldenrod: '#b8860b',
      darkgray: '#a9a9a9',
      darkgreen: '#006400',
      darkgrey: '#a9a9a9',
      darkkhaki: '#bdb76b',
      darkmagenta: '#8b008b',
      darkolivegreen: '#556b2f',
      darkorange: '#ff8c00',
      darkorchid: '#9932cc',
      darkred: '#8b0000',
      darksalmon: '#e9967a',
      darkseagreen: '#8fbc8f',
      darkslateblue: '#483d8b',
      darkslategray: '#2f4f4f',
      darkslategrey: '#2f4f4f',
      darkturquoise: '#00ced1',
      darkviolet: '#9400d3',
      deeppink: '#ff1493',
      deepskyblue: '#00bfff',
      dimgray: '#696969',
      dimgrey: '#696969',
      dodgerblue: '#1e90ff',
      firebrick: '#b22222',
      floralwhite: '#fffaf0',
      forestgreen: '#228b22',
      fuchsia: '#ff00ff',
      gainsboro: '#dcdcdc',
      ghostwhite: '#f8f8ff',
      gold: '#ffd700',
      goldenrod: '#daa520',
      gray: '#808080',
      green: '#008000',
      greenyellow: '#adff2f',
      grey: '#808080',
      honeydew: '#f0fff0',
      hotpink: '#ff69b4',
      indianred: '#cd5c5c',
      indigo: '#4b0082',
      ivory: '#fffff0',
      khaki: '#f0e68c',
      lavender: '#e6e6fa',
      lavenderblush: '#fff0f5',
      lawngreen: '#7cfc00',
      lemonchiffon: '#fffacd',
      lightblue: '#add8e6',
      lightcoral: '#f08080',
      lightcyan: '#e0ffff',
      lightgoldenrodyellow: '#fafad2',
      lightgray: '#d3d3d3',
      lightgreen: '#90ee90',
      lightgrey: '#d3d3d3',
      lightpink: '#ffb6c1',
      lightsalmon: '#ffa07a',
      lightseagreen: '#20b2aa',
      lightskyblue: '#87cefa',
      lightslategray: '#778899',
      lightslategrey: '#778899',
      lightsteelblue: '#b0c4de',
      lightyellow: '#ffffe0',
      lime: '#00ff00',
      limegreen: '#32cd32',
      linen: '#faf0e6',
      magenta: '#ff00ff',
      maroon: '#800000',
      mediumaquamarine: '#66cdaa',
      mediumblue: '#0000cd',
      mediumorchid: '#ba55d3',
      mediumpurple: '#9370db',
      mediumseagreen: '#3cb371',
      mediumslateblue: '#7b68ee',
      mediumspringgreen: '#00fa9a',
      mediumturquoise: '#48d1cc',
      mediumvioletred: '#c71585',
      midnightblue: '#191970',
      mintcream: '#f5fffa',
      mistyrose: '#ffe4e1',
      moccasin: '#ffe4b5',
      navajowhite: '#ffdead',
      navy: '#000080',
      oldlace: '#fdf5e6',
      olive: '#808000',
      olivedrab: '#6b8e23',
      orange: '#ffa500',
      orangered: '#ff4500',
      orchid: '#da70d6',
      palegoldenrod: '#eee8aa',
      palegreen: '#98fb98',
      paleturquoise: '#afeeee',
      palevioletred: '#db7093',
      papayawhip: '#ffefd5',
      peachpuff: '#ffdab9',
      peru: '#cd853f',
      pink: '#ffc0cb',
      plum: '#dda0dd',
      powderblue: '#b0e0e6',
      purple: '#800080',
      red: '#ff0000',
      rosybrown: '#bc8f8f',
      royalblue: '#4169e1',
      saddlebrown: '#8b4513',
      salmon: '#fa8072',
      sandybrown: '#f4a460',
      seagreen: '#2e8b57',
      seashell: '#fff5ee',
      sienna: '#a0522d',
      silver: '#c0c0c0',
      skyblue: '#87ceeb',
      slateblue: '#6a5acd',
      slategray: '#708090',
      slategrey: '#708090',
      snow: '#fffafa',
      springgreen: '#00ff7f',
      steelblue: '#4682b4',
      tan: '#d2b48c',
      teal: '#008080',
      thistle: '#d8bfd8',
      tomato: '#ff6347',
      turquoise: '#40e0d0',
      violet: '#ee82ee',
      wheat: '#f5deb3',
      white: '#ffffff',
      whitesmoke: '#f5f5f5',
      yellow: '#ffff00',
      yellowgreen: '#9acd32'
    };
  var colorPatterns = {
      HEX3: /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,
      HEX6: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
      RGB: new RegExp([
        '^rgb\\(',
        INTEGER.source,
        ',',
        INTEGER.source,
        ',',
        INTEGER.source,
        '\\)$'
      ].join(WHITESPACE.source), 'i'),
      RGB_PERCENT: new RegExp([
        '^rgb\\(',
        PERCENT.source,
        ',',
        PERCENT.source,
        ',',
        PERCENT.source,
        '\\)$'
      ].join(WHITESPACE.source), 'i'),
      RGBA: new RegExp([
        '^rgba\\(',
        INTEGER.source,
        ',',
        INTEGER.source,
        ',',
        INTEGER.source,
        ',',
        DECIMAL.source,
        '\\)$'
      ].join(WHITESPACE.source), 'i'),
      RGBA_PERCENT: new RegExp([
        '^rgba\\(',
        PERCENT.source,
        ',',
        PERCENT.source,
        ',',
        PERCENT.source,
        ',',
        DECIMAL.source,
        '\\)$'
      ].join(WHITESPACE.source), 'i'),
      HSL: new RegExp([
        '^hsl\\(',
        INTEGER.source,
        ',',
        PERCENT.source,
        ',',
        PERCENT.source,
        '\\)$'
      ].join(WHITESPACE.source), 'i'),
      HSLA: new RegExp([
        '^hsla\\(',
        INTEGER.source,
        ',',
        PERCENT.source,
        ',',
        PERCENT.source,
        ',',
        DECIMAL.source,
        '\\)$'
      ].join(WHITESPACE.source), 'i')
    };
  p5.Color._getFormattedColor = function () {
    var numArgs = arguments.length, mode = this._colorMode, first, second, third, alpha, str, vals;
    if (numArgs >= 3) {
      first = arguments[0];
      second = arguments[1];
      third = arguments[2];
      alpha = typeof arguments[3] === 'number' ? arguments[3] : this._colorMaxes[mode][3];
    } else if (numArgs === 1 && typeof arguments[0] === 'string') {
      str = arguments[0].trim().toLowerCase();
      if (namedColors[str]) {
        return p5.Color._getFormattedColor.apply(this, [namedColors[str]]);
      }
      if (colorPatterns.HEX3.test(str)) {
        vals = colorPatterns.HEX3.exec(str).slice(1).map(function (color) {
          return parseInt(color + color, 16);
        });
      } else if (colorPatterns.HEX6.test(str)) {
        vals = colorPatterns.HEX6.exec(str).slice(1).map(function (color) {
          return parseInt(color, 16);
        });
      } else if (colorPatterns.RGB.test(str)) {
        vals = colorPatterns.RGB.exec(str).slice(1).map(function (color) {
          return parseInt(color, 10);
        });
      } else if (colorPatterns.RGB_PERCENT.test(str)) {
        vals = colorPatterns.RGB_PERCENT.exec(str).slice(1).map(function (color) {
          return parseInt(parseFloat(color) / 100 * 255, 10);
        });
      } else if (colorPatterns.RGBA.test(str)) {
        vals = colorPatterns.RGBA.exec(str).slice(1).map(function (color, idx) {
          if (idx === 3) {
            return parseInt(parseFloat(color) * 255, 10);
          }
          return parseInt(color, 10);
        });
      } else if (colorPatterns.RGBA_PERCENT.test(str)) {
        vals = colorPatterns.RGBA_PERCENT.exec(str).slice(1).map(function (color, idx) {
          if (idx === 3) {
            return parseInt(parseFloat(color) * 255, 10);
          }
          return parseInt(parseFloat(color) / 100 * 255, 10);
        });
      } else if (colorPatterns.HSL.test(str)) {
        vals = colorPatterns.HSL.exec(str).slice(1).map(function (color) {
          return parseInt(color, 10);
        });
      } else if (colorPatterns.HSLA.test(str)) {
        vals = colorPatterns.HSLA.exec(str).slice(1).map(function (color) {
          return parseFloat(color, 10);
        });
      } else {
        vals = [255];
      }
      return p5.Color._getFormattedColor.apply(this, vals);
    } else if (numArgs === 1 && typeof arguments[0] === 'number') {
      if (mode === constants.RGB) {
        first = second = third = arguments[0];
      } else if (mode === constants.HSB || mode === constants.HSL) {
        first = third = arguments[0];
        second = 0;
      }
      alpha = typeof arguments[1] === 'number' ? arguments[1] : this._colorMaxes[mode][3];
    } else {
      throw new Error(arguments + 'is not a valid color representation.');
    }
    return [
      first,
      second,
      third,
      alpha
    ];
  };
  return p5.Color;
}({}, amdclean['core_core'], amdclean['color_color_utils'], amdclean['core_constants']);
amdclean['core_p5Element'] = function (require, core_core) {
  var p5 = core_core;
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
    attachListener('touchstart', fxn, this);
    return this;
  };
  p5.Element.prototype.mouseWheel = function (fxn) {
    attachListener('mousewheel', fxn, this);
    return this;
  };
  p5.Element.prototype.mouseReleased = function (fxn) {
    attachListener('mouseup', fxn, this);
    attachListener('touchend', fxn, this);
    return this;
  };
  p5.Element.prototype.mouseClicked = function (fxn) {
    attachListener('click', fxn, this);
    return this;
  };
  p5.Element.prototype.mouseMoved = function (fxn) {
    attachListener('mousemove', fxn, this);
    attachListener('touchmove', fxn, this);
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
  p5.Element.prototype.touchStarted = function (fxn) {
    attachListener('touchstart', fxn, this);
    attachListener('mousedown', fxn, this);
    return this;
  };
  p5.Element.prototype.touchMoved = function (fxn) {
    attachListener('touchmove', fxn, this);
    attachListener('mousemove', fxn, this);
    return this;
  };
  p5.Element.prototype.touchEnded = function (fxn) {
    attachListener('touchend', fxn, this);
    attachListener('mouseup', fxn, this);
    return this;
  };
  p5.Element.prototype.dragOver = function (fxn) {
    attachListener('dragover', fxn, this);
    return this;
  };
  p5.Element.prototype.dragLeave = function (fxn) {
    attachListener('dragleave', fxn, this);
    return this;
  };
  p5.Element.prototype.drop = function (callback, fxn) {
    function makeLoader(theFile) {
      var p5file = new p5.File(theFile);
      return function (e) {
        p5file.data = e.target.result;
        callback(p5file);
      };
    }
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      attachListener('dragover', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }, this);
      attachListener('dragleave', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }, this);
      if (arguments.length > 1) {
        attachListener('drop', fxn, this);
      }
      attachListener('drop', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files;
        for (var i = 0; i < files.length; i++) {
          var f = files[i];
          var reader = new FileReader();
          reader.onload = makeLoader(f);
          if (f.type === 'text') {
            reader.readAsText(f);
          } else {
            reader.readAsDataURL(f);
          }
        }
      }, this);
    } else {
      console.log('The File APIs are not fully supported in this browser.');
    }
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
}({}, amdclean['core_core']);
amdclean['typography_p5Font'] = function (require, core_core, core_constants) {
  'use strict';
  var p5 = core_core;
  var constants = core_constants;
  p5.Font = function (p) {
    this.parent = p;
    this.font = undefined;
  };
  p5.Font.prototype._renderPath = function (line, x, y, fontSize, options) {
    var pathdata, p = this.parent, pg = p._graphics, ctx = pg.drawingContext, textWidth, textHeight, textAscent, textDescent;
    fontSize = fontSize || p._textSize;
    options = options || {};
    textWidth = p.textWidth(line);
    textAscent = p.textAscent();
    textDescent = p.textDescent();
    textHeight = textAscent + textDescent;
    if (ctx.textAlign === constants.CENTER) {
      x -= textWidth / 2;
    } else if (ctx.textAlign === constants.RIGHT) {
      x -= textWidth;
    }
    if (ctx.textBaseline === constants.TOP) {
      y += textHeight;
    } else if (ctx.textBaseline === constants._CTX_MIDDLE) {
      y += textHeight / 2 - textDescent;
    } else if (ctx.textBaseline === constants.BOTTOM) {
      y -= textDescent;
    }
    pathdata = this.font.getPath(line, x, y, fontSize, options).commands;
    ctx.beginPath();
    for (var i = 0; i < pathdata.length; i += 1) {
      var cmd = pathdata[i];
      if (cmd.type === 'M') {
        ctx.moveTo(cmd.x, cmd.y);
      } else if (cmd.type === 'L') {
        ctx.lineTo(cmd.x, cmd.y);
      } else if (cmd.type === 'C') {
        ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
      } else if (cmd.type === 'Q') {
        ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
      } else if (cmd.type === 'Z') {
        ctx.closePath();
      }
    }
    if (p._doStroke && p._strokeSet) {
      ctx.stroke();
    }
    if (p._doFill) {
      ctx.fillStyle = p._fillSet ? ctx.fillStyle : constants._DEFAULT_TEXT_FILL;
      ctx.fill();
    }
    return this;
  };
  p5.Font.prototype.textBounds = function (str, x, y, fontSize) {
    if (!this.parent._isOpenType()) {
      throw Error('not supported for system fonts');
    }
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize || this.parent._textSize;
    var xCoords = [], yCoords = [], minX, minY, maxX, maxY, scale = 1 / this.font.unitsPerEm * fontSize;
    this.font.forEachGlyph(str, x, y, fontSize, {}, function (glyph, gX, gY) {
      if (glyph.name !== 'space') {
        gX = gX !== undefined ? gX : 0;
        gY = gY !== undefined ? gY : 0;
        var gm = glyph.getMetrics();
        xCoords.push(gX + gm.xMin * scale);
        yCoords.push(gY + -gm.yMin * scale);
        xCoords.push(gX + gm.xMax * scale);
        yCoords.push(gY + -gm.yMax * scale);
      }
    });
    minX = Math.min.apply(null, xCoords);
    minY = Math.min.apply(null, yCoords);
    maxX = Math.max.apply(null, xCoords);
    maxY = Math.max.apply(null, yCoords);
    return {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY
    };
  };
  p5.Font.prototype.list = function () {
    throw 'not yet implemented';
  };
  return p5.Font;
}({}, amdclean['core_core'], amdclean['core_constants']);
amdclean['core_canvas'] = function (require, core_constants) {
  var constants = core_constants;
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
}({}, amdclean['core_constants']);
amdclean['image_filters'] = function (require) {
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
      var gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      var val;
      if (gray >= thresh) {
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
amdclean['core_p5Graphics'] = function (require, core_core) {
  var p5 = core_core;
  p5.Graphics = function (elt, pInst, isMainCanvas) {
    p5.Element.call(this, elt, pInst);
    this.canvas = elt;
    this._pInst = pInst;
    if (isMainCanvas) {
      this._isMainCanvas = true;
      this._pInst._setProperty('_curElement', this);
      this._pInst._setProperty('canvas', this.canvas);
      this._pInst._setProperty('width', this.width);
      this._pInst._setProperty('height', this.height);
    } else {
      this.canvas.style.display = 'none';
      this._styles = [];
    }
  };
  p5.Graphics.prototype = Object.create(p5.Element.prototype);
  p5.Graphics.prototype.resize = function (w, h) {
    this.width = w;
    this.height = h;
    this.elt.width = w * this._pInst.pixelDensity;
    this.elt.height = h * this._pInst.pixelDensity;
    this.elt.style.width = w + 'px';
    this.elt.style.height = h + 'px';
    if (this._isMainCanvas) {
      this._pInst._setProperty('width', this.width);
      this._pInst._setProperty('height', this.height);
    }
    this._resizeHelper();
  };
  return p5.Graphics;
}({}, amdclean['core_core']);
amdclean['core_p5Graphics2D'] = function (require, core_core, core_canvas, core_constants, image_filters, core_p5Graphics) {
  var p5 = core_core;
  var canvas = core_canvas;
  var constants = core_constants;
  var filters = image_filters;
  var styleEmpty = 'rgba(0,0,0,0)';
  p5.Graphics2D = function (elt, pInst, isMainCanvas) {
    p5.Graphics.call(this, elt, pInst, isMainCanvas);
    this.drawingContext = this.canvas.getContext('2d');
    this._pInst._setProperty('drawingContext', this.drawingContext);
    return this;
  };
  p5.Graphics2D.prototype = Object.create(p5.Graphics.prototype);
  p5.Graphics2D.prototype._applyDefaults = function () {
    this.drawingContext.fillStyle = constants._DEFAULT_FILL;
    this.drawingContext.strokeStyle = constants._DEFAULT_STROKE;
    this.drawingContext.lineCap = constants.ROUND;
    this.drawingContext.font = 'normal 12px sans-serif';
  };
  p5.Graphics2D.prototype._resizeHelper = function () {
    this.drawingContext.scale(this._pInst.pixelDensity, this._pInst.pixelDensity);
  };
  p5.Graphics2D.prototype.background = function () {
    this.drawingContext.save();
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    this.drawingContext.scale(this._pInst.pixelDensity, this._pInst.pixelDensity);
    if (arguments[0] instanceof p5.Image) {
      this._pInst.image(arguments[0], 0, 0, this.width, this.height);
    } else {
      var curFill = this.drawingContext.fillStyle;
      var color = this._pInst.color.apply(this._pInst, arguments);
      var newFill = color.toString();
      this.drawingContext.fillStyle = newFill;
      this.drawingContext.fillRect(0, 0, this.width, this.height);
      this.drawingContext.fillStyle = curFill;
    }
    this.drawingContext.restore();
  };
  p5.Graphics2D.prototype.clear = function () {
    this.drawingContext.clearRect(0, 0, this.width, this.height);
  };
  p5.Graphics2D.prototype.fill = function () {
    var ctx = this.drawingContext;
    var color = this._pInst.color.apply(this._pInst, arguments);
    ctx.fillStyle = color.toString();
  };
  p5.Graphics2D.prototype.stroke = function () {
    var ctx = this.drawingContext;
    var color = this._pInst.color.apply(this._pInst, arguments);
    ctx.strokeStyle = color.toString();
  };
  p5.Graphics2D.prototype.image = function (img, x, y, w, h) {
    var frame = img.canvas || img.elt;
    try {
      if (this._pInst._tint && img.canvas) {
        this.drawingContext.drawImage(this._getTintedImageCanvas(img), x, y, w, h);
      } else {
        this.drawingContext.drawImage(frame, x, y, w, h);
      }
    } catch (e) {
      if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
        throw e;
      }
    }
  };
  p5.Graphics2D.prototype._getTintedImageCanvas = function (img) {
    if (!img.canvas) {
      return img;
    }
    var pixels = filters._toPixels(img.canvas);
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
      newPixels[i] = r * this._pInst._tint[0] / 255;
      newPixels[i + 1] = g * this._pInst._tint[1] / 255;
      newPixels[i + 2] = b * this._pInst._tint[2] / 255;
      newPixels[i + 3] = a * this._pInst._tint[3] / 255;
    }
    tmpCtx.putImageData(id, 0, 0);
    return tmpCanvas;
  };
  p5.Graphics2D.prototype.blendMode = function (mode) {
    this.drawingContext.globalCompositeOperation = mode;
  };
  p5.Graphics2D.prototype.blend = function () {
    var currBlend = this.drawingContext.globalCompositeOperation;
    var blendMode = arguments[arguments.length - 1];
    var copyArgs = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    this.drawingContext.globalCompositeOperation = blendMode;
    this._pInst.copy.apply(this._pInst, copyArgs);
    this.drawingContext.globalCompositeOperation = currBlend;
  };
  p5.Graphics2D.prototype.copy = function () {
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
      srcImage = this._pInst;
      sx = arguments[0];
      sy = arguments[1];
      sw = arguments[2];
      sh = arguments[3];
      dx = arguments[4];
      dy = arguments[5];
      dw = arguments[6];
      dh = arguments[7];
    } else {
      throw new Error('Signature not supported');
    }
    p5.Graphics2D._copyHelper(srcImage, sx, sy, sw, sh, dx, dy, dw, dh);
  };
  p5.Graphics2D._copyHelper = function (srcImage, sx, sy, sw, sh, dx, dy, dw, dh) {
    var s = srcImage.canvas.width / srcImage.width;
    this.drawingContext.drawImage(srcImage.canvas, s * sx, s * sy, s * sw, s * sh, dx, dy, dw, dh);
  };
  p5.Graphics2D.prototype.get = function (x, y, w, h) {
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
    var pd = this.pixelDensity || this._pInst.pixelDensity;
    if (w === 1 && h === 1) {
      var imageData = this.drawingContext.getImageData(x * pd, y * pd, w, h);
      var data = imageData.data;
      var pixels = [];
      for (var i = 0; i < data.length; i += 4) {
        pixels.push(data[i], data[i + 1], data[i + 2], data[i + 3]);
      }
      return pixels;
    } else {
      var sx = x * pd;
      var sy = y * pd;
      var dw = Math.min(w, this.width);
      var dh = Math.min(h, this.height);
      var sw = dw * pd;
      var sh = dh * pd;
      var region = new p5.Image(dw, dh);
      region.canvas.getContext('2d').drawImage(this.canvas, sx, sy, sw, sh, 0, 0, dw, dh);
      return region;
    }
  };
  p5.Graphics2D.prototype.loadPixels = function () {
    var pd = this.pixelDensity || this._pInst.pixelDensity;
    var w = this.width * pd;
    var h = this.height * pd;
    var imageData = this.drawingContext.getImageData(0, 0, w, h);
    if (this._pInst) {
      this._pInst._setProperty('imageData', imageData);
      this._pInst._setProperty('pixels', imageData.data);
    } else {
      this._setProperty('imageData', imageData);
      this._setProperty('pixels', imageData.data);
    }
  };
  p5.Graphics2D.prototype.set = function (x, y, imgOrCol) {
    if (imgOrCol instanceof p5.Image) {
      this.drawingContext.save();
      this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
      this.drawingContext.scale(this._pInst.pixelDensity, this._pInst.pixelDensity);
      this.drawingContext.drawImage(imgOrCol.canvas, x, y);
      this.loadPixels.call(this._pInst);
      this.drawingContext.restore();
    } else {
      var ctx = this._pInst || this;
      var r = 0, g = 0, b = 0, a = 0;
      var idx = 4 * (y * ctx.pixelDensity * (this.width * ctx.pixelDensity) + x * ctx.pixelDensity);
      if (!ctx.imageData) {
        ctx.loadPixels.call(ctx);
      }
      if (typeof imgOrCol === 'number') {
        if (idx < ctx.pixels.length) {
          r = imgOrCol;
          g = imgOrCol;
          b = imgOrCol;
          a = 255;
        }
      } else if (imgOrCol instanceof Array) {
        if (imgOrCol.length < 4) {
          throw new Error('pixel array must be of the form [R, G, B, A]');
        }
        if (idx < ctx.pixels.length) {
          r = imgOrCol[0];
          g = imgOrCol[1];
          b = imgOrCol[2];
          a = imgOrCol[3];
        }
      } else if (imgOrCol instanceof p5.Color) {
        if (idx < ctx.pixels.length) {
          r = imgOrCol.rgba[0];
          g = imgOrCol.rgba[1];
          b = imgOrCol.rgba[2];
          a = imgOrCol.rgba[3];
        }
      }
      for (var i = 0; i < ctx.pixelDensity; i++) {
        for (var j = 0; j < ctx.pixelDensity; j++) {
          idx = 4 * ((y * ctx.pixelDensity + j) * this.width * ctx.pixelDensity + (x * ctx.pixelDensity + i));
          ctx.pixels[idx] = r;
          ctx.pixels[idx + 1] = g;
          ctx.pixels[idx + 2] = b;
          ctx.pixels[idx + 3] = a;
        }
      }
    }
  };
  p5.Graphics2D.prototype.updatePixels = function (x, y, w, h) {
    var pd = this.pixelDensity || this._pInst.pixelDensity;
    if (x === undefined && y === undefined && w === undefined && h === undefined) {
      x = 0;
      y = 0;
      w = this.width;
      h = this.height;
    }
    w *= pd;
    h *= pd;
    if (this._pInst) {
      this.drawingContext.putImageData(this._pInst.imageData, x, y, 0, 0, w, h);
    } else {
      this.drawingContext.putImageData(this.imageData, x, y, 0, 0, w, h);
    }
  };
  p5.Graphics2D.prototype.arc = function (x, y, w, h, start, stop, mode, curves) {
    if (!this._pInst._doStroke && !this._pInst._doFill) {
      return;
    }
    var ctx = this.drawingContext;
    var vals = canvas.arcModeAdjust(x, y, w, h, this._pInst._ellipseMode);
    var rx = vals.w / 2;
    var ry = vals.h / 2;
    ctx.beginPath();
    curves.forEach(function (curve, index) {
      if (index === 0) {
        ctx.moveTo(vals.x + curve.x1 * rx, vals.y + curve.y1 * ry);
      }
      ctx.bezierCurveTo(vals.x + curve.x2 * rx, vals.y + curve.y2 * ry, vals.x + curve.x3 * rx, vals.y + curve.y3 * ry, vals.x + curve.x4 * rx, vals.y + curve.y4 * ry);
    });
    if (this._pInst._doFill) {
      if (mode === constants.PIE || mode == null) {
        ctx.lineTo(vals.x, vals.y);
      }
      ctx.closePath();
      ctx.fill();
      if (this._pInst._doStroke) {
        if (mode === constants.CHORD || mode === constants.PIE) {
          ctx.stroke();
          return this;
        }
      }
    }
    if (this._pInst._doStroke) {
      if (mode === constants.OPEN || mode == null) {
        ctx.beginPath();
        curves.forEach(function (curve, index) {
          if (index === 0) {
            ctx.moveTo(vals.x + curve.x1 * rx, vals.y + curve.y1 * ry);
          }
          ctx.bezierCurveTo(vals.x + curve.x2 * rx, vals.y + curve.y2 * ry, vals.x + curve.x3 * rx, vals.y + curve.y3 * ry, vals.x + curve.x4 * rx, vals.y + curve.y4 * ry);
        });
        ctx.stroke();
      }
    }
    return this;
  };
  p5.Graphics2D.prototype.ellipse = function (x, y, w, h) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if (ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (ctx.strokeStyle === styleEmpty) {
        return this;
      }
    }
    var vals = canvas.modeAdjust(x, y, w, h, this._pInst._ellipseMode);
    var kappa = 0.5522848, ox = vals.w / 2 * kappa, oy = vals.h / 2 * kappa, xe = vals.x + vals.w, ye = vals.y + vals.h, xm = vals.x + vals.w / 2, ym = vals.y + vals.h / 2;
    ctx.beginPath();
    ctx.moveTo(vals.x, ym);
    ctx.bezierCurveTo(vals.x, ym - oy, xm - ox, vals.y, xm, vals.y);
    ctx.bezierCurveTo(xm + ox, vals.y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, vals.x, ym + oy, vals.x, ym);
    ctx.closePath();
    if (doFill) {
      ctx.fill();
    }
    if (doStroke) {
      ctx.stroke();
    }
  };
  p5.Graphics2D.prototype.line = function (x1, y1, x2, y2) {
    var ctx = this.drawingContext;
    if (!this._pInst._doStroke) {
      return this;
    } else if (ctx.strokeStyle === styleEmpty) {
      return this;
    }
    if (ctx.lineWidth % 2 === 1) {
      ctx.translate(0.5, 0.5);
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (ctx.lineWidth % 2 === 1) {
      ctx.translate(-0.5, -0.5);
    }
    return this;
  };
  p5.Graphics2D.prototype.point = function (x, y) {
    var ctx = this.drawingContext;
    var s = ctx.strokeStyle;
    var f = ctx.fillStyle;
    if (!this._pInst._doStroke) {
      return this;
    } else if (ctx.strokeStyle === styleEmpty) {
      return this;
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
  };
  p5.Graphics2D.prototype.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if (ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (ctx.strokeStyle === styleEmpty) {
        return this;
      }
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    if (doFill) {
      ctx.fill();
    }
    if (doStroke) {
      ctx.stroke();
    }
    return this;
  };
  p5.Graphics2D.prototype.rect = function (x, y, w, h, tl, tr, br, bl) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if (ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (ctx.strokeStyle === styleEmpty) {
        return this;
      }
    }
    var vals = canvas.modeAdjust(x, y, w, h, this._pInst._rectMode);
    if (this._pInst._doStroke && ctx.lineWidth % 2 === 1) {
      ctx.translate(0.5, 0.5);
    }
    ctx.beginPath();
    if (typeof tl === 'undefined') {
      ctx.rect(vals.x, vals.y, vals.w, vals.h);
    } else {
      if (typeof tr === 'undefined') {
        tr = tl;
      }
      if (typeof br === 'undefined') {
        br = tr;
      }
      if (typeof bl === 'undefined') {
        bl = br;
      }
      var _x = vals.x;
      var _y = vals.y;
      var _w = vals.w;
      var _h = vals.h;
      var hw = _w / 2;
      var hh = _h / 2;
      if (_w < 2 * tl) {
        tl = hw;
      }
      if (_h < 2 * tl) {
        tl = hh;
      }
      if (_w < 2 * tr) {
        tr = hw;
      }
      if (_h < 2 * tr) {
        tr = hh;
      }
      if (_w < 2 * br) {
        br = hw;
      }
      if (_h < 2 * br) {
        br = hh;
      }
      if (_w < 2 * bl) {
        bl = hw;
      }
      if (_h < 2 * bl) {
        bl = hh;
      }
      ctx.beginPath();
      ctx.moveTo(_x + tl, _y);
      ctx.arcTo(_x + _w, _y, _x + _w, _y + _h, tr);
      ctx.arcTo(_x + _w, _y + _h, _x, _y + _h, br);
      ctx.arcTo(_x, _y + _h, _x, _y, bl);
      ctx.arcTo(_x, _y, _x + _w, _y, tl);
      ctx.closePath();
    }
    if (this._pInst._doFill) {
      ctx.fill();
    }
    if (this._pInst._doStroke) {
      ctx.stroke();
    }
    if (this._pInst._doStroke && ctx.lineWidth % 2 === 1) {
      ctx.translate(-0.5, -0.5);
    }
    return this;
  };
  p5.Graphics2D.prototype.triangle = function (x1, y1, x2, y2, x3, y3) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if (ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (ctx.strokeStyle === styleEmpty) {
        return this;
      }
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    if (doFill) {
      ctx.fill();
    }
    if (doStroke) {
      ctx.stroke();
    }
  };
  p5.Graphics2D.prototype.endShape = function (mode, vertices, isCurve, isBezier, isQuadratic, isContour, shapeKind) {
    if (vertices.length === 0) {
      return this;
    }
    if (!this._pInst._doStroke && !this._pInst._doFill) {
      return this;
    }
    var closeShape = mode === constants.CLOSE;
    var v;
    if (closeShape && !isContour) {
      vertices.push(vertices[0]);
    }
    var i, j;
    var numVerts = vertices.length;
    if (isCurve && (shapeKind === constants.POLYGON || shapeKind === null)) {
      if (numVerts > 3) {
        var b = [], s = 1 - this._pInst._curveTightness;
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(vertices[1][0], vertices[1][1]);
        for (i = 1; i + 2 < numVerts; i++) {
          v = vertices[i];
          b[0] = [
            v[0],
            v[1]
          ];
          b[1] = [
            v[0] + (s * vertices[i + 1][0] - s * vertices[i - 1][0]) / 6,
            v[1] + (s * vertices[i + 1][1] - s * vertices[i - 1][1]) / 6
          ];
          b[2] = [
            vertices[i + 1][0] + (s * vertices[i][0] - s * vertices[i + 2][0]) / 6,
            vertices[i + 1][1] + (s * vertices[i][1] - s * vertices[i + 2][1]) / 6
          ];
          b[3] = [
            vertices[i + 1][0],
            vertices[i + 1][1]
          ];
          this.drawingContext.bezierCurveTo(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
        }
        if (closeShape) {
          this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
        }
        this._doFillStrokeClose();
      }
    } else if (isBezier && (shapeKind === constants.POLYGON || shapeKind === null)) {
      this.drawingContext.beginPath();
      for (i = 0; i < numVerts; i++) {
        if (vertices[i].isVert) {
          if (vertices[i].moveTo) {
            this.drawingContext.moveTo(vertices[i][0], vertices[i][1]);
          } else {
            this.drawingContext.lineTo(vertices[i][0], vertices[i][1]);
          }
        } else {
          this.drawingContext.bezierCurveTo(vertices[i][0], vertices[i][1], vertices[i][2], vertices[i][3], vertices[i][4], vertices[i][5]);
        }
      }
      this._doFillStrokeClose();
    } else if (isQuadratic && (shapeKind === constants.POLYGON || shapeKind === null)) {
      this.drawingContext.beginPath();
      for (i = 0; i < numVerts; i++) {
        if (vertices[i].isVert) {
          if (vertices[i].moveTo) {
            this.drawingContext.moveTo([0], vertices[i][1]);
          } else {
            this.drawingContext.lineTo(vertices[i][0], vertices[i][1]);
          }
        } else {
          this.drawingContext.quadraticCurveTo(vertices[i][0], vertices[i][1], vertices[i][2], vertices[i][3]);
        }
      }
      this._doFillStrokeClose();
    } else {
      if (shapeKind === constants.POINTS) {
        for (i = 0; i < numVerts; i++) {
          v = vertices[i];
          if (this._pInst._doStroke) {
            this._pInst.stroke(v[6]);
          }
          this._pInst.point(v[0], v[1]);
        }
      } else if (shapeKind === constants.LINES) {
        for (i = 0; i + 1 < numVerts; i += 2) {
          v = vertices[i];
          if (this._pInst._doStroke) {
            this._pInst.stroke(vertices[i + 1][6]);
          }
          this._pInst.line(v[0], v[1], vertices[i + 1][0], vertices[i + 1][1]);
        }
      } else if (shapeKind === constants.TRIANGLES) {
        for (i = 0; i + 2 < numVerts; i += 3) {
          v = vertices[i];
          this.drawingContext.beginPath();
          this.drawingContext.moveTo(v[0], v[1]);
          this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
          this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
          this.drawingContext.lineTo(v[0], v[1]);
          if (this._pInst._doFill) {
            this._pInst.fill(vertices[i + 2][5]);
            this.drawingContext.fill();
          }
          if (this._pInst._doStroke) {
            this._pInst.stroke(vertices[i + 2][6]);
            this.drawingContext.stroke();
          }
          this.drawingContext.closePath();
        }
      } else if (shapeKind === constants.TRIANGLE_STRIP) {
        for (i = 0; i + 1 < numVerts; i++) {
          v = vertices[i];
          this.drawingContext.beginPath();
          this.drawingContext.moveTo(vertices[i + 1][0], vertices[i + 1][1]);
          this.drawingContext.lineTo(v[0], v[1]);
          if (this._pInst._doStroke) {
            this._pInst.stroke(vertices[i + 1][6]);
          }
          if (this._pInst._doFill) {
            this._pInst.fill(vertices[i + 1][5]);
          }
          if (i + 2 < numVerts) {
            this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
            if (this._pInst._doStroke) {
              this._pInst.stroke(vertices[i + 2][6]);
            }
            if (this._pInst._doFill) {
              this._pInst.fill(vertices[i + 2][5]);
            }
          }
          this._doFillStrokeClose();
        }
      } else if (shapeKind === constants.TRIANGLE_FAN) {
        if (numVerts > 2) {
          this.drawingContext.beginPath();
          this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
          this.drawingContext.lineTo(vertices[1][0], vertices[1][1]);
          this.drawingContext.lineTo(vertices[2][0], vertices[2][1]);
          if (this._pInst._doFill) {
            this._pInst.fill(vertices[2][5]);
          }
          if (this._pInst._doStroke) {
            this._pInst.stroke(vertices[2][6]);
          }
          this._doFillStrokeClose();
          for (i = 3; i < numVerts; i++) {
            v = vertices[i];
            this.drawingContext.beginPath();
            this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
            this.drawingContext.lineTo(vertices[i - 1][0], vertices[i - 1][1]);
            this.drawingContext.lineTo(v[0], v[1]);
            if (this._pInst._doFill) {
              this._pInst.fill(v[5]);
            }
            if (this._pInst._doStroke) {
              this._pInst.stroke(v[6]);
            }
            this._doFillStrokeClose();
          }
        }
      } else if (shapeKind === constants.QUADS) {
        for (i = 0; i + 3 < numVerts; i += 4) {
          v = vertices[i];
          this.drawingContext.beginPath();
          this.drawingContext.moveTo(v[0], v[1]);
          for (j = 1; j < 4; j++) {
            this.drawingContext.lineTo(vertices[i + j][0], vertices[i + j][1]);
          }
          this.drawingContext.lineTo(v[0], v[1]);
          if (this._pInst._doFill) {
            this._pInst.fill(vertices[i + 3][5]);
          }
          if (this._pInst._doStroke) {
            this._pInst.stroke(vertices[i + 3][6]);
          }
          this._doFillStrokeClose();
        }
      } else if (shapeKind === constants.QUAD_STRIP) {
        if (numVerts > 3) {
          for (i = 0; i + 1 < numVerts; i += 2) {
            v = vertices[i];
            this.drawingContext.beginPath();
            if (i + 3 < numVerts) {
              this.drawingContext.moveTo(vertices[i + 2][0], vertices[i + 2][1]);
              this.drawingContext.lineTo(v[0], v[1]);
              this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
              this.drawingContext.lineTo(vertices[i + 3][0], vertices[i + 3][1]);
              if (this._pInst._doFill) {
                this._pInst.fill(vertices[i + 3][5]);
              }
              if (this._pInst._doStroke) {
                this._pInst.stroke(vertices[i + 3][6]);
              }
            } else {
              this.drawingContext.moveTo(v[0], v[1]);
              this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
            }
            this._doFillStrokeClose();
          }
        }
      } else {
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
        for (i = 1; i < numVerts; i++) {
          v = vertices[i];
          if (v.isVert) {
            if (v.moveTo) {
              this.drawingContext.moveTo(v[0], v[1]);
            } else {
              this.drawingContext.lineTo(v[0], v[1]);
            }
          }
        }
        this._doFillStrokeClose();
      }
    }
    isCurve = false;
    isBezier = false;
    isQuadratic = false;
    isContour = false;
    if (closeShape) {
      vertices.pop();
    }
    return this;
  };
  p5.Graphics2D.prototype.noSmooth = function () {
    this.drawingContext.mozImageSmoothingEnabled = false;
    this.drawingContext.webkitImageSmoothingEnabled = false;
    return this;
  };
  p5.Graphics2D.prototype.smooth = function () {
    this.drawingContext.mozImageSmoothingEnabled = true;
    this.drawingContext.webkitImageSmoothingEnabled = true;
    return this;
  };
  p5.Graphics2D.prototype.strokeCap = function (cap) {
    if (cap === constants.ROUND || cap === constants.SQUARE || cap === constants.PROJECT) {
      this.drawingContext.lineCap = cap;
    }
    return this;
  };
  p5.Graphics2D.prototype.strokeJoin = function (join) {
    if (join === constants.ROUND || join === constants.BEVEL || join === constants.MITER) {
      this.drawingContext.lineJoin = join;
    }
    return this;
  };
  p5.Graphics2D.prototype.strokeWeight = function (w) {
    if (typeof w === 'undefined' || w === 0) {
      this.drawingContext.lineWidth = 0.0001;
    } else {
      this.drawingContext.lineWidth = w;
    }
    return this;
  };
  p5.Graphics2D.prototype._getFill = function () {
    return this.drawingContext.fillStyle;
  };
  p5.Graphics2D.prototype._getStroke = function () {
    return this.drawingContext.strokeStyle;
  };
  p5.Graphics2D.prototype.bezier = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    this._pInst.beginShape();
    this._pInst.vertex(x1, y1);
    this._pInst.bezierVertex(x2, y2, x3, y3, x4, y4);
    this._pInst.endShape();
    return this;
  };
  p5.Graphics2D.prototype.curve = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    this._pInst.beginShape();
    this._pInst.curveVertex(x1, y1);
    this._pInst.curveVertex(x2, y2);
    this._pInst.curveVertex(x3, y3);
    this._pInst.curveVertex(x4, y4);
    this._pInst.endShape();
    return this;
  };
  p5.Graphics2D.prototype._doFillStrokeClose = function () {
    if (this._pInst._doFill) {
      this.drawingContext.fill();
    }
    if (this._pInst._doStroke) {
      this.drawingContext.stroke();
    }
    this.drawingContext.closePath();
  };
  p5.Graphics2D.prototype.applyMatrix = function (n00, n01, n02, n10, n11, n12) {
    this.drawingContext.transform(n00, n01, n02, n10, n11, n12);
  };
  p5.Graphics2D.prototype.resetMatrix = function () {
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    return this;
  };
  p5.Graphics2D.prototype.rotate = function (r) {
    this.drawingContext.rotate(r);
  };
  p5.Graphics2D.prototype.scale = function () {
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
  p5.Graphics2D.prototype.shearX = function (angle) {
    if (this._pInst._angleMode === constants.DEGREES) {
      angle = this._pInst.radians(angle);
    }
    this.drawingContext.transform(1, 0, this._pInst.tan(angle), 1, 0, 0);
    return this;
  };
  p5.Graphics2D.prototype.shearY = function (angle) {
    if (this._pInst._angleMode === constants.DEGREES) {
      angle = this._pInst.radians(angle);
    }
    this.drawingContext.transform(1, this._pInst.tan(angle), 0, 1, 0, 0);
    return this;
  };
  p5.Graphics2D.prototype.translate = function (x, y) {
    this.drawingContext.translate(x, y);
    return this;
  };
  p5.Graphics2D.prototype.text = function (str, x, y, maxWidth, maxHeight) {
    var p = this._pInst, cars, n, ii, jj, line, testLine, testWidth, words, totalHeight, baselineHacked;
    if (!(p._doFill || p._doStroke)) {
      return;
    }
    if (typeof str !== 'string') {
      str = str.toString();
    }
    str = str.replace(/(\t)/g, '  ');
    cars = str.split('\n');
    if (typeof maxWidth !== 'undefined') {
      totalHeight = 0;
      for (ii = 0; ii < cars.length; ii++) {
        line = '';
        words = cars[ii].split(' ');
        for (n = 0; n < words.length; n++) {
          testLine = line + words[n] + ' ';
          testWidth = this.textWidth(testLine);
          if (testWidth > maxWidth) {
            line = words[n] + ' ';
            totalHeight += p.textLeading();
          } else {
            line = testLine;
          }
        }
      }
      switch (this.drawingContext.textAlign) {
      case constants.CENTER:
        x += maxWidth / 2;
        break;
      case constants.RIGHT:
        x += maxWidth;
        break;
      }
      if (typeof maxHeight !== 'undefined') {
        switch (this.drawingContext.textBaseline) {
        case constants.BOTTOM:
          y += maxHeight - totalHeight;
          break;
        case constants._CTX_MIDDLE:
          y += (maxHeight - totalHeight) / 2;
          break;
        case constants.BASELINE:
          baselineHacked = true;
          this.drawingContext.textBaseline = constants.TOP;
          break;
        }
      }
      for (ii = 0; ii < cars.length; ii++) {
        line = '';
        words = cars[ii].split(' ');
        for (n = 0; n < words.length; n++) {
          testLine = line + words[n] + ' ';
          testWidth = this.textWidth(testLine);
          if (testWidth > maxWidth) {
            this._renderText(p, line, x, y);
            line = words[n] + ' ';
            y += p.textLeading();
          } else {
            line = testLine;
          }
        }
        this._renderText(p, line, x, y);
        y += p.textLeading();
      }
    } else {
      for (jj = 0; jj < cars.length; jj++) {
        this._renderText(p, cars[jj], x, y);
        y += p.textLeading();
      }
    }
    if (baselineHacked) {
      this.drawingContext.textBaseline = constants.BASELINE;
    }
    return p;
  };
  p5.Graphics2D.prototype._renderText = function (p, line, x, y) {
    if (p._isOpenType()) {
      return p._textFont._renderPath(line, x, y);
    }
    if (p._doStroke && p._strokeSet) {
      this.drawingContext.strokeText(line, x, y);
    }
    if (p._doFill) {
      this.drawingContext.fillStyle = p._fillSet ? this.drawingContext.fillStyle : constants._DEFAULT_TEXT_FILL;
      this.drawingContext.fillText(line, x, y);
    }
    return p;
  };
  p5.Graphics2D.prototype.textWidth = function (s) {
    var p = this._pInst;
    if (p._isOpenType()) {
      return p._textFont.textBounds(s, 0, 0).w;
    }
    return this.drawingContext.measureText(s).width;
  };
  p5.Graphics2D.prototype.textAlign = function (h, v) {
    if (arguments.length) {
      if (h === constants.LEFT || h === constants.RIGHT || h === constants.CENTER) {
        this.drawingContext.textAlign = h;
      }
      if (v === constants.TOP || v === constants.BOTTOM || v === constants.CENTER || v === constants.BASELINE) {
        if (v === constants.CENTER) {
          this.drawingContext.textBaseline = constants._CTX_MIDDLE;
        } else {
          this.drawingContext.textBaseline = v;
        }
      }
      return this._pInst;
    } else {
      var valign = this.drawingContext.textBaseline;
      if (valign === constants._CTX_MIDDLE) {
        valign = constants.CENTER;
      }
      return {
        horizontal: this.drawingContext.textAlign,
        vertical: valign
      };
    }
  };
  p5.Graphics2D.prototype._applyTextProperties = function () {
    var font, p = this._pInst;
    p._setProperty('_textAscent', null);
    p._setProperty('_textDescent', null);
    font = p._textFont;
    if (p._isOpenType()) {
      font = p._textFont.font.familyName;
      p._setProperty('_textStyle', p._textFont.font.styleName);
    }
    this.drawingContext.font = p._textStyle + ' ' + p._textSize + 'px ' + font;
    return p;
  };
  p5.Graphics2D.prototype.push = function () {
    this.drawingContext.save();
  };
  p5.Graphics2D.prototype.pop = function () {
    this.drawingContext.restore();
  };
  return p5.Graphics2D;
}({}, amdclean['core_core'], amdclean['core_canvas'], amdclean['core_constants'], amdclean['image_filters'], amdclean['core_p5Graphics']);
amdclean['_3d_shaders'] = function (require) {
  return {
    defaultVertShader: [
      'attribute vec3 a_VertexPosition;',
      'uniform mat4 uMVMatrix;',
      'uniform mat4 uPMatrix;',
      'void main(void) {',
      'vec3 zeroToOne = a_VertexPosition / 1000.0;',
      'vec3 zeroToTwo = zeroToOne * 2.0;',
      'vec3 clipSpace = zeroToTwo - 1.0;',
      'gl_Position = uPMatrix*uMVMatrix*vec4(clipSpace*vec3(1, -1, 1), 1.0);',
      '}'
    ].join('\n'),
    defaultMatFragShader: [
      'precision mediump float;',
      'uniform vec4 u_MaterialColor;',
      'void main(void) {',
      'gl_FragColor = u_MaterialColor;',
      '}'
    ].join('\n')
  };
}({});
amdclean['_3d_mat4'] = function (require) {
  var GLMAT_EPSILON = 0.000001;
  var GLMAT_ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  var mat4 = {};
  mat4.create = function () {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  mat4.clone = function (a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  };
  mat4.copy = function (out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  };
  mat4.identity = function (out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  mat4.transpose = function (out, a) {
    if (out === a) {
      var a01 = a[1], a02 = a[2], a03 = a[3], a12 = a[6], a13 = a[7], a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }
    return out;
  };
  mat4.invert = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  };
  mat4.adjoint = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  };
  mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  };
  mat4.mul = mat4.multiply;
  mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  };
  mat4.scale = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  };
  mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;
    if (Math.abs(len) < GLMAT_EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  };
  mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad), c = Math.cos(rad), a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  };
  mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad), c = Math.cos(rad), a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  };
  mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad), c = Math.cos(rad), a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    if (a !== out) {
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  };
  mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left), tb = 1 / (top - bottom), nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  };
  mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * nf;
    out[15] = 0;
    return out;
  };
  mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  };
  return mat4;
}({});
amdclean['_3d_p5Graphics3D'] = function (require, core_core, _3d_shaders, core_p5Graphics, _3d_mat4) {
  var p5 = core_core;
  var shaders = _3d_shaders;
  var mat4 = _3d_mat4;
  var gl, shaderProgram;
  var mvMatrix;
  var pMatrix;
  var mvMatrixStack = [];
  var attributes = {
      alpha: false,
      depth: true,
      stencil: true,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    };
  p5.Graphics3D = function (elt, pInst, isMainCanvas) {
    p5.Graphics.call(this, elt, pInst, isMainCanvas);
    try {
      this.drawingContext = this.canvas.getContext('webgl', attributes) || this.canvas.getContext('experimental-webgl', attributes);
      if (this.drawingContext === null) {
        throw 'Error creating webgl context';
      } else {
        console.log('p5.Graphics3d: enabled webgl context');
      }
    } catch (er) {
      console.error(er);
    }
    this._pInst._setProperty('_graphics', this);
    this.isP3D = true;
    gl = this.drawingContext;
    gl.clearColor(1, 1, 1, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.width * this._pInst.pixelDensity, this.height * this._pInst.pixelDensity);
    this.initShaders();
    this.initMatrix();
    return this;
  };
  p5.Graphics3D.prototype = Object.create(p5.Graphics.prototype);
  p5.Graphics3D.prototype.initShaders = function () {
    var _vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(_vertShader, shaders.defaultVertShader);
    gl.compileShader(_vertShader);
    if (!gl.getShaderParameter(_vertShader, gl.COMPILE_STATUS)) {
      alert('Yikes! An error occurred compiling the shaders:' + gl.getShaderInfoLog(_vertShader));
      return null;
    }
    var _fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(_fragShader, shaders.defaultMatFragShader);
    gl.compileShader(_fragShader);
    if (!gl.getShaderParameter(_fragShader, gl.COMPILE_STATUS)) {
      alert('Darn! An error occurred compiling the shaders:' + gl.getShaderInfoLog(_fragShader));
      return null;
    }
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, _vertShader);
    gl.attachShader(shaderProgram, _fragShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Snap! Error linking shader program');
    }
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'a_VertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
    shaderProgram.uMaterialColorLoc = gl.getUniformLocation(shaderProgram, 'u_MaterialColor');
    gl.uniform4f(shaderProgram.uMaterialColorLoc, 1, 1, 1, 1);
  };
  p5.Graphics3D.prototype.initMatrix = function () {
    mvMatrix = mat4.create();
    pMatrix = mat4.create();
    mat4.perspective(pMatrix, 60 / 180 * Math.PI, this.width / this.height, 0.1, 100);
  };
  p5.Graphics3D.prototype.resetMatrix = function () {
    mat4.identity(mvMatrix);
  };
  p5.Graphics3D.prototype.background = function () {
    var _col = this._pInst.color.apply(this._pInst, arguments);
    var _r = _col.color_array[0] / 255;
    var _g = _col.color_array[1] / 255;
    var _b = _col.color_array[2] / 255;
    var _a = _col.color_array[3] / 255;
    gl.clearColor(_r, _g, _b, _a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  };
  p5.Graphics3D.prototype.stroke = function () {
    this._stroke = this._pInst.color.apply(this._pInst, arguments);
  };
  p5.Graphics3D.prototype.drawGeometry = function (vertices) {
    var geomVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geomVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    _setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
    return this;
  };
  p5.Graphics3D.prototype.translate = function (x, y, z) {
    mat4.translate(mvMatrix, mvMatrix, [
      x,
      y,
      z
    ]);
    return this;
  };
  p5.Graphics3D.prototype.scale = function (x, y, z) {
    mat4.scale(mvMatrix, mvMatrix, [
      x,
      y,
      z
    ]);
    return this;
  };
  p5.Graphics3D.prototype.rotateX = function (rad) {
    mat4.rotateX(mvMatrix, mvMatrix, rad);
    return this;
  };
  p5.Graphics3D.prototype.rotateY = function (rad) {
    mat4.rotateY(mvMatrix, mvMatrix, rad);
    return this;
  };
  p5.Graphics3D.prototype.rotateZ = function (rad) {
    mat4.rotateZ(mvMatrix, mvMatrix, rad);
    return this;
  };
  p5.Graphics3D.prototype.push = function () {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
  };
  p5.Graphics3D.prototype.pop = function () {
    if (mvMatrixStack.length === 0) {
      throw 'Invalid popMatrix!';
    }
    mvMatrix = mvMatrixStack.pop();
  };
  function _setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  }
  return p5.Graphics3D;
}({}, amdclean['core_core'], amdclean['_3d_shaders'], amdclean['core_p5Graphics'], amdclean['_3d_mat4']);
amdclean['image_p5Image'] = function (require, core_core, image_filters) {
  'use strict';
  var p5 = core_core;
  var Filters = image_filters;
  p5.Image = function (width, height) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.drawingContext = this.canvas.getContext('2d');
    this.pixelDensity = 1;
    this.pixels = [];
  };
  p5.Image.prototype._setProperty = function (prop, value) {
    this[prop] = value;
  };
  p5.Image.prototype.loadPixels = function () {
    p5.Graphics2D.prototype.loadPixels.call(this);
  };
  p5.Image.prototype.updatePixels = function (x, y, w, h) {
    p5.Graphics2D.prototype.updatePixels.call(this, x, y, w, h);
  };
  p5.Image.prototype.get = function (x, y, w, h) {
    return p5.Graphics2D.prototype.get.call(this, x, y, w, h);
  };
  p5.Image.prototype.set = function (x, y, imgOrCol) {
    p5.Graphics2D.prototype.set.call(this, x, y, imgOrCol);
  };
  p5.Image.prototype.resize = function (width, height) {
    width = width || this.canvas.width;
    height = height || this.canvas.height;
    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCanvas.getContext('2d').drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
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
      scaleFactor = p5Image._pInst.pixelDensity;
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
    this.drawingContext.globalCompositeOperation = 'destination-in';
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
}({}, amdclean['core_core'], amdclean['image_filters']);
amdclean['math_polargeometry'] = function (require) {
  return {
    degreesToRadians: function (x) {
      return 2 * Math.PI * x / 360;
    },
    radiansToDegrees: function (x) {
      return 360 * x / (2 * Math.PI);
    }
  };
}({});
amdclean['math_p5Vector'] = function (require, core_core, math_polargeometry, core_constants) {
  'use strict';
  var p5 = core_core;
  var polarGeometry = math_polargeometry;
  var constants = core_constants;
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
  p5.Vector.prototype.toString = function p5VectorToString() {
    return 'p5.Vector Object : [' + this.x + ', ' + this.y + ', ' + this.z + ']';
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
  p5.Vector.prototype.copy = function () {
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
    var d = v.copy().sub(this);
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
  p5.Vector.prototype.equals = function (x, y, z) {
    var a, b, c;
    if (x instanceof p5.Vector) {
      a = x.x || 0;
      b = x.y || 0;
      c = x.z || 0;
    } else if (x instanceof Array) {
      a = x[0] || 0;
      b = x[1] || 0;
      c = x[2] || 0;
    } else {
      a = x || 0;
      b = y || 0;
      c = z || 0;
    }
    return this.x === a && this.y === b && this.z === c;
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
  p5.Vector.add = function (v1, v2, target) {
    if (!target) {
      target = v1.copy();
    } else {
      target.set(v1);
    }
    target.add(v2);
    return target;
  };
  p5.Vector.sub = function (v1, v2, target) {
    if (!target) {
      target = v1.copy();
    } else {
      target.set(v1);
    }
    target.sub(v2);
    return target;
  };
  p5.Vector.mult = function (v, n, target) {
    if (!target) {
      target = v.copy();
    } else {
      target.set(v);
    }
    target.mult(n);
    return target;
  };
  p5.Vector.div = function (v, n, target) {
    if (!target) {
      target = v.copy();
    } else {
      target.set(v);
    }
    target.div(n);
    return target;
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
  p5.Vector.lerp = function (v1, v2, amt, target) {
    if (!target) {
      target = v1.copy();
    } else {
      target.set(v1);
    }
    target.lerp(v2, amt);
    return target;
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
}({}, amdclean['core_core'], amdclean['math_polargeometry'], amdclean['core_constants']);
amdclean['io_p5TableRow'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
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
}({}, amdclean['core_core']);
amdclean['io_p5Table'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
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
  p5.Table.prototype.set = function (row, column, value) {
    this.rows[row].set(column, value);
  };
  p5.Table.prototype.setNum = function (row, column, value) {
    this.rows[row].set(column, value);
  };
  p5.Table.prototype.setString = function (row, column, value) {
    this.rows[row].set(column, value);
  };
  p5.Table.prototype.get = function (row, column) {
    return this.rows[row].get(column);
  };
  p5.Table.prototype.getNum = function (row, column) {
    return this.rows[row].getNum(column);
  };
  p5.Table.prototype.getString = function (row, column) {
    return this.rows[row].getString(column);
  };
  p5.Table.prototype.getObject = function (headerColumn) {
    var tableObject = {};
    var obj, cPos, index;
    for (var i = 0; i < this.rows.length; i++) {
      obj = this.rows[i].obj;
      if (typeof headerColumn === 'string') {
        cPos = this.columns.indexOf(headerColumn);
        if (cPos >= 0) {
          index = obj[headerColumn];
          tableObject[index] = obj;
        } else {
          throw 'This table has no column named "' + headerColumn + '"';
        }
      } else {
        tableObject[i] = this.rows[i].obj;
      }
    }
    return tableObject;
  };
  p5.Table.prototype.getArray = function () {
    var tableArray = [];
    for (var i = 0; i < this.rows.length; i++) {
      tableArray.push(this.rows[i].arr);
    }
    return tableArray;
  };
  return p5.Table;
}({}, amdclean['core_core']);
amdclean['color_creating_reading'] = function (require, core_core, color_p5Color) {
  'use strict';
  var p5 = core_core;
  p5.prototype.alpha = function (c) {
    if (c instanceof p5.Color || c instanceof Array) {
      return this.color(c).getAlpha();
    } else {
      throw new Error('Needs p5.Color or pixel array as argument.');
    }
  };
  p5.prototype.blue = function (c) {
    if (c instanceof p5.Color || c instanceof Array) {
      return this.color(c).getBlue();
    } else {
      throw new Error('Needs p5.Color or pixel array as argument.');
    }
  };
  p5.prototype.brightness = function (c) {
    if (c instanceof p5.Color || c instanceof Array) {
      return this.color(c).getBrightness();
    } else {
      throw new Error('Needs p5.Color or pixel array as argument.');
    }
  };
  p5.prototype.color = function () {
    if (arguments[0] instanceof p5.Color) {
      return arguments[0];
    } else if (arguments[0] instanceof Array) {
      return new p5.Color(this, arguments[0]);
    } else {
      var args = Array.prototype.slice.call(arguments);
      return new p5.Color(this, args);
    }
  };
  p5.prototype.green = function (c) {
    if (c instanceof p5.Color || c instanceof Array) {
      return this.color(c).getGreen();
    } else {
      throw new Error('Needs p5.Color or pixel array as argument.');
    }
  };
  p5.prototype.hue = function (c) {
    if (!c instanceof p5.Color) {
      throw new Error('Needs p5.Color as argument.');
    }
    return c.getHue();
  };
  p5.prototype.lerpColor = function (c1, c2, amt) {
    amt = Math.max(Math.min(amt, 1), 0);
    if (c1 instanceof Array) {
      var c = [];
      for (var i = 0; i < c1.length; i++) {
        c.push(Math.sqrt(p5.prototype.lerp(c1[i] * c1[i], c2[i] * c2[i], amt)));
      }
      return c;
    } else if (c1 instanceof p5.Color) {
      var pc = [];
      for (var j = 0; j < 4; j++) {
        pc.push(Math.sqrt(p5.prototype.lerp(c1.rgba[j] * c1.rgba[j], c2.rgba[j] * c2.rgba[j], amt)));
      }
      return new p5.Color(this, pc);
    } else {
      return Math.sqrt(p5.prototype.lerp(c1 * c1, c2 * c2, amt));
    }
  };
  p5.prototype.lightness = function (c) {
    if (c instanceof p5.Color || c instanceof Array) {
      return this.color(c).getLightness();
    } else {
      throw new Error('Needs p5.Color or pixel array as argument.');
    }
  };
  p5.prototype.red = function (c) {
    if (c instanceof p5.Color || c instanceof Array) {
      return this.color(c).getRed();
    } else {
      throw new Error('Needs p5.Color or pixel array as argument.');
    }
  };
  p5.prototype.saturation = function (c) {
    if (!c instanceof p5.Color) {
      throw new Error('Needs p5.Color as argument.');
    }
    return c.getSaturation();
  };
  return p5;
}({}, amdclean['core_core'], amdclean['color_p5Color']);
amdclean['color_setting'] = function (require, core_core, core_constants, color_p5Color) {
  'use strict';
  var p5 = core_core;
  var constants = core_constants;
  p5.prototype._doStroke = true;
  p5.prototype._doFill = true;
  p5.prototype._strokeSet = false;
  p5.prototype._fillSet = false;
  p5.prototype._colorMode = constants.RGB;
  p5.prototype._colorMaxes = {
    rgb: [
      255,
      255,
      255,
      255
    ],
    hsb: [
      360,
      100,
      100,
      1
    ],
    hsl: [
      360,
      100,
      100,
      1
    ]
  };
  p5.prototype.background = function () {
    if (arguments[0] instanceof p5.Image) {
      this.image(arguments[0], 0, 0, this.width, this.height);
    } else {
      this._graphics.background.apply(this._graphics, arguments);
    }
    return this;
  };
  p5.prototype.clear = function () {
    this._graphics.clear();
    return this;
  };
  p5.prototype.colorMode = function () {
    if (arguments[0] === constants.RGB || arguments[0] === constants.HSB || arguments[0] === constants.HSL) {
      this._colorMode = arguments[0];
      var maxArr = this._colorMaxes[this._colorMode];
      if (arguments.length === 2) {
        maxArr[0] = arguments[1];
        maxArr[1] = arguments[1];
        maxArr[2] = arguments[1];
        maxArr[3] = arguments[1];
      } else if (arguments.length > 2) {
        maxArr[0] = arguments[1];
        maxArr[1] = arguments[2];
        maxArr[2] = arguments[3];
      }
      if (arguments.length === 5) {
        maxArr[3] = arguments[4];
      }
    }
    return this;
  };
  p5.prototype.fill = function () {
    this._setProperty('_fillSet', true);
    this._setProperty('_doFill', true);
    this._graphics.fill.apply(this._graphics, arguments);
    return this;
  };
  p5.prototype.noFill = function () {
    this._setProperty('_doFill', false);
    return this;
  };
  p5.prototype.noStroke = function () {
    this._setProperty('_doStroke', false);
    return this;
  };
  p5.prototype.stroke = function () {
    this._setProperty('_strokeSet', true);
    this._setProperty('_doStroke', true);
    this._graphics.stroke.apply(this._graphics, arguments);
    return this;
  };
  return p5;
}({}, amdclean['core_core'], amdclean['core_constants'], amdclean['color_p5Color']);
amdclean['utilities_conversion'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
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
      return n.map(function (n) {
        return p5.prototype.int(n, radix);
      });
    }
  };
  p5.prototype.str = function (n) {
    if (n instanceof Array) {
      return n.map(p5.prototype.str);
    } else {
      return String(n);
    }
  };
  p5.prototype.boolean = function (n) {
    if (typeof n === 'number') {
      return n !== 0;
    } else if (typeof n === 'string') {
      return n.toLowerCase() === 'true';
    } else if (typeof n === 'boolean') {
      return n;
    } else if (n instanceof Array) {
      return n.map(p5.prototype.boolean);
    }
  };
  p5.prototype.byte = function (n) {
    var nn = p5.prototype.int(n, 10);
    if (typeof nn === 'number') {
      return (nn + 128) % 256 - 128;
    } else if (nn instanceof Array) {
      return nn.map(p5.prototype.byte);
    }
  };
  p5.prototype.char = function (n) {
    if (typeof n === 'number' && !isNaN(n)) {
      return String.fromCharCode(n);
    } else if (n instanceof Array) {
      return n.map(p5.prototype.char);
    } else if (typeof n === 'string') {
      return p5.prototype.char(parseInt(n, 10));
    }
  };
  p5.prototype.unchar = function (n) {
    if (typeof n === 'string' && n.length === 1) {
      return n.charCodeAt(0);
    } else if (n instanceof Array) {
      return n.map(p5.prototype.unchar);
    }
  };
  p5.prototype.hex = function (n, digits) {
    digits = digits === undefined || digits === null ? digits = 8 : digits;
    if (n instanceof Array) {
      return n.map(function (n) {
        return p5.prototype.hex(n, digits);
      });
    } else if (typeof n === 'number') {
      if (n < 0) {
        n = 4294967295 + n + 1;
      }
      var hex = Number(n).toString(16).toUpperCase();
      while (hex.length < digits) {
        hex = '0' + hex;
      }
      if (hex.length >= digits) {
        hex = hex.substring(hex.length - digits, hex.length);
      }
      return hex;
    }
  };
  p5.prototype.unhex = function (n) {
    if (n instanceof Array) {
      return n.map(p5.prototype.unhex);
    } else {
      return parseInt('0x' + n, 16);
    }
  };
  return p5;
}({}, amdclean['core_core']);
amdclean['utilities_array_functions'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
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
  p5.prototype.shuffle = function (arr, bool) {
    arr = bool || ArrayBuffer.isView(arr) ? arr : arr.slice();
    var rnd, tmp, idx = arr.length;
    while (idx > 1) {
      rnd = Math.random() * idx | 0;
      tmp = arr[--idx];
      arr[idx] = arr[rnd];
      arr[rnd] = tmp;
    }
    return arr;
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
}({}, amdclean['core_core']);
amdclean['utilities_string_functions'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
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
      var typeOfFirst = Object.prototype.toString.call(arguments[0]);
      if (typeOfFirst === '[object Arguments]') {
        if (arguments[0].length === 3) {
          return this.nf(arguments[0][0], arguments[0][1], arguments[0][2]);
        } else if (arguments[0].length === 2) {
          return this.nf(arguments[0][0], arguments[0][1]);
        } else {
          return this.nf(arguments[0][0]);
        }
      } else {
        return doNf.apply(this, arguments);
      }
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
      var decimal = '';
      if (decimalInd !== -1 || arguments[2] - decPart.length > 0) {
        decimal = '.';
      }
      if (decPart.length > arguments[2]) {
        decPart = decPart.substring(0, arguments[2]);
      }
      for (var i = 0; i < arguments[1] - intPart.length; i++) {
        str += '0';
      }
      str += intPart;
      str += decimal;
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
    if (arguments[1] === 0) {
      rem = '';
    } else if (arguments[1] !== undefined) {
      if (arguments[1] > rem.length) {
        rem += dec === -1 ? '.' : '';
        var len = arguments[1] - rem.length + 1;
        for (var i = 0; i < len; i++) {
          rem += '0';
        }
      } else {
        rem = rem.substring(0, arguments[1] + 1);
      }
    }
    return n + rem;
  }
  p5.prototype.nfp = function () {
    var nfRes = this.nf.apply(this, arguments);
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
    var nfRes = this.nf.apply(this, arguments);
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
}({}, amdclean['core_core']);
amdclean['core_environment'] = function (require, core_core, core_constants) {
  'use strict';
  var p5 = core_core;
  var C = core_constants;
  var standardCursors = [
      C.ARROW,
      C.CROSS,
      C.HAND,
      C.MOVE,
      C.TEXT,
      C.WAIT
    ];
  p5.prototype._frameRate = 0;
  p5.prototype._lastFrameTime = window.performance.now();
  p5.prototype._targetFrameRate = 60;
  if (window.console && console.log) {
    p5.prototype.print = function (args) {
      try {
        var newArgs = JSON.parse(JSON.stringify(args));
        console.log(newArgs);
      } catch (err) {
        console.log(args);
      }
    };
  } else {
    p5.prototype.print = function () {
    };
  }
  p5.prototype.println = p5.prototype.print;
  p5.prototype.frameCount = 0;
  p5.prototype.focused = document.hasFocus();
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
  p5.prototype._onresize = function (e) {
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
  p5.prototype.devicePixelScaling = function (val) {
    if (val) {
      if (typeof val === 'number') {
        this.pixelDensity = val;
      } else {
        this.pixelDensity = window.devicePixelRatio || 1;
      }
    } else {
      this.pixelDensity = 1;
    }
    this.resizeCanvas(this.width, this.height, true);
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
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  p5.prototype.getURL = function () {
    return location.href;
  };
  p5.prototype.getURLPath = function () {
    return location.pathname.split('/').filter(function (v) {
      return v !== '';
    });
  };
  p5.prototype.getURLParams = function () {
    var re = /[?&]([^&=]+)(?:[&=])([^&=]+)/gim;
    var m;
    var v = {};
    while ((m = re.exec(location.search)) != null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      v[m[1]] = m[2];
    }
    return v;
  };
  return p5;
}({}, amdclean['core_core'], amdclean['core_constants']);
amdclean['image_image'] = function (require, core_core, core_constants) {
  'use strict';
  var p5 = core_core;
  var constants = core_constants;
  p5.prototype._imageMode = constants.CORNER;
  p5.prototype._tint = null;
  p5.prototype.createImage = function (width, height) {
    return new p5.Image(width, height);
  };
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
}({}, amdclean['core_core'], amdclean['core_constants']);
amdclean['core_error_helpers'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
  var class2type = {};
  var toString = class2type.toString;
  var names = [
      'Boolean',
      'Number',
      'String',
      'Function',
      'Array',
      'Date',
      'RegExp',
      'Object',
      'Error'
    ];
  for (var n = 0; n < names.length; n++) {
    class2type['[object ' + names[n] + ']'] = names[n].toLowerCase();
  }
  var getType = function (obj) {
    if (obj == null) {
      return obj + '';
    }
    return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : typeof obj;
  };
  var isArray = Array.isArray || function (obj) {
      return getType(obj) === 'array';
    };
  var isNumeric = function (obj) {
    return !isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
  };
  var numberTypes = [
      'Number',
      'Integer',
      'Number/Constant'
    ];
  function typeMatches(defType, argType, arg) {
    if (defType.match(/^p5\./)) {
      var parts = defType.split('.');
      return arg instanceof p5[parts[1]];
    }
    return defType === 'Boolean' || defType.toLowerCase() === argType || numberTypes.indexOf(defType) > -1 && isNumeric(arg);
  }
  var PARAM_COUNT = 0;
  var EMPTY_VAR = 1;
  var WRONG_TYPE = 2;
  var typeColors = [
      '#2D7BB6',
      '#EE9900',
      '#4DB200'
    ];
  function report(message, func, color) {
    if ('undefined' === getType(color)) {
      color = '#B40033';
    } else if (getType(color) === 'number') {
      color = typeColors[color];
    }
    console.log('%c> p5.js says: ' + message + '%c [http://p5js.org/reference/#p5/' + func + ']', 'background-color:' + color + ';color:#FFF;', 'background-color:transparent;color:' + color + ';');
  }
  p5.prototype._validateParameters = function (func, args, types) {
    if (!isArray(types[0])) {
      types = [types];
    }
    var diff = Math.abs(args.length - types[0].length);
    var message, tindex = 0;
    for (var i = 1, len = types.length; i < len; i++) {
      var d = Math.abs(args.length - types[i].length);
      if (d <= diff) {
        tindex = i;
        diff = d;
      }
    }
    var symbol = 'X';
    if (diff > 0) {
      message = 'You wrote ' + func + '(';
      if (args.length > 0) {
        message += symbol + (',' + symbol).repeat(args.length - 1);
      }
      message += '). ' + func + ' was expecting ' + types[tindex].length + ' parameters. Try ' + func + '(';
      if (types[tindex].length > 0) {
        message += symbol + (',' + symbol).repeat(types[tindex].length - 1);
      }
      message += ').';
      if (types.length > 1) {
        message += ' ' + func + ' takes different numbers of parameters ' + 'depending on what you want to do. Click this link to learn more: ';
      }
      report(message, func, PARAM_COUNT);
    }
    for (var format = 0; format < types.length; format++) {
      for (var p = 0; p < types[format].length && p < args.length; p++) {
        var defType = types[format][p];
        var argType = getType(args[p]);
        if ('undefined' === argType || null === argType) {
          report('It looks like ' + func + ' received an empty variable in spot #' + (p + 1) + '. If not intentional, this is often a problem with scope: ' + '[link to scope].', func, EMPTY_VAR);
        } else if (!typeMatches(defType, argType, args[p])) {
          message = func + ' was expecting a ' + defType.toLowerCase() + ' for parameter #' + (p + 1) + ', received ';
          message += 'string' === argType ? '"' + args[p] + '"' : args[p];
          message += ' instead.';
          if (types.length > 1) {
            message += ' ' + func + ' takes different numbers of parameters ' + 'depending on what you want to do. ' + 'Click this link to learn more:';
          }
          report(message, func, WRONG_TYPE);
        }
      }
    }
  };
  p5.prototype._testColors = function () {
    var str = 'A box of biscuits, a box of mixed biscuits and a biscuit mixer';
    report(str, 'println', '#ED225D');
    report(str, 'println', '#2D7BB6');
    report(str, 'println', '#EE9900');
    report(str, 'println', '#A67F59');
    report(str, 'println', '#704F21');
    report(str, 'println', '#1CC581');
    report(str, 'println', '#FF6625');
    report(str, 'println', '#79EB22');
    report(str, 'println', '#B40033');
    report(str, 'println', '#084B7F');
    report(str, 'println', '#945F00');
    report(str, 'println', '#6B441D');
    report(str, 'println', '#2E1B00');
    report(str, 'println', '#008851');
    report(str, 'println', '#C83C00');
    report(str, 'println', '#4DB200');
  };
  return p5;
}({}, amdclean['core_core']);
amdclean['image_loading_displaying'] = function (require, core_core, image_filters, core_canvas, core_constants, core_error_helpers) {
  'use strict';
  var p5 = core_core;
  var Filters = image_filters;
  var canvas = core_canvas;
  var constants = core_constants;
  p5.prototype.loadImage = function (path, successCallback, failureCallback) {
    var img = new Image();
    var pImg = new p5.Image(1, 1, this);
    img.onload = function () {
      pImg.width = pImg.canvas.width = img.width;
      pImg.height = pImg.canvas.height = img.height;
      pImg.canvas.getContext('2d').drawImage(img, 0, 0);
      if (typeof successCallback === 'function') {
        successCallback(pImg);
      }
    };
    img.onerror = function (e) {
      if (typeof failureCallback === 'function') {
        failureCallback(e);
      }
    };
    if (path.indexOf('data:image/') !== 0) {
      img.crossOrigin = 'Anonymous';
    }
    img.src = path;
    return pImg;
  };
  p5.prototype.image = function (img, x, y, width, height) {
    this._validateParameters('image', arguments, [
      [
        'p5.Image',
        'Number',
        'Number'
      ],
      [
        'p5.Image',
        'Number',
        'Number',
        'Number',
        'Number'
      ]
    ]);
    x = x || 0;
    y = y || 0;
    width = width || img.width;
    height = height || img.height;
    var vals = canvas.modeAdjust(x, y, width, height, this._imageMode);
    this._graphics.image(img, vals.x, vals.y, vals.w, vals.h);
  };
  p5.prototype.tint = function () {
    var c = this.color.apply(this, arguments);
    this._tint = c.rgba;
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
}({}, amdclean['core_core'], amdclean['image_filters'], amdclean['core_canvas'], amdclean['core_constants'], amdclean['core_error_helpers']);
amdclean['image_pixels'] = function (require, core_core, image_filters, color_p5Color) {
  'use strict';
  var p5 = core_core;
  var Filters = image_filters;
  p5.prototype.pixels = [];
  p5.prototype.blend = function () {
    this._graphics.blend.apply(this._graphics, arguments);
  };
  p5.prototype.copy = function () {
    p5.Graphics2D._copyHelper.apply(this, arguments);
  };
  p5.prototype.filter = function (operation, value) {
    Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
  };
  p5.prototype.get = function (x, y, w, h) {
    return this._graphics.get(x, y, w, h);
  };
  p5.prototype.loadPixels = function () {
    this._graphics.loadPixels();
  };
  p5.prototype.set = function (x, y, imgOrCol) {
    this._graphics.set(x, y, imgOrCol);
  };
  p5.prototype.updatePixels = function (x, y, w, h) {
    this._graphics.updatePixels(x, y, w, h);
  };
  return p5;
}({}, amdclean['core_core'], amdclean['image_filters'], amdclean['color_p5Color']);
!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports)
    module.exports = definition();
  else if (typeof define == 'function' && define.amd)
    define('reqwest', definition);
  else
    context[name] = definition();
}('reqwest', amdclean, function () {
  var win = window, doc = document, httpsRe = /^http/, protocolRe = /(^\w+):\/\//, twoHundo = /^(20\d|1223)$/, byTag = 'getElementsByTagName', readyState = 'readyState', contentType = 'Content-Type', requestedWith = 'X-Requested-With', head = doc[byTag]('head')[0], uniqid = 0, callbackPrefix = 'reqwest_' + +new Date(), lastValue, xmlHttpRequest = 'XMLHttpRequest', xDomainRequest = 'XDomainRequest', noop = function () {
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
  function succeed(r) {
    var protocol = protocolRe.exec(r.url);
    protocol = protocol && protocol[1] || window.location.protocol;
    return httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response;
  }
  function handleReadyState(r, success, error) {
    return function () {
      if (r._aborted)
        return error(r.request);
      if (r._timedOut)
        return error(r.request, 'Request is aborted: timeout');
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop;
        if (succeed(r))
          success(r.request);
        else
          error(r.request);
      }
    };
  }
  function setHeaders(http, o) {
    var headers = o['headers'] || {}, h;
    headers['Accept'] = headers['Accept'] || defaultHeaders['accept'][o['type']] || defaultHeaders['accept']['*'];
    var isAFormData = typeof FormData === 'function' && o['data'] instanceof FormData;
    if (!o['crossOrigin'] && !headers[requestedWith])
      headers[requestedWith] = defaultHeaders['requestedWith'];
    if (!headers[contentType] && !isAFormData)
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
  function setType(header) {
    if (header.match('json'))
      return 'json';
    if (header.match('javascript'))
      return 'js';
    if (header.match('text'))
      return 'html';
    if (header.match('xml'))
      return 'xml';
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
    var self = this;
    fn = fn || function () {
    };
    if (o['timeout']) {
      this.timeout = setTimeout(function () {
        timedOut();
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
      var type = o['type'] || resp && setType(resp.getResponseHeader('Content-Type'));
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
    function timedOut() {
      self._timedOut = true;
      self.request.abort();
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
    },
    'catch': function (fn) {
      return this.fail(fn);
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
amdclean['io_files'] = function (require, core_core, reqwest) {
  'use strict';
  var p5 = core_core;
  var reqwest = reqwest;
  p5.prototype.loadFont = function (path, callback) {
    var p5Font = new p5.Font(this);
    opentype.load(path, function (err, font) {
      if (err) {
        throw Error(err);
      }
      p5Font.font = font;
      if (typeof callback !== 'undefined') {
        callback(p5Font);
      }
    });
    return p5Font;
  };
  p5.prototype.createInput = function () {
    throw 'not yet implemented';
  };
  p5.prototype.createReader = function () {
    throw 'not yet implemented';
  };
  p5.prototype.loadBytes = function () {
    throw 'not yet implemented';
  };
  p5.prototype.loadJSON = function () {
    var path = arguments[0];
    var callback = arguments[1];
    var ret = [];
    var t = 'json';
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
    var separatorSet = false;
    for (var i = 1; i < arguments.length; i++) {
      if (typeof arguments[i] === 'function') {
        callback = arguments[i];
      } else if (typeof arguments[i] === 'string') {
        options.push(arguments[i]);
        if (arguments[i] === 'header') {
          header = true;
        }
        if (arguments[i] === 'csv') {
          if (separatorSet) {
            throw new Error('Cannot set multiple separator types.');
          } else {
            sep = ',';
            separatorSet = true;
          }
        } else if (arguments[i] === 'tsv') {
          if (separatorSet) {
            throw new Error('Cannot set multiple separator types.');
          } else {
            sep = '\t';
            separatorSet = true;
          }
        }
      }
    }
    var t = new p5.Table();
    reqwest({
      url: path,
      crossOrigin: true,
      type: 'csv'
    }).then(function (resp) {
      resp = resp.responseText;
      var state = {};
      var PRE_TOKEN = 0, MID_TOKEN = 1, POST_TOKEN = 2, POST_RECORD = 4;
      var QUOTE = '"', CR = '\r', LF = '\n';
      var records = [];
      var offset = 0;
      var currentRecord = null;
      var currentChar;
      var recordBegin = function () {
        state.escaped = false;
        currentRecord = [];
        tokenBegin();
      };
      var recordEnd = function () {
        state.currentState = POST_RECORD;
        records.push(currentRecord);
        currentRecord = null;
      };
      var tokenBegin = function () {
        state.currentState = PRE_TOKEN;
        state.token = '';
      };
      var tokenEnd = function () {
        currentRecord.push(state.token);
        tokenBegin();
      };
      while (true) {
        currentChar = resp[offset++];
        if (currentChar == null) {
          if (state.escaped) {
            throw new Error('Unclosed quote in file.');
          }
          if (currentRecord) {
            tokenEnd();
            recordEnd();
            break;
          }
        }
        if (currentRecord === null) {
          recordBegin();
        }
        if (state.currentState === PRE_TOKEN) {
          if (currentChar === QUOTE) {
            state.escaped = true;
            state.currentState = MID_TOKEN;
            continue;
          }
          state.currentState = MID_TOKEN;
        }
        if (state.currentState === MID_TOKEN && state.escaped) {
          if (currentChar === QUOTE) {
            if (resp[offset] === QUOTE) {
              state.token += QUOTE;
              offset++;
            } else {
              state.escaped = false;
              state.currentState = POST_TOKEN;
            }
          } else {
            state.token += currentChar;
          }
          continue;
        }
        if (currentChar === CR) {
          if (resp[offset] === LF) {
            offset++;
          }
          tokenEnd();
          recordEnd();
        } else if (currentChar === LF) {
          tokenEnd();
          recordEnd();
        } else if (currentChar === sep) {
          tokenEnd();
        } else if (state.currentState === MID_TOKEN) {
          state.token += currentChar;
        }
      }
      if (header) {
        t.columns = records.shift();
      } else {
        for (i = 0; i < records.length; i++) {
          t.columns[i] = i.toString();
        }
      }
      var row;
      for (i = 0; i < records.length; i++) {
        if (i === records.length - 1 && records[i].length === 1) {
          if (records[i][0] === 'undefined') {
            break;
          }
        }
        row = new p5.TableRow();
        row.arr = records[i];
        row.obj = makeObject(records[i], t.columns);
        t.addRow(row);
      }
      if (callback !== null) {
        callback(t);
      }
    }).fail(function (err, msg) {
      if (typeof callback !== 'undefined') {
        callback(false);
      }
    });
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
    var ret = document.implementation.createDocument(null, null);
    reqwest({
      url: path,
      type: 'xml',
      crossOrigin: true
    }).then(function (resp) {
      var x = resp.documentElement;
      ret.appendChild(x);
      if (typeof callback !== 'undefined') {
        callback(resp);
      }
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
  p5.prototype.httpGet = function () {
    var args = Array.prototype.slice.call(arguments);
    args.push('GET');
    p5.prototype.httpDo.apply(this, args);
  };
  p5.prototype.httpPost = function () {
    var args = Array.prototype.slice.call(arguments);
    args.push('POST');
    p5.prototype.httpDo.apply(this, args);
  };
  p5.prototype.httpDo = function () {
    var method = 'GET';
    var path = arguments[0];
    var data = {};
    var type = '';
    var callback;
    for (var i = 1; i < arguments.length; i++) {
      var a = arguments[i];
      if (typeof a === 'string') {
        if (a === 'GET' || a === 'POST' || a === 'PUT') {
          method = a;
        } else {
          type = a;
        }
      } else if (typeof a === 'object') {
        data = a;
      } else if (typeof a === 'function') {
        callback = a;
      }
    }
    if (type === '') {
      if (path.indexOf('json') !== -1) {
        type = 'json';
      } else if (path.indexOf('xml') !== -1) {
        type = 'xml';
      } else {
        type = 'text';
      }
    }
    reqwest({
      url: path,
      method: method,
      data: data,
      type: type,
      crossOrigin: true,
      success: function (resp) {
        if (typeof callback !== 'undefined') {
          if (type === 'text') {
            callback(resp.response);
          } else {
            callback(resp);
          }
        }
      }
    });
  };
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
    } else if (args.length === 1 && typeof args[0] === 'string') {
      p5.prototype.saveCanvas(cnv, args[0]);
    } else {
      var extension = _checkFileExtension(args[1], args[2])[1];
      switch (extension) {
      case 'json':
        p5.prototype.saveJSON(args[0], args[1], args[2]);
        return;
      case 'txt':
        p5.prototype.saveStrings(args[0], args[1], args[2]);
        return;
      default:
        if (args[0] instanceof Array) {
          p5.prototype.saveStrings(args[0], args[1], args[2]);
        } else if (args[0] instanceof p5.Table) {
          p5.prototype.saveTable(args[0], args[1], args[2], args[3]);
        } else if (args[0] instanceof p5.Image) {
          p5.prototype.saveCanvas(args[0].canvas, args[1]);
        } else if (args[0] instanceof p5.SoundFile) {
          p5.prototype.saveSound(args[0], args[1], args[2], args[3]);
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
    console.log(stringify);
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
          var e = escapeHelper(header[k]);
          pWriter.println('      <td>' + e);
          pWriter.println('      </td>');
        }
        pWriter.println('    </tr>');
      }
      for (var row = 0; row < table.rows.length; row++) {
        pWriter.println('    <tr>');
        for (var col = 0; col < table.columns.length; col++) {
          var entry = table.rows[row].getString(col);
          var htmlEntry = escapeHelper(entry);
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
  var escapeHelper = function (content) {
    return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
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
    if (!extension || extension === true || extension === 'true') {
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
}({}, amdclean['core_core'], amdclean['reqwest']);
amdclean['events_keyboard'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
  var downKeys = {};
  p5.prototype.isKeyPressed = false;
  p5.prototype.keyIsPressed = false;
  p5.prototype.key = '';
  p5.prototype.keyCode = 0;
  p5.prototype._onkeydown = function (e) {
    this._setProperty('isKeyPressed', true);
    this._setProperty('keyIsPressed', true);
    this._setProperty('keyCode', e.which);
    downKeys[e.which] = true;
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
  p5.prototype._onkeyup = function (e) {
    var keyReleased = this.keyReleased || window.keyReleased;
    this._setProperty('isKeyPressed', false);
    this._setProperty('keyIsPressed', false);
    downKeys[e.which] = false;
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
  p5.prototype._onkeypress = function (e) {
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
  p5.prototype._onblur = function (e) {
    downKeys = {};
  };
  p5.prototype.keyIsDown = function (code) {
    return downKeys[code];
  };
  return p5;
}({}, amdclean['core_core']);
amdclean['events_acceleration'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
  p5.prototype.deviceOrientation = undefined;
  p5.prototype.accelerationX = 0;
  p5.prototype.accelerationY = 0;
  p5.prototype.accelerationZ = 0;
  p5.prototype.pAccelerationX = 0;
  p5.prototype.pAccelerationY = 0;
  p5.prototype.pAccelerationZ = 0;
  p5.prototype._updatePAccelerations = function () {
    this._setProperty('pAccelerationX', this.accelerationX);
    this._setProperty('pAccelerationY', this.accelerationY);
    this._setProperty('pAccelerationZ', this.accelerationZ);
  };
  var move_threshold = 0.5;
  p5.prototype.setMoveThreshold = function (val) {
    if (typeof val === 'number') {
      move_threshold = val;
    }
  };
  var old_max_axis = '';
  var new_max_axis = '';
  p5.prototype._ondeviceorientation = function (e) {
    this._setProperty('accelerationX', e.beta);
    this._setProperty('accelerationY', e.gamma);
    this._setProperty('accelerationZ', e.alpha);
    this._handleMotion();
  };
  p5.prototype._ondevicemotion = function (e) {
    this._setProperty('accelerationX', e.acceleration.x * 2);
    this._setProperty('accelerationY', e.acceleration.y * 2);
    this._setProperty('accelerationZ', e.acceleration.z * 2);
    this._handleMotion();
  };
  p5.prototype._onMozOrientation = function (e) {
    this._setProperty('accelerationX', e.x);
    this._setProperty('accelerationY', e.y);
    this._setProperty('accelerationZ', e.z);
    this._handleMotion();
  };
  p5.prototype._handleMotion = function () {
    if (window.orientation === 90 || window.orientation === -90) {
      this._setProperty('deviceOrientation', 'landscape');
    } else if (window.orientation === 0) {
      this._setProperty('deviceOrientation', 'portrait');
    } else if (window.orientation === undefined) {
      this._setProperty('deviceOrientation', 'undefined');
    }
    var onDeviceMove = this.onDeviceMove || window.onDeviceMove;
    if (typeof onDeviceMove === 'function') {
      if (Math.abs(this.accelerationX - this.pAccelerationX) > move_threshold || Math.abs(this.accelerationY - this.pAccelerationY) > move_threshold || Math.abs(this.accelerationZ - this.pAccelerationZ) > move_threshold) {
        onDeviceMove();
      }
    }
    var onDeviceTurn = this.onDeviceTurn || window.onDeviceTurn;
    if (typeof onDeviceTurn === 'function') {
      var max_val = 0;
      if (Math.abs(this.accelerationX) > max_val) {
        max_val = this.accelerationX;
        new_max_axis = 'x';
      }
      if (Math.abs(this.accelerationY) > max_val) {
        max_val = this.accelerationY;
        new_max_axis = 'y';
      }
      if (Math.abs(this.accelerationZ) > max_val) {
        new_max_axis = 'z';
      }
      if (old_max_axis !== '' && old_max_axis !== new_max_axis) {
        onDeviceTurn(new_max_axis);
      }
      old_max_axis = new_max_axis;
    }
  };
  return p5;
}({}, amdclean['core_core']);
amdclean['events_mouse'] = function (require, core_core, core_constants) {
  'use strict';
  var p5 = core_core;
  var constants = core_constants;
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
  p5.prototype._onmousemove = function (e) {
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
  p5.prototype._onmousedown = function (e) {
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
  p5.prototype._onmouseup = function (e) {
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
  p5.prototype._onclick = function (e) {
    var context = this._isGlobal ? window : this;
    if (typeof context.mouseClicked === 'function') {
      var executeDefault = context.mouseClicked(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    }
  };
  p5.prototype._onmousewheel = p5.prototype._onDOMMouseScroll = function (e) {
    var context = this._isGlobal ? window : this;
    if (typeof context.mouseWheel === 'function') {
      e.delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      var executeDefault = context.mouseWheel(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    }
  };
  return p5;
}({}, amdclean['core_core'], amdclean['core_constants']);
amdclean['utilities_time_date'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
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
    return window.performance.now();
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
}({}, amdclean['core_core']);
amdclean['events_touch'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
  p5.prototype.touchX = 0;
  p5.prototype.touchY = 0;
  p5.prototype.ptouchX = 0;
  p5.prototype.ptouchY = 0;
  p5.prototype.touches = [];
  p5.prototype.touchIsDown = false;
  p5.prototype._updateTouchCoords = function (e) {
    if (e.type === 'mousedown' || e.type === 'mousemove' || e.type === 'mouseup') {
      this._setProperty('touchX', this.mouseX);
      this._setProperty('touchY', this.mouseY);
    } else {
      var touchPos = getTouchPos(this._curElement.elt, e, 0);
      this._setProperty('touchX', touchPos.x);
      this._setProperty('touchY', touchPos.y);
      var touches = [];
      for (var i = 0; i < e.touches.length; i++) {
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
    var touch = e.touches[i] || e.changedTouches[i];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }
  p5.prototype._ontouchstart = function (e) {
    var context = this._isGlobal ? window : this;
    var executeDefault;
    this._updateTouchCoords(e);
    this._setProperty('touchIsDown', true);
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
  p5.prototype._ontouchmove = function (e) {
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
  p5.prototype._ontouchend = function (e) {
    this._updateTouchCoords(e);
    if (this.touches.length === 0) {
      this._setProperty('touchIsDown', false);
    }
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
}({}, amdclean['core_core']);
amdclean['math_math'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
  p5.prototype.createVector = function (x, y, z) {
    if (this instanceof p5) {
      return new p5.Vector(this, arguments);
    } else {
      return new p5.Vector(x, y, z);
    }
  };
  return p5;
}({}, amdclean['core_core']);
amdclean['math_calculation'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
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
}({}, amdclean['core_core']);
amdclean['math_random'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
  var seeded = false;
  var lcg = function () {
      var m = 4294967296, a = 1664525, c = 1013904223, seed, z;
      return {
        setSeed: function (val) {
          z = seed = (val == null ? Math.random() * m : val) >>> 0;
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
}({}, amdclean['core_core']);
amdclean['math_noise'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
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
            z = seed = (val == null ? Math.random() * m : val) >>> 0;
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
}({}, amdclean['core_core']);
amdclean['math_trigonometry'] = function (require, core_core, math_polargeometry, core_constants) {
  'use strict';
  var p5 = core_core;
  var polarGeometry = math_polargeometry;
  var constants = core_constants;
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
}({}, amdclean['core_core'], amdclean['math_polargeometry'], amdclean['core_constants']);
amdclean['core_rendering'] = function (require, core_core, core_constants, core_p5Graphics2D, _3d_p5Graphics3D) {
  var p5 = core_core;
  var constants = core_constants;
  p5.prototype.createCanvas = function (w, h, renderer) {
    var r = renderer || constants.P2D;
    var isDefault, c;
    if (arguments[3]) {
      isDefault = typeof arguments[3] === 'boolean' ? arguments[3] : false;
    }
    if (r === constants.WEBGL) {
      c = document.getElementById('defaultCanvas');
      if (c) {
        c.parentNode.removeChild(c);
      }
      c = document.createElement('canvas');
      c.id = 'defaultCanvas';
    } else {
      if (isDefault) {
        c = document.createElement('canvas');
        c.id = 'defaultCanvas';
      } else {
        c = this.canvas;
      }
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
    if (r === constants.WEBGL) {
      if (!this._defaultGraphics) {
        this._setProperty('_graphics', new p5.Graphics3D(c, this, true));
        this._defaultGraphics = this._graphics;
        this._elements.push(this._defaultGraphics);
      }
    } else {
      if (!this._defaultGraphics) {
        this._setProperty('_graphics', new p5.Graphics2D(c, this, true));
        this._defaultGraphics = this._graphics;
        this._elements.push(this._defaultGraphics);
      }
    }
    this._defaultGraphics.resize(w, h);
    this._defaultGraphics._applyDefaults();
    return this._defaultGraphics;
  };
  p5.prototype.resizeCanvas = function (w, h, noRedraw) {
    if (this._graphics) {
      this._graphics.resize(w, h);
      this._graphics._applyDefaults();
      if (!noRedraw) {
        this.redraw();
      }
    }
  };
  p5.prototype.noCanvas = function () {
    if (this.canvas) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  };
  p5.prototype.createGraphics = function (w, h, renderer) {
    if (renderer === constants.WEBGL) {
      return this._createGraphics3D(w, h);
    } else {
      return this._createGraphics2D(w, h);
    }
  };
  p5.prototype._createGraphics2D = function (w, h) {
    var c = document.createElement('canvas');
    var node = this._userNode || document.body;
    node.appendChild(c);
    var pg = new p5.Graphics2D(c, this, false);
    this._elements.push(pg);
    for (var p in p5.prototype) {
      if (!pg[p]) {
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
  p5.prototype._createGraphics3D = function (w, h) {
    var c = document.createElement('canvas');
    var node = this._userNode || document.body;
    node.appendChild(c);
    var pg = new p5.Graphics3D(c, this, false);
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
    if (mode === constants.BLEND || mode === constants.DARKEST || mode === constants.LIGHTEST || mode === constants.DIFFERENCE || mode === constants.MULTIPLY || mode === constants.EXCLUSION || mode === constants.SCREEN || mode === constants.REPLACE || mode === constants.OVERLAY || mode === constants.HARD_LIGHT || mode === constants.SOFT_LIGHT || mode === constants.DODGE || mode === constants.BURN || mode === constants.ADD || mode === constants.NORMAL) {
      this._graphics.blendMode(mode);
    } else {
      throw new Error('Mode ' + mode + ' not recognized.');
    }
  };
  return p5;
}({}, amdclean['core_core'], amdclean['core_constants'], amdclean['core_p5Graphics2D'], amdclean['_3d_p5Graphics3D']);
amdclean['core_2d_primitives'] = function (require, core_core, core_constants, core_error_helpers) {
  'use strict';
  var p5 = core_core;
  var constants = core_constants;
  var EPSILON = 0.00001;
  p5.prototype._createArc = function (radius, startAngle, endAngle) {
    var twoPI = Math.PI * 2;
    var curves = [];
    var piOverTwo = Math.PI / 2;
    var sgn = startAngle < endAngle ? 1 : -1;
    var a1 = startAngle;
    var totalAngle = Math.min(twoPI, Math.abs(endAngle - startAngle));
    while (totalAngle > EPSILON) {
      var a2 = a1 + sgn * Math.min(totalAngle, piOverTwo);
      curves.push(this._createSmallArc(radius, a1, a2));
      totalAngle -= Math.abs(a2 - a1);
      a1 = a2;
    }
    return curves;
  };
  p5.prototype._createSmallArc = function (r, a1, a2) {
    var a = (a2 - a1) / 2;
    var x4 = r * Math.cos(a);
    var y4 = r * Math.sin(a);
    var x1 = x4;
    var y1 = -y4;
    var k = 0.5522847498;
    var f = k * Math.tan(a);
    var x2 = x1 + f * y4;
    var y2 = y1 + f * x4;
    var x3 = x2;
    var y3 = -y2;
    var ar = a + a1;
    var cos_ar = Math.cos(ar);
    var sin_ar = Math.sin(ar);
    return {
      x1: r * Math.cos(a1),
      y1: r * Math.sin(a1),
      x2: x2 * cos_ar - y2 * sin_ar,
      y2: x2 * sin_ar + y2 * cos_ar,
      x3: x3 * cos_ar - y3 * sin_ar,
      y3: x3 * sin_ar + y3 * cos_ar,
      x4: r * Math.cos(a2),
      y4: r * Math.sin(a2)
    };
  };
  p5.prototype.arc = function (x, y, width, height, start, stop, mode) {
    if (!this._doStroke && !this._doFill) {
      return this;
    }
    if (this._angleMode === constants.DEGREES) {
      start = this.radians(start);
      stop = this.radians(stop);
    }
    var curves = this._createArc(1, start, stop);
    this._graphics.arc(x, y, width, height, start, stop, mode, curves);
    return this;
  };
  p5.prototype.ellipse = function (x, y, w, h) {
    this._validateParameters('ellipse', arguments, [
      'Number',
      'Number',
      'Number',
      'Number'
    ]);
    if (!this._doStroke && !this._doFill) {
      return this;
    }
    w = Math.abs(w);
    h = Math.abs(h);
    this._graphics.ellipse(x, y, w, h);
    return this;
  };
  p5.prototype.line = function () {
    this._validateParameters('line', arguments, [
      [
        'Number',
        'Number',
        'Number',
        'Number'
      ],
      [
        'Number',
        'Number',
        'Number',
        'Number',
        'Number',
        'Number'
      ]
    ]);
    if (!this._doStroke) {
      return this;
    }
    if (this._graphics.isP3D) {
      this._graphics.line(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    } else {
      this._graphics.line(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
  };
  p5.prototype.point = function (x, y) {
    this._validateParameters('point', arguments, [
      'Number',
      'Number'
    ]);
    if (!this._doStroke) {
      return this;
    }
    this._graphics.point(x, y);
    return this;
  };
  p5.prototype.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    this._validateParameters('quad', arguments, [
      'Number',
      'Number',
      'Number',
      'Number',
      'Number',
      'Number',
      'Number',
      'Number'
    ]);
    if (!this._doStroke && !this._doFill) {
      return this;
    }
    this._graphics.quad(x1, y1, x2, y2, x3, y3, x4, y4);
    return this;
  };
  p5.prototype.rect = function (x, y, w, h, tl, tr, br, bl) {
    this._validateParameters('rect', arguments, [
      [
        'Number',
        'Number',
        'Number',
        'Number'
      ],
      [
        'Number',
        'Number',
        'Number',
        'Number',
        'Number'
      ],
      [
        'Number',
        'Number',
        'Number',
        'Number',
        'Number',
        'Number',
        'Number',
        'Number',
        'Number'
      ]
    ]);
    if (!this._doStroke && !this._doFill) {
      return;
    }
    this._graphics.rect(x, y, w, h, tl, tr, br, bl);
    return this;
  };
  p5.prototype.triangle = function (x1, y1, x2, y2, x3, y3) {
    this._validateParameters('triangle', arguments, [
      'Number',
      'Number',
      'Number',
      'Number',
      'Number',
      'Number'
    ]);
    if (!this._doStroke && !this._doFill) {
      return this;
    }
    this._graphics.triangle(x1, y1, x2, y2, x3, y3);
    return this;
  };
  return p5;
}({}, amdclean['core_core'], amdclean['core_constants'], amdclean['core_error_helpers']);
amdclean['_3d_3d_primitives'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
  p5.prototype.Geometry3D = function () {
    this.vertices = [];
    this.faces = [];
    this.faceNormals = [];
    this.uvs = [];
  };
  p5.prototype.plane = function (width, height, detailX, detailY) {
    p5.prototype.Geometry3D.call(this);
    width = width || 1;
    height = height || 1;
    detailX = detailX || 1;
    detailY = detailY || 1;
    for (var y = 0; y <= detailY; y++) {
      var t = y / detailY;
      for (var x = 0; x <= detailX; x++) {
        var s = x / detailX;
        this.vertices.push([
          2 * width * s - width,
          2 * height * t - height,
          0
        ]);
        this.uvs.push([
          s,
          t
        ]);
        this.faceNormals.push([
          0,
          0,
          1
        ]);
        if (x < detailX && y < detailY) {
          var i = x + y * (detailX + 1);
          this.faces.push([
            i,
            i + 1,
            i + detailX + 1
          ]);
          this.faces.push([
            i + detailX + 1,
            i + 1,
            i + detailX + 2
          ]);
        }
      }
    }
    var vertices = verticesArray(this.faces, this.vertices);
    this._graphics.drawGeometry(vertices);
    return this;
  };
  p5.prototype.cube = function (width, height, depth, detailX, detailY, detailZ) {
    p5.prototype.Geometry3D.call(this);
    width = width || 1;
    height = height || 1;
    depth = depth || 1;
    detailX = detailX || 1;
    detailY = detailY || 1;
    detailZ = detailZ || 1;
    for (var y1 = 0; y1 <= detailY; y1++) {
      var t1 = y1 / detailY;
      for (var x1 = 0; x1 <= detailX; x1++) {
        var s1 = x1 / detailX;
        this.vertices.push([
          2 * width * s1 - width,
          2 * height * t1 - height,
          depth / 2
        ]);
        this.uvs.push([
          s1,
          t1
        ]);
        this.faceNormals.push([
          0,
          0,
          1
        ]);
        if (x1 < detailX && y1 < detailY) {
          var i1 = x1 + y1 * (detailX + 1);
          this.faces.push([
            i1,
            i1 + 1,
            i1 + detailX + 1
          ]);
          this.faces.push([
            i1 + detailX + 1,
            i1 + 1,
            i1 + detailX + 2
          ]);
        }
      }
    }
    for (var y2 = 0; y2 <= detailY; y2++) {
      var t2 = y2 / detailY;
      for (var x2 = 0; x2 <= detailX; x2++) {
        var s2 = x2 / detailX;
        this.vertices.push([
          2 * width * s2 - width,
          2 * height * t2 - height,
          -depth / 2
        ]);
        this.uvs.push([
          s2,
          t2
        ]);
        this.faceNormals.push([
          0,
          0,
          -1
        ]);
        if (x2 < detailX && y2 < detailY) {
          var i2 = x2 + y2 * (detailX + 1);
          this.faces.push([
            i2,
            i2 + 1,
            i2 + detailX + 1
          ]);
          this.faces.push([
            i2 + detailX + 1,
            i2 + 1,
            i2 + detailX + 2
          ]);
        }
      }
    }
    var vertices = verticesArray(this.faces, this.vertices);
    this._graphics.drawGeometry(vertices);
    return this;
  };
  p5.prototype.sphere = function (radius, detailX, detailY, detalZ) {
    p5.prototype.Geometry3D.call(this);
    radius = radius || 6;
    detailX = detailX || 1;
    detailY = detailY || 1;
    var vertices = verticesArray(this.faces, this.vertices);
    this._graphics.drawGeometry(vertices);
    return this;
  };
  function verticesArray(faces, vertices) {
    var output = [];
    faces.forEach(function (face) {
      face.forEach(function (index) {
        vertices[index].forEach(function (vertex) {
          output.push(vertex);
        });
      });
    });
    return output;
  }
  return p5;
}({}, amdclean['core_core']);
amdclean['core_attributes'] = function (require, core_core, core_constants) {
  'use strict';
  var p5 = core_core;
  var constants = core_constants;
  p5.prototype._rectMode = constants.CORNER;
  p5.prototype._ellipseMode = constants.CENTER;
  p5.prototype.ellipseMode = function (m) {
    if (m === constants.CORNER || m === constants.CORNERS || m === constants.RADIUS || m === constants.CENTER) {
      this._ellipseMode = m;
    }
    return this;
  };
  p5.prototype.noSmooth = function () {
    this._graphics.noSmooth();
    return this;
  };
  p5.prototype.rectMode = function (m) {
    if (m === constants.CORNER || m === constants.CORNERS || m === constants.RADIUS || m === constants.CENTER) {
      this._rectMode = m;
    }
    return this;
  };
  p5.prototype.smooth = function () {
    this._graphics.smooth();
    return this;
  };
  p5.prototype.strokeCap = function (cap) {
    if (cap === constants.ROUND || cap === constants.SQUARE || cap === constants.PROJECT) {
      this._graphics.strokeCap(cap);
    }
    return this;
  };
  p5.prototype.strokeJoin = function (join) {
    if (join === constants.ROUND || join === constants.BEVEL || join === constants.MITER) {
      this._graphics.strokeJoin(join);
    }
    return this;
  };
  p5.prototype.strokeWeight = function (w) {
    this._graphics.strokeWeight(w);
    return this;
  };
  return p5;
}({}, amdclean['core_core'], amdclean['core_constants']);
amdclean['core_curves'] = function (require, core_core, core_error_helpers) {
  'use strict';
  var p5 = core_core;
  var bezierDetail = 20;
  var curveDetail = 20;
  p5.prototype._curveTightness = 0;
  p5.prototype.bezier = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    this._validateParameters('bezier', arguments, [
      'Number',
      'Number',
      'Number',
      'Number',
      'Number',
      'Number',
      'Number',
      'Number'
    ]);
    if (!this._doStroke) {
      return this;
    }
    this._graphics.bezier(x1, y1, x2, y2, x3, y3, x4, y4);
    return this;
  };
  p5.prototype.bezierDetail = function (d) {
    bezierDetail = d;
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
    this._validateParameters('curve', arguments, [
      'Number',
      'Number',
      'Number',
      'Number',
      'Number',
      'Number',
      'Number',
      'Number'
    ]);
    if (!this._doStroke) {
      return;
    }
    this._graphics.curve(x1, y1, x2, y2, x3, y3, x4, y4);
    return this;
  };
  p5.prototype.curveDetail = function (d) {
    curveDetail = d;
    return this;
  };
  p5.prototype.curveTightness = function (t) {
    this._setProperty('_curveTightness', t);
  };
  p5.prototype.curvePoint = function (a, b, c, d, t) {
    var t3 = t * t * t, t2 = t * t, f1 = -0.5 * t3 + t2 - 0.5 * t, f2 = 1.5 * t3 - 2.5 * t2 + 1, f3 = -1.5 * t3 + 2 * t2 + 0.5 * t, f4 = 0.5 * t3 - 0.5 * t2;
    return a * f1 + b * f2 + c * f3 + d * f4;
  };
  p5.prototype.curveTangent = function (a, b, c, d, t) {
    var t2 = t * t, f1 = -3 * t2 / 2 + 2 * t - 0.5, f2 = 9 * t2 / 2 - 5 * t, f3 = -9 * t2 / 2 + 4 * t + 0.5, f4 = 3 * t2 / 2 - t;
    return a * f1 + b * f2 + c * f3 + d * f4;
  };
  return p5;
}({}, amdclean['core_core'], amdclean['core_error_helpers']);
amdclean['core_vertex'] = function (require, core_core, core_constants) {
  'use strict';
  var p5 = core_core;
  var constants = core_constants;
  var shapeKind = null;
  var vertices = [];
  var contourVertices = [];
  var isBezier = false;
  var isCurve = false;
  var isQuadratic = false;
  var isContour = false;
  p5.prototype.beginContour = function () {
    contourVertices = [];
    isContour = true;
    return this;
  };
  p5.prototype.beginShape = function (kind) {
    if (kind === constants.POINTS || kind === constants.LINES || kind === constants.TRIANGLES || kind === constants.TRIANGLE_FAN || kind === constants.TRIANGLE_STRIP || kind === constants.QUADS || kind === constants.QUAD_STRIP) {
      shapeKind = kind;
    } else {
      shapeKind = null;
    }
    vertices = [];
    contourVertices = [];
    return this;
  };
  p5.prototype.bezierVertex = function (x2, y2, x3, y3, x4, y4) {
    if (vertices.length === 0) {
      throw 'vertex() must be used once before calling bezierVertex()';
    } else {
      isBezier = true;
      var vert = [];
      for (var i = 0; i < arguments.length; i++) {
        vert[i] = arguments[i];
      }
      vert.isVert = false;
      if (isContour) {
        contourVertices.push(vert);
      } else {
        vertices.push(vert);
      }
    }
    return this;
  };
  p5.prototype.curveVertex = function (x, y) {
    isCurve = true;
    this.vertex(x, y);
    return this;
  };
  p5.prototype.endContour = function () {
    var vert = contourVertices[0].slice();
    vert.isVert = contourVertices[0].isVert;
    vert.moveTo = false;
    contourVertices.push(vert);
    vertices.push(vertices[0]);
    for (var i = 0; i < contourVertices.length; i++) {
      vertices.push(contourVertices[i]);
    }
    return this;
  };
  p5.prototype.endShape = function (mode) {
    if (vertices.length === 0) {
      return this;
    }
    if (!this._doStroke && !this._doFill) {
      return this;
    }
    var closeShape = mode === constants.CLOSE;
    if (closeShape && !isContour) {
      vertices.push(vertices[0]);
    }
    this._graphics.endShape(mode, vertices, isCurve, isBezier, isQuadratic, isContour, shapeKind);
    isCurve = false;
    isBezier = false;
    isQuadratic = false;
    isContour = false;
    if (closeShape) {
      vertices.pop();
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
    if (vertices.length > 0) {
      isQuadratic = true;
      var vert = [];
      for (var i = 0; i < arguments.length; i++) {
        vert[i] = arguments[i];
      }
      vert.isVert = false;
      if (isContour) {
        contourVertices.push(vert);
      } else {
        vertices.push(vert);
      }
    } else {
      throw 'vertex() must be used once before calling quadraticVertex()';
    }
    return this;
  };
  p5.prototype.vertex = function (x, y, moveTo) {
    var vert = [];
    vert.isVert = true;
    vert[0] = x;
    vert[1] = y;
    vert[2] = 0;
    vert[3] = 0;
    vert[4] = 0;
    vert[5] = this._graphics._getFill();
    vert[6] = this._graphics._getStroke();
    if (moveTo) {
      vert.moveTo = moveTo;
    }
    if (isContour) {
      if (contourVertices.length === 0) {
        vert.moveTo = true;
      }
      contourVertices.push(vert);
    } else {
      vertices.push(vert);
    }
    return this;
  };
  return p5;
}({}, amdclean['core_core'], amdclean['core_constants']);
amdclean['core_structure'] = function (require, core_core) {
  'use strict';
  var p5 = core_core;
  p5.prototype.exit = function () {
    throw 'exit() not implemented, see remove()';
  };
  p5.prototype.noLoop = function () {
    this._loop = false;
  };
  p5.prototype.loop = function () {
    this._loop = true;
    this._draw();
  };
  p5.prototype.push = function () {
    this._graphics.push();
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
    this._graphics.pop();
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
    var userSetup = this.setup || window.setup;
    var userDraw = this.draw || window.draw;
    if (typeof userDraw === 'function') {
      this.push();
      if (typeof userSetup === 'undefined') {
        this.scale(this.pixelDensity, this.pixelDensity);
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
  };
  p5.prototype.size = function () {
    throw 'size() not implemented, see createCanvas()';
  };
  return p5;
}({}, amdclean['core_core']);
amdclean['core_transform'] = function (require, core_core, core_constants) {
  'use strict';
  var p5 = core_core;
  var constants = core_constants;
  p5.prototype.applyMatrix = function (n00, n01, n02, n10, n11, n12) {
    this._graphics.applyMatrix(n00, n01, n02, n10, n11, n12);
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
    this._graphics.resetMatrix();
    return this;
  };
  p5.prototype.rotate = function (r) {
    if (this._angleMode === constants.DEGREES) {
      r = this.radians(r);
    }
    this._graphics.rotate(r);
    return this;
  };
  p5.prototype.rotateX = function (rad) {
    if (this._graphics.isP3D) {
      this._graphics.rotateX(rad);
    } else {
      throw 'not yet implemented.';
    }
    return this;
  };
  p5.prototype.rotateY = function (rad) {
    if (this._graphics.isP3D) {
      this._graphics.rotateY(rad);
    } else {
      throw 'not yet implemented.';
    }
    return this;
  };
  p5.prototype.rotateZ = function (rad) {
    if (this._graphics.isP3D) {
      this._graphics.rotateZ(rad);
    } else {
      throw 'not supported in p2d. Please use webgl mode';
    }
    return this;
  };
  p5.prototype.scale = function () {
    if (this._graphics.isP3D) {
      this._graphics.scale(arguments[0], arguments[1], arguments[2]);
    } else {
      this._graphics.scale.apply(this._graphics, arguments);
    }
    return this;
  };
  p5.prototype.shearX = function (angle) {
    if (this._angleMode === constants.DEGREES) {
      angle = this.radians(angle);
    }
    this._graphics.shearX(angle);
    return this;
  };
  p5.prototype.shearY = function (angle) {
    if (this._angleMode === constants.DEGREES) {
      angle = this.radians(angle);
    }
    this._graphics.shearY(angle);
    return this;
  };
  p5.prototype.translate = function (x, y, z) {
    if (this._graphics.isP3D) {
      this._graphics.translate(x, y, z);
    } else {
      this._graphics.translate(x, y);
    }
    return this;
  };
  return p5;
}({}, amdclean['core_core'], amdclean['core_constants']);
amdclean['typography_attributes'] = function (require, core_core, core_constants) {
  'use strict';
  var p5 = core_core;
  var constants = core_constants;
  p5.prototype._textSize = 12;
  p5.prototype._textLeading = 15;
  p5.prototype._textFont = 'sans-serif';
  p5.prototype._textStyle = constants.NORMAL;
  p5.prototype._textAscent = null;
  p5.prototype._textDescent = null;
  p5.prototype.textAlign = function (h, v) {
    return this._graphics.textAlign(h, v);
  };
  p5.prototype.textLeading = function (l) {
    if (arguments.length) {
      this._setProperty('_textLeading', l);
      return this;
    }
    return this._textLeading;
  };
  p5.prototype.textSize = function (s) {
    if (arguments.length) {
      this._setProperty('_textSize', s);
      this._setProperty('_textLeading', s * constants._DEFAULT_LEADMULT);
      return this._graphics._applyTextProperties();
    }
    return this._textSize;
  };
  p5.prototype.textStyle = function (s) {
    if (arguments.length) {
      if (s === constants.NORMAL || s === constants.ITALIC || s === constants.BOLD) {
        this._setProperty('_textStyle', s);
      }
      return this._graphics._applyTextProperties();
    }
    return this._textStyle;
  };
  p5.prototype.textWidth = function (s) {
    return this._graphics.textWidth(s);
  };
  p5.prototype.textAscent = function () {
    if (this._textAscent === null) {
      this._updateTextMetrics();
    }
    return this._textAscent;
  };
  p5.prototype.textDescent = function () {
    if (this._textDescent === null) {
      this._updateTextMetrics();
    }
    return this._textDescent;
  };
  p5.prototype._isOpenType = function (f) {
    f = f || this._textFont;
    return typeof f === 'object' && f.font && f.font.supported;
  };
  p5.prototype._updateTextMetrics = function () {
    if (this._isOpenType()) {
      var bounds = this._textFont.textBounds('ABCjgq|', 0, 0);
      this._setProperty('_textAscent', Math.abs(bounds.y));
      this._setProperty('_textDescent', bounds.h - Math.abs(bounds.y));
      return this;
    }
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
    return this;
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
}({}, amdclean['core_core'], amdclean['core_constants']);
amdclean['typography_loading_displaying'] = function (require, core_core, core_constants, core_error_helpers) {
  'use strict';
  var p5 = core_core;
  var constants = core_constants;
  p5.prototype.text = function (str, x, y, maxWidth, maxHeight) {
    this._validateParameters('text', arguments, [
      [
        'String',
        'Number',
        'Number'
      ],
      [
        'String',
        'Number',
        'Number',
        'Number',
        'Number'
      ]
    ]);
    return !(this._doFill || this._doStroke) ? this : this._graphics.text.apply(this._graphics, arguments);
  };
  p5.prototype.textFont = function (theFont, theSize) {
    this._validateParameters('textFont', arguments, [
      ['String'],
      ['Object'],
      [
        'String',
        'Number'
      ],
      [
        'Object',
        'Number'
      ]
    ]);
    if (arguments.length) {
      if (!theFont) {
        throw Error('null font passed to textFont');
      }
      this._setProperty('_textFont', theFont);
      if (theSize) {
        this._setProperty('_textSize', theSize);
        this._setProperty('_textLeading', theSize * constants._DEFAULT_LEADMULT);
      }
      return this._graphics._applyTextProperties();
    }
    return this;
  };
  return p5;
}({}, amdclean['core_core'], amdclean['core_constants'], amdclean['core_error_helpers']);
amdclean['app'] = function (require, core_core, color_p5Color, core_p5Element, typography_p5Font, core_p5Graphics2D, _3d_p5Graphics3D, image_p5Image, math_p5Vector, io_p5TableRow, io_p5Table, color_creating_reading, color_setting, core_constants, utilities_conversion, utilities_array_functions, utilities_string_functions, core_environment, image_image, image_loading_displaying, image_pixels, io_files, events_keyboard, events_acceleration, events_mouse, utilities_time_date, events_touch, math_math, math_calculation, math_random, math_noise, math_trigonometry, core_rendering, core_2d_primitives, _3d_3d_primitives, core_attributes, core_curves, core_vertex, core_structure, core_transform, typography_attributes, typography_loading_displaying, _3d_shaders) {
  'use strict';
  var p5 = core_core;
  var _globalInit = function () {
    if (!window.PHANTOMJS && !window.mocha) {
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
  return p5;
}({}, amdclean['core_core'], amdclean['color_p5Color'], amdclean['core_p5Element'], amdclean['typography_p5Font'], amdclean['core_p5Graphics2D'], amdclean['_3d_p5Graphics3D'], amdclean['image_p5Image'], amdclean['math_p5Vector'], amdclean['io_p5TableRow'], amdclean['io_p5Table'], amdclean['color_creating_reading'], amdclean['color_setting'], amdclean['core_constants'], amdclean['utilities_conversion'], amdclean['utilities_array_functions'], amdclean['utilities_string_functions'], amdclean['core_environment'], amdclean['image_image'], amdclean['image_loading_displaying'], amdclean['image_pixels'], amdclean['io_files'], amdclean['events_keyboard'], amdclean['events_acceleration'], amdclean['events_mouse'], amdclean['utilities_time_date'], amdclean['events_touch'], amdclean['math_math'], amdclean['math_calculation'], amdclean['math_random'], amdclean['math_noise'], amdclean['math_trigonometry'], amdclean['core_rendering'], amdclean['core_2d_primitives'], amdclean['_3d_3d_primitives'], amdclean['core_attributes'], amdclean['core_curves'], amdclean['core_vertex'], amdclean['core_structure'], amdclean['core_transform'], amdclean['typography_attributes'], amdclean['typography_loading_displaying'], amdclean['_3d_shaders']);
return amdclean['app'];
}));(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.opentype = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";exports.argument=function(r,t){if(!r)throw new Error(t)},exports.assert=exports.argument;


},{}],2:[function(require,module,exports){
"use strict";function line(e,i,n,o,t){e.beginPath(),e.moveTo(i,n),e.lineTo(o,t),e.stroke()}exports.line=line;


},{}],3:[function(require,module,exports){
"use strict";function DefaultEncoding(e){this.font=e}function CmapEncoding(e){this.cmap=e}function CffEncoding(e,l){this.encoding=e,this.charset=l}function GlyphNames(e){var l;switch(e.version){case 1:this.names=exports.standardNames.slice();break;case 2:for(this.names=new Array(e.numberOfGlyphs),l=0;l<e.numberOfGlyphs;l++)this.names[l]=e.glyphNameIndex[l]<exports.standardNames.length?exports.standardNames[e.glyphNameIndex[l]]:e.names[e.glyphNameIndex[l]-exports.standardNames.length];break;case 2.5:for(this.names=new Array(e.numberOfGlyphs),l=0;l<e.numberOfGlyphs;l++)this.names[l]=exports.standardNames[l+e.glyphNameIndex[l]];break;case 3:this.names=[]}}function addGlyphNames(e){for(var l,r=e.tables.cmap.glyphIndexMap,a=Object.keys(r),s=0;s<a.length;s+=1){var i=a[s],o=r[i];l=e.glyphs[o],l.addUnicode(parseInt(i))}for(s=0;s<e.glyphs.length;s+=1)l=e.glyphs[s],l.name=e.cffEncoding?e.cffEncoding.charset[s]:e.glyphNames.glyphIndexToName(s)}var cffStandardStrings=[".notdef","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","endash","dagger","daggerdbl","periodcentered","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","questiondown","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","ring","cedilla","hungarumlaut","ogonek","caron","emdash","AE","ordfeminine","Lslash","Oslash","OE","ordmasculine","ae","dotlessi","lslash","oslash","oe","germandbls","onesuperior","logicalnot","mu","trademark","Eth","onehalf","plusminus","Thorn","onequarter","divide","brokenbar","degree","thorn","threequarters","twosuperior","registered","minus","eth","multiply","threesuperior","copyright","Aacute","Acircumflex","Adieresis","Agrave","Aring","Atilde","Ccedilla","Eacute","Ecircumflex","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Ntilde","Oacute","Ocircumflex","Odieresis","Ograve","Otilde","Scaron","Uacute","Ucircumflex","Udieresis","Ugrave","Yacute","Ydieresis","Zcaron","aacute","acircumflex","adieresis","agrave","aring","atilde","ccedilla","eacute","ecircumflex","edieresis","egrave","iacute","icircumflex","idieresis","igrave","ntilde","oacute","ocircumflex","odieresis","ograve","otilde","scaron","uacute","ucircumflex","udieresis","ugrave","yacute","ydieresis","zcaron","exclamsmall","Hungarumlautsmall","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","266 ff","onedotenleader","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","commasuperior","threequartersemdash","periodsuperior","questionsmall","asuperior","bsuperior","centsuperior","dsuperior","esuperior","isuperior","lsuperior","msuperior","nsuperior","osuperior","rsuperior","ssuperior","tsuperior","ff","ffi","ffl","parenleftinferior","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","exclamdownsmall","centoldstyle","Lslashsmall","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","Dotaccentsmall","Macronsmall","figuredash","hypheninferior","Ogoneksmall","Ringsmall","Cedillasmall","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","zerosuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall","001.000","001.001","001.002","001.003","Black","Bold","Book","Light","Medium","Regular","Roman","Semibold"],cffStandardEncoding=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","","endash","dagger","daggerdbl","periodcentered","","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","","questiondown","","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","","ring","cedilla","","hungarumlaut","ogonek","caron","emdash","","","","","","","","","","","","","","","","","AE","","ordfeminine","","","","","Lslash","Oslash","OE","ordmasculine","","","","","","ae","","","","dotlessi","","","lslash","oslash","oe","germandbls"],cffExpertEncoding=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","space","exclamsmall","Hungarumlautsmall","","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","twodotenleader","onedotenleader","comma","hyphen","period","fraction","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","colon","semicolon","commasuperior","threequartersemdash","periodsuperior","questionsmall","","asuperior","bsuperior","centsuperior","dsuperior","esuperior","","","isuperior","","","lsuperior","msuperior","nsuperior","osuperior","","","rsuperior","ssuperior","tsuperior","","ff","fi","fl","ffi","ffl","parenleftinferior","","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","exclamdownsmall","centoldstyle","Lslashsmall","","","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","","Dotaccentsmall","","","Macronsmall","","","figuredash","hypheninferior","","","Ogoneksmall","Ringsmall","Cedillasmall","","","","onequarter","onehalf","threequarters","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","","","zerosuperior","onesuperior","twosuperior","threesuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall"],standardNames=[".notdef",".null","nonmarkingreturn","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quotesingle","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","grave","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","Adieresis","Aring","Ccedilla","Eacute","Ntilde","Odieresis","Udieresis","aacute","agrave","acircumflex","adieresis","atilde","aring","ccedilla","eacute","egrave","ecircumflex","edieresis","iacute","igrave","icircumflex","idieresis","ntilde","oacute","ograve","ocircumflex","odieresis","otilde","uacute","ugrave","ucircumflex","udieresis","dagger","degree","cent","sterling","section","bullet","paragraph","germandbls","registered","copyright","trademark","acute","dieresis","notequal","AE","Oslash","infinity","plusminus","lessequal","greaterequal","yen","mu","partialdiff","summation","product","pi","integral","ordfeminine","ordmasculine","Omega","ae","oslash","questiondown","exclamdown","logicalnot","radical","florin","approxequal","Delta","guillemotleft","guillemotright","ellipsis","nonbreakingspace","Agrave","Atilde","Otilde","OE","oe","endash","emdash","quotedblleft","quotedblright","quoteleft","quoteright","divide","lozenge","ydieresis","Ydieresis","fraction","currency","guilsinglleft","guilsinglright","fi","fl","daggerdbl","periodcentered","quotesinglbase","quotedblbase","perthousand","Acircumflex","Ecircumflex","Aacute","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Oacute","Ocircumflex","apple","Ograve","Uacute","Ucircumflex","Ugrave","dotlessi","circumflex","tilde","macron","breve","dotaccent","ring","cedilla","hungarumlaut","ogonek","caron","Lslash","lslash","Scaron","scaron","Zcaron","zcaron","brokenbar","Eth","eth","Yacute","yacute","Thorn","thorn","minus","multiply","onesuperior","twosuperior","threesuperior","onehalf","onequarter","threequarters","franc","Gbreve","gbreve","Idotaccent","Scedilla","scedilla","Cacute","cacute","Ccaron","ccaron","dcroat"];DefaultEncoding.prototype.charToGlyphIndex=function(e){var l=e.charCodeAt(0),r=this.font.glyphs;if(!r)return null;for(var a=0;a<r.length;a+=1)for(var s=r[a],i=0;i<s.unicodes.length;i+=1)if(s.unicodes[i]===l)return a},CmapEncoding.prototype.charToGlyphIndex=function(e){return this.cmap.glyphIndexMap[e.charCodeAt(0)]||0},CffEncoding.prototype.charToGlyphIndex=function(e){var l=e.charCodeAt(0),r=this.encoding[l];return this.charset.indexOf(r)},GlyphNames.prototype.nameToGlyphIndex=function(e){return this.names.indexOf(e)},GlyphNames.prototype.glyphIndexToName=function(e){return this.names[e]},exports.cffStandardStrings=cffStandardStrings,exports.cffStandardEncoding=cffStandardEncoding,exports.cffExpertEncoding=cffExpertEncoding,exports.standardNames=standardNames,exports.DefaultEncoding=DefaultEncoding,exports.CmapEncoding=CmapEncoding,exports.CffEncoding=CffEncoding,exports.GlyphNames=GlyphNames,exports.addGlyphNames=addGlyphNames;


},{}],4:[function(require,module,exports){
"use strict";function Font(t){t=t||{},this.familyName=t.familyName||" ",this.styleName=t.styleName||" ",this.designer=t.designer||" ",this.designerURL=t.designerURL||" ",this.manufacturer=t.manufacturer||" ",this.manufacturerURL=t.manufacturerURL||" ",this.license=t.license||" ",this.licenseURL=t.licenseURL||" ",this.version=t.version||"Version 0.1",this.description=t.description||" ",this.copyright=t.copyright||" ",this.trademark=t.trademark||" ",this.unitsPerEm=t.unitsPerEm||1e3,this.ascender=t.ascender,this.descender=t.descender,this.supported=!0,this.glyphs=t.glyphs||[],this.encoding=new encoding.DefaultEncoding(this),this.tables={}}var path=require("./path"),sfnt=require("./tables/sfnt"),encoding=require("./encoding");Font.prototype.hasChar=function(t){return null!==this.encoding.charToGlyphIndex(t)},Font.prototype.charToGlyphIndex=function(t){return this.encoding.charToGlyphIndex(t)},Font.prototype.charToGlyph=function(t){var e=this.charToGlyphIndex(t),n=this.glyphs[e];return n||(n=this.glyphs[0]),n},Font.prototype.stringToGlyphs=function(t){for(var e=[],n=0;n<t.length;n+=1){var i=t[n];e.push(this.charToGlyph(i))}return e},Font.prototype.nameToGlyphIndex=function(t){return this.glyphNames.nameToGlyphIndex(t)},Font.prototype.nameToGlyph=function(t){var e=this.nametoGlyphIndex(t),n=this.glyphs[e];return n||(n=this.glyphs[0]),n},Font.prototype.glyphIndexToName=function(t){return this.glyphNames.glyphIndexToName?this.glyphNames.glyphIndexToName(t):""},Font.prototype.getKerningValue=function(t,e){t=t.index||t,e=e.index||e;var n=this.getGposKerningValue;return n?n(t,e):this.kerningPairs[t+","+e]||0},Font.prototype.forEachGlyph=function(t,e,n,i,o,r){if(this.supported){e=void 0!==e?e:0,n=void 0!==n?n:0,i=void 0!==i?i:72,o=o||{};for(var s=void 0===o.kerning?!0:o.kerning,h=1/this.unitsPerEm*i,a=this.stringToGlyphs(t),p=0;p<a.length;p+=1){var c=a[p];if(r(c,e,n,i,o),c.advanceWidth&&(e+=c.advanceWidth*h),s&&p<a.length-1){var u=this.getKerningValue(c,a[p+1]);e+=u*h}}}},Font.prototype.getPath=function(t,e,n,i,o){var r=new path.Path;return this.forEachGlyph(t,e,n,i,o,function(t,e,n,i){var o=t.getPath(e,n,i);r.extend(o)}),r},Font.prototype.draw=function(t,e,n,i,o,r){this.getPath(e,n,i,o,r).draw(t)},Font.prototype.drawPoints=function(t,e,n,i,o,r){this.forEachGlyph(e,n,i,o,r,function(e,n,i,o){e.drawPoints(t,n,i,o)})},Font.prototype.drawMetrics=function(t,e,n,i,o,r){this.forEachGlyph(e,n,i,o,r,function(e,n,i,o){e.drawMetrics(t,n,i,o)})},Font.prototype.validate=function(){function t(t,e){t||n.push(e)}function e(e){t(i[e]&&i[e].trim().length>0,"No "+e+" specified.")}var n=[],i=this;e("familyName"),e("weightName"),e("manufacturer"),e("copyright"),e("version"),t(this.unitsPerEm>0,"No unitsPerEm specified.")},Font.prototype.toTables=function(){return sfnt.fontToTable(this)},Font.prototype.toBuffer=function(){for(var t=this.toTables(),e=t.encode(),n=new ArrayBuffer(e.length),i=new Uint8Array(n),o=0;o<e.length;o++)i[o]=e[o];return n},Font.prototype.download=function(){var t=this.familyName.replace(/\s/g,"")+"-"+this.styleName+".otf",e=this.toBuffer();window.requestFileSystem=window.requestFileSystem||window.webkitRequestFileSystem,window.requestFileSystem(window.TEMPORARY,e.byteLength,function(n){n.root.getFile(t,{create:!0},function(t){t.createWriter(function(n){var i=new DataView(e),o=new Blob([i],{type:"font/opentype"});n.write(o),n.addEventListener("writeend",function(){location.href=t.toURL()},!1)})})},function(t){throw t})},exports.Font=Font;


},{"./encoding":3,"./path":8,"./tables/sfnt":23}],5:[function(require,module,exports){
"use strict";function Glyph(t){this.font=t.font||null,this.index=t.index||0,this.name=t.name||null,this.unicode=t.unicode||void 0,this.unicodes=t.unicodes||void 0!==t.unicode?[t.unicode]:[],this.xMin=t.xMin||0,this.yMin=t.yMin||0,this.xMax=t.xMax||0,this.yMax=t.yMax||0,this.advanceWidth=t.advanceWidth||0,this.path=t.path||null}var check=require("./check"),draw=require("./draw"),path=require("./path");Glyph.prototype.addUnicode=function(t){0===this.unicodes.length&&(this.unicode=t),this.unicodes.push(t)},Glyph.prototype.getPath=function(t,i,e){t=void 0!==t?t:0,i=void 0!==i?i:0,e=void 0!==e?e:72;for(var n=1/this.font.unitsPerEm*e,h=new path.Path,a=this.path.commands,o=0;o<a.length;o+=1){var r=a[o];"M"===r.type?h.moveTo(t+r.x*n,i+-r.y*n):"L"===r.type?h.lineTo(t+r.x*n,i+-r.y*n):"Q"===r.type?h.quadraticCurveTo(t+r.x1*n,i+-r.y1*n,t+r.x*n,i+-r.y*n):"C"===r.type?h.curveTo(t+r.x1*n,i+-r.y1*n,t+r.x2*n,i+-r.y2*n,t+r.x*n,i+-r.y*n):"Z"===r.type&&h.closePath()}return h},Glyph.prototype.getContours=function(){if(void 0===this.points)return[];for(var t=[],i=[],e=0;e<this.points.length;e+=1){var n=this.points[e];i.push(n),n.lastPointOfContour&&(t.push(i),i=[])}return check.argument(0===i.length,"There are still points left in the current contour."),t},Glyph.prototype.getMetrics=function(){for(var t=this.path.commands,i=[],e=[],n=0;n<t.length;n+=1){var h=t[n];"Z"!==h.type&&(i.push(h.x),e.push(h.y)),("Q"===h.type||"C"===h.type)&&(i.push(h.x1),e.push(h.y1)),"C"===h.type&&(i.push(h.x2),e.push(h.y2))}var a={xMin:Math.min.apply(null,i),yMin:Math.min.apply(null,e),xMax:Math.max.apply(null,i),yMax:Math.max.apply(null,e),leftSideBearing:0};return a.rightSideBearing=this.advanceWidth-a.leftSideBearing-(a.xMax-a.xMin),a},Glyph.prototype.draw=function(t,i,e,n){this.getPath(i,e,n).draw(t)},Glyph.prototype.drawPoints=function(t,i,e,n){function h(i,e,n,h){var a=2*Math.PI;t.beginPath();for(var o=0;o<i.length;o+=1)t.moveTo(e+i[o].x*h,n+i[o].y*h),t.arc(e+i[o].x*h,n+i[o].y*h,2,0,a,!1);t.closePath(),t.fill()}i=void 0!==i?i:0,e=void 0!==e?e:0,n=void 0!==n?n:24;for(var a=1/this.font.unitsPerEm*n,o=[],r=[],s=this.path,l=0;l<s.commands.length;l+=1){var p=s.commands[l];void 0!==p.x&&o.push({x:p.x,y:-p.y}),void 0!==p.x1&&r.push({x:p.x1,y:-p.y1}),void 0!==p.x2&&r.push({x:p.x2,y:-p.y2})}t.fillStyle="blue",h(o,i,e,a),t.fillStyle="red",h(r,i,e,a)},Glyph.prototype.drawMetrics=function(t,i,e,n){var h;i=void 0!==i?i:0,e=void 0!==e?e:0,n=void 0!==n?n:24,h=1/this.font.unitsPerEm*n,t.lineWidth=1,t.strokeStyle="black",draw.line(t,i,-1e4,i,1e4),draw.line(t,-1e4,e,1e4,e),t.strokeStyle="blue",draw.line(t,i+this.xMin*h,-1e4,i+this.xMin*h,1e4),draw.line(t,i+this.xMax*h,-1e4,i+this.xMax*h,1e4),draw.line(t,-1e4,e+-this.yMin*h,1e4,e+-this.yMin*h),draw.line(t,-1e4,e+-this.yMax*h,1e4,e+-this.yMax*h),t.strokeStyle="green",draw.line(t,i+this.advanceWidth*h,-1e4,i+this.advanceWidth*h,1e4)},exports.Glyph=Glyph;


},{"./check":1,"./draw":2,"./path":8}],6:[function(require,module,exports){
"use strict";function toArrayBuffer(e){for(var a=new ArrayBuffer(e.length),r=new Uint8Array(a),s=0;s<e.length;s+=1)r[s]=e[s];return a}function loadFromFile(e,a){var r=require("fs");r.readFile(e,function(e,r){return e?a(e.message):void a(null,toArrayBuffer(r))})}function loadFromUrl(e,a){var r=new XMLHttpRequest;r.open("get",e,!0),r.responseType="arraybuffer",r.onload=function(){return 200!==r.status?a("Font could not be loaded: "+r.statusText):a(null,r.response)},r.send()}function parseBuffer(e){var a,r,s,t,n,o,p,l=new _font.Font,i=new DataView(e,0),u=parse.getFixed(i,0);if(1===u)l.outlinesFormat="truetype";else{if(u=parse.getTag(i,0),"OTTO"!==u)throw new Error("Unsupported OpenType version "+u);l.outlinesFormat="cff"}for(var c=parse.getUShort(i,4),f=12,h=0;c>h;h+=1){var d=parse.getTag(i,f),m=parse.getULong(i,f+8);switch(d){case"cmap":l.tables.cmap=cmap.parse(i,m),l.encoding=new encoding.CmapEncoding(l.tables.cmap),l.encoding||(l.supported=!1);break;case"head":l.tables.head=head.parse(i,m),l.unitsPerEm=l.tables.head.unitsPerEm,a=l.tables.head.indexToLocFormat;break;case"hhea":l.tables.hhea=hhea.parse(i,m),l.ascender=l.tables.hhea.ascender,l.descender=l.tables.hhea.descender,l.numberOfHMetrics=l.tables.hhea.numberOfHMetrics;break;case"hmtx":r=m;break;case"maxp":l.tables.maxp=maxp.parse(i,m),l.numGlyphs=l.tables.maxp.numGlyphs;break;case"name":l.tables.name=_name.parse(i,m),l.familyName=l.tables.name.fontFamily,l.styleName=l.tables.name.fontSubfamily;break;case"OS/2":l.tables.os2=os2.parse(i,m);break;case"post":l.tables.post=post.parse(i,m),l.glyphNames=new encoding.GlyphNames(l.tables.post);break;case"glyf":s=m;break;case"loca":t=m;break;case"CFF ":n=m;break;case"kern":o=m;break;case"GPOS":p=m}f+=16}if(s&&t){var b=0===a,g=loca.parse(i,t,l.numGlyphs,b);l.glyphs=glyf.parse(i,s,g,l),hmtx.parse(i,r,l.numberOfHMetrics,l.numGlyphs,l.glyphs),encoding.addGlyphNames(l)}else n?(cff.parse(i,n,l),encoding.addGlyphNames(l)):l.supported=!1;return l.supported&&(l.kerningPairs=o?kern.parse(i,o):{},p&&gpos.parse(i,p,l)),l}function load(e,a){var r="undefined"==typeof window,s=r?loadFromFile:loadFromUrl;s(e,function(e,r){if(e)return a(e);var s=parseBuffer(r);return s.supported?a(null,s):a("Font is not supported (is this a Postscript font?)")})}var encoding=require("./encoding"),_font=require("./font"),glyph=require("./glyph"),parse=require("./parse"),path=require("./path"),cmap=require("./tables/cmap"),cff=require("./tables/cff"),glyf=require("./tables/glyf"),gpos=require("./tables/gpos"),head=require("./tables/head"),hhea=require("./tables/hhea"),hmtx=require("./tables/hmtx"),kern=require("./tables/kern"),loca=require("./tables/loca"),maxp=require("./tables/maxp"),_name=require("./tables/name"),os2=require("./tables/os2"),post=require("./tables/post");exports._parse=parse,exports.Font=_font.Font,exports.Glyph=glyph.Glyph,exports.Path=path.Path,exports.parse=parseBuffer,exports.load=load;
},{"./encoding":3,"./font":4,"./glyph":5,"./parse":7,"./path":8,"./tables/cff":10,"./tables/cmap":11,"./tables/glyf":12,"./tables/gpos":13,"./tables/head":14,"./tables/hhea":15,"./tables/hmtx":16,"./tables/kern":17,"./tables/loca":18,"./tables/maxp":19,"./tables/name":20,"./tables/os2":21,"./tables/post":22,"fs":undefined}],7:[function(require,module,exports){
"use strict";function Parser(t,e){this.data=t,this.offset=e,this.relativeOffset=0}exports.getByte=function(t,e){return t.getUint8(e)},exports.getCard8=exports.getByte,exports.getUShort=function(t,e){return t.getUint16(e,!1)},exports.getCard16=exports.getUShort,exports.getShort=function(t,e){return t.getInt16(e,!1)},exports.getULong=function(t,e){return t.getUint32(e,!1)},exports.getFixed=function(t,e){var r=t.getInt16(e,!1),s=t.getUint16(e+2,!1);return r+s/65535},exports.getTag=function(t,e){for(var r="",s=e;e+4>s;s+=1)r+=String.fromCharCode(t.getInt8(s));return r},exports.getOffset=function(t,e,r){for(var s=0,o=0;r>o;o+=1)s<<=8,s+=t.getUint8(e+o);return s},exports.getBytes=function(t,e,r){for(var s=[],o=e;r>o;o+=1)s.push(t.getUint8(o));return s},exports.bytesToString=function(t){for(var e="",r=0;r<t.length;r+=1)e+=String.fromCharCode(t[r]);return e};var typeOffsets={"byte":1,uShort:2,"short":2,uLong:4,fixed:4,longDateTime:8,tag:4};Parser.prototype.parseByte=function(){var t=this.data.getUint8(this.offset+this.relativeOffset);return this.relativeOffset+=1,t},Parser.prototype.parseChar=function(){var t=this.data.getInt8(this.offset+this.relativeOffset);return this.relativeOffset+=1,t},Parser.prototype.parseCard8=Parser.prototype.parseByte,Parser.prototype.parseUShort=function(){var t=this.data.getUint16(this.offset+this.relativeOffset);return this.relativeOffset+=2,t},Parser.prototype.parseCard16=Parser.prototype.parseUShort,Parser.prototype.parseSID=Parser.prototype.parseUShort,Parser.prototype.parseOffset16=Parser.prototype.parseUShort,Parser.prototype.parseShort=function(){var t=this.data.getInt16(this.offset+this.relativeOffset);return this.relativeOffset+=2,t},Parser.prototype.parseF2Dot14=function(){var t=this.data.getInt16(this.offset+this.relativeOffset)/16384;return this.relativeOffset+=2,t},Parser.prototype.parseULong=function(){var t=exports.getULong(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,t},Parser.prototype.parseFixed=function(){var t=exports.getFixed(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,t},Parser.prototype.parseOffset16List=Parser.prototype.parseUShortList=function(t){for(var e=new Array(t),r=this.data,s=this.offset+this.relativeOffset,o=0;t>o;o++)e[o]=exports.getUShort(r,s),s+=2;return this.relativeOffset+=2*t,e},Parser.prototype.parseString=function(t){var e=this.data,r=this.offset+this.relativeOffset,s="";this.relativeOffset+=t;for(var o=0;t>o;o++)s+=String.fromCharCode(e.getUint8(r+o));return s},Parser.prototype.parseTag=function(){return this.parseString(4)},Parser.prototype.parseLongDateTime=function(){var t=exports.getULong(this.data,this.offset+this.relativeOffset+4);return this.relativeOffset+=8,t},Parser.prototype.parseFixed=function(){var t=exports.getULong(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,t/65536},Parser.prototype.parseVersion=function(){var t=exports.getUShort(this.data,this.offset+this.relativeOffset),e=exports.getUShort(this.data,this.offset+this.relativeOffset+2);return this.relativeOffset+=4,t+e/4096/10},Parser.prototype.skip=function(t,e){void 0===e&&(e=1),this.relativeOffset+=typeOffsets[t]*e},exports.Parser=Parser;


},{}],8:[function(require,module,exports){
"use strict";function Path(){this.commands=[],this.fill="black",this.stroke=null,this.strokeWidth=1}Path.prototype.moveTo=function(t,o){this.commands.push({type:"M",x:t,y:o})},Path.prototype.lineTo=function(t,o){this.commands.push({type:"L",x:t,y:o})},Path.prototype.curveTo=Path.prototype.bezierCurveTo=function(t,o,e,i,s,h){this.commands.push({type:"C",x1:t,y1:o,x2:e,y2:i,x:s,y:h})},Path.prototype.quadTo=Path.prototype.quadraticCurveTo=function(t,o,e,i){this.commands.push({type:"Q",x1:t,y1:o,x:e,y:i})},Path.prototype.close=Path.prototype.closePath=function(){this.commands.push({type:"Z"})},Path.prototype.extend=function(t){t.commands&&(t=t.commands),Array.prototype.push.apply(this.commands,t)},Path.prototype.draw=function(t){t.beginPath();for(var o=0;o<this.commands.length;o+=1){var e=this.commands[o];"M"===e.type?t.moveTo(e.x,e.y):"L"===e.type?t.lineTo(e.x,e.y):"C"===e.type?t.bezierCurveTo(e.x1,e.y1,e.x2,e.y2,e.x,e.y):"Q"===e.type?t.quadraticCurveTo(e.x1,e.y1,e.x,e.y):"Z"===e.type&&t.closePath()}this.fill&&(t.fillStyle=this.fill,t.fill()),this.stroke&&(t.strokeStyle=this.stroke,t.lineWidth=this.strokeWidth,t.stroke())},Path.prototype.toPathData=function(t){function o(o){return Math.round(o)===o?""+Math.round(o):o.toFixed(t)}function e(){for(var t="",e=0;e<arguments.length;e+=1){var i=arguments[e];i>=0&&e>0&&(t+=" "),t+=o(i)}return t}t=void 0!==t?t:2;for(var i="",s=0;s<this.commands.length;s+=1){var h=this.commands[s];"M"===h.type?i+="M"+e(h.x,h.y):"L"===h.type?i+="L"+e(h.x,h.y):"C"===h.type?i+="C"+e(h.x1,h.y1,h.x2,h.y2,h.x,h.y):"Q"===h.type?i+="Q"+e(h.x1,h.y1,h.x,h.y):"Z"===h.type&&(i+="Z")}return i},Path.prototype.toSVG=function(t){var o='<path d="';return o+=this.toPathData(t),o+='"',this.fill&"black"!==this.fill&&(o+=null===this.fill?' fill="none"':' fill="'+this.fill+'"'),this.stroke&&(o+=' stroke="'+this.stroke+'" stroke-width="'+this.strokeWidth+'"'),o+="/>"},exports.Path=Path;


},{}],9:[function(require,module,exports){
"use strict";function Table(e,t,i){var s;for(s=0;s<t.length;s+=1){var r=t[s];this[r.name]=r.value}if(this.tableName=e,this.fields=t,i){var f=Object.keys(i);for(s=0;s<f.length;s+=1){var n=f[s],o=i[n];void 0!==this[n]&&(this[n]=o)}}}var check=require("./check"),encode=require("./types").encode,sizeOf=require("./types").sizeOf;Table.prototype.sizeOf=function(){for(var e=0,t=0;t<this.fields.length;t+=1){var i=this.fields[t],s=this[i.name];if(void 0===s&&(s=i.value),"function"==typeof s.sizeOf)e+=s.sizeOf();else{var r=sizeOf[i.type];check.assert("function"==typeof r,"Could not find sizeOf function for field"+i.name),e+=r(s)}}return e},Table.prototype.encode=function(){return encode.TABLE(this)},exports.Table=Table;


},{"./check":1,"./types":24}],10:[function(require,module,exports){
"use strict";function equals(e,t){if(e===t)return!0;if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return!1;for(var a=0;a<e.length;a+=1)if(!equals(e[a],t[a]))return!1;return!0}return!1}function parseCFFIndex(e,t,a){var r,n,s,i=[],h=[],o=parse.getCard16(e,t);if(0!==o){var f=parse.getByte(e,t+2);n=t+(o+1)*f+2;var p=t+3;for(r=0;o+1>r;r+=1)i.push(parse.getOffset(e,p,f)),p+=f;s=n+i[o]}else s=t+2;for(r=0;r<i.length-1;r+=1){var u=parse.getBytes(e,n+i[r],n+i[r+1]);a&&(u=a(u)),h.push(u)}return{objects:h,startOffset:t,endOffset:s}}function parseFloatOperand(e){for(var t="",a=15,r=["0","1","2","3","4","5","6","7","8","9",".","E","E-",null,"-"];;){var n=e.parseByte(),s=n>>4,i=15&n;if(s===a)break;if(t+=r[s],i===a)break;t+=r[i]}return parseFloat(t)}function parseOperand(e,t){var a,r,n,s;if(28===t)return a=e.parseByte(),r=e.parseByte(),a<<8|r;if(29===t)return a=e.parseByte(),r=e.parseByte(),n=e.parseByte(),s=e.parseByte(),a<<24|r<<16|n<<8|s;if(30===t)return parseFloatOperand(e);if(t>=32&&246>=t)return t-139;if(t>=247&&250>=t)return a=e.parseByte(),256*(t-247)+a+108;if(t>=251&&254>=t)return a=e.parseByte(),256*-(t-251)-a-108;throw new Error("Invalid b0 "+t)}function entriesToObject(e){for(var t={},a=0;a<e.length;a+=1){var r,n=e[a][0],s=e[a][1];if(r=1===s.length?s[0]:s,t.hasOwnProperty(n))throw new Error("Object "+t+" already has key "+n);t[n]=r}return t}function parseCFFDict(e,t,a){t=void 0!==t?t:0;var r=new parse.Parser(e,t),n=[],s=[];for(a=void 0!==a?a:e.length;r.relativeOffset<a;){var i=r.parseByte();21>=i?(12===i&&(i=1200+r.parseByte()),n.push([i,s]),s=[]):s.push(parseOperand(r,i))}return entriesToObject(n)}function getCFFString(e,t){return t=390>=t?encoding.cffStandardStrings[t]:e[t-391]}function interpretDict(e,t,a){for(var r={},n=0;n<t.length;n+=1){var s=t[n],i=e[s.op];void 0===i&&(i=void 0!==s.value?s.value:null),"SID"===s.type&&(i=getCFFString(a,i)),r[s.name]=i}return r}function parseCFFHeader(e,t){var a={};return a.formatMajor=parse.getCard8(e,t),a.formatMinor=parse.getCard8(e,t+1),a.size=parse.getCard8(e,t+2),a.offsetSize=parse.getCard8(e,t+3),a.startOffset=t,a.endOffset=t+4,a}function parseCFFTopDict(e,t){var a=parseCFFDict(e,0,e.byteLength);return interpretDict(a,TOP_DICT_META,t)}function parseCFFPrivateDict(e,t,a,r){var n=parseCFFDict(e,t,a);return interpretDict(n,PRIVATE_DICT_META,r)}function parseCFFCharset(e,t,a,r){var n,s,i,h=new parse.Parser(e,t);a-=1;var o=[".notdef"],f=h.parseCard8();if(0===f)for(n=0;a>n;n+=1)s=h.parseSID(),o.push(getCFFString(r,s));else if(1===f)for(;o.length<=a;)for(s=h.parseSID(),i=h.parseCard8(),n=0;i>=n;n+=1)o.push(getCFFString(r,s)),s+=1;else{if(2!==f)throw new Error("Unknown charset format "+f);for(;o.length<=a;)for(s=h.parseSID(),i=h.parseCard16(),n=0;i>=n;n+=1)o.push(getCFFString(r,s)),s+=1}return o}function parseCFFEncoding(e,t,a){var r,n,s={},i=new parse.Parser(e,t),h=i.parseCard8();if(0===h){var o=i.parseCard8();for(r=0;o>r;r+=1)n=i.parseCard8(),s[n]=r}else{if(1!==h)throw new Error("Unknown encoding format "+h);var f=i.parseCard8();for(n=1,r=0;f>r;r+=1)for(var p=i.parseCard8(),u=i.parseCard8(),l=p;p+u>=l;l+=1)s[l]=n,n+=1}return new encoding.CffEncoding(s,a)}function parseCFFCharstring(e,t,a){function r(e,t){v&&p.closePath(),p.moveTo(e,t),v=!0}function n(){var e;e=u.length%2!==0,e&&!c&&(d=u.shift()+t.nominalWidthX),l+=u.length>>1,u.length=0,c=!0}function s(e){for(var y,b,T,C,I,F,D,x,k,S,E,B,w=0;w<e.length;){var M=e[w];switch(w+=1,M){case 1:n();break;case 3:n();break;case 4:u.length>1&&!c&&(d=u.shift()+t.nominalWidthX,c=!0),m+=u.pop(),r(g,m);break;case 5:for(;u.length>0;)g+=u.shift(),m+=u.shift(),p.lineTo(g,m);break;case 6:for(;u.length>0&&(g+=u.shift(),p.lineTo(g,m),0!==u.length);)m+=u.shift(),p.lineTo(g,m);break;case 7:for(;u.length>0&&(m+=u.shift(),p.lineTo(g,m),0!==u.length);)g+=u.shift(),p.lineTo(g,m);break;case 8:for(;u.length>0;)i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f+u.shift(),p.curveTo(i,h,o,f,g,m);break;case 10:I=u.pop()+t.subrsBias,F=t.subrs[I],F&&s(F);break;case 11:return;case 12:switch(M=e[w],w+=1,M){case 35:i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),D=o+u.shift(),x=f+u.shift(),k=D+u.shift(),S=x+u.shift(),E=k+u.shift(),B=S+u.shift(),g=E+u.shift(),m=B+u.shift(),u.shift(),p.curveTo(i,h,o,f,D,x),p.curveTo(k,S,E,B,g,m);break;case 34:i=g+u.shift(),h=m,o=i+u.shift(),f=h+u.shift(),D=o+u.shift(),x=f,k=D+u.shift(),S=f,E=k+u.shift(),B=m,g=E+u.shift(),p.curveTo(i,h,o,f,D,x),p.curveTo(k,S,E,B,g,m);break;case 36:i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),D=o+u.shift(),x=f,k=D+u.shift(),S=f,E=k+u.shift(),B=S+u.shift(),g=E+u.shift(),p.curveTo(i,h,o,f,D,x),p.curveTo(k,S,E,B,g,m);break;case 37:i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),D=o+u.shift(),x=f+u.shift(),k=D+u.shift(),S=x+u.shift(),E=k+u.shift(),B=S+u.shift(),Math.abs(E-g)>Math.abs(B-m)?g=E+u.shift():m=B+u.shift(),p.curveTo(i,h,o,f,D,x),p.curveTo(k,S,E,B,g,m);break;default:console.log("Glyph "+a+": unknown operator 1200"+M),u.length=0}break;case 14:u.length>0&&!c&&(d=u.shift()+t.nominalWidthX,c=!0),v&&(p.closePath(),v=!1);break;case 18:n();break;case 19:case 20:n(),w+=l+7>>3;break;case 21:u.length>2&&!c&&(d=u.shift()+t.nominalWidthX,c=!0),m+=u.pop(),g+=u.pop(),r(g,m);break;case 22:u.length>1&&!c&&(d=u.shift()+t.nominalWidthX,c=!0),g+=u.pop(),r(g,m);break;case 23:n();break;case 24:for(;u.length>2;)i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f+u.shift(),p.curveTo(i,h,o,f,g,m);g+=u.shift(),m+=u.shift(),p.lineTo(g,m);break;case 25:for(;u.length>6;)g+=u.shift(),m+=u.shift(),p.lineTo(g,m);i=g+u.shift(),h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f+u.shift(),p.curveTo(i,h,o,f,g,m);break;case 26:for(u.length%2&&(g+=u.shift());u.length>0;)i=g,h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o,m=f+u.shift(),p.curveTo(i,h,o,f,g,m);break;case 27:for(u.length%2&&(m+=u.shift());u.length>0;)i=g+u.shift(),h=m,o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f,p.curveTo(i,h,o,f,g,m);break;case 28:y=e[w],b=e[w+1],u.push((y<<24|b<<16)>>16),w+=2;break;case 29:I=u.pop()+t.gsubrsBias,F=t.gsubrs[I],F&&s(F);break;case 30:for(;u.length>0&&(i=g,h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f+(1===u.length?u.shift():0),p.curveTo(i,h,o,f,g,m),0!==u.length);)i=g+u.shift(),h=m,o=i+u.shift(),f=h+u.shift(),m=f+u.shift(),g=o+(1===u.length?u.shift():0),p.curveTo(i,h,o,f,g,m);break;case 31:for(;u.length>0&&(i=g+u.shift(),h=m,o=i+u.shift(),f=h+u.shift(),m=f+u.shift(),g=o+(1===u.length?u.shift():0),p.curveTo(i,h,o,f,g,m),0!==u.length);)i=g,h=m+u.shift(),o=i+u.shift(),f=h+u.shift(),g=o+u.shift(),m=f+(1===u.length?u.shift():0),p.curveTo(i,h,o,f,g,m);break;default:32>M?console.log("Glyph "+a+": unknown operator "+M):247>M?u.push(M-139):251>M?(y=e[w],w+=1,u.push(256*(M-247)+y+108)):255>M?(y=e[w],w+=1,u.push(256*-(M-251)-y-108)):(y=e[w],b=e[w+1],T=e[w+2],C=e[w+3],w+=4,u.push((y<<24|b<<16|T<<8|C)/65536))}}}var i,h,o,f,p=new path.Path,u=[],l=0,c=!1,d=t.defaultWidthX,v=!1,g=0,m=0;s(e);var y=new _glyph.Glyph({font:t,index:a});return y.path=p,y.advanceWidth=d,y}function calcCFFSubroutineBias(e){var t;return t=e.length<1240?107:e.length<33900?1131:32768}function parseCFFTable(e,t,a){a.tables.cff={};var r=parseCFFHeader(e,t),n=parseCFFIndex(e,r.endOffset,parse.bytesToString),s=parseCFFIndex(e,n.endOffset),i=parseCFFIndex(e,s.endOffset,parse.bytesToString),h=parseCFFIndex(e,i.endOffset);a.gsubrs=h.objects,a.gsubrsBias=calcCFFSubroutineBias(a.gsubrs);var o=new DataView(new Uint8Array(s.objects[0]).buffer),f=parseCFFTopDict(o,i.objects);a.tables.cff.topDict=f;var p=t+f["private"][1],u=parseCFFPrivateDict(e,p,f["private"][0],i.objects);if(a.defaultWidthX=u.defaultWidthX,a.nominalWidthX=u.nominalWidthX,0!==u.subrs){var l=p+u.subrs,c=parseCFFIndex(e,l);a.subrs=c.objects,a.subrsBias=calcCFFSubroutineBias(a.subrs)}else a.subrs=[],a.subrsBias=0;var d=parseCFFIndex(e,t+f.charStrings);a.nGlyphs=d.objects.length;var v=parseCFFCharset(e,t+f.charset,a.nGlyphs,i.objects);a.cffEncoding=0===f.encoding?new encoding.CffEncoding(encoding.cffStandardEncoding,v):1===f.encoding?new encoding.CffEncoding(encoding.cffExpertEncoding,v):parseCFFEncoding(e,t+f.encoding,v),a.encoding=a.encoding||a.cffEncoding,a.glyphs=[];for(var g=0;g<a.nGlyphs;g+=1){var m=d.objects[g];a.glyphs.push(parseCFFCharstring(m,a,g))}}function encodeString(e,t){var a,r=encoding.cffStandardStrings.indexOf(e);return r>=0&&(a=r),r=t.indexOf(e),r>=0?a=r+encoding.cffStandardStrings.length:(a=encoding.cffStandardStrings.length+t.length,t.push(e)),a}function makeHeader(){return new table.Table("Header",[{name:"major",type:"Card8",value:1},{name:"minor",type:"Card8",value:0},{name:"hdrSize",type:"Card8",value:4},{name:"major",type:"Card8",value:1}])}function makeNameIndex(e){var t=new table.Table("Name INDEX",[{name:"names",type:"INDEX",value:[]}]);t.names=[];for(var a=0;a<e.length;a+=1)t.names.push({name:"name_"+a,type:"NAME",value:e[a]});return t}function makeDict(e,t,a){for(var r={},n=0;n<e.length;n+=1){var s=e[n],i=t[s.name];void 0===i||equals(i,s.value)||("SID"===s.type&&(i=encodeString(i,a)),r[s.op]={name:s.name,type:s.type,value:i})}return r}function makeTopDict(e,t){var a=new table.Table("Top DICT",[{name:"dict",type:"DICT",value:{}}]);return a.dict=makeDict(TOP_DICT_META,e,t),a}function makeTopDictIndex(e){var t=new table.Table("Top DICT INDEX",[{name:"topDicts",type:"INDEX",value:[]}]);return t.topDicts=[{name:"topDict_0",type:"TABLE",value:e}],t}function makeStringIndex(e){var t=new table.Table("String INDEX",[{name:"strings",type:"INDEX",value:[]}]);t.strings=[];for(var a=0;a<e.length;a+=1)t.strings.push({name:"string_"+a,type:"STRING",value:e[a]});return t}function makeGlobalSubrIndex(){return new table.Table("Global Subr INDEX",[{name:"subrs",type:"INDEX",value:[]}])}function makeCharsets(e,t){for(var a=new table.Table("Charsets",[{name:"format",type:"Card8",value:0}]),r=0;r<e.length;r+=1){var n=e[r],s=encodeString(n,t);a.fields.push({name:"glyph_"+r,type:"SID",value:s})}return a}function glyphToOps(e){var t=[],a=e.path;t.push({name:"width",type:"NUMBER",value:e.advanceWidth});for(var r=0,n=0,s=0;s<a.commands.length;s+=1){var i,h,o=a.commands[s];if("Q"===o.type){var f=1/3,p=2/3;o={type:"C",x:o.x,y:o.y,x1:f*r+p*o.x1,y1:f*n+p*o.y1,x2:f*o.x+p*o.x1,y2:f*o.y+p*o.y1}}if("M"===o.type)i=Math.round(o.x-r),h=Math.round(o.y-n),t.push({name:"dx",type:"NUMBER",value:i}),t.push({name:"dy",type:"NUMBER",value:h}),t.push({name:"rmoveto",type:"OP",value:21}),r=Math.round(o.x),n=Math.round(o.y);else if("L"===o.type)i=Math.round(o.x-r),h=Math.round(o.y-n),t.push({name:"dx",type:"NUMBER",value:i}),t.push({name:"dy",type:"NUMBER",value:h}),t.push({name:"rlineto",type:"OP",value:5}),r=Math.round(o.x),n=Math.round(o.y);else if("C"===o.type){var u=Math.round(o.x1-r),l=Math.round(o.y1-n),c=Math.round(o.x2-o.x1),d=Math.round(o.y2-o.y1);i=Math.round(o.x-o.x2),h=Math.round(o.y-o.y2),t.push({name:"dx1",type:"NUMBER",value:u}),t.push({name:"dy1",type:"NUMBER",value:l}),t.push({name:"dx2",type:"NUMBER",value:c}),t.push({name:"dy2",type:"NUMBER",value:d}),t.push({name:"dx",type:"NUMBER",value:i}),t.push({name:"dy",type:"NUMBER",value:h}),t.push({name:"rrcurveto",type:"OP",value:8}),r=Math.round(o.x),n=Math.round(o.y)}}return t.push({name:"endchar",type:"OP",value:14}),t}function makeCharStringsIndex(e){for(var t=new table.Table("CharStrings INDEX",[{name:"charStrings",type:"INDEX",value:[]}]),a=0;a<e.length;a+=1){var r=e[a],n=glyphToOps(r);t.charStrings.push({name:r.name,type:"CHARSTRING",value:n})}return t}function makePrivateDict(e,t){var a=new table.Table("Private DICT",[{name:"dict",type:"DICT",value:{}}]);return a.dict=makeDict(PRIVATE_DICT_META,e,t),a}function makePrivateDictIndex(e){var t=new table.Table("Private DICT INDEX",[{name:"privateDicts",type:"INDEX",value:[]}]);return t.privateDicts=[{name:"privateDict_0",type:"TABLE",value:e}],t}function makeCFFTable(e,t){for(var a=new table.Table("CFF ",[{name:"header",type:"TABLE"},{name:"nameIndex",type:"TABLE"},{name:"topDictIndex",type:"TABLE"},{name:"stringIndex",type:"TABLE"},{name:"globalSubrIndex",type:"TABLE"},{name:"charsets",type:"TABLE"},{name:"charStringsIndex",type:"TABLE"},{name:"privateDictIndex",type:"TABLE"}]),r={version:t.version,fullName:t.fullName,familyName:t.familyName,weight:t.weightName,charset:999,encoding:0,charStrings:999,"private":[0,999]},n={},s=[],i=1;i<e.length;i+=1)s.push(e[i].name);var h=[];a.header=makeHeader(),a.nameIndex=makeNameIndex([t.postScriptName]);var o=makeTopDict(r,h);a.topDictIndex=makeTopDictIndex(o),a.globalSubrIndex=makeGlobalSubrIndex(),a.charsets=makeCharsets(s,h),a.charStringsIndex=makeCharStringsIndex(e);var f=makePrivateDict(n,h);a.privateDictIndex=makePrivateDictIndex(f),a.stringIndex=makeStringIndex(h);var p=a.header.sizeOf()+a.nameIndex.sizeOf()+a.topDictIndex.sizeOf()+a.stringIndex.sizeOf()+a.globalSubrIndex.sizeOf();return r.charset=p,r.encoding=0,r.charStrings=r.charset+a.charsets.sizeOf(),r.private[1]=r.charStrings+a.charStringsIndex.sizeOf(),o=makeTopDict(r,h),a.topDictIndex=makeTopDictIndex(o),a}var encoding=require("../encoding"),_glyph=require("../glyph"),parse=require("../parse"),path=require("../path"),table=require("../table"),TOP_DICT_META=[{name:"version",op:0,type:"SID"},{name:"notice",op:1,type:"SID"},{name:"copyright",op:1200,type:"SID"},{name:"fullName",op:2,type:"SID"},{name:"familyName",op:3,type:"SID"},{name:"weight",op:4,type:"SID"},{name:"isFixedPitch",op:1201,type:"number",value:0},{name:"italicAngle",op:1202,type:"number",value:0},{name:"underlinePosition",op:1203,type:"number",value:-100},{name:"underlineThickness",op:1204,type:"number",value:50},{name:"paintType",op:1205,type:"number",value:0},{name:"charstringType",op:1206,type:"number",value:2},{name:"fontMatrix",op:1207,type:["real","real","real","real","real","real"],value:[.001,0,0,.001,0,0]},{name:"uniqueId",op:13,type:"number"},{name:"fontBBox",op:5,type:["number","number","number","number"],value:[0,0,0,0]},{name:"strokeWidth",op:1208,type:"number",value:0},{name:"xuid",op:14,type:[],value:null},{name:"charset",op:15,type:"offset",value:0},{name:"encoding",op:16,type:"offset",value:0},{name:"charStrings",op:17,type:"offset",value:0},{name:"private",op:18,type:["number","offset"],value:[0,0]}],PRIVATE_DICT_META=[{name:"subrs",op:19,type:"offset",value:0},{name:"defaultWidthX",op:20,type:"number",value:0},{name:"nominalWidthX",op:21,type:"number",value:0}];exports.parse=parseCFFTable,exports.make=makeCFFTable;


},{"../encoding":3,"../glyph":5,"../parse":7,"../path":8,"../table":9}],11:[function(require,module,exports){
"use strict";function parseCmapTable(e,a){var t,r={};r.version=parse.getUShort(e,a),check.argument(0===r.version,"cmap table version should be 0."),r.numTables=parse.getUShort(e,a+2);var n=-1;for(t=0;t<r.numTables;t+=1){var s=parse.getUShort(e,a+4+8*t),l=parse.getUShort(e,a+4+8*t+2);if(3===s&&(1===l||0===l)){n=parse.getULong(e,a+4+8*t+4);break}}if(-1===n)return null;var o=new parse.Parser(e,a+n);r.format=o.parseUShort(),check.argument(4===r.format,"Only format 4 cmap tables are supported."),r.length=o.parseUShort(),r.language=o.parseUShort();var p;r.segCount=p=o.parseUShort()>>1,o.skip("uShort",3),r.glyphIndexMap={};var g=new parse.Parser(e,a+n+14),m=new parse.Parser(e,a+n+16+2*p),u=new parse.Parser(e,a+n+16+4*p),h=new parse.Parser(e,a+n+16+6*p),c=a+n+16+8*p;for(t=0;p-1>t;t+=1)for(var f,d=g.parseUShort(),S=m.parseUShort(),i=u.parseShort(),v=h.parseUShort(),U=S;d>=U;U+=1)0!==v?(c=h.offset+h.relativeOffset-2,c+=v,c+=2*(U-S),f=parse.getUShort(e,c),0!==f&&(f=f+i&65535)):f=U+i&65535,r.glyphIndexMap[U]=f;return r}function addSegment(e,a,t){e.segments.push({end:a,start:a,delta:-(a-t),offset:0})}function addTerminatorSegment(e){e.segments.push({end:65535,start:65535,delta:1,offset:0})}function makeCmapTable(e){var a,t=new table.Table("cmap",[{name:"version",type:"USHORT",value:0},{name:"numTables",type:"USHORT",value:1},{name:"platformID",type:"USHORT",value:3},{name:"encodingID",type:"USHORT",value:1},{name:"offset",type:"ULONG",value:12},{name:"format",type:"USHORT",value:4},{name:"length",type:"USHORT",value:0},{name:"language",type:"USHORT",value:0},{name:"segCountX2",type:"USHORT",value:0},{name:"searchRange",type:"USHORT",value:0},{name:"entrySelector",type:"USHORT",value:0},{name:"rangeShift",type:"USHORT",value:0}]);for(t.segments=[],a=0;a<e.length;a+=1){for(var r=e[a],n=0;n<r.unicodes.length;n+=1)addSegment(t,r.unicodes[n],a);t.segments=t.segments.sort(function(e,a){return e.start-a.start})}addTerminatorSegment(t);var s;s=t.segments.length,t.segCountX2=2*s,t.searchRange=2*Math.pow(2,Math.floor(Math.log(s)/Math.log(2))),t.entrySelector=Math.log(t.searchRange/2)/Math.log(2),t.rangeShift=t.segCountX2-t.searchRange;var l=[],o=[],p=[],g=[],m=[];for(a=0;s>a;a+=1){var u=t.segments[a];l=l.concat({name:"end_"+a,type:"USHORT",value:u.end}),o=o.concat({name:"start_"+a,type:"USHORT",value:u.start}),p=p.concat({name:"idDelta_"+a,type:"SHORT",value:u.delta}),g=g.concat({name:"idRangeOffset_"+a,type:"USHORT",value:u.offset}),void 0!==u.glyphId&&(m=m.concat({name:"glyph_"+a,type:"USHORT",value:u.glyphId}))}return t.fields=t.fields.concat(l),t.fields.push({name:"reservedPad",type:"USHORT",value:0}),t.fields=t.fields.concat(o),t.fields=t.fields.concat(p),t.fields=t.fields.concat(g),t.fields=t.fields.concat(m),t.length=14+2*l.length+2+2*o.length+2*p.length+2*g.length+2*m.length,t}var check=require("../check"),parse=require("../parse"),table=require("../table");exports.parse=parseCmapTable,exports.make=makeCmapTable;


},{"../check":1,"../parse":7,"../table":9}],12:[function(require,module,exports){
"use strict";function parseGlyphCoordinate(r,e,t,o,n){var a;return(e&o)>0?(a=r.parseByte(),0===(e&n)&&(a=-a),a=t+a):a=(e&n)>0?t:t+r.parseShort(),a}function parseGlyph(r,e,t,o){var n=new parse.Parser(r,e),a=new _glyph.Glyph({font:o,index:t});a.numberOfContours=n.parseShort(),a.xMin=n.parseShort(),a.yMin=n.parseShort(),a.xMax=n.parseShort(),a.yMax=n.parseShort();var s,p;if(a.numberOfContours>0){var u,i=a.endPointIndices=[];for(u=0;u<a.numberOfContours;u+=1)i.push(n.parseUShort());for(a.instructionLength=n.parseUShort(),a.instructions=[],u=0;u<a.instructionLength;u+=1)a.instructions.push(n.parseByte());var l=i[i.length-1]+1;for(s=[],u=0;l>u;u+=1)if(p=n.parseByte(),s.push(p),(8&p)>0)for(var h=n.parseByte(),f=0;h>f;f+=1)s.push(p),u+=1;if(check.argument(s.length===l,"Bad flags."),i.length>0){var y,c=[];if(l>0){for(u=0;l>u;u+=1)p=s[u],y={},y.onCurve=!!(1&p),y.lastPointOfContour=i.indexOf(u)>=0,c.push(y);var v=0;for(u=0;l>u;u+=1)p=s[u],y=c[u],y.x=parseGlyphCoordinate(n,p,v,2,16),v=y.x;var x=0;for(u=0;l>u;u+=1)p=s[u],y=c[u],y.y=parseGlyphCoordinate(n,p,x,4,32),x=y.y}a.points=c}else a.points=[]}else if(0===a.numberOfContours)a.points=[];else{a.isComposite=!0,a.points=[],a.components=[];for(var C=!0;C;){s=n.parseUShort();var g={glyphIndex:n.parseUShort(),xScale:1,scale01:0,scale10:0,yScale:1,dx:0,dy:0};(1&s)>0?(g.dx=n.parseShort(),g.dy=n.parseShort()):(g.dx=n.parseChar(),g.dy=n.parseChar()),(8&s)>0?g.xScale=g.yScale=n.parseF2Dot14():(64&s)>0?(g.xScale=n.parseF2Dot14(),g.yScale=n.parseF2Dot14()):(128&s)>0&&(g.xScale=n.parseF2Dot14(),g.scale01=n.parseF2Dot14(),g.scale10=n.parseF2Dot14(),g.yScale=n.parseF2Dot14()),a.components.push(g),C=!!(32&s)}}return a}function transformPoints(r,e){for(var t=[],o=0;o<r.length;o+=1){var n=r[o],a={x:e.xScale*n.x+e.scale01*n.y+e.dx,y:e.scale10*n.x+e.yScale*n.y+e.dy,onCurve:n.onCurve,lastPointOfContour:n.lastPointOfContour};t.push(a)}return t}function getContours(r){for(var e=[],t=[],o=0;o<r.length;o+=1){var n=r[o];t.push(n),n.lastPointOfContour&&(e.push(t),t=[])}return check.argument(0===t.length,"There are still points left in the current contour."),e}function getPath(r){var e=new path.Path;if(!r)return e;for(var t=getContours(r),o=0;o<t.length;o+=1){var n,a,s=t[o],p=s[0],u=s[s.length-1];p.onCurve?(n=null,a=!0):(p=u.onCurve?u:{x:(p.x+u.x)/2,y:(p.y+u.y)/2},n=p,a=!1),e.moveTo(p.x,p.y);for(var i=a?1:0;i<s.length;i+=1){var l=s[i],h=0===i?p:s[i-1];if(h.onCurve&&l.onCurve)e.lineTo(l.x,l.y);else if(h.onCurve&&!l.onCurve)n=l;else if(h.onCurve||l.onCurve){if(h.onCurve||!l.onCurve)throw new Error("Invalid state.");e.quadraticCurveTo(n.x,n.y,l.x,l.y),n=null}else{var f={x:(h.x+l.x)/2,y:(h.y+l.y)/2};e.quadraticCurveTo(h.x,h.y,f.x,f.y),n=l}}p!==u&&(n?e.quadraticCurveTo(n.x,n.y,p.x,p.y):e.lineTo(p.x,p.y))}return e.closePath(),e}function parseGlyfTable(r,e,t,o){var n,a=[];for(n=0;n<t.length-1;n+=1){var s=t[n],p=t[n+1];a.push(s!==p?parseGlyph(r,e+s,n,o):new _glyph.Glyph({font:o,index:n}))}for(n=0;n<a.length;n+=1){var u=a[n];if(u.isComposite)for(var i=0;i<u.components.length;i+=1){var l=u.components[i],h=a[l.glyphIndex];if(h.points){var f=transformPoints(h.points,l);u.points=u.points.concat(f)}}u.path=getPath(u.points)}return a}var check=require("../check"),_glyph=require("../glyph"),parse=require("../parse"),path=require("../path");exports.parse=parseGlyfTable;


},{"../check":1,"../glyph":5,"../parse":7,"../path":8}],13:[function(require,module,exports){
"use strict";function parseTaggedListTable(r,e){for(var a=new parse.Parser(r,e),s=a.parseUShort(),t=[],o=0;s>o;o++)t[a.parseTag()]={offset:a.parseUShort()};return t}function parseCoverageTable(r,e){var a=new parse.Parser(r,e),s=a.parseUShort(),t=a.parseUShort();if(1===s)return a.parseUShortList(t);if(2===s){for(var o=[];t--;)for(var p=a.parseUShort(),n=a.parseUShort(),f=a.parseUShort(),i=p;n>=i;i++)o[f++]=i;return o}}function parseClassDefTable(r,e){var a=new parse.Parser(r,e),s=a.parseUShort();if(1===s){var t=a.parseUShort(),o=a.parseUShort(),p=a.parseUShortList(o);return function(r){return p[r-t]||0}}if(2===s){for(var n=a.parseUShort(),f=[],i=[],h=[],S=0;n>S;S++)f[S]=a.parseUShort(),i[S]=a.parseUShort(),h[S]=a.parseUShort();return function(r){for(var e=0,a=f.length-1;a>e;){var s=e+a+1>>1;r<f[s]?a=s-1:e=s}return f[e]<=r&&r<=i[e]?h[e]||0:0}}}function parsePairPosSubTable(r,e){var a,s,t=new parse.Parser(r,e),o=t.parseUShort(),p=t.parseUShort(),n=parseCoverageTable(r,e+p),f=t.parseUShort(),i=t.parseUShort();if(4===f&&0===i){var h={};if(1===o){for(var S=t.parseUShort(),u=[],v=t.parseOffset16List(S),U=0;S>U;U++){var l=v[U],g=h[l];if(!g){g={},t.relativeOffset=l;for(var T=t.parseUShort();T--;){var c=t.parseUShort();f&&(a=t.parseShort()),i&&(s=t.parseShort()),g[c]=a}}u[n[U]]=g}return function(r,e){var a=u[r];return a?a[e]:void 0}}if(2===o){for(var b=t.parseUShort(),P=t.parseUShort(),L=t.parseUShort(),k=t.parseUShort(),d=parseClassDefTable(r,e+b),w=parseClassDefTable(r,e+P),O=[],C=0;L>C;C++)for(var G=O[C]=[],K=0;k>K;K++)f&&(a=t.parseShort()),i&&(s=t.parseShort()),G[K]=a;var V={};for(C=0;C<n.length;C++)V[n[C]]=1;return function(r,e){if(V[r]){var a=d(r),s=w(e),t=O[a];return t?t[s]:void 0}}}}}function parseLookupTable(r,e){var a=new parse.Parser(r,e),s=a.parseUShort(),t=a.parseUShort(),o=16&t,p=a.parseUShort(),n=a.parseOffset16List(p),f={lookupType:s,lookupFlag:t,markFilteringSet:o?a.parseUShort():-1};if(2===s){for(var i=[],h=0;p>h;h++)i.push(parsePairPosSubTable(r,e+n[h]));f.getKerningValue=function(r,e){for(var a=i.length;a--;){var s=i[a](r,e);if(void 0!==s)return s}return 0}}return f}function parseGposTable(r,e,a){var s=new parse.Parser(r,e),t=s.parseFixed();check.argument(1===t,"Unsupported GPOS table version."),parseTaggedListTable(r,e+s.parseUShort()),parseTaggedListTable(r,e+s.parseUShort());var o=s.parseUShort();s.relativeOffset=o;for(var p=s.parseUShort(),n=s.parseOffset16List(p),f=e+o,i=0;p>i;i++){var h=parseLookupTable(r,f+n[i]);2!==h.lookupType||a.getGposKerningValue||(a.getGposKerningValue=h.getKerningValue)}}var check=require("../check"),parse=require("../parse");exports.parse=parseGposTable;


},{"../check":1,"../parse":7}],14:[function(require,module,exports){
"use strict";function parseHeadTable(e,a){var r={},t=new parse.Parser(e,a);return r.version=t.parseVersion(),r.fontRevision=Math.round(1e3*t.parseFixed())/1e3,r.checkSumAdjustment=t.parseULong(),r.magicNumber=t.parseULong(),check.argument(1594834165===r.magicNumber,"Font header has wrong magic number."),r.flags=t.parseUShort(),r.unitsPerEm=t.parseUShort(),r.created=t.parseLongDateTime(),r.modified=t.parseLongDateTime(),r.xMin=t.parseShort(),r.yMin=t.parseShort(),r.xMax=t.parseShort(),r.yMax=t.parseShort(),r.macStyle=t.parseUShort(),r.lowestRecPPEM=t.parseUShort(),r.fontDirectionHint=t.parseShort(),r.indexToLocFormat=t.parseShort(),r.glyphDataFormat=t.parseShort(),r}function makeHeadTable(e){return new table.Table("head",[{name:"version",type:"FIXED",value:65536},{name:"fontRevision",type:"FIXED",value:65536},{name:"checkSumAdjustment",type:"ULONG",value:0},{name:"magicNumber",type:"ULONG",value:1594834165},{name:"flags",type:"USHORT",value:0},{name:"unitsPerEm",type:"USHORT",value:1e3},{name:"created",type:"LONGDATETIME",value:0},{name:"modified",type:"LONGDATETIME",value:0},{name:"xMin",type:"SHORT",value:0},{name:"yMin",type:"SHORT",value:0},{name:"xMax",type:"SHORT",value:0},{name:"yMax",type:"SHORT",value:0},{name:"macStyle",type:"USHORT",value:0},{name:"lowestRecPPEM",type:"USHORT",value:0},{name:"fontDirectionHint",type:"SHORT",value:2},{name:"indexToLocFormat",type:"SHORT",value:0},{name:"glyphDataFormat",type:"SHORT",value:0}],e)}var check=require("../check"),parse=require("../parse"),table=require("../table");exports.parse=parseHeadTable,exports.make=makeHeadTable;


},{"../check":1,"../parse":7,"../table":9}],15:[function(require,module,exports){
"use strict";function parseHheaTable(e,a){var r={},t=new parse.Parser(e,a);return r.version=t.parseVersion(),r.ascender=t.parseShort(),r.descender=t.parseShort(),r.lineGap=t.parseShort(),r.advanceWidthMax=t.parseUShort(),r.minLeftSideBearing=t.parseShort(),r.minRightSideBearing=t.parseShort(),r.xMaxExtent=t.parseShort(),r.caretSlopeRise=t.parseShort(),r.caretSlopeRun=t.parseShort(),r.caretOffset=t.parseShort(),t.relativeOffset+=8,r.metricDataFormat=t.parseShort(),r.numberOfHMetrics=t.parseUShort(),r}function makeHheaTable(e){return new table.Table("hhea",[{name:"version",type:"FIXED",value:65536},{name:"ascender",type:"FWORD",value:0},{name:"descender",type:"FWORD",value:0},{name:"lineGap",type:"FWORD",value:0},{name:"advanceWidthMax",type:"UFWORD",value:0},{name:"minLeftSideBearing",type:"FWORD",value:0},{name:"minRightSideBearing",type:"FWORD",value:0},{name:"xMaxExtent",type:"FWORD",value:0},{name:"caretSlopeRise",type:"SHORT",value:1},{name:"caretSlopeRun",type:"SHORT",value:0},{name:"caretOffset",type:"SHORT",value:0},{name:"reserved1",type:"SHORT",value:0},{name:"reserved2",type:"SHORT",value:0},{name:"reserved3",type:"SHORT",value:0},{name:"reserved4",type:"SHORT",value:0},{name:"metricDataFormat",type:"SHORT",value:0},{name:"numberOfHMetrics",type:"USHORT",value:0}],e)}var parse=require("../parse"),table=require("../table");exports.parse=parseHheaTable,exports.make=makeHheaTable;


},{"../parse":7,"../table":9}],16:[function(require,module,exports){
"use strict";function parseHmtxTable(e,a,r,t,s){for(var i,l,n=new parse.Parser(e,a),p=0;t>p;p+=1){r>p&&(i=n.parseUShort(),l=n.parseShort());var d=s[p];d.advanceWidth=i,d.leftSideBearing=l}}function makeHmtxTable(e){for(var a=new table.Table("hmtx",[]),r=0;r<e.length;r+=1){var t=e[r],s=t.advanceWidth||0,i=t.leftSideBearing||0;a.fields.push({name:"advanceWidth_"+r,type:"USHORT",value:s}),a.fields.push({name:"leftSideBearing_"+r,type:"SHORT",value:i})}return a}var parse=require("../parse"),table=require("../table");exports.parse=parseHmtxTable,exports.make=makeHmtxTable;


},{"../parse":7,"../table":9}],17:[function(require,module,exports){
"use strict";function parseKernTable(r,e){var a={},s=new parse.Parser(r,e),p=s.parseUShort();check.argument(0===p,"Unsupported kern table version."),s.skip("uShort",1);var t=s.parseUShort();check.argument(0===t,"Unsupported kern sub-table version."),s.skip("uShort",2);var o=s.parseUShort();s.skip("uShort",3);for(var n=0;o>n;n+=1){var h=s.parseUShort(),u=s.parseUShort(),c=s.parseShort();a[h+","+u]=c}return a}var check=require("../check"),parse=require("../parse");exports.parse=parseKernTable;


},{"../check":1,"../parse":7}],18:[function(require,module,exports){
"use strict";function parseLocaTable(r,a,e,s){for(var p=new parse.Parser(r,a),o=s?p.parseUShort:p.parseULong,t=[],c=0;e+1>c;c+=1){var n=o.call(p);s&&(n*=2),t.push(n)}return t}var parse=require("../parse");exports.parse=parseLocaTable;


},{"../parse":7}],19:[function(require,module,exports){
"use strict";function parseMaxpTable(e,a){var r={},s=new parse.Parser(e,a);return r.version=s.parseVersion(),r.numGlyphs=s.parseUShort(),1===r.version&&(r.maxPoints=s.parseUShort(),r.maxContours=s.parseUShort(),r.maxCompositePoints=s.parseUShort(),r.maxCompositeContours=s.parseUShort(),r.maxZones=s.parseUShort(),r.maxTwilightPoints=s.parseUShort(),r.maxStorage=s.parseUShort(),r.maxFunctionDefs=s.parseUShort(),r.maxInstructionDefs=s.parseUShort(),r.maxStackElements=s.parseUShort(),r.maxSizeOfInstructions=s.parseUShort(),r.maxComponentElements=s.parseUShort(),r.maxComponentDepth=s.parseUShort()),r}function makeMaxpTable(e){return new table.Table("maxp",[{name:"version",type:"FIXED",value:20480},{name:"numGlyphs",type:"USHORT",value:e}])}var parse=require("../parse"),table=require("../table");exports.parse=parseMaxpTable,exports.make=makeMaxpTable;


},{"../parse":7,"../table":9}],20:[function(require,module,exports){
"use strict";function parseNameTable(e,a){var r={},n=new parse.Parser(e,a);r.format=n.parseUShort();for(var t=n.parseUShort(),s=n.offset+n.parseUShort(),o=0,m=0;t>m;m++){var l=n.parseUShort(),p=n.parseUShort(),u=n.parseUShort(),i=n.parseUShort(),d=nameTableNames[i],c=n.parseUShort(),f=n.parseUShort();if(3===l&&1===p&&1033===u){for(var h=[],T=c/2,g=0;T>g;g++,f+=2)h[g]=parse.getShort(e,s+f);var S=String.fromCharCode.apply(null,h);d?r[d]=S:(o++,r["unknown"+o]=S)}}return 1===r.format&&(r.langTagCount=n.parseUShort()),r}function makeNameRecord(e,a,r,n,t,s){return new table.Table("NameRecord",[{name:"platformID",type:"USHORT",value:e},{name:"encodingID",type:"USHORT",value:a},{name:"languageID",type:"USHORT",value:r},{name:"nameID",type:"USHORT",value:n},{name:"length",type:"USHORT",value:t},{name:"offset",type:"USHORT",value:s}])}function addMacintoshNameRecord(e,a,r,n){var t=encode.STRING(r);return e.records.push(makeNameRecord(1,0,0,a,t.length,n)),e.strings.push(t),n+=t.length}function addWindowsNameRecord(e,a,r,n){var t=encode.UTF16(r);return e.records.push(makeNameRecord(3,1,1033,a,t.length,n)),e.strings.push(t),n+=t.length}function makeNameTable(e){var a=new table.Table("name",[{name:"format",type:"USHORT",value:0},{name:"count",type:"USHORT",value:0},{name:"stringOffset",type:"USHORT",value:0}]);a.records=[],a.strings=[];var r,n,t=0;for(r=0;r<nameTableNames.length;r+=1)void 0!==e[nameTableNames[r]]&&(n=e[nameTableNames[r]],t=addMacintoshNameRecord(a,r,n,t));for(r=0;r<nameTableNames.length;r+=1)void 0!==e[nameTableNames[r]]&&(n=e[nameTableNames[r]],t=addWindowsNameRecord(a,r,n,t));for(a.count=a.records.length,a.stringOffset=6+12*a.count,r=0;r<a.records.length;r+=1)a.fields.push({name:"record_"+r,type:"TABLE",value:a.records[r]});for(r=0;r<a.strings.length;r+=1)a.fields.push({name:"string_"+r,type:"LITERAL",value:a.strings[r]});return a}var encode=require("../types").encode,parse=require("../parse"),table=require("../table"),nameTableNames=["copyright","fontFamily","fontSubfamily","uniqueID","fullName","version","postScriptName","trademark","manufacturer","designer","description","manufacturerURL","designerURL","licence","licenceURL","reserved","preferredFamily","preferredSubfamily","compatibleFullName","sampleText","postScriptFindFontName","wwsFamily","wwsSubfamily"];exports.parse=parseNameTable,exports.make=makeNameTable;


},{"../parse":7,"../table":9,"../types":24}],21:[function(require,module,exports){
"use strict";function getUnicodeRange(e){for(var n=0;n<unicodeRanges.length;n+=1){var a=unicodeRanges[n];if(e>=a.begin&&e<a.end)return n}return-1}function parseOS2Table(e,n){var a={},i=new parse.Parser(e,n);a.version=i.parseUShort(),a.xAvgCharWidth=i.parseShort(),a.usWeightClass=i.parseUShort(),a.usWidthClass=i.parseUShort(),a.fsType=i.parseUShort(),a.ySubscriptXSize=i.parseShort(),a.ySubscriptYSize=i.parseShort(),a.ySubscriptXOffset=i.parseShort(),a.ySubscriptYOffset=i.parseShort(),a.ySuperscriptXSize=i.parseShort(),a.ySuperscriptYSize=i.parseShort(),a.ySuperscriptXOffset=i.parseShort(),a.ySuperscriptYOffset=i.parseShort(),a.yStrikeoutSize=i.parseShort(),a.yStrikeoutPosition=i.parseShort(),a.sFamilyClass=i.parseShort(),a.panose=[];for(var t=0;10>t;t++)a.panose[t]=i.parseByte();return a.ulUnicodeRange1=i.parseULong(),a.ulUnicodeRange2=i.parseULong(),a.ulUnicodeRange3=i.parseULong(),a.ulUnicodeRange4=i.parseULong(),a.achVendID=String.fromCharCode(i.parseByte(),i.parseByte(),i.parseByte(),i.parseByte()),a.fsSelection=i.parseUShort(),a.usFirstCharIndex=i.parseUShort(),a.usLastCharIndex=i.parseUShort(),a.sTypoAscender=i.parseShort(),a.sTypoDescender=i.parseShort(),a.sTypoLineGap=i.parseShort(),a.usWinAscent=i.parseUShort(),a.usWinDescent=i.parseUShort(),a.version>=1&&(a.ulCodePageRange1=i.parseULong(),a.ulCodePageRange2=i.parseULong()),a.version>=2&&(a.sxHeight=i.parseShort(),a.sCapHeight=i.parseShort(),a.usDefaultChar=i.parseUShort(),a.usBreakChar=i.parseUShort(),a.usMaxContent=i.parseUShort()),a}function makeOS2Table(e){return new table.Table("OS/2",[{name:"version",type:"USHORT",value:3},{name:"xAvgCharWidth",type:"SHORT",value:0},{name:"usWeightClass",type:"USHORT",value:0},{name:"usWidthClass",type:"USHORT",value:0},{name:"fsType",type:"USHORT",value:0},{name:"ySubscriptXSize",type:"SHORT",value:650},{name:"ySubscriptYSize",type:"SHORT",value:699},{name:"ySubscriptXOffset",type:"SHORT",value:0},{name:"ySubscriptYOffset",type:"SHORT",value:140},{name:"ySuperscriptXSize",type:"SHORT",value:650},{name:"ySuperscriptYSize",type:"SHORT",value:699},{name:"ySuperscriptXOffset",type:"SHORT",value:0},{name:"ySuperscriptYOffset",type:"SHORT",value:479},{name:"yStrikeoutSize",type:"SHORT",value:49},{name:"yStrikeoutPosition",type:"SHORT",value:258},{name:"sFamilyClass",type:"SHORT",value:0},{name:"bFamilyType",type:"BYTE",value:0},{name:"bSerifStyle",type:"BYTE",value:0},{name:"bWeight",type:"BYTE",value:0},{name:"bProportion",type:"BYTE",value:0},{name:"bContrast",type:"BYTE",value:0},{name:"bStrokeVariation",type:"BYTE",value:0},{name:"bArmStyle",type:"BYTE",value:0},{name:"bLetterform",type:"BYTE",value:0},{name:"bMidline",type:"BYTE",value:0},{name:"bXHeight",type:"BYTE",value:0},{name:"ulUnicodeRange1",type:"ULONG",value:0},{name:"ulUnicodeRange2",type:"ULONG",value:0},{name:"ulUnicodeRange3",type:"ULONG",value:0},{name:"ulUnicodeRange4",type:"ULONG",value:0},{name:"achVendID",type:"CHARARRAY",value:"XXXX"},{name:"fsSelection",type:"USHORT",value:0},{name:"usFirstCharIndex",type:"USHORT",value:0},{name:"usLastCharIndex",type:"USHORT",value:0},{name:"sTypoAscender",type:"SHORT",value:0},{name:"sTypoDescender",type:"SHORT",value:0},{name:"sTypoLineGap",type:"SHORT",value:0},{name:"usWinAscent",type:"USHORT",value:0},{name:"usWinDescent",type:"USHORT",value:0},{name:"ulCodePageRange1",type:"ULONG",value:0},{name:"ulCodePageRange2",type:"ULONG",value:0},{name:"sxHeight",type:"SHORT",value:0},{name:"sCapHeight",type:"SHORT",value:0},{name:"usDefaultChar",type:"USHORT",value:0},{name:"usBreakChar",type:"USHORT",value:0},{name:"usMaxContext",type:"USHORT",value:0}],e)}var parse=require("../parse"),table=require("../table"),unicodeRanges=[{begin:0,end:127},{begin:128,end:255},{begin:256,end:383},{begin:384,end:591},{begin:592,end:687},{begin:688,end:767},{begin:768,end:879},{begin:880,end:1023},{begin:11392,end:11519},{begin:1024,end:1279},{begin:1328,end:1423},{begin:1424,end:1535},{begin:42240,end:42559},{begin:1536,end:1791},{begin:1984,end:2047},{begin:2304,end:2431},{begin:2432,end:2559},{begin:2560,end:2687},{begin:2688,end:2815},{begin:2816,end:2943},{begin:2944,end:3071},{begin:3072,end:3199},{begin:3200,end:3327},{begin:3328,end:3455},{begin:3584,end:3711},{begin:3712,end:3839},{begin:4256,end:4351},{begin:6912,end:7039},{begin:4352,end:4607},{begin:7680,end:7935},{begin:7936,end:8191},{begin:8192,end:8303},{begin:8304,end:8351},{begin:8352,end:8399},{begin:8400,end:8447},{begin:8448,end:8527},{begin:8528,end:8591},{begin:8592,end:8703},{begin:8704,end:8959},{begin:8960,end:9215},{begin:9216,end:9279},{begin:9280,end:9311},{begin:9312,end:9471},{begin:9472,end:9599},{begin:9600,end:9631},{begin:9632,end:9727},{begin:9728,end:9983},{begin:9984,end:10175},{begin:12288,end:12351},{begin:12352,end:12447},{begin:12448,end:12543},{begin:12544,end:12591},{begin:12592,end:12687},{begin:43072,end:43135},{begin:12800,end:13055},{begin:13056,end:13311},{begin:44032,end:55215},{begin:55296,end:57343},{begin:67840,end:67871},{begin:19968,end:40959},{begin:57344,end:63743},{begin:12736,end:12783},{begin:64256,end:64335},{begin:64336,end:65023},{begin:65056,end:65071},{begin:65040,end:65055},{begin:65104,end:65135},{begin:65136,end:65279},{begin:65280,end:65519},{begin:65520,end:65535},{begin:3840,end:4095},{begin:1792,end:1871},{begin:1920,end:1983},{begin:3456,end:3583},{begin:4096,end:4255},{begin:4608,end:4991},{begin:5024,end:5119},{begin:5120,end:5759},{begin:5760,end:5791},{begin:5792,end:5887},{begin:6016,end:6143},{begin:6144,end:6319},{begin:10240,end:10495},{begin:40960,end:42127},{begin:5888,end:5919},{begin:66304,end:66351},{begin:66352,end:66383},{begin:66560,end:66639},{begin:118784,end:119039},{begin:119808,end:120831},{begin:1044480,end:1048573},{begin:65024,end:65039},{begin:917504,end:917631},{begin:6400,end:6479},{begin:6480,end:6527},{begin:6528,end:6623},{begin:6656,end:6687},{begin:11264,end:11359},{begin:11568,end:11647},{begin:19904,end:19967},{begin:43008,end:43055},{begin:65536,end:65663},{begin:65856,end:65935},{begin:66432,end:66463},{begin:66464,end:66527},{begin:66640,end:66687},{begin:66688,end:66735},{begin:67584,end:67647},{begin:68096,end:68191},{begin:119552,end:119647},{begin:73728,end:74751},{begin:119648,end:119679},{begin:7040,end:7103},{begin:7168,end:7247},{begin:7248,end:7295},{begin:43136,end:43231},{begin:43264,end:43311},{begin:43312,end:43359},{begin:43520,end:43615},{begin:65936,end:65999},{begin:66e3,end:66047},{begin:66208,end:66271},{begin:127024,end:127135}];exports.unicodeRanges=unicodeRanges,exports.getUnicodeRange=getUnicodeRange,exports.parse=parseOS2Table,exports.make=makeOS2Table;


},{"../parse":7,"../table":9}],22:[function(require,module,exports){
"use strict";function parsePostTable(e,a){var r,n={},s=new parse.Parser(e,a);switch(n.version=s.parseVersion(),n.italicAngle=s.parseFixed(),n.underlinePosition=s.parseShort(),n.underlineThickness=s.parseShort(),n.isFixedPitch=s.parseULong(),n.minMemType42=s.parseULong(),n.maxMemType42=s.parseULong(),n.minMemType1=s.parseULong(),n.maxMemType1=s.parseULong(),n.version){case 1:n.names=encoding.standardNames.slice();break;case 2:for(n.numberOfGlyphs=s.parseUShort(),n.glyphNameIndex=new Array(n.numberOfGlyphs),r=0;r<n.numberOfGlyphs;r++)n.glyphNameIndex[r]=s.parseUShort();for(n.names=[],r=0;r<n.numberOfGlyphs;r++)if(n.glyphNameIndex[r]>=encoding.standardNames.length){var p=s.parseChar();n.names.push(s.parseString(p))}break;case 2.5:for(n.numberOfGlyphs=s.parseUShort(),n.offset=new Array(n.numberOfGlyphs),r=0;r<n.numberOfGlyphs;r++)n.offset[r]=s.parseChar()}return n}function makePostTable(){return new table.Table("post",[{name:"version",type:"FIXED",value:196608},{name:"italicAngle",type:"FIXED",value:0},{name:"underlinePosition",type:"FWORD",value:0},{name:"underlineThickness",type:"FWORD",value:0},{name:"isFixedPitch",type:"ULONG",value:0},{name:"minMemType42",type:"ULONG",value:0},{name:"maxMemType42",type:"ULONG",value:0},{name:"minMemType1",type:"ULONG",value:0},{name:"maxMemType1",type:"ULONG",value:0}])}var encoding=require("../encoding"),parse=require("../parse"),table=require("../table");exports.parse=parsePostTable,exports.make=makePostTable;


},{"../encoding":3,"../parse":7,"../table":9}],23:[function(require,module,exports){
"use strict";function log2(e){return Math.log(e)/Math.log(2)|0}function computeCheckSum(e){for(;e.length%4!==0;)e.push(0);for(var a=0,n=0;n<e.length;n+=4)a+=(e[n]<<24)+(e[n+1]<<16)+(e[n+2]<<8)+e[n+3];return a%=Math.pow(2,32)}function makeTableRecord(e,a,n,r){return new table.Table("Table Record",[{name:"tag",type:"TAG",value:void 0!==e?e:""},{name:"checkSum",type:"ULONG",value:void 0!==a?a:0},{name:"offset",type:"ULONG",value:void 0!==n?n:0},{name:"length",type:"ULONG",value:void 0!==r?r:0}])}function makeSfntTable(e){var a=new table.Table("sfnt",[{name:"version",type:"TAG",value:"OTTO"},{name:"numTables",type:"USHORT",value:0},{name:"searchRange",type:"USHORT",value:0},{name:"entrySelector",type:"USHORT",value:0},{name:"rangeShift",type:"USHORT",value:0}]);a.tables=e,a.numTables=e.length;var n=Math.pow(2,log2(a.numTables));a.searchRange=16*n,a.entrySelector=log2(n),a.rangeShift=16*a.numTables-a.searchRange;for(var r=[],t=[],i=a.sizeOf()+makeTableRecord().sizeOf()*a.numTables;i%4!==0;)i+=1,t.push({name:"padding",type:"BYTE",value:0});for(var l=0;l<e.length;l+=1){var s=e[l];check.argument(4===s.tableName.length,"Table name"+s.tableName+" is invalid.");var m=s.sizeOf(),u=makeTableRecord(s.tableName,computeCheckSum(s.encode()),i,m);for(r.push({name:u.tag+" Table Record",type:"TABLE",value:u}),t.push({name:s.tableName+" table",type:"TABLE",value:s}),i+=m,check.argument(!isNaN(i),"Something went wrong calculating the offset.");i%4!==0;)i+=1,t.push({name:"padding",type:"BYTE",value:0})}return r.sort(function(e,a){return e.value.tag>a.value.tag?1:-1}),a.fields=a.fields.concat(r),a.fields=a.fields.concat(t),a}function metricsForChar(e,a,n){for(var r=0;r<a.length;r+=1){var t=e.charToGlyphIndex(a[r]);if(t>0){var i=e.glyphs[t];return i.getMetrics()}}return n}function average(e){for(var a=0,n=0;n<e.length;n+=1)a+=e[n];return a/e.length}function fontToSfntTable(e){for(var a=[],n=[],r=[],t=[],i=[],l=[],s=[],m=null,u=0,c=0,h=0,o=0,d=0,p=0;p<e.glyphs.length;p+=1){var f=e.glyphs[p],g=0|f.unicode;(m>g||null===m)&&(m=g),g>u&&(u=g);var y=os2.getUnicodeRange(g);if(32>y)c|=1<<y;else if(64>y)h|=1<<y-32;else if(96>y)o|=1<<y-64;else{if(!(123>y))throw new Error("Unicode ranges bits > 123 are reserved for internal usage");d|=1<<y-96}if(".notdef"!==f.name){var v=f.getMetrics();a.push(v.xMin),n.push(v.yMin),r.push(v.xMax),t.push(v.yMax),l.push(v.leftSideBearing),s.push(v.rightSideBearing),i.push(f.advanceWidth)}}var x={xMin:Math.min.apply(null,a),yMin:Math.min.apply(null,n),xMax:Math.max.apply(null,r),yMax:Math.max.apply(null,t),advanceWidthMax:Math.max.apply(null,i),advanceWidthAvg:average(i),minLeftSideBearing:Math.min.apply(null,l),maxLeftSideBearing:Math.max.apply(null,l),minRightSideBearing:Math.min.apply(null,s)};x.ascender=void 0!==e.ascender?e.ascender:x.yMax,x.descender=void 0!==e.descender?e.descender:x.yMin;var M=head.make({unitsPerEm:e.unitsPerEm,xMin:x.xMin,yMin:x.yMin,xMax:x.xMax,yMax:x.yMax}),T=hhea.make({ascender:x.ascender,descender:x.descender,advanceWidthMax:x.advanceWidthMax,minLeftSideBearing:x.minLeftSideBearing,minRightSideBearing:x.minRightSideBearing,xMaxExtent:x.maxLeftSideBearing+(x.xMax-x.xMin),numberOfHMetrics:e.glyphs.length}),S=maxp.make(e.glyphs.length),b=os2.make({xAvgCharWidth:Math.round(x.advanceWidthAvg),usWeightClass:500,usWidthClass:5,usFirstCharIndex:m,usLastCharIndex:u,ulUnicodeRange1:c,ulUnicodeRange2:h,ulUnicodeRange3:o,ulUnicodeRange4:d,sTypoAscender:x.ascender,sTypoDescender:x.descender,sTypoLineGap:0,usWinAscent:x.ascender,usWinDescent:-x.descender,sxHeight:metricsForChar(e,"xyvw",{yMax:0}).yMax,sCapHeight:metricsForChar(e,"HIKLEFJMNTZBDPRAGOQSUVWXY",x).yMax,usBreakChar:e.hasChar(" ")?32:0}),k=hmtx.make(e.glyphs),R=cmap.make(e.glyphs),N=e.familyName+" "+e.styleName,U=e.familyName.replace(/\s/g,"")+"-"+e.styleName,L=_name.make({copyright:e.copyright,fontFamily:e.familyName,fontSubfamily:e.styleName,uniqueID:e.manufacturer+":"+N,fullName:N,version:e.version,postScriptName:U,trademark:e.trademark,manufacturer:e.manufacturer,designer:e.designer,description:e.description,manufacturerURL:e.manufacturerURL,designerURL:e.designerURL,license:e.license,licenseURL:e.licenseURL,preferredFamily:e.familyName,preferredSubfamily:e.styleName}),C=post.make(),B=cff.make(e.glyphs,{version:e.version,fullName:N,familyName:e.familyName,weightName:e.styleName,postScriptName:U}),O=[M,T,S,b,L,R,C,B,k],w=makeSfntTable(O),q=w.encode(),W=computeCheckSum(q),A=w.fields,E=!1;for(p=0;p<A.length;p+=1)if("head table"===A[p].name){A[p].value.checkSumAdjustment=2981146554-W,E=!0;break}if(!E)throw new Error("Could not find head table with checkSum to adjust.");return w}var check=require("../check"),table=require("../table"),cmap=require("./cmap"),cff=require("./cff"),head=require("./head"),hhea=require("./hhea"),hmtx=require("./hmtx"),maxp=require("./maxp"),_name=require("./name"),os2=require("./os2"),post=require("./post");exports.computeCheckSum=computeCheckSum,exports.make=makeSfntTable,exports.fontToTable=fontToSfntTable;


},{"../check":1,"../table":9,"./cff":10,"./cmap":11,"./head":14,"./hhea":15,"./hmtx":16,"./maxp":19,"./name":20,"./os2":21,"./post":22}],24:[function(require,module,exports){
"use strict";function constant(e){return function(){return e}}var check=require("./check"),LIMIT16=32768,LIMIT32=2147483648,decode={},encode={},sizeOf={};encode.BYTE=function(e){return check.argument(e>=0&&255>=e,"Byte value should be between 0 and 255."),[e]},sizeOf.BYTE=constant(1),encode.CHAR=function(e){return[e.charCodeAt(0)]},sizeOf.BYTE=constant(1),encode.CHARARRAY=function(e){for(var n=[],o=0;o<e.length;o+=1)n.push(e.charCodeAt(o));return n},sizeOf.CHARARRAY=function(e){return e.length},encode.USHORT=function(e){return[e>>8&255,255&e]},sizeOf.USHORT=constant(2),encode.SHORT=function(e){return e>=LIMIT16&&(e=-(2*LIMIT16-e)),[e>>8&255,255&e]},sizeOf.SHORT=constant(2),encode.UINT24=function(e){return[e>>16&255,e>>8&255,255&e]},sizeOf.UINT24=constant(3),encode.ULONG=function(e){return[e>>24&255,e>>16&255,e>>8&255,255&e]},sizeOf.ULONG=constant(4),encode.LONG=function(e){return e>=LIMIT32&&(e=-(2*LIMIT32-e)),[e>>24&255,e>>16&255,e>>8&255,255&e]},sizeOf.LONG=constant(4),encode.FIXED=encode.ULONG,sizeOf.FIXED=sizeOf.ULONG,encode.FWORD=encode.SHORT,sizeOf.FWORD=sizeOf.SHORT,encode.UFWORD=encode.USHORT,sizeOf.UFWORD=sizeOf.USHORT,encode.LONGDATETIME=function(){return[0,0,0,0,0,0,0,0]},sizeOf.LONGDATETIME=constant(8),encode.TAG=function(e){return check.argument(4===e.length,"Tag should be exactly 4 ASCII characters."),[e.charCodeAt(0),e.charCodeAt(1),e.charCodeAt(2),e.charCodeAt(3)]},sizeOf.TAG=constant(4),encode.Card8=encode.BYTE,sizeOf.Card8=sizeOf.BYTE,encode.Card16=encode.USHORT,sizeOf.Card16=sizeOf.USHORT,encode.OffSize=encode.BYTE,sizeOf.OffSize=sizeOf.BYTE,encode.SID=encode.USHORT,sizeOf.SID=sizeOf.USHORT,encode.NUMBER=function(e){return e>=-107&&107>=e?[e+139]:e>=108&&1131>=e?(e-=108,[(e>>8)+247,255&e]):e>=-1131&&-108>=e?(e=-e-108,[(e>>8)+251,255&e]):e>=-32768&&32767>=e?encode.NUMBER16(e):encode.NUMBER32(e)},sizeOf.NUMBER=function(e){return encode.NUMBER(e).length},encode.NUMBER16=function(e){return[28,e>>8&255,255&e]},sizeOf.NUMBER16=constant(2),encode.NUMBER32=function(e){return[29,e>>24&255,e>>16&255,e>>8&255,255&e]},sizeOf.NUMBER32=constant(4),encode.NAME=encode.CHARARRAY,sizeOf.NAME=sizeOf.CHARARRAY,encode.STRING=encode.CHARARRAY,sizeOf.STRING=sizeOf.CHARARRAY,encode.UTF16=function(e){for(var n=[],o=0;o<e.length;o+=1)n.push(0),n.push(e.charCodeAt(o));return n},sizeOf.UTF16=function(e){return 2*e.length},encode.INDEX=function(e){var n,o=1,t=[o],c=[],r=0;for(n=0;n<e.length;n+=1){var f=encode.OBJECT(e[n]);Array.prototype.push.apply(c,f),r+=f.length,o+=f.length,t.push(o)}if(0===c.length)return[0,0];var d=[],i=1+Math.floor(Math.log(r)/Math.log(2))/8|0,u=[void 0,encode.BYTE,encode.USHORT,encode.UINT24,encode.ULONG][i];for(n=0;n<t.length;n+=1){var a=u(t[n]);Array.prototype.push.apply(d,a)}return Array.prototype.concat(encode.Card16(e.length),encode.OffSize(i),d,c)},sizeOf.INDEX=function(e){return encode.INDEX(e).length},encode.DICT=function(e){for(var n=[],o=Object.keys(e),t=o.length,c=0;t>c;c+=1){var r=parseInt(o[c],0),f=e[r];n=n.concat(encode.OPERAND(f.value,f.type)),n=n.concat(encode.OPERATOR(r))}return n},sizeOf.DICT=function(e){return encode.DICT(e).length},encode.OPERATOR=function(e){return 1200>e?[e]:[12,e-1200]},encode.OPERAND=function(e,n){var o=[];if(Array.isArray(n))for(var t=0;t<n.length;t+=1)check.argument(e.length===n.length,"Not enough arguments given for type"+n),o=o.concat(encode.OPERAND(e[t],n[t]));else o=o.concat("SID"===n?encode.NUMBER(e):"offset"===n?encode.NUMBER32(e):encode.NUMBER(e));return o},encode.OP=encode.BYTE,sizeOf.OP=sizeOf.BYTE;var wmm="function"==typeof WeakMap&&new WeakMap;encode.CHARSTRING=function(e){if(wmm&&wmm.has(e))return wmm.get(e);for(var n=[],o=e.length,t=0;o>t;t+=1){var c=e[t];n=n.concat(encode[c.type](c.value))}return wmm&&wmm.set(e,n),n},sizeOf.CHARSTRING=function(e){return encode.CHARSTRING(e).length},encode.OBJECT=function(e){var n=encode[e.type];return check.argument(void 0!==n,"No encoding function for type "+e.type),n(e.value)},encode.TABLE=function(e){for(var n=[],o=e.fields.length,t=0;o>t;t+=1){var c=e.fields[t],r=encode[c.type];check.argument(void 0!==r,"No encoding function for field type "+c.type);var f=e[c.name];void 0===f&&(f=c.value);var d=r(f);n=n.concat(d)}return n},encode.LITERAL=function(e){return e},sizeOf.LITERAL=function(e){return e.length},exports.decode=decode,exports.encode=encode,exports.sizeOf=sizeOf;


},{"./check":1}]},{},[6])(6)
});