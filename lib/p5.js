/*! p5.js v0.4.4 May 26, 2015 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5', [], function () { return (root.returnExportsGlobal = factory());});
  else if (typeof exports === 'object')
    module.exports = factory();
  else
    root['p5'] = factory();
}(this, function () {
var amdclean = {};
amdclean['shim'] = function (require) {
  window.requestDraw = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
  }();
}({});
amdclean['constants'] = function (require) {
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
    LINEAR: 'linear',
    QUADRATIC: 'quadratic',
    BEZIER: 'bezier',
    CURVE: 'curve'
  };
}({});
amdclean['core'] = function (require, shim, constants) {
  'use strict';
  var constants = constants;
  var p5 = function (sketch, node, sync) {
    if (arguments.length === 2 && typeof node === 'boolean') {
      sync = node;
      node = undefined;
    }
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
      this.createCanvas(this._defaultCanvasSize.width, this._defaultCanvasSize.height, true);
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
      this.canvas.style.visibility = '';
      this.canvas.className = this.canvas.className.replace('p5_hidden', '');
      this._setupDone = true;
      this._loadingScreen.parentNode.removeChild(this._loadingScreen);
    }.bind(this);
    this._draw = function () {
      var now = new Date().getTime();
      this._frameRate = 1000 / (now - this._lastFrameTime);
      this._lastFrameTime = now;
      this._setProperty('frameCount', this.frameCount + 1);
      if (this._loop) {
        if (this._drawInterval) {
          clearInterval(this._drawInterval);
        }
        this._drawInterval = setTimeout(function () {
          window.requestDraw(this._draw.bind(this));
        }.bind(this), 1000 / this._targetFrameRate);
      }
      this.redraw();
      this._updatePAccelerations();
      this._updatePMouseCoords();
      this._updatePTouchCoords();
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
}({}, amdclean['shim'], amdclean['constants']);
amdclean['utilscolor_utils'] = function (require, core) {
  var p5 = core;
  p5.ColorUtils = {};
  p5.ColorUtils.hsbaToRGBA = function (hsba) {
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
  p5.ColorUtils.rgbaToHSBA = function (rgba) {
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
  return p5.ColorUtils;
}({}, amdclean['core']);
amdclean['p5Color'] = function (require, core, utilscolor_utils, constants) {
  var p5 = core;
  var color_utils = utilscolor_utils;
  var constants = constants;
  p5.Color = function (pInst, vals) {
    this.color_array = p5.Color._getFormattedColor.apply(pInst, vals);
    this._normalizeColorArray(pInst);
    if (pInst._colorMode === constants.HSB) {
      this.hsba = this.color_array;
      this.rgba = color_utils.hsbaToRGBA(this.hsba);
    } else {
      this.rgba = this.color_array;
      this.hsba = color_utils.rgbaToHSBA(this.rgba);
    }
    return this;
  };
  p5.Color.prototype._normalizeColorArray = function (pInst) {
    var isRGB = pInst._colorMode === constants.RGB;
    var maxArr = isRGB ? pInst._maxRGB : pInst._maxHSB;
    var arr = this.color_array;
    arr[0] *= 255 / maxArr[0];
    arr[1] *= 255 / maxArr[1];
    arr[2] *= 255 / maxArr[2];
    arr[3] *= 255 / maxArr[3];
    return arr;
  };
  p5.Color.prototype.getHue = function () {
    return this.hsba[0];
  };
  p5.Color.prototype.getSaturation = function () {
    return this.hsba[1];
  };
  p5.Color.prototype.getBrightness = function () {
    return this.hsba[2];
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
    return this.rgba[3];
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
      ].join(WHITESPACE.source), 'i')
    };
  p5.Color._getFormattedColor = function () {
    var r, g, b, a, str, vals;
    if (arguments.length >= 3) {
      r = arguments[0];
      g = arguments[1];
      b = arguments[2];
      a = typeof arguments[3] === 'number' ? arguments[3] : 255;
    } else if (typeof arguments[0] === 'string') {
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
      } else {
        vals = [255];
      }
      return p5.Color._getFormattedColor.apply(this, vals);
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
  return p5.Color;
}({}, amdclean['core'], amdclean['utilscolor_utils'], amdclean['constants']);
amdclean['p5Element'] = function (require, core) {
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
}({}, amdclean['core']);
amdclean['p5Graphics'] = function (require, core, constants) {
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
}({}, amdclean['core'], amdclean['constants']);
amdclean['filters'] = function (require) {
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
amdclean['p5Image'] = function (require, core, filters) {
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
}({}, amdclean['core'], amdclean['filters']);
amdclean['p5File'] = function (require, core) {
  var p5 = core;
  p5.File = function (file, pInst) {
    this.file = file;
    this._pInst = pInst;
    var typeList = file.type.split('/');
    this.type = typeList[0];
    this.subtype = typeList[1];
    this.name = file.name;
    this.size = file.size;
    this.data = undefined;
  };
  return p5.File;
}({}, amdclean['core']);
amdclean['polargeometry'] = function (require) {
  return {
    degreesToRadians: function (x) {
      return 2 * Math.PI * x / 360;
    },
    radiansToDegrees: function (x) {
      return 360 * x / (2 * Math.PI);
    }
  };
}({});
amdclean['p5Vector'] = function (require, core, polargeometry, constants) {
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
    if (x instanceof p5.Vector) {
      x = x.x || 0;
      y = x.y || 0;
      z = x.z || 0;
    } else if (x instanceof Array) {
      x = x[0] || 0;
      y = x[1] || 0;
      z = x[2] || 0;
    } else {
      x = x || 0;
      y = y || 0;
      z = z || 0;
    }
    return this.x === x && this.y === y && this.z === z;
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
}({}, amdclean['core'], amdclean['polargeometry'], amdclean['constants']);
amdclean['p5TableRow'] = function (require, core) {
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
}({}, amdclean['core']);
amdclean['p5Table'] = function (require, core) {
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
  return p5.Table;
}({}, amdclean['core']);
amdclean['colorcreating_reading'] = function (require, core, p5Color) {
  'use strict';
  var p5 = core;
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
    if (!c instanceof p5.Color) {
      throw new Error('Needs p5.Color as argument.');
    }
    return c.getBrightness();
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
}({}, amdclean['core'], amdclean['p5Color']);
amdclean['colorsetting'] = function (require, core, constants, p5Color) {
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
    this.drawingContext.save();
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    this.drawingContext.scale(this._pixelDensity, this._pixelDensity);
    if (arguments[0] instanceof p5.Image) {
      this.image(arguments[0], 0, 0, this.width, this.height);
    } else {
      var curFill = this.drawingContext.fillStyle;
      var color = this.color.apply(this, arguments);
      var newFill = color.toString();
      this.drawingContext.fillStyle = newFill;
      this.drawingContext.fillRect(0, 0, this.width, this.height);
      this.drawingContext.fillStyle = curFill;
    }
    this.drawingContext.restore();
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
  };
  p5.prototype.fill = function () {
    this._setProperty('_doFill', true);
    var ctx = this.drawingContext;
    var color = this.color.apply(this, arguments);
    ctx.fillStyle = color.toString();
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
    var color = this.color.apply(this, arguments);
    ctx.strokeStyle = color.toString();
  };
  return p5;
}({}, amdclean['core'], amdclean['constants'], amdclean['p5Color']);
amdclean['dataconversion'] = function (require, core) {
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
}({}, amdclean['core']);
amdclean['dataarray_functions'] = function (require, core) {
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
}({}, amdclean['core']);
amdclean['datastring_functions'] = function (require, core) {
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
    if (arguments[1] === 0) {
      rem = '';
    }
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
}({}, amdclean['core']);
amdclean['environment'] = function (require, core, constants) {
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
        this._pixelDensity = val;
      } else {
        this._pixelDensity = window.devicePixelRatio || 1;
      }
    } else {
      this._pixelDensity = 1;
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
}({}, amdclean['core'], amdclean['constants']);
amdclean['imageimage'] = function (require, core, constants) {
  'use strict';
  var p5 = core;
  var constants = constants;
  p5.prototype._imageMode = constants.CORNER;
  p5.prototype._tint = null;
  p5.prototype.createImage = function (width, height) {
    return new p5.Image(width, height);
  };
  return p5;
}({}, amdclean['core'], amdclean['constants']);
amdclean['canvas'] = function (require, constants) {
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
}({}, amdclean['constants']);
amdclean['imageloading_displaying'] = function (require, core, filters, canvas, constants) {
  'use strict';
  var p5 = core;
  var Filters = filters;
  var canvas = canvas;
  var constants = constants;
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
    var frame = img.canvas || img.elt;
    x = x || 0;
    y = y || 0;
    width = width || img.width;
    height = height || img.height;
    var vals = canvas.modeAdjust(x, y, width, height, this._imageMode);
    try {
      if (this._tint && img.canvas) {
        this.drawingContext.drawImage(this._getTintedImageCanvas(img), vals.x, vals.y, vals.w, vals.h);
      } else {
        this.drawingContext.drawImage(frame, vals.x, vals.y, vals.w, vals.h);
      }
    } catch (e) {
      if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
        throw e;
      }
    }
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
}({}, amdclean['core'], amdclean['filters'], amdclean['canvas'], amdclean['constants']);
amdclean['imagepixels'] = function (require, core, filters, p5Color) {
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
    var s = srcImage.canvas.width / srcImage.width;
    this.drawingContext.drawImage(srcImage.canvas, s * sx, s * sy, s * sw, s * sh, dx, dy, dw, dh);
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
      this.drawingContext.save();
      this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
      this.drawingContext.scale(this._pixelDensity, this._pixelDensity);
      this.drawingContext.drawImage(imgOrCol.canvas, x, y);
      this.loadPixels.call(this);
      this.drawingContext.restore();
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
}({}, amdclean['core'], amdclean['filters'], amdclean['p5Color']);
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
amdclean['inputfiles'] = function (require, core, reqwest) {
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
  return p5;
}({}, amdclean['core'], amdclean['reqwest']);
amdclean['inputkeyboard'] = function (require, core) {
  'use strict';
  var p5 = core;
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
}({}, amdclean['core']);
amdclean['inputacceleration'] = function (require, core) {
  'use strict';
  var p5 = core;
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
}({}, amdclean['core']);
amdclean['inputmouse'] = function (require, core, constants) {
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
      var executeDefault = context.mouseWheel(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    }
  };
  return p5;
}({}, amdclean['core'], amdclean['constants']);
amdclean['inputtime_date'] = function (require, core) {
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
}({}, amdclean['core']);
amdclean['inputtouch'] = function (require, core) {
  'use strict';
  var p5 = core;
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
}({}, amdclean['core']);
amdclean['mathmath'] = function (require, core) {
  'use strict';
  var p5 = core;
  p5.prototype.createVector = function (x, y, z) {
    if (this instanceof p5) {
      return new p5.Vector(this, arguments);
    } else {
      return new p5.Vector(x, y, z);
    }
  };
  return p5;
}({}, amdclean['core']);
amdclean['mathcalculation'] = function (require, core) {
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
}({}, amdclean['core']);
amdclean['mathrandom'] = function (require, core) {
  'use strict';
  var p5 = core;
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
}({}, amdclean['core']);
amdclean['mathnoise'] = function (require, core) {
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
}({}, amdclean['core']);
amdclean['mathtrigonometry'] = function (require, core, polargeometry, constants) {
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
}({}, amdclean['core'], amdclean['polargeometry'], amdclean['constants']);
(function (f) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = f();
  } else if (typeof define === 'function' && define.amd) {
    define('opentype', [], f);
  } else {
    var g;
    if (typeof window !== 'undefined') {
      g = window;
    } else if (typeof global !== 'undefined') {
      g = global;
    } else if (typeof self !== 'undefined') {
      g = self;
    } else {
      g = this;
    }
    g.opentype = f();
  }
}(function () {
  var define, module, exports;
  return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == 'function' && require;
          if (!u && a)
            return a(o, !0);
          if (i)
            return i(o, !0);
          var f = new Error('Cannot find module \'' + o + '\'');
          throw f.code = 'MODULE_NOT_FOUND', f;
        }
        var l = n[o] = { exports: {} };
        t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = typeof require == 'function' && require;
    for (var o = 0; o < r.length; o++)
      s(r[o]);
    return s;
  }({
    1: [
      function (require, module, exports) {
        'use strict';
        exports.argument = function (predicate, message) {
          if (!predicate) {
            throw new Error(message);
          }
        };
        exports.assert = exports.argument;
      },
      {}
    ],
    2: [
      function (require, module, exports) {
        'use strict';
        function line(ctx, x1, y1, x2, y2) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        exports.line = line;
      },
      {}
    ],
    3: [
      function (require, module, exports) {
        'use strict';
        var cffStandardStrings = [
            '.notdef',
            'space',
            'exclam',
            'quotedbl',
            'numbersign',
            'dollar',
            'percent',
            'ampersand',
            'quoteright',
            'parenleft',
            'parenright',
            'asterisk',
            'plus',
            'comma',
            'hyphen',
            'period',
            'slash',
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine',
            'colon',
            'semicolon',
            'less',
            'equal',
            'greater',
            'question',
            'at',
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
            'bracketleft',
            'backslash',
            'bracketright',
            'asciicircum',
            'underscore',
            'quoteleft',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
            'braceleft',
            'bar',
            'braceright',
            'asciitilde',
            'exclamdown',
            'cent',
            'sterling',
            'fraction',
            'yen',
            'florin',
            'section',
            'currency',
            'quotesingle',
            'quotedblleft',
            'guillemotleft',
            'guilsinglleft',
            'guilsinglright',
            'fi',
            'fl',
            'endash',
            'dagger',
            'daggerdbl',
            'periodcentered',
            'paragraph',
            'bullet',
            'quotesinglbase',
            'quotedblbase',
            'quotedblright',
            'guillemotright',
            'ellipsis',
            'perthousand',
            'questiondown',
            'grave',
            'acute',
            'circumflex',
            'tilde',
            'macron',
            'breve',
            'dotaccent',
            'dieresis',
            'ring',
            'cedilla',
            'hungarumlaut',
            'ogonek',
            'caron',
            'emdash',
            'AE',
            'ordfeminine',
            'Lslash',
            'Oslash',
            'OE',
            'ordmasculine',
            'ae',
            'dotlessi',
            'lslash',
            'oslash',
            'oe',
            'germandbls',
            'onesuperior',
            'logicalnot',
            'mu',
            'trademark',
            'Eth',
            'onehalf',
            'plusminus',
            'Thorn',
            'onequarter',
            'divide',
            'brokenbar',
            'degree',
            'thorn',
            'threequarters',
            'twosuperior',
            'registered',
            'minus',
            'eth',
            'multiply',
            'threesuperior',
            'copyright',
            'Aacute',
            'Acircumflex',
            'Adieresis',
            'Agrave',
            'Aring',
            'Atilde',
            'Ccedilla',
            'Eacute',
            'Ecircumflex',
            'Edieresis',
            'Egrave',
            'Iacute',
            'Icircumflex',
            'Idieresis',
            'Igrave',
            'Ntilde',
            'Oacute',
            'Ocircumflex',
            'Odieresis',
            'Ograve',
            'Otilde',
            'Scaron',
            'Uacute',
            'Ucircumflex',
            'Udieresis',
            'Ugrave',
            'Yacute',
            'Ydieresis',
            'Zcaron',
            'aacute',
            'acircumflex',
            'adieresis',
            'agrave',
            'aring',
            'atilde',
            'ccedilla',
            'eacute',
            'ecircumflex',
            'edieresis',
            'egrave',
            'iacute',
            'icircumflex',
            'idieresis',
            'igrave',
            'ntilde',
            'oacute',
            'ocircumflex',
            'odieresis',
            'ograve',
            'otilde',
            'scaron',
            'uacute',
            'ucircumflex',
            'udieresis',
            'ugrave',
            'yacute',
            'ydieresis',
            'zcaron',
            'exclamsmall',
            'Hungarumlautsmall',
            'dollaroldstyle',
            'dollarsuperior',
            'ampersandsmall',
            'Acutesmall',
            'parenleftsuperior',
            'parenrightsuperior',
            '266 ff',
            'onedotenleader',
            'zerooldstyle',
            'oneoldstyle',
            'twooldstyle',
            'threeoldstyle',
            'fouroldstyle',
            'fiveoldstyle',
            'sixoldstyle',
            'sevenoldstyle',
            'eightoldstyle',
            'nineoldstyle',
            'commasuperior',
            'threequartersemdash',
            'periodsuperior',
            'questionsmall',
            'asuperior',
            'bsuperior',
            'centsuperior',
            'dsuperior',
            'esuperior',
            'isuperior',
            'lsuperior',
            'msuperior',
            'nsuperior',
            'osuperior',
            'rsuperior',
            'ssuperior',
            'tsuperior',
            'ff',
            'ffi',
            'ffl',
            'parenleftinferior',
            'parenrightinferior',
            'Circumflexsmall',
            'hyphensuperior',
            'Gravesmall',
            'Asmall',
            'Bsmall',
            'Csmall',
            'Dsmall',
            'Esmall',
            'Fsmall',
            'Gsmall',
            'Hsmall',
            'Ismall',
            'Jsmall',
            'Ksmall',
            'Lsmall',
            'Msmall',
            'Nsmall',
            'Osmall',
            'Psmall',
            'Qsmall',
            'Rsmall',
            'Ssmall',
            'Tsmall',
            'Usmall',
            'Vsmall',
            'Wsmall',
            'Xsmall',
            'Ysmall',
            'Zsmall',
            'colonmonetary',
            'onefitted',
            'rupiah',
            'Tildesmall',
            'exclamdownsmall',
            'centoldstyle',
            'Lslashsmall',
            'Scaronsmall',
            'Zcaronsmall',
            'Dieresissmall',
            'Brevesmall',
            'Caronsmall',
            'Dotaccentsmall',
            'Macronsmall',
            'figuredash',
            'hypheninferior',
            'Ogoneksmall',
            'Ringsmall',
            'Cedillasmall',
            'questiondownsmall',
            'oneeighth',
            'threeeighths',
            'fiveeighths',
            'seveneighths',
            'onethird',
            'twothirds',
            'zerosuperior',
            'foursuperior',
            'fivesuperior',
            'sixsuperior',
            'sevensuperior',
            'eightsuperior',
            'ninesuperior',
            'zeroinferior',
            'oneinferior',
            'twoinferior',
            'threeinferior',
            'fourinferior',
            'fiveinferior',
            'sixinferior',
            'seveninferior',
            'eightinferior',
            'nineinferior',
            'centinferior',
            'dollarinferior',
            'periodinferior',
            'commainferior',
            'Agravesmall',
            'Aacutesmall',
            'Acircumflexsmall',
            'Atildesmall',
            'Adieresissmall',
            'Aringsmall',
            'AEsmall',
            'Ccedillasmall',
            'Egravesmall',
            'Eacutesmall',
            'Ecircumflexsmall',
            'Edieresissmall',
            'Igravesmall',
            'Iacutesmall',
            'Icircumflexsmall',
            'Idieresissmall',
            'Ethsmall',
            'Ntildesmall',
            'Ogravesmall',
            'Oacutesmall',
            'Ocircumflexsmall',
            'Otildesmall',
            'Odieresissmall',
            'OEsmall',
            'Oslashsmall',
            'Ugravesmall',
            'Uacutesmall',
            'Ucircumflexsmall',
            'Udieresissmall',
            'Yacutesmall',
            'Thornsmall',
            'Ydieresissmall',
            '001.000',
            '001.001',
            '001.002',
            '001.003',
            'Black',
            'Bold',
            'Book',
            'Light',
            'Medium',
            'Regular',
            'Roman',
            'Semibold'
          ];
        var cffStandardEncoding = [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            'space',
            'exclam',
            'quotedbl',
            'numbersign',
            'dollar',
            'percent',
            'ampersand',
            'quoteright',
            'parenleft',
            'parenright',
            'asterisk',
            'plus',
            'comma',
            'hyphen',
            'period',
            'slash',
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine',
            'colon',
            'semicolon',
            'less',
            'equal',
            'greater',
            'question',
            'at',
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
            'bracketleft',
            'backslash',
            'bracketright',
            'asciicircum',
            'underscore',
            'quoteleft',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
            'braceleft',
            'bar',
            'braceright',
            'asciitilde',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            'exclamdown',
            'cent',
            'sterling',
            'fraction',
            'yen',
            'florin',
            'section',
            'currency',
            'quotesingle',
            'quotedblleft',
            'guillemotleft',
            'guilsinglleft',
            'guilsinglright',
            'fi',
            'fl',
            '',
            'endash',
            'dagger',
            'daggerdbl',
            'periodcentered',
            '',
            'paragraph',
            'bullet',
            'quotesinglbase',
            'quotedblbase',
            'quotedblright',
            'guillemotright',
            'ellipsis',
            'perthousand',
            '',
            'questiondown',
            '',
            'grave',
            'acute',
            'circumflex',
            'tilde',
            'macron',
            'breve',
            'dotaccent',
            'dieresis',
            '',
            'ring',
            'cedilla',
            '',
            'hungarumlaut',
            'ogonek',
            'caron',
            'emdash',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            'AE',
            '',
            'ordfeminine',
            '',
            '',
            '',
            '',
            'Lslash',
            'Oslash',
            'OE',
            'ordmasculine',
            '',
            '',
            '',
            '',
            '',
            'ae',
            '',
            '',
            '',
            'dotlessi',
            '',
            '',
            'lslash',
            'oslash',
            'oe',
            'germandbls'
          ];
        var cffExpertEncoding = [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            'space',
            'exclamsmall',
            'Hungarumlautsmall',
            '',
            'dollaroldstyle',
            'dollarsuperior',
            'ampersandsmall',
            'Acutesmall',
            'parenleftsuperior',
            'parenrightsuperior',
            'twodotenleader',
            'onedotenleader',
            'comma',
            'hyphen',
            'period',
            'fraction',
            'zerooldstyle',
            'oneoldstyle',
            'twooldstyle',
            'threeoldstyle',
            'fouroldstyle',
            'fiveoldstyle',
            'sixoldstyle',
            'sevenoldstyle',
            'eightoldstyle',
            'nineoldstyle',
            'colon',
            'semicolon',
            'commasuperior',
            'threequartersemdash',
            'periodsuperior',
            'questionsmall',
            '',
            'asuperior',
            'bsuperior',
            'centsuperior',
            'dsuperior',
            'esuperior',
            '',
            '',
            'isuperior',
            '',
            '',
            'lsuperior',
            'msuperior',
            'nsuperior',
            'osuperior',
            '',
            '',
            'rsuperior',
            'ssuperior',
            'tsuperior',
            '',
            'ff',
            'fi',
            'fl',
            'ffi',
            'ffl',
            'parenleftinferior',
            '',
            'parenrightinferior',
            'Circumflexsmall',
            'hyphensuperior',
            'Gravesmall',
            'Asmall',
            'Bsmall',
            'Csmall',
            'Dsmall',
            'Esmall',
            'Fsmall',
            'Gsmall',
            'Hsmall',
            'Ismall',
            'Jsmall',
            'Ksmall',
            'Lsmall',
            'Msmall',
            'Nsmall',
            'Osmall',
            'Psmall',
            'Qsmall',
            'Rsmall',
            'Ssmall',
            'Tsmall',
            'Usmall',
            'Vsmall',
            'Wsmall',
            'Xsmall',
            'Ysmall',
            'Zsmall',
            'colonmonetary',
            'onefitted',
            'rupiah',
            'Tildesmall',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            'exclamdownsmall',
            'centoldstyle',
            'Lslashsmall',
            '',
            '',
            'Scaronsmall',
            'Zcaronsmall',
            'Dieresissmall',
            'Brevesmall',
            'Caronsmall',
            '',
            'Dotaccentsmall',
            '',
            '',
            'Macronsmall',
            '',
            '',
            'figuredash',
            'hypheninferior',
            '',
            '',
            'Ogoneksmall',
            'Ringsmall',
            'Cedillasmall',
            '',
            '',
            '',
            'onequarter',
            'onehalf',
            'threequarters',
            'questiondownsmall',
            'oneeighth',
            'threeeighths',
            'fiveeighths',
            'seveneighths',
            'onethird',
            'twothirds',
            '',
            '',
            'zerosuperior',
            'onesuperior',
            'twosuperior',
            'threesuperior',
            'foursuperior',
            'fivesuperior',
            'sixsuperior',
            'sevensuperior',
            'eightsuperior',
            'ninesuperior',
            'zeroinferior',
            'oneinferior',
            'twoinferior',
            'threeinferior',
            'fourinferior',
            'fiveinferior',
            'sixinferior',
            'seveninferior',
            'eightinferior',
            'nineinferior',
            'centinferior',
            'dollarinferior',
            'periodinferior',
            'commainferior',
            'Agravesmall',
            'Aacutesmall',
            'Acircumflexsmall',
            'Atildesmall',
            'Adieresissmall',
            'Aringsmall',
            'AEsmall',
            'Ccedillasmall',
            'Egravesmall',
            'Eacutesmall',
            'Ecircumflexsmall',
            'Edieresissmall',
            'Igravesmall',
            'Iacutesmall',
            'Icircumflexsmall',
            'Idieresissmall',
            'Ethsmall',
            'Ntildesmall',
            'Ogravesmall',
            'Oacutesmall',
            'Ocircumflexsmall',
            'Otildesmall',
            'Odieresissmall',
            'OEsmall',
            'Oslashsmall',
            'Ugravesmall',
            'Uacutesmall',
            'Ucircumflexsmall',
            'Udieresissmall',
            'Yacutesmall',
            'Thornsmall',
            'Ydieresissmall'
          ];
        var standardNames = [
            '.notdef',
            '.null',
            'nonmarkingreturn',
            'space',
            'exclam',
            'quotedbl',
            'numbersign',
            'dollar',
            'percent',
            'ampersand',
            'quotesingle',
            'parenleft',
            'parenright',
            'asterisk',
            'plus',
            'comma',
            'hyphen',
            'period',
            'slash',
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine',
            'colon',
            'semicolon',
            'less',
            'equal',
            'greater',
            'question',
            'at',
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
            'bracketleft',
            'backslash',
            'bracketright',
            'asciicircum',
            'underscore',
            'grave',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
            'braceleft',
            'bar',
            'braceright',
            'asciitilde',
            'Adieresis',
            'Aring',
            'Ccedilla',
            'Eacute',
            'Ntilde',
            'Odieresis',
            'Udieresis',
            'aacute',
            'agrave',
            'acircumflex',
            'adieresis',
            'atilde',
            'aring',
            'ccedilla',
            'eacute',
            'egrave',
            'ecircumflex',
            'edieresis',
            'iacute',
            'igrave',
            'icircumflex',
            'idieresis',
            'ntilde',
            'oacute',
            'ograve',
            'ocircumflex',
            'odieresis',
            'otilde',
            'uacute',
            'ugrave',
            'ucircumflex',
            'udieresis',
            'dagger',
            'degree',
            'cent',
            'sterling',
            'section',
            'bullet',
            'paragraph',
            'germandbls',
            'registered',
            'copyright',
            'trademark',
            'acute',
            'dieresis',
            'notequal',
            'AE',
            'Oslash',
            'infinity',
            'plusminus',
            'lessequal',
            'greaterequal',
            'yen',
            'mu',
            'partialdiff',
            'summation',
            'product',
            'pi',
            'integral',
            'ordfeminine',
            'ordmasculine',
            'Omega',
            'ae',
            'oslash',
            'questiondown',
            'exclamdown',
            'logicalnot',
            'radical',
            'florin',
            'approxequal',
            'Delta',
            'guillemotleft',
            'guillemotright',
            'ellipsis',
            'nonbreakingspace',
            'Agrave',
            'Atilde',
            'Otilde',
            'OE',
            'oe',
            'endash',
            'emdash',
            'quotedblleft',
            'quotedblright',
            'quoteleft',
            'quoteright',
            'divide',
            'lozenge',
            'ydieresis',
            'Ydieresis',
            'fraction',
            'currency',
            'guilsinglleft',
            'guilsinglright',
            'fi',
            'fl',
            'daggerdbl',
            'periodcentered',
            'quotesinglbase',
            'quotedblbase',
            'perthousand',
            'Acircumflex',
            'Ecircumflex',
            'Aacute',
            'Edieresis',
            'Egrave',
            'Iacute',
            'Icircumflex',
            'Idieresis',
            'Igrave',
            'Oacute',
            'Ocircumflex',
            'apple',
            'Ograve',
            'Uacute',
            'Ucircumflex',
            'Ugrave',
            'dotlessi',
            'circumflex',
            'tilde',
            'macron',
            'breve',
            'dotaccent',
            'ring',
            'cedilla',
            'hungarumlaut',
            'ogonek',
            'caron',
            'Lslash',
            'lslash',
            'Scaron',
            'scaron',
            'Zcaron',
            'zcaron',
            'brokenbar',
            'Eth',
            'eth',
            'Yacute',
            'yacute',
            'Thorn',
            'thorn',
            'minus',
            'multiply',
            'onesuperior',
            'twosuperior',
            'threesuperior',
            'onehalf',
            'onequarter',
            'threequarters',
            'franc',
            'Gbreve',
            'gbreve',
            'Idotaccent',
            'Scedilla',
            'scedilla',
            'Cacute',
            'cacute',
            'Ccaron',
            'ccaron',
            'dcroat'
          ];
        function DefaultEncoding(font) {
          this.font = font;
        }
        DefaultEncoding.prototype.charToGlyphIndex = function (c) {
          var code = c.charCodeAt(0);
          var glyphs = this.font.glyphs;
          if (glyphs) {
            for (var i = 0; i < glyphs.length; i += 1) {
              var glyph = glyphs[i];
              for (var j = 0; j < glyph.unicodes.length; j += 1) {
                if (glyph.unicodes[j] === code) {
                  return i;
                }
              }
            }
          } else {
            return null;
          }
        };
        function CmapEncoding(cmap) {
          this.cmap = cmap;
        }
        CmapEncoding.prototype.charToGlyphIndex = function (c) {
          return this.cmap.glyphIndexMap[c.charCodeAt(0)] || 0;
        };
        function CffEncoding(encoding, charset) {
          this.encoding = encoding;
          this.charset = charset;
        }
        CffEncoding.prototype.charToGlyphIndex = function (s) {
          var code = s.charCodeAt(0);
          var charName = this.encoding[code];
          return this.charset.indexOf(charName);
        };
        function GlyphNames(post) {
          var i;
          switch (post.version) {
          case 1:
            this.names = exports.standardNames.slice();
            break;
          case 2:
            this.names = new Array(post.numberOfGlyphs);
            for (i = 0; i < post.numberOfGlyphs; i++) {
              if (post.glyphNameIndex[i] < exports.standardNames.length) {
                this.names[i] = exports.standardNames[post.glyphNameIndex[i]];
              } else {
                this.names[i] = post.names[post.glyphNameIndex[i] - exports.standardNames.length];
              }
            }
            break;
          case 2.5:
            this.names = new Array(post.numberOfGlyphs);
            for (i = 0; i < post.numberOfGlyphs; i++) {
              this.names[i] = exports.standardNames[i + post.glyphNameIndex[i]];
            }
            break;
          case 3:
            this.names = [];
            break;
          }
        }
        GlyphNames.prototype.nameToGlyphIndex = function (name) {
          return this.names.indexOf(name);
        };
        GlyphNames.prototype.glyphIndexToName = function (gid) {
          return this.names[gid];
        };
        function addGlyphNames(font) {
          var glyph;
          var glyphIndexMap = font.tables.cmap.glyphIndexMap;
          var charCodes = Object.keys(glyphIndexMap);
          for (var i = 0; i < charCodes.length; i += 1) {
            var c = charCodes[i];
            var glyphIndex = glyphIndexMap[c];
            glyph = font.glyphs[glyphIndex];
            glyph.addUnicode(parseInt(c));
          }
          for (i = 0; i < font.glyphs.length; i += 1) {
            glyph = font.glyphs[i];
            if (font.cffEncoding) {
              glyph.name = font.cffEncoding.charset[i];
            } else {
              glyph.name = font.glyphNames.glyphIndexToName(i);
            }
          }
        }
        exports.cffStandardStrings = cffStandardStrings;
        exports.cffStandardEncoding = cffStandardEncoding;
        exports.cffExpertEncoding = cffExpertEncoding;
        exports.standardNames = standardNames;
        exports.DefaultEncoding = DefaultEncoding;
        exports.CmapEncoding = CmapEncoding;
        exports.CffEncoding = CffEncoding;
        exports.GlyphNames = GlyphNames;
        exports.addGlyphNames = addGlyphNames;
      },
      {}
    ],
    4: [
      function (require, module, exports) {
        'use strict';
        var path = path;
        var sfnt = tables_sfnt;
        var encoding = encoding;
        function Font(options) {
          options = options || {};
          this.familyName = options.familyName || ' ';
          this.styleName = options.styleName || ' ';
          this.designer = options.designer || ' ';
          this.designerURL = options.designerURL || ' ';
          this.manufacturer = options.manufacturer || ' ';
          this.manufacturerURL = options.manufacturerURL || ' ';
          this.license = options.license || ' ';
          this.licenseURL = options.licenseURL || ' ';
          this.version = options.version || 'Version 0.1';
          this.description = options.description || ' ';
          this.copyright = options.copyright || ' ';
          this.trademark = options.trademark || ' ';
          this.unitsPerEm = options.unitsPerEm || 1000;
          this.ascender = options.ascender;
          this.descender = options.descender;
          this.supported = true;
          this.glyphs = options.glyphs || [];
          this.encoding = new encoding.DefaultEncoding(this);
          this.tables = {};
        }
        Font.prototype.hasChar = function (c) {
          return this.encoding.charToGlyphIndex(c) !== null;
        };
        Font.prototype.charToGlyphIndex = function (s) {
          return this.encoding.charToGlyphIndex(s);
        };
        Font.prototype.charToGlyph = function (c) {
          var glyphIndex = this.charToGlyphIndex(c);
          var glyph = this.glyphs[glyphIndex];
          if (!glyph) {
            glyph = this.glyphs[0];
          }
          return glyph;
        };
        Font.prototype.stringToGlyphs = function (s) {
          var glyphs = [];
          for (var i = 0; i < s.length; i += 1) {
            var c = s[i];
            glyphs.push(this.charToGlyph(c));
          }
          return glyphs;
        };
        Font.prototype.nameToGlyphIndex = function (name) {
          return this.glyphNames.nameToGlyphIndex(name);
        };
        Font.prototype.nameToGlyph = function (name) {
          var glyphIndex = this.nametoGlyphIndex(name);
          var glyph = this.glyphs[glyphIndex];
          if (!glyph) {
            glyph = this.glyphs[0];
          }
          return glyph;
        };
        Font.prototype.glyphIndexToName = function (gid) {
          if (!this.glyphNames.glyphIndexToName) {
            return '';
          }
          return this.glyphNames.glyphIndexToName(gid);
        };
        Font.prototype.getKerningValue = function (leftGlyph, rightGlyph) {
          leftGlyph = leftGlyph.index || leftGlyph;
          rightGlyph = rightGlyph.index || rightGlyph;
          var gposKerning = this.getGposKerningValue;
          return gposKerning ? gposKerning(leftGlyph, rightGlyph) : this.kerningPairs[leftGlyph + ',' + rightGlyph] || 0;
        };
        Font.prototype.forEachGlyph = function (text, x, y, fontSize, options, callback) {
          if (!this.supported) {
            return;
          }
          x = x !== undefined ? x : 0;
          y = y !== undefined ? y : 0;
          fontSize = fontSize !== undefined ? fontSize : 72;
          options = options || {};
          var kerning = options.kerning === undefined ? true : options.kerning;
          var fontScale = 1 / this.unitsPerEm * fontSize;
          var glyphs = this.stringToGlyphs(text);
          for (var i = 0; i < glyphs.length; i += 1) {
            var glyph = glyphs[i];
            callback(glyph, x, y, fontSize, options);
            if (glyph.advanceWidth) {
              x += glyph.advanceWidth * fontScale;
            }
            if (kerning && i < glyphs.length - 1) {
              var kerningValue = this.getKerningValue(glyph, glyphs[i + 1]);
              x += kerningValue * fontScale;
            }
          }
        };
        Font.prototype.getPath = function (text, x, y, fontSize, options) {
          var fullPath = new path.Path();
          this.forEachGlyph(text, x, y, fontSize, options, function (glyph, gX, gY, gFontSize) {
            var glyphPath = glyph.getPath(gX, gY, gFontSize);
            fullPath.extend(glyphPath);
          });
          return fullPath;
        };
        Font.prototype.draw = function (ctx, text, x, y, fontSize, options) {
          this.getPath(text, x, y, fontSize, options).draw(ctx);
        };
        Font.prototype.drawPoints = function (ctx, text, x, y, fontSize, options) {
          this.forEachGlyph(text, x, y, fontSize, options, function (glyph, gX, gY, gFontSize) {
            glyph.drawPoints(ctx, gX, gY, gFontSize);
          });
        };
        Font.prototype.drawMetrics = function (ctx, text, x, y, fontSize, options) {
          this.forEachGlyph(text, x, y, fontSize, options, function (glyph, gX, gY, gFontSize) {
            glyph.drawMetrics(ctx, gX, gY, gFontSize);
          });
        };
        Font.prototype.validate = function () {
          var warnings = [];
          var _this = this;
          function assert(predicate, message) {
            if (!predicate) {
              warnings.push(message);
            }
          }
          function assertStringAttribute(attrName) {
            assert(_this[attrName] && _this[attrName].trim().length > 0, 'No ' + attrName + ' specified.');
          }
          assertStringAttribute('familyName');
          assertStringAttribute('weightName');
          assertStringAttribute('manufacturer');
          assertStringAttribute('copyright');
          assertStringAttribute('version');
          assert(this.unitsPerEm > 0, 'No unitsPerEm specified.');
        };
        Font.prototype.toTables = function () {
          return sfnt.fontToTable(this);
        };
        Font.prototype.toBuffer = function () {
          var sfntTable = this.toTables();
          var bytes = sfntTable.encode();
          var buffer = new ArrayBuffer(bytes.length);
          var intArray = new Uint8Array(buffer);
          for (var i = 0; i < bytes.length; i++) {
            intArray[i] = bytes[i];
          }
          return buffer;
        };
        Font.prototype.download = function () {
          var fileName = this.familyName.replace(/\s/g, '') + '-' + this.styleName + '.otf';
          var buffer = this.toBuffer();
          window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
          window.requestFileSystem(window.TEMPORARY, buffer.byteLength, function (fs) {
            fs.root.getFile(fileName, { create: true }, function (fileEntry) {
              fileEntry.createWriter(function (writer) {
                var dataView = new DataView(buffer);
                var blob = new Blob([dataView], { type: 'font/opentype' });
                writer.write(blob);
                writer.addEventListener('writeend', function () {
                  location.href = fileEntry.toURL();
                }, false);
              });
            });
          }, function (err) {
            throw err;
          });
        };
        exports.Font = Font;
      },
      {
        './encoding': 3,
        './path': 8,
        './tables/sfnt': 23
      }
    ],
    5: [
      function (require, module, exports) {
        'use strict';
        var check = check;
        var draw = draw;
        var path = path;
        function Glyph(options) {
          this.font = options.font || null;
          this.index = options.index || 0;
          this.name = options.name || null;
          this.unicode = options.unicode || undefined;
          this.unicodes = options.unicodes || options.unicode !== undefined ? [options.unicode] : [];
          this.xMin = options.xMin || 0;
          this.yMin = options.yMin || 0;
          this.xMax = options.xMax || 0;
          this.yMax = options.yMax || 0;
          this.advanceWidth = options.advanceWidth || 0;
          this.path = options.path || null;
        }
        Glyph.prototype.addUnicode = function (unicode) {
          if (this.unicodes.length === 0) {
            this.unicode = unicode;
          }
          this.unicodes.push(unicode);
        };
        Glyph.prototype.getPath = function (x, y, fontSize) {
          x = x !== undefined ? x : 0;
          y = y !== undefined ? y : 0;
          fontSize = fontSize !== undefined ? fontSize : 72;
          var scale = 1 / this.font.unitsPerEm * fontSize;
          var p = new path.Path();
          var commands = this.path.commands;
          for (var i = 0; i < commands.length; i += 1) {
            var cmd = commands[i];
            if (cmd.type === 'M') {
              p.moveTo(x + cmd.x * scale, y + -cmd.y * scale);
            } else if (cmd.type === 'L') {
              p.lineTo(x + cmd.x * scale, y + -cmd.y * scale);
            } else if (cmd.type === 'Q') {
              p.quadraticCurveTo(x + cmd.x1 * scale, y + -cmd.y1 * scale, x + cmd.x * scale, y + -cmd.y * scale);
            } else if (cmd.type === 'C') {
              p.curveTo(x + cmd.x1 * scale, y + -cmd.y1 * scale, x + cmd.x2 * scale, y + -cmd.y2 * scale, x + cmd.x * scale, y + -cmd.y * scale);
            } else if (cmd.type === 'Z') {
              p.closePath();
            }
          }
          return p;
        };
        Glyph.prototype.getContours = function () {
          if (this.points === undefined) {
            return [];
          }
          var contours = [];
          var currentContour = [];
          for (var i = 0; i < this.points.length; i += 1) {
            var pt = this.points[i];
            currentContour.push(pt);
            if (pt.lastPointOfContour) {
              contours.push(currentContour);
              currentContour = [];
            }
          }
          check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
          return contours;
        };
        Glyph.prototype.getMetrics = function () {
          var commands = this.path.commands;
          var xCoords = [];
          var yCoords = [];
          for (var i = 0; i < commands.length; i += 1) {
            var cmd = commands[i];
            if (cmd.type !== 'Z') {
              xCoords.push(cmd.x);
              yCoords.push(cmd.y);
            }
            if (cmd.type === 'Q' || cmd.type === 'C') {
              xCoords.push(cmd.x1);
              yCoords.push(cmd.y1);
            }
            if (cmd.type === 'C') {
              xCoords.push(cmd.x2);
              yCoords.push(cmd.y2);
            }
          }
          var metrics = {
              xMin: Math.min.apply(null, xCoords),
              yMin: Math.min.apply(null, yCoords),
              xMax: Math.max.apply(null, xCoords),
              yMax: Math.max.apply(null, yCoords),
              leftSideBearing: 0
            };
          metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
          return metrics;
        };
        Glyph.prototype.draw = function (ctx, x, y, fontSize) {
          this.getPath(x, y, fontSize).draw(ctx);
        };
        Glyph.prototype.drawPoints = function (ctx, x, y, fontSize) {
          function drawCircles(l, x, y, scale) {
            var PI_SQ = Math.PI * 2;
            ctx.beginPath();
            for (var j = 0; j < l.length; j += 1) {
              ctx.moveTo(x + l[j].x * scale, y + l[j].y * scale);
              ctx.arc(x + l[j].x * scale, y + l[j].y * scale, 2, 0, PI_SQ, false);
            }
            ctx.closePath();
            ctx.fill();
          }
          x = x !== undefined ? x : 0;
          y = y !== undefined ? y : 0;
          fontSize = fontSize !== undefined ? fontSize : 24;
          var scale = 1 / this.font.unitsPerEm * fontSize;
          var blueCircles = [];
          var redCircles = [];
          var path = this.path;
          for (var i = 0; i < path.commands.length; i += 1) {
            var cmd = path.commands[i];
            if (cmd.x !== undefined) {
              blueCircles.push({
                x: cmd.x,
                y: -cmd.y
              });
            }
            if (cmd.x1 !== undefined) {
              redCircles.push({
                x: cmd.x1,
                y: -cmd.y1
              });
            }
            if (cmd.x2 !== undefined) {
              redCircles.push({
                x: cmd.x2,
                y: -cmd.y2
              });
            }
          }
          ctx.fillStyle = 'blue';
          drawCircles(blueCircles, x, y, scale);
          ctx.fillStyle = 'red';
          drawCircles(redCircles, x, y, scale);
        };
        Glyph.prototype.drawMetrics = function (ctx, x, y, fontSize) {
          var scale;
          x = x !== undefined ? x : 0;
          y = y !== undefined ? y : 0;
          fontSize = fontSize !== undefined ? fontSize : 24;
          scale = 1 / this.font.unitsPerEm * fontSize;
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'black';
          draw.line(ctx, x, -10000, x, 10000);
          draw.line(ctx, -10000, y, 10000, y);
          ctx.strokeStyle = 'blue';
          draw.line(ctx, x + this.xMin * scale, -10000, x + this.xMin * scale, 10000);
          draw.line(ctx, x + this.xMax * scale, -10000, x + this.xMax * scale, 10000);
          draw.line(ctx, -10000, y + -this.yMin * scale, 10000, y + -this.yMin * scale);
          draw.line(ctx, -10000, y + -this.yMax * scale, 10000, y + -this.yMax * scale);
          ctx.strokeStyle = 'green';
          draw.line(ctx, x + this.advanceWidth * scale, -10000, x + this.advanceWidth * scale, 10000);
        };
        exports.Glyph = Glyph;
      },
      {
        './check': 1,
        './draw': 2,
        './path': 8
      }
    ],
    6: [
      function (require, module, exports) {
        'use strict';
        var encoding = encoding;
        var _font = font;
        var glyph = glyph;
        var parse = parse;
        var path = path;
        var cmap = tables_cmap;
        var cff = tables_cff;
        var glyf = tables_glyf;
        var gpos = tables_gpos;
        var head = tables_head;
        var hhea = tables_hhea;
        var hmtx = tables_hmtx;
        var kern = tables_kern;
        var loca = tables_loca;
        var maxp = tables_maxp;
        var _name = tables_name;
        var os2 = tables_os2;
        var post = tables_post;
        function toArrayBuffer(buffer) {
          var arrayBuffer = new ArrayBuffer(buffer.length);
          var data = new Uint8Array(arrayBuffer);
          for (var i = 0; i < buffer.length; i += 1) {
            data[i] = buffer[i];
          }
          return arrayBuffer;
        }
        function loadFromFile(path, callback) {
          var fs = fs;
          fs.readFile(path, function (err, buffer) {
            if (err) {
              return callback(err.message);
            }
            callback(null, toArrayBuffer(buffer));
          });
        }
        function loadFromUrl(url, callback) {
          var request = new XMLHttpRequest();
          request.open('get', url, true);
          request.responseType = 'arraybuffer';
          request.onload = function () {
            if (request.status !== 200) {
              return callback('Font could not be loaded: ' + request.statusText);
            }
            return callback(null, request.response);
          };
          request.send();
        }
        function parseBuffer(buffer) {
          var indexToLocFormat;
          var hmtxOffset;
          var glyfOffset;
          var locaOffset;
          var cffOffset;
          var kernOffset;
          var gposOffset;
          var font = new _font.Font();
          var data = new DataView(buffer, 0);
          var version = parse.getFixed(data, 0);
          if (version === 1) {
            font.outlinesFormat = 'truetype';
          } else {
            version = parse.getTag(data, 0);
            if (version === 'OTTO') {
              font.outlinesFormat = 'cff';
            } else {
              throw new Error('Unsupported OpenType version ' + version);
            }
          }
          var numTables = parse.getUShort(data, 4);
          var p = 12;
          for (var i = 0; i < numTables; i += 1) {
            var tag = parse.getTag(data, p);
            var offset = parse.getULong(data, p + 8);
            switch (tag) {
            case 'cmap':
              font.tables.cmap = cmap.parse(data, offset);
              font.encoding = new encoding.CmapEncoding(font.tables.cmap);
              if (!font.encoding) {
                font.supported = false;
              }
              break;
            case 'head':
              font.tables.head = head.parse(data, offset);
              font.unitsPerEm = font.tables.head.unitsPerEm;
              indexToLocFormat = font.tables.head.indexToLocFormat;
              break;
            case 'hhea':
              font.tables.hhea = hhea.parse(data, offset);
              font.ascender = font.tables.hhea.ascender;
              font.descender = font.tables.hhea.descender;
              font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
              break;
            case 'hmtx':
              hmtxOffset = offset;
              break;
            case 'maxp':
              font.tables.maxp = maxp.parse(data, offset);
              font.numGlyphs = font.tables.maxp.numGlyphs;
              break;
            case 'name':
              font.tables.name = _name.parse(data, offset);
              font.familyName = font.tables.name.fontFamily;
              font.styleName = font.tables.name.fontSubfamily;
              break;
            case 'OS/2':
              font.tables.os2 = os2.parse(data, offset);
              break;
            case 'post':
              font.tables.post = post.parse(data, offset);
              font.glyphNames = new encoding.GlyphNames(font.tables.post);
              break;
            case 'glyf':
              glyfOffset = offset;
              break;
            case 'loca':
              locaOffset = offset;
              break;
            case 'CFF ':
              cffOffset = offset;
              break;
            case 'kern':
              kernOffset = offset;
              break;
            case 'GPOS':
              gposOffset = offset;
              break;
            }
            p += 16;
          }
          if (glyfOffset && locaOffset) {
            var shortVersion = indexToLocFormat === 0;
            var locaTable = loca.parse(data, locaOffset, font.numGlyphs, shortVersion);
            font.glyphs = glyf.parse(data, glyfOffset, locaTable, font);
            hmtx.parse(data, hmtxOffset, font.numberOfHMetrics, font.numGlyphs, font.glyphs);
            encoding.addGlyphNames(font);
          } else if (cffOffset) {
            cff.parse(data, cffOffset, font);
            encoding.addGlyphNames(font);
          } else {
            font.supported = false;
          }
          if (font.supported) {
            if (kernOffset) {
              font.kerningPairs = kern.parse(data, kernOffset);
            } else {
              font.kerningPairs = {};
            }
            if (gposOffset) {
              gpos.parse(data, gposOffset, font);
            }
          }
          return font;
        }
        function load(url, callback) {
          var isNode = typeof window === 'undefined';
          var loadFn = isNode ? loadFromFile : loadFromUrl;
          loadFn(url, function (err, arrayBuffer) {
            if (err) {
              return callback(err);
            }
            var font = parseBuffer(arrayBuffer);
            if (!font.supported) {
              return callback('Font is not supported (is this a Postscript font?)');
            }
            return callback(null, font);
          });
        }
        exports._parse = parse;
        exports.Font = _font.Font;
        exports.Glyph = glyph.Glyph;
        exports.Path = path.Path;
        exports.parse = parseBuffer;
        exports.load = load;
      },
      {
        './encoding': 3,
        './font': 4,
        './glyph': 5,
        './parse': 7,
        './path': 8,
        './tables/cff': 10,
        './tables/cmap': 11,
        './tables/glyf': 12,
        './tables/gpos': 13,
        './tables/head': 14,
        './tables/hhea': 15,
        './tables/hmtx': 16,
        './tables/kern': 17,
        './tables/loca': 18,
        './tables/maxp': 19,
        './tables/name': 20,
        './tables/os2': 21,
        './tables/post': 22,
        'fs': undefined
      }
    ],
    7: [
      function (require, module, exports) {
        'use strict';
        exports.getByte = function getByte(dataView, offset) {
          return dataView.getUint8(offset);
        };
        exports.getCard8 = exports.getByte;
        exports.getUShort = function (dataView, offset) {
          return dataView.getUint16(offset, false);
        };
        exports.getCard16 = exports.getUShort;
        exports.getShort = function (dataView, offset) {
          return dataView.getInt16(offset, false);
        };
        exports.getULong = function (dataView, offset) {
          return dataView.getUint32(offset, false);
        };
        exports.getFixed = function (dataView, offset) {
          var decimal = dataView.getInt16(offset, false);
          var fraction = dataView.getUint16(offset + 2, false);
          return decimal + fraction / 65535;
        };
        exports.getTag = function (dataView, offset) {
          var tag = '';
          for (var i = offset; i < offset + 4; i += 1) {
            tag += String.fromCharCode(dataView.getInt8(i));
          }
          return tag;
        };
        exports.getOffset = function (dataView, offset, offSize) {
          var v = 0;
          for (var i = 0; i < offSize; i += 1) {
            v <<= 8;
            v += dataView.getUint8(offset + i);
          }
          return v;
        };
        exports.getBytes = function (dataView, startOffset, endOffset) {
          var bytes = [];
          for (var i = startOffset; i < endOffset; i += 1) {
            bytes.push(dataView.getUint8(i));
          }
          return bytes;
        };
        exports.bytesToString = function (bytes) {
          var s = '';
          for (var i = 0; i < bytes.length; i += 1) {
            s += String.fromCharCode(bytes[i]);
          }
          return s;
        };
        var typeOffsets = {
            byte: 1,
            uShort: 2,
            short: 2,
            uLong: 4,
            fixed: 4,
            longDateTime: 8,
            tag: 4
          };
        function Parser(data, offset) {
          this.data = data;
          this.offset = offset;
          this.relativeOffset = 0;
        }
        Parser.prototype.parseByte = function () {
          var v = this.data.getUint8(this.offset + this.relativeOffset);
          this.relativeOffset += 1;
          return v;
        };
        Parser.prototype.parseChar = function () {
          var v = this.data.getInt8(this.offset + this.relativeOffset);
          this.relativeOffset += 1;
          return v;
        };
        Parser.prototype.parseCard8 = Parser.prototype.parseByte;
        Parser.prototype.parseUShort = function () {
          var v = this.data.getUint16(this.offset + this.relativeOffset);
          this.relativeOffset += 2;
          return v;
        };
        Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
        Parser.prototype.parseSID = Parser.prototype.parseUShort;
        Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;
        Parser.prototype.parseShort = function () {
          var v = this.data.getInt16(this.offset + this.relativeOffset);
          this.relativeOffset += 2;
          return v;
        };
        Parser.prototype.parseF2Dot14 = function () {
          var v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
          this.relativeOffset += 2;
          return v;
        };
        Parser.prototype.parseULong = function () {
          var v = exports.getULong(this.data, this.offset + this.relativeOffset);
          this.relativeOffset += 4;
          return v;
        };
        Parser.prototype.parseFixed = function () {
          var v = exports.getFixed(this.data, this.offset + this.relativeOffset);
          this.relativeOffset += 4;
          return v;
        };
        Parser.prototype.parseOffset16List = Parser.prototype.parseUShortList = function (count) {
          var offsets = new Array(count);
          var dataView = this.data;
          var offset = this.offset + this.relativeOffset;
          for (var i = 0; i < count; i++) {
            offsets[i] = exports.getUShort(dataView, offset);
            offset += 2;
          }
          this.relativeOffset += count * 2;
          return offsets;
        };
        Parser.prototype.parseString = function (length) {
          var dataView = this.data;
          var offset = this.offset + this.relativeOffset;
          var string = '';
          this.relativeOffset += length;
          for (var i = 0; i < length; i++) {
            string += String.fromCharCode(dataView.getUint8(offset + i));
          }
          return string;
        };
        Parser.prototype.parseTag = function () {
          return this.parseString(4);
        };
        Parser.prototype.parseLongDateTime = function () {
          var v = exports.getULong(this.data, this.offset + this.relativeOffset + 4);
          this.relativeOffset += 8;
          return v;
        };
        Parser.prototype.parseFixed = function () {
          var v = exports.getULong(this.data, this.offset + this.relativeOffset);
          this.relativeOffset += 4;
          return v / 65536;
        };
        Parser.prototype.parseVersion = function () {
          var major = exports.getUShort(this.data, this.offset + this.relativeOffset);
          var minor = exports.getUShort(this.data, this.offset + this.relativeOffset + 2);
          this.relativeOffset += 4;
          return major + minor / 4096 / 10;
        };
        Parser.prototype.skip = function (type, amount) {
          if (amount === undefined) {
            amount = 1;
          }
          this.relativeOffset += typeOffsets[type] * amount;
        };
        exports.Parser = Parser;
      },
      {}
    ],
    8: [
      function (require, module, exports) {
        'use strict';
        function Path() {
          this.commands = [];
          this.fill = 'black';
          this.stroke = null;
          this.strokeWidth = 1;
        }
        Path.prototype.moveTo = function (x, y) {
          this.commands.push({
            type: 'M',
            x: x,
            y: y
          });
        };
        Path.prototype.lineTo = function (x, y) {
          this.commands.push({
            type: 'L',
            x: x,
            y: y
          });
        };
        Path.prototype.curveTo = Path.prototype.bezierCurveTo = function (x1, y1, x2, y2, x, y) {
          this.commands.push({
            type: 'C',
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            x: x,
            y: y
          });
        };
        Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function (x1, y1, x, y) {
          this.commands.push({
            type: 'Q',
            x1: x1,
            y1: y1,
            x: x,
            y: y
          });
        };
        Path.prototype.close = Path.prototype.closePath = function () {
          this.commands.push({ type: 'Z' });
        };
        Path.prototype.extend = function (pathOrCommands) {
          if (pathOrCommands.commands) {
            pathOrCommands = pathOrCommands.commands;
          }
          Array.prototype.push.apply(this.commands, pathOrCommands);
        };
        Path.prototype.draw = function (ctx) {
          ctx.beginPath();
          for (var i = 0; i < this.commands.length; i += 1) {
            var cmd = this.commands[i];
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
          if (this.fill) {
            ctx.fillStyle = this.fill;
            ctx.fill();
          }
          if (this.stroke) {
            ctx.strokeStyle = this.stroke;
            ctx.lineWidth = this.strokeWidth;
            ctx.stroke();
          }
        };
        Path.prototype.toPathData = function (decimalPlaces) {
          decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2;
          function floatToString(v) {
            if (Math.round(v) === v) {
              return '' + Math.round(v);
            } else {
              return v.toFixed(decimalPlaces);
            }
          }
          function packValues() {
            var s = '';
            for (var i = 0; i < arguments.length; i += 1) {
              var v = arguments[i];
              if (v >= 0 && i > 0) {
                s += ' ';
              }
              s += floatToString(v);
            }
            return s;
          }
          var d = '';
          for (var i = 0; i < this.commands.length; i += 1) {
            var cmd = this.commands[i];
            if (cmd.type === 'M') {
              d += 'M' + packValues(cmd.x, cmd.y);
            } else if (cmd.type === 'L') {
              d += 'L' + packValues(cmd.x, cmd.y);
            } else if (cmd.type === 'C') {
              d += 'C' + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
            } else if (cmd.type === 'Q') {
              d += 'Q' + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
            } else if (cmd.type === 'Z') {
              d += 'Z';
            }
          }
          return d;
        };
        Path.prototype.toSVG = function (decimalPlaces) {
          var svg = '<path d="';
          svg += this.toPathData(decimalPlaces);
          svg += '"';
          if (this.fill & this.fill !== 'black') {
            if (this.fill === null) {
              svg += ' fill="none"';
            } else {
              svg += ' fill="' + this.fill + '"';
            }
          }
          if (this.stroke) {
            svg += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"';
          }
          svg += '/>';
          return svg;
        };
        exports.Path = Path;
      },
      {}
    ],
    9: [
      function (require, module, exports) {
        'use strict';
        var check = check;
        var encode = types.encode;
        var sizeOf = types.sizeOf;
        function Table(tableName, fields, options) {
          var i;
          for (i = 0; i < fields.length; i += 1) {
            var field = fields[i];
            this[field.name] = field.value;
          }
          this.tableName = tableName;
          this.fields = fields;
          if (options) {
            var optionKeys = Object.keys(options);
            for (i = 0; i < optionKeys.length; i += 1) {
              var k = optionKeys[i];
              var v = options[k];
              if (this[k] !== undefined) {
                this[k] = v;
              }
            }
          }
        }
        Table.prototype.sizeOf = function () {
          var v = 0;
          for (var i = 0; i < this.fields.length; i += 1) {
            var field = this.fields[i];
            var value = this[field.name];
            if (value === undefined) {
              value = field.value;
            }
            if (typeof value.sizeOf === 'function') {
              v += value.sizeOf();
            } else {
              var sizeOfFunction = sizeOf[field.type];
              check.assert(typeof sizeOfFunction === 'function', 'Could not find sizeOf function for field' + field.name);
              v += sizeOfFunction(value);
            }
          }
          return v;
        };
        Table.prototype.encode = function () {
          return encode.TABLE(this);
        };
        exports.Table = Table;
      },
      {
        './check': 1,
        './types': 24
      }
    ],
    10: [
      function (require, module, exports) {
        'use strict';
        var encoding = encoding;
        var _glyph = glyph;
        var parse = parse;
        var path = path;
        var table = table;
        function equals(a, b) {
          if (a === b) {
            return true;
          } else if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) {
              return false;
            }
            for (var i = 0; i < a.length; i += 1) {
              if (!equals(a[i], b[i])) {
                return false;
              }
            }
            return true;
          } else {
            return false;
          }
        }
        function parseCFFIndex(data, start, conversionFn) {
          var offsets = [];
          var objects = [];
          var count = parse.getCard16(data, start);
          var i;
          var objectOffset;
          var endOffset;
          if (count !== 0) {
            var offsetSize = parse.getByte(data, start + 2);
            objectOffset = start + (count + 1) * offsetSize + 2;
            var pos = start + 3;
            for (i = 0; i < count + 1; i += 1) {
              offsets.push(parse.getOffset(data, pos, offsetSize));
              pos += offsetSize;
            }
            endOffset = objectOffset + offsets[count];
          } else {
            endOffset = start + 2;
          }
          for (i = 0; i < offsets.length - 1; i += 1) {
            var value = parse.getBytes(data, objectOffset + offsets[i], objectOffset + offsets[i + 1]);
            if (conversionFn) {
              value = conversionFn(value);
            }
            objects.push(value);
          }
          return {
            objects: objects,
            startOffset: start,
            endOffset: endOffset
          };
        }
        function parseFloatOperand(parser) {
          var s = '';
          var eof = 15;
          var lookup = [
              '0',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '.',
              'E',
              'E-',
              null,
              '-'
            ];
          while (true) {
            var b = parser.parseByte();
            var n1 = b >> 4;
            var n2 = b & 15;
            if (n1 === eof) {
              break;
            }
            s += lookup[n1];
            if (n2 === eof) {
              break;
            }
            s += lookup[n2];
          }
          return parseFloat(s);
        }
        function parseOperand(parser, b0) {
          var b1;
          var b2;
          var b3;
          var b4;
          if (b0 === 28) {
            b1 = parser.parseByte();
            b2 = parser.parseByte();
            return b1 << 8 | b2;
          }
          if (b0 === 29) {
            b1 = parser.parseByte();
            b2 = parser.parseByte();
            b3 = parser.parseByte();
            b4 = parser.parseByte();
            return b1 << 24 | b2 << 16 | b3 << 8 | b4;
          }
          if (b0 === 30) {
            return parseFloatOperand(parser);
          }
          if (b0 >= 32 && b0 <= 246) {
            return b0 - 139;
          }
          if (b0 >= 247 && b0 <= 250) {
            b1 = parser.parseByte();
            return (b0 - 247) * 256 + b1 + 108;
          }
          if (b0 >= 251 && b0 <= 254) {
            b1 = parser.parseByte();
            return -(b0 - 251) * 256 - b1 - 108;
          }
          throw new Error('Invalid b0 ' + b0);
        }
        function entriesToObject(entries) {
          var o = {};
          for (var i = 0; i < entries.length; i += 1) {
            var key = entries[i][0];
            var values = entries[i][1];
            var value;
            if (values.length === 1) {
              value = values[0];
            } else {
              value = values;
            }
            if (o.hasOwnProperty(key)) {
              throw new Error('Object ' + o + ' already has key ' + key);
            }
            o[key] = value;
          }
          return o;
        }
        function parseCFFDict(data, start, size) {
          start = start !== undefined ? start : 0;
          var parser = new parse.Parser(data, start);
          var entries = [];
          var operands = [];
          size = size !== undefined ? size : data.length;
          while (parser.relativeOffset < size) {
            var op = parser.parseByte();
            if (op <= 21) {
              if (op === 12) {
                op = 1200 + parser.parseByte();
              }
              entries.push([
                op,
                operands
              ]);
              operands = [];
            } else {
              operands.push(parseOperand(parser, op));
            }
          }
          return entriesToObject(entries);
        }
        function getCFFString(strings, index) {
          if (index <= 390) {
            index = encoding.cffStandardStrings[index];
          } else {
            index = strings[index - 391];
          }
          return index;
        }
        function interpretDict(dict, meta, strings) {
          var newDict = {};
          for (var i = 0; i < meta.length; i += 1) {
            var m = meta[i];
            var value = dict[m.op];
            if (value === undefined) {
              value = m.value !== undefined ? m.value : null;
            }
            if (m.type === 'SID') {
              value = getCFFString(strings, value);
            }
            newDict[m.name] = value;
          }
          return newDict;
        }
        function parseCFFHeader(data, start) {
          var header = {};
          header.formatMajor = parse.getCard8(data, start);
          header.formatMinor = parse.getCard8(data, start + 1);
          header.size = parse.getCard8(data, start + 2);
          header.offsetSize = parse.getCard8(data, start + 3);
          header.startOffset = start;
          header.endOffset = start + 4;
          return header;
        }
        var TOP_DICT_META = [
            {
              name: 'version',
              op: 0,
              type: 'SID'
            },
            {
              name: 'notice',
              op: 1,
              type: 'SID'
            },
            {
              name: 'copyright',
              op: 1200,
              type: 'SID'
            },
            {
              name: 'fullName',
              op: 2,
              type: 'SID'
            },
            {
              name: 'familyName',
              op: 3,
              type: 'SID'
            },
            {
              name: 'weight',
              op: 4,
              type: 'SID'
            },
            {
              name: 'isFixedPitch',
              op: 1201,
              type: 'number',
              value: 0
            },
            {
              name: 'italicAngle',
              op: 1202,
              type: 'number',
              value: 0
            },
            {
              name: 'underlinePosition',
              op: 1203,
              type: 'number',
              value: -100
            },
            {
              name: 'underlineThickness',
              op: 1204,
              type: 'number',
              value: 50
            },
            {
              name: 'paintType',
              op: 1205,
              type: 'number',
              value: 0
            },
            {
              name: 'charstringType',
              op: 1206,
              type: 'number',
              value: 2
            },
            {
              name: 'fontMatrix',
              op: 1207,
              type: [
                'real',
                'real',
                'real',
                'real',
                'real',
                'real'
              ],
              value: [
                0.001,
                0,
                0,
                0.001,
                0,
                0
              ]
            },
            {
              name: 'uniqueId',
              op: 13,
              type: 'number'
            },
            {
              name: 'fontBBox',
              op: 5,
              type: [
                'number',
                'number',
                'number',
                'number'
              ],
              value: [
                0,
                0,
                0,
                0
              ]
            },
            {
              name: 'strokeWidth',
              op: 1208,
              type: 'number',
              value: 0
            },
            {
              name: 'xuid',
              op: 14,
              type: [],
              value: null
            },
            {
              name: 'charset',
              op: 15,
              type: 'offset',
              value: 0
            },
            {
              name: 'encoding',
              op: 16,
              type: 'offset',
              value: 0
            },
            {
              name: 'charStrings',
              op: 17,
              type: 'offset',
              value: 0
            },
            {
              name: 'private',
              op: 18,
              type: [
                'number',
                'offset'
              ],
              value: [
                0,
                0
              ]
            }
          ];
        var PRIVATE_DICT_META = [
            {
              name: 'subrs',
              op: 19,
              type: 'offset',
              value: 0
            },
            {
              name: 'defaultWidthX',
              op: 20,
              type: 'number',
              value: 0
            },
            {
              name: 'nominalWidthX',
              op: 21,
              type: 'number',
              value: 0
            }
          ];
        function parseCFFTopDict(data, strings) {
          var dict = parseCFFDict(data, 0, data.byteLength);
          return interpretDict(dict, TOP_DICT_META, strings);
        }
        function parseCFFPrivateDict(data, start, size, strings) {
          var dict = parseCFFDict(data, start, size);
          return interpretDict(dict, PRIVATE_DICT_META, strings);
        }
        function parseCFFCharset(data, start, nGlyphs, strings) {
          var i;
          var sid;
          var count;
          var parser = new parse.Parser(data, start);
          nGlyphs -= 1;
          var charset = ['.notdef'];
          var format = parser.parseCard8();
          if (format === 0) {
            for (i = 0; i < nGlyphs; i += 1) {
              sid = parser.parseSID();
              charset.push(getCFFString(strings, sid));
            }
          } else if (format === 1) {
            while (charset.length <= nGlyphs) {
              sid = parser.parseSID();
              count = parser.parseCard8();
              for (i = 0; i <= count; i += 1) {
                charset.push(getCFFString(strings, sid));
                sid += 1;
              }
            }
          } else if (format === 2) {
            while (charset.length <= nGlyphs) {
              sid = parser.parseSID();
              count = parser.parseCard16();
              for (i = 0; i <= count; i += 1) {
                charset.push(getCFFString(strings, sid));
                sid += 1;
              }
            }
          } else {
            throw new Error('Unknown charset format ' + format);
          }
          return charset;
        }
        function parseCFFEncoding(data, start, charset) {
          var i;
          var code;
          var enc = {};
          var parser = new parse.Parser(data, start);
          var format = parser.parseCard8();
          if (format === 0) {
            var nCodes = parser.parseCard8();
            for (i = 0; i < nCodes; i += 1) {
              code = parser.parseCard8();
              enc[code] = i;
            }
          } else if (format === 1) {
            var nRanges = parser.parseCard8();
            code = 1;
            for (i = 0; i < nRanges; i += 1) {
              var first = parser.parseCard8();
              var nLeft = parser.parseCard8();
              for (var j = first; j <= first + nLeft; j += 1) {
                enc[j] = code;
                code += 1;
              }
            }
          } else {
            throw new Error('Unknown encoding format ' + format);
          }
          return new encoding.CffEncoding(enc, charset);
        }
        function parseCFFCharstring(code, font, index) {
          var c1x;
          var c1y;
          var c2x;
          var c2y;
          var p = new path.Path();
          var stack = [];
          var nStems = 0;
          var haveWidth = false;
          var width = font.defaultWidthX;
          var open = false;
          var x = 0;
          var y = 0;
          function newContour(x, y) {
            if (open) {
              p.closePath();
            }
            p.moveTo(x, y);
            open = true;
          }
          function parseStems() {
            var hasWidthArg;
            hasWidthArg = stack.length % 2 !== 0;
            if (hasWidthArg && !haveWidth) {
              width = stack.shift() + font.nominalWidthX;
            }
            nStems += stack.length >> 1;
            stack.length = 0;
            haveWidth = true;
          }
          function parse(code) {
            var b1;
            var b2;
            var b3;
            var b4;
            var codeIndex;
            var subrCode;
            var jpx;
            var jpy;
            var c3x;
            var c3y;
            var c4x;
            var c4y;
            var i = 0;
            while (i < code.length) {
              var v = code[i];
              i += 1;
              switch (v) {
              case 1:
                parseStems();
                break;
              case 3:
                parseStems();
                break;
              case 4:
                if (stack.length > 1 && !haveWidth) {
                  width = stack.shift() + font.nominalWidthX;
                  haveWidth = true;
                }
                y += stack.pop();
                newContour(x, y);
                break;
              case 5:
                while (stack.length > 0) {
                  x += stack.shift();
                  y += stack.shift();
                  p.lineTo(x, y);
                }
                break;
              case 6:
                while (stack.length > 0) {
                  x += stack.shift();
                  p.lineTo(x, y);
                  if (stack.length === 0) {
                    break;
                  }
                  y += stack.shift();
                  p.lineTo(x, y);
                }
                break;
              case 7:
                while (stack.length > 0) {
                  y += stack.shift();
                  p.lineTo(x, y);
                  if (stack.length === 0) {
                    break;
                  }
                  x += stack.shift();
                  p.lineTo(x, y);
                }
                break;
              case 8:
                while (stack.length > 0) {
                  c1x = x + stack.shift();
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  y = c2y + stack.shift();
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                break;
              case 10:
                codeIndex = stack.pop() + font.subrsBias;
                subrCode = font.subrs[codeIndex];
                if (subrCode) {
                  parse(subrCode);
                }
                break;
              case 11:
                return;
              case 12:
                v = code[i];
                i += 1;
                switch (v) {
                case 35:
                  c1x = x + stack.shift();
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  jpx = c2x + stack.shift();
                  jpy = c2y + stack.shift();
                  c3x = jpx + stack.shift();
                  c3y = jpy + stack.shift();
                  c4x = c3x + stack.shift();
                  c4y = c3y + stack.shift();
                  x = c4x + stack.shift();
                  y = c4y + stack.shift();
                  stack.shift();
                  p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                  p.curveTo(c3x, c3y, c4x, c4y, x, y);
                  break;
                case 34:
                  c1x = x + stack.shift();
                  c1y = y;
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  jpx = c2x + stack.shift();
                  jpy = c2y;
                  c3x = jpx + stack.shift();
                  c3y = c2y;
                  c4x = c3x + stack.shift();
                  c4y = y;
                  x = c4x + stack.shift();
                  p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                  p.curveTo(c3x, c3y, c4x, c4y, x, y);
                  break;
                case 36:
                  c1x = x + stack.shift();
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  jpx = c2x + stack.shift();
                  jpy = c2y;
                  c3x = jpx + stack.shift();
                  c3y = c2y;
                  c4x = c3x + stack.shift();
                  c4y = c3y + stack.shift();
                  x = c4x + stack.shift();
                  p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                  p.curveTo(c3x, c3y, c4x, c4y, x, y);
                  break;
                case 37:
                  c1x = x + stack.shift();
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  jpx = c2x + stack.shift();
                  jpy = c2y + stack.shift();
                  c3x = jpx + stack.shift();
                  c3y = jpy + stack.shift();
                  c4x = c3x + stack.shift();
                  c4y = c3y + stack.shift();
                  if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                    x = c4x + stack.shift();
                  } else {
                    y = c4y + stack.shift();
                  }
                  p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                  p.curveTo(c3x, c3y, c4x, c4y, x, y);
                  break;
                default:
                  console.log('Glyph ' + index + ': unknown operator ' + 1200 + v);
                  stack.length = 0;
                }
                break;
              case 14:
                if (stack.length > 0 && !haveWidth) {
                  width = stack.shift() + font.nominalWidthX;
                  haveWidth = true;
                }
                if (open) {
                  p.closePath();
                  open = false;
                }
                break;
              case 18:
                parseStems();
                break;
              case 19:
              case 20:
                parseStems();
                i += nStems + 7 >> 3;
                break;
              case 21:
                if (stack.length > 2 && !haveWidth) {
                  width = stack.shift() + font.nominalWidthX;
                  haveWidth = true;
                }
                y += stack.pop();
                x += stack.pop();
                newContour(x, y);
                break;
              case 22:
                if (stack.length > 1 && !haveWidth) {
                  width = stack.shift() + font.nominalWidthX;
                  haveWidth = true;
                }
                x += stack.pop();
                newContour(x, y);
                break;
              case 23:
                parseStems();
                break;
              case 24:
                while (stack.length > 2) {
                  c1x = x + stack.shift();
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  y = c2y + stack.shift();
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                x += stack.shift();
                y += stack.shift();
                p.lineTo(x, y);
                break;
              case 25:
                while (stack.length > 6) {
                  x += stack.shift();
                  y += stack.shift();
                  p.lineTo(x, y);
                }
                c1x = x + stack.shift();
                c1y = y + stack.shift();
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                x = c2x + stack.shift();
                y = c2y + stack.shift();
                p.curveTo(c1x, c1y, c2x, c2y, x, y);
                break;
              case 26:
                if (stack.length % 2) {
                  x += stack.shift();
                }
                while (stack.length > 0) {
                  c1x = x;
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x;
                  y = c2y + stack.shift();
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                break;
              case 27:
                if (stack.length % 2) {
                  y += stack.shift();
                }
                while (stack.length > 0) {
                  c1x = x + stack.shift();
                  c1y = y;
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  y = c2y;
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                break;
              case 28:
                b1 = code[i];
                b2 = code[i + 1];
                stack.push((b1 << 24 | b2 << 16) >> 16);
                i += 2;
                break;
              case 29:
                codeIndex = stack.pop() + font.gsubrsBias;
                subrCode = font.gsubrs[codeIndex];
                if (subrCode) {
                  parse(subrCode);
                }
                break;
              case 30:
                while (stack.length > 0) {
                  c1x = x;
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  y = c2y + (stack.length === 1 ? stack.shift() : 0);
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                  if (stack.length === 0) {
                    break;
                  }
                  c1x = x + stack.shift();
                  c1y = y;
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  y = c2y + stack.shift();
                  x = c2x + (stack.length === 1 ? stack.shift() : 0);
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                break;
              case 31:
                while (stack.length > 0) {
                  c1x = x + stack.shift();
                  c1y = y;
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  y = c2y + stack.shift();
                  x = c2x + (stack.length === 1 ? stack.shift() : 0);
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                  if (stack.length === 0) {
                    break;
                  }
                  c1x = x;
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  y = c2y + (stack.length === 1 ? stack.shift() : 0);
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                break;
              default:
                if (v < 32) {
                  console.log('Glyph ' + index + ': unknown operator ' + v);
                } else if (v < 247) {
                  stack.push(v - 139);
                } else if (v < 251) {
                  b1 = code[i];
                  i += 1;
                  stack.push((v - 247) * 256 + b1 + 108);
                } else if (v < 255) {
                  b1 = code[i];
                  i += 1;
                  stack.push(-(v - 251) * 256 - b1 - 108);
                } else {
                  b1 = code[i];
                  b2 = code[i + 1];
                  b3 = code[i + 2];
                  b4 = code[i + 3];
                  i += 4;
                  stack.push((b1 << 24 | b2 << 16 | b3 << 8 | b4) / 65536);
                }
              }
            }
          }
          parse(code);
          var glyph = new _glyph.Glyph({
              font: font,
              index: index
            });
          glyph.path = p;
          glyph.advanceWidth = width;
          return glyph;
        }
        function calcCFFSubroutineBias(subrs) {
          var bias;
          if (subrs.length < 1240) {
            bias = 107;
          } else if (subrs.length < 33900) {
            bias = 1131;
          } else {
            bias = 32768;
          }
          return bias;
        }
        function parseCFFTable(data, start, font) {
          font.tables.cff = {};
          var header = parseCFFHeader(data, start);
          var nameIndex = parseCFFIndex(data, header.endOffset, parse.bytesToString);
          var topDictIndex = parseCFFIndex(data, nameIndex.endOffset);
          var stringIndex = parseCFFIndex(data, topDictIndex.endOffset, parse.bytesToString);
          var globalSubrIndex = parseCFFIndex(data, stringIndex.endOffset);
          font.gsubrs = globalSubrIndex.objects;
          font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);
          var topDictData = new DataView(new Uint8Array(topDictIndex.objects[0]).buffer);
          var topDict = parseCFFTopDict(topDictData, stringIndex.objects);
          font.tables.cff.topDict = topDict;
          var privateDictOffset = start + topDict['private'][1];
          var privateDict = parseCFFPrivateDict(data, privateDictOffset, topDict['private'][0], stringIndex.objects);
          font.defaultWidthX = privateDict.defaultWidthX;
          font.nominalWidthX = privateDict.nominalWidthX;
          if (privateDict.subrs !== 0) {
            var subrOffset = privateDictOffset + privateDict.subrs;
            var subrIndex = parseCFFIndex(data, subrOffset);
            font.subrs = subrIndex.objects;
            font.subrsBias = calcCFFSubroutineBias(font.subrs);
          } else {
            font.subrs = [];
            font.subrsBias = 0;
          }
          var charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
          font.nGlyphs = charStringsIndex.objects.length;
          var charset = parseCFFCharset(data, start + topDict.charset, font.nGlyphs, stringIndex.objects);
          if (topDict.encoding === 0) {
            font.cffEncoding = new encoding.CffEncoding(encoding.cffStandardEncoding, charset);
          } else if (topDict.encoding === 1) {
            font.cffEncoding = new encoding.CffEncoding(encoding.cffExpertEncoding, charset);
          } else {
            font.cffEncoding = parseCFFEncoding(data, start + topDict.encoding, charset);
          }
          font.encoding = font.encoding || font.cffEncoding;
          font.glyphs = [];
          for (var i = 0; i < font.nGlyphs; i += 1) {
            var charString = charStringsIndex.objects[i];
            font.glyphs.push(parseCFFCharstring(charString, font, i));
          }
        }
        function encodeString(s, strings) {
          var sid;
          var i = encoding.cffStandardStrings.indexOf(s);
          if (i >= 0) {
            sid = i;
          }
          i = strings.indexOf(s);
          if (i >= 0) {
            sid = i + encoding.cffStandardStrings.length;
          } else {
            sid = encoding.cffStandardStrings.length + strings.length;
            strings.push(s);
          }
          return sid;
        }
        function makeHeader() {
          return new table.Table('Header', [
            {
              name: 'major',
              type: 'Card8',
              value: 1
            },
            {
              name: 'minor',
              type: 'Card8',
              value: 0
            },
            {
              name: 'hdrSize',
              type: 'Card8',
              value: 4
            },
            {
              name: 'major',
              type: 'Card8',
              value: 1
            }
          ]);
        }
        function makeNameIndex(fontNames) {
          var t = new table.Table('Name INDEX', [{
                name: 'names',
                type: 'INDEX',
                value: []
              }]);
          t.names = [];
          for (var i = 0; i < fontNames.length; i += 1) {
            t.names.push({
              name: 'name_' + i,
              type: 'NAME',
              value: fontNames[i]
            });
          }
          return t;
        }
        function makeDict(meta, attrs, strings) {
          var m = {};
          for (var i = 0; i < meta.length; i += 1) {
            var entry = meta[i];
            var value = attrs[entry.name];
            if (value !== undefined && !equals(value, entry.value)) {
              if (entry.type === 'SID') {
                value = encodeString(value, strings);
              }
              m[entry.op] = {
                name: entry.name,
                type: entry.type,
                value: value
              };
            }
          }
          return m;
        }
        function makeTopDict(attrs, strings) {
          var t = new table.Table('Top DICT', [{
                name: 'dict',
                type: 'DICT',
                value: {}
              }]);
          t.dict = makeDict(TOP_DICT_META, attrs, strings);
          return t;
        }
        function makeTopDictIndex(topDict) {
          var t = new table.Table('Top DICT INDEX', [{
                name: 'topDicts',
                type: 'INDEX',
                value: []
              }]);
          t.topDicts = [{
              name: 'topDict_0',
              type: 'TABLE',
              value: topDict
            }];
          return t;
        }
        function makeStringIndex(strings) {
          var t = new table.Table('String INDEX', [{
                name: 'strings',
                type: 'INDEX',
                value: []
              }]);
          t.strings = [];
          for (var i = 0; i < strings.length; i += 1) {
            t.strings.push({
              name: 'string_' + i,
              type: 'STRING',
              value: strings[i]
            });
          }
          return t;
        }
        function makeGlobalSubrIndex() {
          return new table.Table('Global Subr INDEX', [{
              name: 'subrs',
              type: 'INDEX',
              value: []
            }]);
        }
        function makeCharsets(glyphNames, strings) {
          var t = new table.Table('Charsets', [{
                name: 'format',
                type: 'Card8',
                value: 0
              }]);
          for (var i = 0; i < glyphNames.length; i += 1) {
            var glyphName = glyphNames[i];
            var glyphSID = encodeString(glyphName, strings);
            t.fields.push({
              name: 'glyph_' + i,
              type: 'SID',
              value: glyphSID
            });
          }
          return t;
        }
        function glyphToOps(glyph) {
          var ops = [];
          var path = glyph.path;
          ops.push({
            name: 'width',
            type: 'NUMBER',
            value: glyph.advanceWidth
          });
          var x = 0;
          var y = 0;
          for (var i = 0; i < path.commands.length; i += 1) {
            var dx;
            var dy;
            var cmd = path.commands[i];
            if (cmd.type === 'Q') {
              var _13 = 1 / 3;
              var _23 = 2 / 3;
              cmd = {
                type: 'C',
                x: cmd.x,
                y: cmd.y,
                x1: _13 * x + _23 * cmd.x1,
                y1: _13 * y + _23 * cmd.y1,
                x2: _13 * cmd.x + _23 * cmd.x1,
                y2: _13 * cmd.y + _23 * cmd.y1
              };
            }
            if (cmd.type === 'M') {
              dx = Math.round(cmd.x - x);
              dy = Math.round(cmd.y - y);
              ops.push({
                name: 'dx',
                type: 'NUMBER',
                value: dx
              });
              ops.push({
                name: 'dy',
                type: 'NUMBER',
                value: dy
              });
              ops.push({
                name: 'rmoveto',
                type: 'OP',
                value: 21
              });
              x = Math.round(cmd.x);
              y = Math.round(cmd.y);
            } else if (cmd.type === 'L') {
              dx = Math.round(cmd.x - x);
              dy = Math.round(cmd.y - y);
              ops.push({
                name: 'dx',
                type: 'NUMBER',
                value: dx
              });
              ops.push({
                name: 'dy',
                type: 'NUMBER',
                value: dy
              });
              ops.push({
                name: 'rlineto',
                type: 'OP',
                value: 5
              });
              x = Math.round(cmd.x);
              y = Math.round(cmd.y);
            } else if (cmd.type === 'C') {
              var dx1 = Math.round(cmd.x1 - x);
              var dy1 = Math.round(cmd.y1 - y);
              var dx2 = Math.round(cmd.x2 - cmd.x1);
              var dy2 = Math.round(cmd.y2 - cmd.y1);
              dx = Math.round(cmd.x - cmd.x2);
              dy = Math.round(cmd.y - cmd.y2);
              ops.push({
                name: 'dx1',
                type: 'NUMBER',
                value: dx1
              });
              ops.push({
                name: 'dy1',
                type: 'NUMBER',
                value: dy1
              });
              ops.push({
                name: 'dx2',
                type: 'NUMBER',
                value: dx2
              });
              ops.push({
                name: 'dy2',
                type: 'NUMBER',
                value: dy2
              });
              ops.push({
                name: 'dx',
                type: 'NUMBER',
                value: dx
              });
              ops.push({
                name: 'dy',
                type: 'NUMBER',
                value: dy
              });
              ops.push({
                name: 'rrcurveto',
                type: 'OP',
                value: 8
              });
              x = Math.round(cmd.x);
              y = Math.round(cmd.y);
            }
          }
          ops.push({
            name: 'endchar',
            type: 'OP',
            value: 14
          });
          return ops;
        }
        function makeCharStringsIndex(glyphs) {
          var t = new table.Table('CharStrings INDEX', [{
                name: 'charStrings',
                type: 'INDEX',
                value: []
              }]);
          for (var i = 0; i < glyphs.length; i += 1) {
            var glyph = glyphs[i];
            var ops = glyphToOps(glyph);
            t.charStrings.push({
              name: glyph.name,
              type: 'CHARSTRING',
              value: ops
            });
          }
          return t;
        }
        function makePrivateDict(attrs, strings) {
          var t = new table.Table('Private DICT', [{
                name: 'dict',
                type: 'DICT',
                value: {}
              }]);
          t.dict = makeDict(PRIVATE_DICT_META, attrs, strings);
          return t;
        }
        function makePrivateDictIndex(privateDict) {
          var t = new table.Table('Private DICT INDEX', [{
                name: 'privateDicts',
                type: 'INDEX',
                value: []
              }]);
          t.privateDicts = [{
              name: 'privateDict_0',
              type: 'TABLE',
              value: privateDict
            }];
          return t;
        }
        function makeCFFTable(glyphs, options) {
          var t = new table.Table('CFF ', [
              {
                name: 'header',
                type: 'TABLE'
              },
              {
                name: 'nameIndex',
                type: 'TABLE'
              },
              {
                name: 'topDictIndex',
                type: 'TABLE'
              },
              {
                name: 'stringIndex',
                type: 'TABLE'
              },
              {
                name: 'globalSubrIndex',
                type: 'TABLE'
              },
              {
                name: 'charsets',
                type: 'TABLE'
              },
              {
                name: 'charStringsIndex',
                type: 'TABLE'
              },
              {
                name: 'privateDictIndex',
                type: 'TABLE'
              }
            ]);
          var attrs = {
              version: options.version,
              fullName: options.fullName,
              familyName: options.familyName,
              weight: options.weightName,
              charset: 999,
              encoding: 0,
              charStrings: 999,
              private: [
                0,
                999
              ]
            };
          var privateAttrs = {};
          var glyphNames = [];
          for (var i = 1; i < glyphs.length; i += 1) {
            glyphNames.push(glyphs[i].name);
          }
          var strings = [];
          t.header = makeHeader();
          t.nameIndex = makeNameIndex([options.postScriptName]);
          var topDict = makeTopDict(attrs, strings);
          t.topDictIndex = makeTopDictIndex(topDict);
          t.globalSubrIndex = makeGlobalSubrIndex();
          t.charsets = makeCharsets(glyphNames, strings);
          t.charStringsIndex = makeCharStringsIndex(glyphs);
          var privateDict = makePrivateDict(privateAttrs, strings);
          t.privateDictIndex = makePrivateDictIndex(privateDict);
          t.stringIndex = makeStringIndex(strings);
          var startOffset = t.header.sizeOf() + t.nameIndex.sizeOf() + t.topDictIndex.sizeOf() + t.stringIndex.sizeOf() + t.globalSubrIndex.sizeOf();
          attrs.charset = startOffset;
          attrs.encoding = 0;
          attrs.charStrings = attrs.charset + t.charsets.sizeOf();
          attrs.private[1] = attrs.charStrings + t.charStringsIndex.sizeOf();
          topDict = makeTopDict(attrs, strings);
          t.topDictIndex = makeTopDictIndex(topDict);
          return t;
        }
        exports.parse = parseCFFTable;
        exports.make = makeCFFTable;
      },
      {
        '../encoding': 3,
        '../glyph': 5,
        '../parse': 7,
        '../path': 8,
        '../table': 9
      }
    ],
    11: [
      function (require, module, exports) {
        'use strict';
        var check = check;
        var parse = parse;
        var table = table;
        function parseCmapTable(data, start) {
          var i;
          var cmap = {};
          cmap.version = parse.getUShort(data, start);
          check.argument(cmap.version === 0, 'cmap table version should be 0.');
          cmap.numTables = parse.getUShort(data, start + 2);
          var offset = -1;
          for (i = 0; i < cmap.numTables; i += 1) {
            var platformId = parse.getUShort(data, start + 4 + i * 8);
            var encodingId = parse.getUShort(data, start + 4 + i * 8 + 2);
            if (platformId === 3 && (encodingId === 1 || encodingId === 0)) {
              offset = parse.getULong(data, start + 4 + i * 8 + 4);
              break;
            }
          }
          if (offset === -1) {
            return null;
          }
          var p = new parse.Parser(data, start + offset);
          cmap.format = p.parseUShort();
          check.argument(cmap.format === 4, 'Only format 4 cmap tables are supported.');
          cmap.length = p.parseUShort();
          cmap.language = p.parseUShort();
          var segCount;
          cmap.segCount = segCount = p.parseUShort() >> 1;
          p.skip('uShort', 3);
          cmap.glyphIndexMap = {};
          var endCountParser = new parse.Parser(data, start + offset + 14);
          var startCountParser = new parse.Parser(data, start + offset + 16 + segCount * 2);
          var idDeltaParser = new parse.Parser(data, start + offset + 16 + segCount * 4);
          var idRangeOffsetParser = new parse.Parser(data, start + offset + 16 + segCount * 6);
          var glyphIndexOffset = start + offset + 16 + segCount * 8;
          for (i = 0; i < segCount - 1; i += 1) {
            var glyphIndex;
            var endCount = endCountParser.parseUShort();
            var startCount = startCountParser.parseUShort();
            var idDelta = idDeltaParser.parseShort();
            var idRangeOffset = idRangeOffsetParser.parseUShort();
            for (var c = startCount; c <= endCount; c += 1) {
              if (idRangeOffset !== 0) {
                glyphIndexOffset = idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2;
                glyphIndexOffset += idRangeOffset;
                glyphIndexOffset += (c - startCount) * 2;
                glyphIndex = parse.getUShort(data, glyphIndexOffset);
                if (glyphIndex !== 0) {
                  glyphIndex = glyphIndex + idDelta & 65535;
                }
              } else {
                glyphIndex = c + idDelta & 65535;
              }
              cmap.glyphIndexMap[c] = glyphIndex;
            }
          }
          return cmap;
        }
        function addSegment(t, code, glyphIndex) {
          t.segments.push({
            end: code,
            start: code,
            delta: -(code - glyphIndex),
            offset: 0
          });
        }
        function addTerminatorSegment(t) {
          t.segments.push({
            end: 65535,
            start: 65535,
            delta: 1,
            offset: 0
          });
        }
        function makeCmapTable(glyphs) {
          var i;
          var t = new table.Table('cmap', [
              {
                name: 'version',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'numTables',
                type: 'USHORT',
                value: 1
              },
              {
                name: 'platformID',
                type: 'USHORT',
                value: 3
              },
              {
                name: 'encodingID',
                type: 'USHORT',
                value: 1
              },
              {
                name: 'offset',
                type: 'ULONG',
                value: 12
              },
              {
                name: 'format',
                type: 'USHORT',
                value: 4
              },
              {
                name: 'length',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'language',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'segCountX2',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'searchRange',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'entrySelector',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'rangeShift',
                type: 'USHORT',
                value: 0
              }
            ]);
          t.segments = [];
          for (i = 0; i < glyphs.length; i += 1) {
            var glyph = glyphs[i];
            for (var j = 0; j < glyph.unicodes.length; j += 1) {
              addSegment(t, glyph.unicodes[j], i);
            }
            t.segments = t.segments.sort(function (a, b) {
              return a.start - b.start;
            });
          }
          addTerminatorSegment(t);
          var segCount;
          segCount = t.segments.length;
          t.segCountX2 = segCount * 2;
          t.searchRange = Math.pow(2, Math.floor(Math.log(segCount) / Math.log(2))) * 2;
          t.entrySelector = Math.log(t.searchRange / 2) / Math.log(2);
          t.rangeShift = t.segCountX2 - t.searchRange;
          var endCounts = [];
          var startCounts = [];
          var idDeltas = [];
          var idRangeOffsets = [];
          var glyphIds = [];
          for (i = 0; i < segCount; i += 1) {
            var segment = t.segments[i];
            endCounts = endCounts.concat({
              name: 'end_' + i,
              type: 'USHORT',
              value: segment.end
            });
            startCounts = startCounts.concat({
              name: 'start_' + i,
              type: 'USHORT',
              value: segment.start
            });
            idDeltas = idDeltas.concat({
              name: 'idDelta_' + i,
              type: 'SHORT',
              value: segment.delta
            });
            idRangeOffsets = idRangeOffsets.concat({
              name: 'idRangeOffset_' + i,
              type: 'USHORT',
              value: segment.offset
            });
            if (segment.glyphId !== undefined) {
              glyphIds = glyphIds.concat({
                name: 'glyph_' + i,
                type: 'USHORT',
                value: segment.glyphId
              });
            }
          }
          t.fields = t.fields.concat(endCounts);
          t.fields.push({
            name: 'reservedPad',
            type: 'USHORT',
            value: 0
          });
          t.fields = t.fields.concat(startCounts);
          t.fields = t.fields.concat(idDeltas);
          t.fields = t.fields.concat(idRangeOffsets);
          t.fields = t.fields.concat(glyphIds);
          t.length = 14 + endCounts.length * 2 + 2 + startCounts.length * 2 + idDeltas.length * 2 + idRangeOffsets.length * 2 + glyphIds.length * 2;
          return t;
        }
        exports.parse = parseCmapTable;
        exports.make = makeCmapTable;
      },
      {
        '../check': 1,
        '../parse': 7,
        '../table': 9
      }
    ],
    12: [
      function (require, module, exports) {
        'use strict';
        var check = check;
        var _glyph = glyph;
        var parse = parse;
        var path = path;
        function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
          var v;
          if ((flag & shortVectorBitMask) > 0) {
            v = p.parseByte();
            if ((flag & sameBitMask) === 0) {
              v = -v;
            }
            v = previousValue + v;
          } else {
            if ((flag & sameBitMask) > 0) {
              v = previousValue;
            } else {
              v = previousValue + p.parseShort();
            }
          }
          return v;
        }
        function parseGlyph(data, start, index, font) {
          var p = new parse.Parser(data, start);
          var glyph = new _glyph.Glyph({
              font: font,
              index: index
            });
          glyph.numberOfContours = p.parseShort();
          glyph.xMin = p.parseShort();
          glyph.yMin = p.parseShort();
          glyph.xMax = p.parseShort();
          glyph.yMax = p.parseShort();
          var flags;
          var flag;
          if (glyph.numberOfContours > 0) {
            var i;
            var endPointIndices = glyph.endPointIndices = [];
            for (i = 0; i < glyph.numberOfContours; i += 1) {
              endPointIndices.push(p.parseUShort());
            }
            glyph.instructionLength = p.parseUShort();
            glyph.instructions = [];
            for (i = 0; i < glyph.instructionLength; i += 1) {
              glyph.instructions.push(p.parseByte());
            }
            var numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
            flags = [];
            for (i = 0; i < numberOfCoordinates; i += 1) {
              flag = p.parseByte();
              flags.push(flag);
              if ((flag & 8) > 0) {
                var repeatCount = p.parseByte();
                for (var j = 0; j < repeatCount; j += 1) {
                  flags.push(flag);
                  i += 1;
                }
              }
            }
            check.argument(flags.length === numberOfCoordinates, 'Bad flags.');
            if (endPointIndices.length > 0) {
              var points = [];
              var point;
              if (numberOfCoordinates > 0) {
                for (i = 0; i < numberOfCoordinates; i += 1) {
                  flag = flags[i];
                  point = {};
                  point.onCurve = !!(flag & 1);
                  point.lastPointOfContour = endPointIndices.indexOf(i) >= 0;
                  points.push(point);
                }
                var px = 0;
                for (i = 0; i < numberOfCoordinates; i += 1) {
                  flag = flags[i];
                  point = points[i];
                  point.x = parseGlyphCoordinate(p, flag, px, 2, 16);
                  px = point.x;
                }
                var py = 0;
                for (i = 0; i < numberOfCoordinates; i += 1) {
                  flag = flags[i];
                  point = points[i];
                  point.y = parseGlyphCoordinate(p, flag, py, 4, 32);
                  py = point.y;
                }
              }
              glyph.points = points;
            } else {
              glyph.points = [];
            }
          } else if (glyph.numberOfContours === 0) {
            glyph.points = [];
          } else {
            glyph.isComposite = true;
            glyph.points = [];
            glyph.components = [];
            var moreComponents = true;
            while (moreComponents) {
              flags = p.parseUShort();
              var component = {
                  glyphIndex: p.parseUShort(),
                  xScale: 1,
                  scale01: 0,
                  scale10: 0,
                  yScale: 1,
                  dx: 0,
                  dy: 0
                };
              if ((flags & 1) > 0) {
                component.dx = p.parseShort();
                component.dy = p.parseShort();
              } else {
                component.dx = p.parseChar();
                component.dy = p.parseChar();
              }
              if ((flags & 8) > 0) {
                component.xScale = component.yScale = p.parseF2Dot14();
              } else if ((flags & 64) > 0) {
                component.xScale = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
              } else if ((flags & 128) > 0) {
                component.xScale = p.parseF2Dot14();
                component.scale01 = p.parseF2Dot14();
                component.scale10 = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
              }
              glyph.components.push(component);
              moreComponents = !!(flags & 32);
            }
          }
          return glyph;
        }
        function transformPoints(points, transform) {
          var newPoints = [];
          for (var i = 0; i < points.length; i += 1) {
            var pt = points[i];
            var newPt = {
                x: transform.xScale * pt.x + transform.scale01 * pt.y + transform.dx,
                y: transform.scale10 * pt.x + transform.yScale * pt.y + transform.dy,
                onCurve: pt.onCurve,
                lastPointOfContour: pt.lastPointOfContour
              };
            newPoints.push(newPt);
          }
          return newPoints;
        }
        function getContours(points) {
          var contours = [];
          var currentContour = [];
          for (var i = 0; i < points.length; i += 1) {
            var pt = points[i];
            currentContour.push(pt);
            if (pt.lastPointOfContour) {
              contours.push(currentContour);
              currentContour = [];
            }
          }
          check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
          return contours;
        }
        function getPath(points) {
          var p = new path.Path();
          if (!points) {
            return p;
          }
          var contours = getContours(points);
          for (var i = 0; i < contours.length; i += 1) {
            var contour = contours[i];
            var firstPt = contour[0];
            var lastPt = contour[contour.length - 1];
            var curvePt;
            var realFirstPoint;
            if (firstPt.onCurve) {
              curvePt = null;
              realFirstPoint = true;
            } else {
              if (lastPt.onCurve) {
                firstPt = lastPt;
              } else {
                firstPt = {
                  x: (firstPt.x + lastPt.x) / 2,
                  y: (firstPt.y + lastPt.y) / 2
                };
              }
              curvePt = firstPt;
              realFirstPoint = false;
            }
            p.moveTo(firstPt.x, firstPt.y);
            for (var j = realFirstPoint ? 1 : 0; j < contour.length; j += 1) {
              var pt = contour[j];
              var prevPt = j === 0 ? firstPt : contour[j - 1];
              if (prevPt.onCurve && pt.onCurve) {
                p.lineTo(pt.x, pt.y);
              } else if (prevPt.onCurve && !pt.onCurve) {
                curvePt = pt;
              } else if (!prevPt.onCurve && !pt.onCurve) {
                var midPt = {
                    x: (prevPt.x + pt.x) / 2,
                    y: (prevPt.y + pt.y) / 2
                  };
                p.quadraticCurveTo(prevPt.x, prevPt.y, midPt.x, midPt.y);
                curvePt = pt;
              } else if (!prevPt.onCurve && pt.onCurve) {
                p.quadraticCurveTo(curvePt.x, curvePt.y, pt.x, pt.y);
                curvePt = null;
              } else {
                throw new Error('Invalid state.');
              }
            }
            if (firstPt !== lastPt) {
              if (curvePt) {
                p.quadraticCurveTo(curvePt.x, curvePt.y, firstPt.x, firstPt.y);
              } else {
                p.lineTo(firstPt.x, firstPt.y);
              }
            }
          }
          p.closePath();
          return p;
        }
        function parseGlyfTable(data, start, loca, font) {
          var glyphs = [];
          var i;
          for (i = 0; i < loca.length - 1; i += 1) {
            var offset = loca[i];
            var nextOffset = loca[i + 1];
            if (offset !== nextOffset) {
              glyphs.push(parseGlyph(data, start + offset, i, font));
            } else {
              glyphs.push(new _glyph.Glyph({
                font: font,
                index: i
              }));
            }
          }
          for (i = 0; i < glyphs.length; i += 1) {
            var glyph = glyphs[i];
            if (glyph.isComposite) {
              for (var j = 0; j < glyph.components.length; j += 1) {
                var component = glyph.components[j];
                var componentGlyph = glyphs[component.glyphIndex];
                if (componentGlyph.points) {
                  var transformedPoints = transformPoints(componentGlyph.points, component);
                  glyph.points = glyph.points.concat(transformedPoints);
                }
              }
            }
            glyph.path = getPath(glyph.points);
          }
          return glyphs;
        }
        exports.parse = parseGlyfTable;
      },
      {
        '../check': 1,
        '../glyph': 5,
        '../parse': 7,
        '../path': 8
      }
    ],
    13: [
      function (require, module, exports) {
        'use strict';
        var check = check;
        var parse = parse;
        function parseTaggedListTable(data, start) {
          var p = new parse.Parser(data, start);
          var n = p.parseUShort();
          var list = [];
          for (var i = 0; i < n; i++) {
            list[p.parseTag()] = { offset: p.parseUShort() };
          }
          return list;
        }
        function parseCoverageTable(data, start) {
          var p = new parse.Parser(data, start);
          var format = p.parseUShort();
          var count = p.parseUShort();
          if (format === 1) {
            return p.parseUShortList(count);
          } else if (format === 2) {
            var coverage = [];
            for (; count--;) {
              var begin = p.parseUShort();
              var end = p.parseUShort();
              var index = p.parseUShort();
              for (var i = begin; i <= end; i++) {
                coverage[index++] = i;
              }
            }
            return coverage;
          }
        }
        function parseClassDefTable(data, start) {
          var p = new parse.Parser(data, start);
          var format = p.parseUShort();
          if (format === 1) {
            var startGlyph = p.parseUShort();
            var glyphCount = p.parseUShort();
            var classes = p.parseUShortList(glyphCount);
            return function (glyphID) {
              return classes[glyphID - startGlyph] || 0;
            };
          } else if (format === 2) {
            var rangeCount = p.parseUShort();
            var startGlyphs = [];
            var endGlyphs = [];
            var classValues = [];
            for (var i = 0; i < rangeCount; i++) {
              startGlyphs[i] = p.parseUShort();
              endGlyphs[i] = p.parseUShort();
              classValues[i] = p.parseUShort();
            }
            return function (glyphID) {
              var l = 0;
              var r = startGlyphs.length - 1;
              while (l < r) {
                var c = l + r + 1 >> 1;
                if (glyphID < startGlyphs[c]) {
                  r = c - 1;
                } else {
                  l = c;
                }
              }
              if (startGlyphs[l] <= glyphID && glyphID <= endGlyphs[l]) {
                return classValues[l] || 0;
              }
              return 0;
            };
          }
        }
        function parsePairPosSubTable(data, start) {
          var p = new parse.Parser(data, start);
          var format = p.parseUShort();
          var coverageOffset = p.parseUShort();
          var coverage = parseCoverageTable(data, start + coverageOffset);
          var valueFormat1 = p.parseUShort();
          var valueFormat2 = p.parseUShort();
          var value1;
          var value2;
          if (valueFormat1 !== 4 || valueFormat2 !== 0)
            return;
          var sharedPairSets = {};
          if (format === 1) {
            var pairSetCount = p.parseUShort();
            var pairSet = [];
            var pairSetOffsets = p.parseOffset16List(pairSetCount);
            for (var firstGlyph = 0; firstGlyph < pairSetCount; firstGlyph++) {
              var pairSetOffset = pairSetOffsets[firstGlyph];
              var sharedPairSet = sharedPairSets[pairSetOffset];
              if (!sharedPairSet) {
                sharedPairSet = {};
                p.relativeOffset = pairSetOffset;
                var pairValueCount = p.parseUShort();
                for (; pairValueCount--;) {
                  var secondGlyph = p.parseUShort();
                  if (valueFormat1)
                    value1 = p.parseShort();
                  if (valueFormat2)
                    value2 = p.parseShort();
                  sharedPairSet[secondGlyph] = value1;
                }
              }
              pairSet[coverage[firstGlyph]] = sharedPairSet;
            }
            return function (leftGlyph, rightGlyph) {
              var pairs = pairSet[leftGlyph];
              if (pairs)
                return pairs[rightGlyph];
            };
          } else if (format === 2) {
            var classDef1Offset = p.parseUShort();
            var classDef2Offset = p.parseUShort();
            var class1Count = p.parseUShort();
            var class2Count = p.parseUShort();
            var getClass1 = parseClassDefTable(data, start + classDef1Offset);
            var getClass2 = parseClassDefTable(data, start + classDef2Offset);
            var kerningMatrix = [];
            for (var i = 0; i < class1Count; i++) {
              var kerningRow = kerningMatrix[i] = [];
              for (var j = 0; j < class2Count; j++) {
                if (valueFormat1)
                  value1 = p.parseShort();
                if (valueFormat2)
                  value2 = p.parseShort();
                kerningRow[j] = value1;
              }
            }
            var covered = {};
            for (i = 0; i < coverage.length; i++)
              covered[coverage[i]] = 1;
            return function (leftGlyph, rightGlyph) {
              if (!covered[leftGlyph])
                return;
              var class1 = getClass1(leftGlyph);
              var class2 = getClass2(rightGlyph);
              var kerningRow = kerningMatrix[class1];
              if (kerningRow) {
                return kerningRow[class2];
              }
            };
          }
        }
        function parseLookupTable(data, start) {
          var p = new parse.Parser(data, start);
          var lookupType = p.parseUShort();
          var lookupFlag = p.parseUShort();
          var useMarkFilteringSet = lookupFlag & 16;
          var subTableCount = p.parseUShort();
          var subTableOffsets = p.parseOffset16List(subTableCount);
          var table = {
              lookupType: lookupType,
              lookupFlag: lookupFlag,
              markFilteringSet: useMarkFilteringSet ? p.parseUShort() : -1
            };
          if (lookupType === 2) {
            var subtables = [];
            for (var i = 0; i < subTableCount; i++) {
              subtables.push(parsePairPosSubTable(data, start + subTableOffsets[i]));
            }
            table.getKerningValue = function (leftGlyph, rightGlyph) {
              for (var i = subtables.length; i--;) {
                var value = subtables[i](leftGlyph, rightGlyph);
                if (value !== undefined)
                  return value;
              }
              return 0;
            };
          }
          return table;
        }
        function parseGposTable(data, start, font) {
          var p = new parse.Parser(data, start);
          var tableVersion = p.parseFixed();
          check.argument(tableVersion === 1, 'Unsupported GPOS table version.');
          parseTaggedListTable(data, start + p.parseUShort());
          parseTaggedListTable(data, start + p.parseUShort());
          var lookupListOffset = p.parseUShort();
          p.relativeOffset = lookupListOffset;
          var lookupCount = p.parseUShort();
          var lookupTableOffsets = p.parseOffset16List(lookupCount);
          var lookupListAbsoluteOffset = start + lookupListOffset;
          for (var i = 0; i < lookupCount; i++) {
            var table = parseLookupTable(data, lookupListAbsoluteOffset + lookupTableOffsets[i]);
            if (table.lookupType === 2 && !font.getGposKerningValue)
              font.getGposKerningValue = table.getKerningValue;
          }
        }
        exports.parse = parseGposTable;
      },
      {
        '../check': 1,
        '../parse': 7
      }
    ],
    14: [
      function (require, module, exports) {
        'use strict';
        var check = check;
        var parse = parse;
        var table = table;
        function parseHeadTable(data, start) {
          var head = {};
          var p = new parse.Parser(data, start);
          head.version = p.parseVersion();
          head.fontRevision = Math.round(p.parseFixed() * 1000) / 1000;
          head.checkSumAdjustment = p.parseULong();
          head.magicNumber = p.parseULong();
          check.argument(head.magicNumber === 1594834165, 'Font header has wrong magic number.');
          head.flags = p.parseUShort();
          head.unitsPerEm = p.parseUShort();
          head.created = p.parseLongDateTime();
          head.modified = p.parseLongDateTime();
          head.xMin = p.parseShort();
          head.yMin = p.parseShort();
          head.xMax = p.parseShort();
          head.yMax = p.parseShort();
          head.macStyle = p.parseUShort();
          head.lowestRecPPEM = p.parseUShort();
          head.fontDirectionHint = p.parseShort();
          head.indexToLocFormat = p.parseShort();
          head.glyphDataFormat = p.parseShort();
          return head;
        }
        function makeHeadTable(options) {
          return new table.Table('head', [
            {
              name: 'version',
              type: 'FIXED',
              value: 65536
            },
            {
              name: 'fontRevision',
              type: 'FIXED',
              value: 65536
            },
            {
              name: 'checkSumAdjustment',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'magicNumber',
              type: 'ULONG',
              value: 1594834165
            },
            {
              name: 'flags',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'unitsPerEm',
              type: 'USHORT',
              value: 1000
            },
            {
              name: 'created',
              type: 'LONGDATETIME',
              value: 0
            },
            {
              name: 'modified',
              type: 'LONGDATETIME',
              value: 0
            },
            {
              name: 'xMin',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'yMin',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'xMax',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'yMax',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'macStyle',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'lowestRecPPEM',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'fontDirectionHint',
              type: 'SHORT',
              value: 2
            },
            {
              name: 'indexToLocFormat',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'glyphDataFormat',
              type: 'SHORT',
              value: 0
            }
          ], options);
        }
        exports.parse = parseHeadTable;
        exports.make = makeHeadTable;
      },
      {
        '../check': 1,
        '../parse': 7,
        '../table': 9
      }
    ],
    15: [
      function (require, module, exports) {
        'use strict';
        var parse = parse;
        var table = table;
        function parseHheaTable(data, start) {
          var hhea = {};
          var p = new parse.Parser(data, start);
          hhea.version = p.parseVersion();
          hhea.ascender = p.parseShort();
          hhea.descender = p.parseShort();
          hhea.lineGap = p.parseShort();
          hhea.advanceWidthMax = p.parseUShort();
          hhea.minLeftSideBearing = p.parseShort();
          hhea.minRightSideBearing = p.parseShort();
          hhea.xMaxExtent = p.parseShort();
          hhea.caretSlopeRise = p.parseShort();
          hhea.caretSlopeRun = p.parseShort();
          hhea.caretOffset = p.parseShort();
          p.relativeOffset += 8;
          hhea.metricDataFormat = p.parseShort();
          hhea.numberOfHMetrics = p.parseUShort();
          return hhea;
        }
        function makeHheaTable(options) {
          return new table.Table('hhea', [
            {
              name: 'version',
              type: 'FIXED',
              value: 65536
            },
            {
              name: 'ascender',
              type: 'FWORD',
              value: 0
            },
            {
              name: 'descender',
              type: 'FWORD',
              value: 0
            },
            {
              name: 'lineGap',
              type: 'FWORD',
              value: 0
            },
            {
              name: 'advanceWidthMax',
              type: 'UFWORD',
              value: 0
            },
            {
              name: 'minLeftSideBearing',
              type: 'FWORD',
              value: 0
            },
            {
              name: 'minRightSideBearing',
              type: 'FWORD',
              value: 0
            },
            {
              name: 'xMaxExtent',
              type: 'FWORD',
              value: 0
            },
            {
              name: 'caretSlopeRise',
              type: 'SHORT',
              value: 1
            },
            {
              name: 'caretSlopeRun',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'caretOffset',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'reserved1',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'reserved2',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'reserved3',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'reserved4',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'metricDataFormat',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'numberOfHMetrics',
              type: 'USHORT',
              value: 0
            }
          ], options);
        }
        exports.parse = parseHheaTable;
        exports.make = makeHheaTable;
      },
      {
        '../parse': 7,
        '../table': 9
      }
    ],
    16: [
      function (require, module, exports) {
        'use strict';
        var parse = parse;
        var table = table;
        function parseHmtxTable(data, start, numMetrics, numGlyphs, glyphs) {
          var advanceWidth;
          var leftSideBearing;
          var p = new parse.Parser(data, start);
          for (var i = 0; i < numGlyphs; i += 1) {
            if (i < numMetrics) {
              advanceWidth = p.parseUShort();
              leftSideBearing = p.parseShort();
            }
            var glyph = glyphs[i];
            glyph.advanceWidth = advanceWidth;
            glyph.leftSideBearing = leftSideBearing;
          }
        }
        function makeHmtxTable(glyphs) {
          var t = new table.Table('hmtx', []);
          for (var i = 0; i < glyphs.length; i += 1) {
            var glyph = glyphs[i];
            var advanceWidth = glyph.advanceWidth || 0;
            var leftSideBearing = glyph.leftSideBearing || 0;
            t.fields.push({
              name: 'advanceWidth_' + i,
              type: 'USHORT',
              value: advanceWidth
            });
            t.fields.push({
              name: 'leftSideBearing_' + i,
              type: 'SHORT',
              value: leftSideBearing
            });
          }
          return t;
        }
        exports.parse = parseHmtxTable;
        exports.make = makeHmtxTable;
      },
      {
        '../parse': 7,
        '../table': 9
      }
    ],
    17: [
      function (require, module, exports) {
        'use strict';
        var check = check;
        var parse = parse;
        function parseKernTable(data, start) {
          var pairs = {};
          var p = new parse.Parser(data, start);
          var tableVersion = p.parseUShort();
          check.argument(tableVersion === 0, 'Unsupported kern table version.');
          p.skip('uShort', 1);
          var subTableVersion = p.parseUShort();
          check.argument(subTableVersion === 0, 'Unsupported kern sub-table version.');
          p.skip('uShort', 2);
          var nPairs = p.parseUShort();
          p.skip('uShort', 3);
          for (var i = 0; i < nPairs; i += 1) {
            var leftIndex = p.parseUShort();
            var rightIndex = p.parseUShort();
            var value = p.parseShort();
            pairs[leftIndex + ',' + rightIndex] = value;
          }
          return pairs;
        }
        exports.parse = parseKernTable;
      },
      {
        '../check': 1,
        '../parse': 7
      }
    ],
    18: [
      function (require, module, exports) {
        'use strict';
        var parse = parse;
        function parseLocaTable(data, start, numGlyphs, shortVersion) {
          var p = new parse.Parser(data, start);
          var parseFn = shortVersion ? p.parseUShort : p.parseULong;
          var glyphOffsets = [];
          for (var i = 0; i < numGlyphs + 1; i += 1) {
            var glyphOffset = parseFn.call(p);
            if (shortVersion) {
              glyphOffset *= 2;
            }
            glyphOffsets.push(glyphOffset);
          }
          return glyphOffsets;
        }
        exports.parse = parseLocaTable;
      },
      { '../parse': 7 }
    ],
    19: [
      function (require, module, exports) {
        'use strict';
        var parse = parse;
        var table = table;
        function parseMaxpTable(data, start) {
          var maxp = {};
          var p = new parse.Parser(data, start);
          maxp.version = p.parseVersion();
          maxp.numGlyphs = p.parseUShort();
          if (maxp.version === 1) {
            maxp.maxPoints = p.parseUShort();
            maxp.maxContours = p.parseUShort();
            maxp.maxCompositePoints = p.parseUShort();
            maxp.maxCompositeContours = p.parseUShort();
            maxp.maxZones = p.parseUShort();
            maxp.maxTwilightPoints = p.parseUShort();
            maxp.maxStorage = p.parseUShort();
            maxp.maxFunctionDefs = p.parseUShort();
            maxp.maxInstructionDefs = p.parseUShort();
            maxp.maxStackElements = p.parseUShort();
            maxp.maxSizeOfInstructions = p.parseUShort();
            maxp.maxComponentElements = p.parseUShort();
            maxp.maxComponentDepth = p.parseUShort();
          }
          return maxp;
        }
        function makeMaxpTable(numGlyphs) {
          return new table.Table('maxp', [
            {
              name: 'version',
              type: 'FIXED',
              value: 20480
            },
            {
              name: 'numGlyphs',
              type: 'USHORT',
              value: numGlyphs
            }
          ]);
        }
        exports.parse = parseMaxpTable;
        exports.make = makeMaxpTable;
      },
      {
        '../parse': 7,
        '../table': 9
      }
    ],
    20: [
      function (require, module, exports) {
        'use strict';
        var encode = types.encode;
        var parse = parse;
        var table = table;
        var nameTableNames = [
            'copyright',
            'fontFamily',
            'fontSubfamily',
            'uniqueID',
            'fullName',
            'version',
            'postScriptName',
            'trademark',
            'manufacturer',
            'designer',
            'description',
            'manufacturerURL',
            'designerURL',
            'licence',
            'licenceURL',
            'reserved',
            'preferredFamily',
            'preferredSubfamily',
            'compatibleFullName',
            'sampleText',
            'postScriptFindFontName',
            'wwsFamily',
            'wwsSubfamily'
          ];
        function parseNameTable(data, start) {
          var name = {};
          var p = new parse.Parser(data, start);
          name.format = p.parseUShort();
          var count = p.parseUShort();
          var stringOffset = p.offset + p.parseUShort();
          var unknownCount = 0;
          for (var i = 0; i < count; i++) {
            var platformID = p.parseUShort();
            var encodingID = p.parseUShort();
            var languageID = p.parseUShort();
            var nameID = p.parseUShort();
            var property = nameTableNames[nameID];
            var byteLength = p.parseUShort();
            var offset = p.parseUShort();
            if (platformID === 3 && encodingID === 1 && languageID === 1033) {
              var codePoints = [];
              var length = byteLength / 2;
              for (var j = 0; j < length; j++, offset += 2) {
                codePoints[j] = parse.getShort(data, stringOffset + offset);
              }
              var str = String.fromCharCode.apply(null, codePoints);
              if (property) {
                name[property] = str;
              } else {
                unknownCount++;
                name['unknown' + unknownCount] = str;
              }
            }
          }
          if (name.format === 1) {
            name.langTagCount = p.parseUShort();
          }
          return name;
        }
        function makeNameRecord(platformID, encodingID, languageID, nameID, length, offset) {
          return new table.Table('NameRecord', [
            {
              name: 'platformID',
              type: 'USHORT',
              value: platformID
            },
            {
              name: 'encodingID',
              type: 'USHORT',
              value: encodingID
            },
            {
              name: 'languageID',
              type: 'USHORT',
              value: languageID
            },
            {
              name: 'nameID',
              type: 'USHORT',
              value: nameID
            },
            {
              name: 'length',
              type: 'USHORT',
              value: length
            },
            {
              name: 'offset',
              type: 'USHORT',
              value: offset
            }
          ]);
        }
        function addMacintoshNameRecord(t, recordID, s, offset) {
          var stringBytes = encode.STRING(s);
          t.records.push(makeNameRecord(1, 0, 0, recordID, stringBytes.length, offset));
          t.strings.push(stringBytes);
          offset += stringBytes.length;
          return offset;
        }
        function addWindowsNameRecord(t, recordID, s, offset) {
          var utf16Bytes = encode.UTF16(s);
          t.records.push(makeNameRecord(3, 1, 1033, recordID, utf16Bytes.length, offset));
          t.strings.push(utf16Bytes);
          offset += utf16Bytes.length;
          return offset;
        }
        function makeNameTable(options) {
          var t = new table.Table('name', [
              {
                name: 'format',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'count',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'stringOffset',
                type: 'USHORT',
                value: 0
              }
            ]);
          t.records = [];
          t.strings = [];
          var offset = 0;
          var i;
          var s;
          for (i = 0; i < nameTableNames.length; i += 1) {
            if (options[nameTableNames[i]] !== undefined) {
              s = options[nameTableNames[i]];
              offset = addMacintoshNameRecord(t, i, s, offset);
            }
          }
          for (i = 0; i < nameTableNames.length; i += 1) {
            if (options[nameTableNames[i]] !== undefined) {
              s = options[nameTableNames[i]];
              offset = addWindowsNameRecord(t, i, s, offset);
            }
          }
          t.count = t.records.length;
          t.stringOffset = 6 + t.count * 12;
          for (i = 0; i < t.records.length; i += 1) {
            t.fields.push({
              name: 'record_' + i,
              type: 'TABLE',
              value: t.records[i]
            });
          }
          for (i = 0; i < t.strings.length; i += 1) {
            t.fields.push({
              name: 'string_' + i,
              type: 'LITERAL',
              value: t.strings[i]
            });
          }
          return t;
        }
        exports.parse = parseNameTable;
        exports.make = makeNameTable;
      },
      {
        '../parse': 7,
        '../table': 9,
        '../types': 24
      }
    ],
    21: [
      function (require, module, exports) {
        'use strict';
        var parse = parse;
        var table = table;
        var unicodeRanges = [
            {
              begin: 0,
              end: 127
            },
            {
              begin: 128,
              end: 255
            },
            {
              begin: 256,
              end: 383
            },
            {
              begin: 384,
              end: 591
            },
            {
              begin: 592,
              end: 687
            },
            {
              begin: 688,
              end: 767
            },
            {
              begin: 768,
              end: 879
            },
            {
              begin: 880,
              end: 1023
            },
            {
              begin: 11392,
              end: 11519
            },
            {
              begin: 1024,
              end: 1279
            },
            {
              begin: 1328,
              end: 1423
            },
            {
              begin: 1424,
              end: 1535
            },
            {
              begin: 42240,
              end: 42559
            },
            {
              begin: 1536,
              end: 1791
            },
            {
              begin: 1984,
              end: 2047
            },
            {
              begin: 2304,
              end: 2431
            },
            {
              begin: 2432,
              end: 2559
            },
            {
              begin: 2560,
              end: 2687
            },
            {
              begin: 2688,
              end: 2815
            },
            {
              begin: 2816,
              end: 2943
            },
            {
              begin: 2944,
              end: 3071
            },
            {
              begin: 3072,
              end: 3199
            },
            {
              begin: 3200,
              end: 3327
            },
            {
              begin: 3328,
              end: 3455
            },
            {
              begin: 3584,
              end: 3711
            },
            {
              begin: 3712,
              end: 3839
            },
            {
              begin: 4256,
              end: 4351
            },
            {
              begin: 6912,
              end: 7039
            },
            {
              begin: 4352,
              end: 4607
            },
            {
              begin: 7680,
              end: 7935
            },
            {
              begin: 7936,
              end: 8191
            },
            {
              begin: 8192,
              end: 8303
            },
            {
              begin: 8304,
              end: 8351
            },
            {
              begin: 8352,
              end: 8399
            },
            {
              begin: 8400,
              end: 8447
            },
            {
              begin: 8448,
              end: 8527
            },
            {
              begin: 8528,
              end: 8591
            },
            {
              begin: 8592,
              end: 8703
            },
            {
              begin: 8704,
              end: 8959
            },
            {
              begin: 8960,
              end: 9215
            },
            {
              begin: 9216,
              end: 9279
            },
            {
              begin: 9280,
              end: 9311
            },
            {
              begin: 9312,
              end: 9471
            },
            {
              begin: 9472,
              end: 9599
            },
            {
              begin: 9600,
              end: 9631
            },
            {
              begin: 9632,
              end: 9727
            },
            {
              begin: 9728,
              end: 9983
            },
            {
              begin: 9984,
              end: 10175
            },
            {
              begin: 12288,
              end: 12351
            },
            {
              begin: 12352,
              end: 12447
            },
            {
              begin: 12448,
              end: 12543
            },
            {
              begin: 12544,
              end: 12591
            },
            {
              begin: 12592,
              end: 12687
            },
            {
              begin: 43072,
              end: 43135
            },
            {
              begin: 12800,
              end: 13055
            },
            {
              begin: 13056,
              end: 13311
            },
            {
              begin: 44032,
              end: 55215
            },
            {
              begin: 55296,
              end: 57343
            },
            {
              begin: 67840,
              end: 67871
            },
            {
              begin: 19968,
              end: 40959
            },
            {
              begin: 57344,
              end: 63743
            },
            {
              begin: 12736,
              end: 12783
            },
            {
              begin: 64256,
              end: 64335
            },
            {
              begin: 64336,
              end: 65023
            },
            {
              begin: 65056,
              end: 65071
            },
            {
              begin: 65040,
              end: 65055
            },
            {
              begin: 65104,
              end: 65135
            },
            {
              begin: 65136,
              end: 65279
            },
            {
              begin: 65280,
              end: 65519
            },
            {
              begin: 65520,
              end: 65535
            },
            {
              begin: 3840,
              end: 4095
            },
            {
              begin: 1792,
              end: 1871
            },
            {
              begin: 1920,
              end: 1983
            },
            {
              begin: 3456,
              end: 3583
            },
            {
              begin: 4096,
              end: 4255
            },
            {
              begin: 4608,
              end: 4991
            },
            {
              begin: 5024,
              end: 5119
            },
            {
              begin: 5120,
              end: 5759
            },
            {
              begin: 5760,
              end: 5791
            },
            {
              begin: 5792,
              end: 5887
            },
            {
              begin: 6016,
              end: 6143
            },
            {
              begin: 6144,
              end: 6319
            },
            {
              begin: 10240,
              end: 10495
            },
            {
              begin: 40960,
              end: 42127
            },
            {
              begin: 5888,
              end: 5919
            },
            {
              begin: 66304,
              end: 66351
            },
            {
              begin: 66352,
              end: 66383
            },
            {
              begin: 66560,
              end: 66639
            },
            {
              begin: 118784,
              end: 119039
            },
            {
              begin: 119808,
              end: 120831
            },
            {
              begin: 1044480,
              end: 1048573
            },
            {
              begin: 65024,
              end: 65039
            },
            {
              begin: 917504,
              end: 917631
            },
            {
              begin: 6400,
              end: 6479
            },
            {
              begin: 6480,
              end: 6527
            },
            {
              begin: 6528,
              end: 6623
            },
            {
              begin: 6656,
              end: 6687
            },
            {
              begin: 11264,
              end: 11359
            },
            {
              begin: 11568,
              end: 11647
            },
            {
              begin: 19904,
              end: 19967
            },
            {
              begin: 43008,
              end: 43055
            },
            {
              begin: 65536,
              end: 65663
            },
            {
              begin: 65856,
              end: 65935
            },
            {
              begin: 66432,
              end: 66463
            },
            {
              begin: 66464,
              end: 66527
            },
            {
              begin: 66640,
              end: 66687
            },
            {
              begin: 66688,
              end: 66735
            },
            {
              begin: 67584,
              end: 67647
            },
            {
              begin: 68096,
              end: 68191
            },
            {
              begin: 119552,
              end: 119647
            },
            {
              begin: 73728,
              end: 74751
            },
            {
              begin: 119648,
              end: 119679
            },
            {
              begin: 7040,
              end: 7103
            },
            {
              begin: 7168,
              end: 7247
            },
            {
              begin: 7248,
              end: 7295
            },
            {
              begin: 43136,
              end: 43231
            },
            {
              begin: 43264,
              end: 43311
            },
            {
              begin: 43312,
              end: 43359
            },
            {
              begin: 43520,
              end: 43615
            },
            {
              begin: 65936,
              end: 65999
            },
            {
              begin: 66000,
              end: 66047
            },
            {
              begin: 66208,
              end: 66271
            },
            {
              begin: 127024,
              end: 127135
            }
          ];
        function getUnicodeRange(unicode) {
          for (var i = 0; i < unicodeRanges.length; i += 1) {
            var range = unicodeRanges[i];
            if (unicode >= range.begin && unicode < range.end) {
              return i;
            }
          }
          return -1;
        }
        function parseOS2Table(data, start) {
          var os2 = {};
          var p = new parse.Parser(data, start);
          os2.version = p.parseUShort();
          os2.xAvgCharWidth = p.parseShort();
          os2.usWeightClass = p.parseUShort();
          os2.usWidthClass = p.parseUShort();
          os2.fsType = p.parseUShort();
          os2.ySubscriptXSize = p.parseShort();
          os2.ySubscriptYSize = p.parseShort();
          os2.ySubscriptXOffset = p.parseShort();
          os2.ySubscriptYOffset = p.parseShort();
          os2.ySuperscriptXSize = p.parseShort();
          os2.ySuperscriptYSize = p.parseShort();
          os2.ySuperscriptXOffset = p.parseShort();
          os2.ySuperscriptYOffset = p.parseShort();
          os2.yStrikeoutSize = p.parseShort();
          os2.yStrikeoutPosition = p.parseShort();
          os2.sFamilyClass = p.parseShort();
          os2.panose = [];
          for (var i = 0; i < 10; i++) {
            os2.panose[i] = p.parseByte();
          }
          os2.ulUnicodeRange1 = p.parseULong();
          os2.ulUnicodeRange2 = p.parseULong();
          os2.ulUnicodeRange3 = p.parseULong();
          os2.ulUnicodeRange4 = p.parseULong();
          os2.achVendID = String.fromCharCode(p.parseByte(), p.parseByte(), p.parseByte(), p.parseByte());
          os2.fsSelection = p.parseUShort();
          os2.usFirstCharIndex = p.parseUShort();
          os2.usLastCharIndex = p.parseUShort();
          os2.sTypoAscender = p.parseShort();
          os2.sTypoDescender = p.parseShort();
          os2.sTypoLineGap = p.parseShort();
          os2.usWinAscent = p.parseUShort();
          os2.usWinDescent = p.parseUShort();
          if (os2.version >= 1) {
            os2.ulCodePageRange1 = p.parseULong();
            os2.ulCodePageRange2 = p.parseULong();
          }
          if (os2.version >= 2) {
            os2.sxHeight = p.parseShort();
            os2.sCapHeight = p.parseShort();
            os2.usDefaultChar = p.parseUShort();
            os2.usBreakChar = p.parseUShort();
            os2.usMaxContent = p.parseUShort();
          }
          return os2;
        }
        function makeOS2Table(options) {
          return new table.Table('OS/2', [
            {
              name: 'version',
              type: 'USHORT',
              value: 3
            },
            {
              name: 'xAvgCharWidth',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'usWeightClass',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'usWidthClass',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'fsType',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'ySubscriptXSize',
              type: 'SHORT',
              value: 650
            },
            {
              name: 'ySubscriptYSize',
              type: 'SHORT',
              value: 699
            },
            {
              name: 'ySubscriptXOffset',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'ySubscriptYOffset',
              type: 'SHORT',
              value: 140
            },
            {
              name: 'ySuperscriptXSize',
              type: 'SHORT',
              value: 650
            },
            {
              name: 'ySuperscriptYSize',
              type: 'SHORT',
              value: 699
            },
            {
              name: 'ySuperscriptXOffset',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'ySuperscriptYOffset',
              type: 'SHORT',
              value: 479
            },
            {
              name: 'yStrikeoutSize',
              type: 'SHORT',
              value: 49
            },
            {
              name: 'yStrikeoutPosition',
              type: 'SHORT',
              value: 258
            },
            {
              name: 'sFamilyClass',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'bFamilyType',
              type: 'BYTE',
              value: 0
            },
            {
              name: 'bSerifStyle',
              type: 'BYTE',
              value: 0
            },
            {
              name: 'bWeight',
              type: 'BYTE',
              value: 0
            },
            {
              name: 'bProportion',
              type: 'BYTE',
              value: 0
            },
            {
              name: 'bContrast',
              type: 'BYTE',
              value: 0
            },
            {
              name: 'bStrokeVariation',
              type: 'BYTE',
              value: 0
            },
            {
              name: 'bArmStyle',
              type: 'BYTE',
              value: 0
            },
            {
              name: 'bLetterform',
              type: 'BYTE',
              value: 0
            },
            {
              name: 'bMidline',
              type: 'BYTE',
              value: 0
            },
            {
              name: 'bXHeight',
              type: 'BYTE',
              value: 0
            },
            {
              name: 'ulUnicodeRange1',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'ulUnicodeRange2',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'ulUnicodeRange3',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'ulUnicodeRange4',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'achVendID',
              type: 'CHARARRAY',
              value: 'XXXX'
            },
            {
              name: 'fsSelection',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'usFirstCharIndex',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'usLastCharIndex',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'sTypoAscender',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'sTypoDescender',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'sTypoLineGap',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'usWinAscent',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'usWinDescent',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'ulCodePageRange1',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'ulCodePageRange2',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'sxHeight',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'sCapHeight',
              type: 'SHORT',
              value: 0
            },
            {
              name: 'usDefaultChar',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'usBreakChar',
              type: 'USHORT',
              value: 0
            },
            {
              name: 'usMaxContext',
              type: 'USHORT',
              value: 0
            }
          ], options);
        }
        exports.unicodeRanges = unicodeRanges;
        exports.getUnicodeRange = getUnicodeRange;
        exports.parse = parseOS2Table;
        exports.make = makeOS2Table;
      },
      {
        '../parse': 7,
        '../table': 9
      }
    ],
    22: [
      function (require, module, exports) {
        'use strict';
        var encoding = encoding;
        var parse = parse;
        var table = table;
        function parsePostTable(data, start) {
          var post = {};
          var p = new parse.Parser(data, start);
          var i;
          post.version = p.parseVersion();
          post.italicAngle = p.parseFixed();
          post.underlinePosition = p.parseShort();
          post.underlineThickness = p.parseShort();
          post.isFixedPitch = p.parseULong();
          post.minMemType42 = p.parseULong();
          post.maxMemType42 = p.parseULong();
          post.minMemType1 = p.parseULong();
          post.maxMemType1 = p.parseULong();
          switch (post.version) {
          case 1:
            post.names = encoding.standardNames.slice();
            break;
          case 2:
            post.numberOfGlyphs = p.parseUShort();
            post.glyphNameIndex = new Array(post.numberOfGlyphs);
            for (i = 0; i < post.numberOfGlyphs; i++) {
              post.glyphNameIndex[i] = p.parseUShort();
            }
            post.names = [];
            for (i = 0; i < post.numberOfGlyphs; i++) {
              if (post.glyphNameIndex[i] >= encoding.standardNames.length) {
                var nameLength = p.parseChar();
                post.names.push(p.parseString(nameLength));
              }
            }
            break;
          case 2.5:
            post.numberOfGlyphs = p.parseUShort();
            post.offset = new Array(post.numberOfGlyphs);
            for (i = 0; i < post.numberOfGlyphs; i++) {
              post.offset[i] = p.parseChar();
            }
            break;
          }
          return post;
        }
        function makePostTable() {
          return new table.Table('post', [
            {
              name: 'version',
              type: 'FIXED',
              value: 196608
            },
            {
              name: 'italicAngle',
              type: 'FIXED',
              value: 0
            },
            {
              name: 'underlinePosition',
              type: 'FWORD',
              value: 0
            },
            {
              name: 'underlineThickness',
              type: 'FWORD',
              value: 0
            },
            {
              name: 'isFixedPitch',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'minMemType42',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'maxMemType42',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'minMemType1',
              type: 'ULONG',
              value: 0
            },
            {
              name: 'maxMemType1',
              type: 'ULONG',
              value: 0
            }
          ]);
        }
        exports.parse = parsePostTable;
        exports.make = makePostTable;
      },
      {
        '../encoding': 3,
        '../parse': 7,
        '../table': 9
      }
    ],
    23: [
      function (require, module, exports) {
        'use strict';
        var check = check;
        var table = table;
        var cmap = cmap;
        var cff = cff;
        var head = head;
        var hhea = hhea;
        var hmtx = hmtx;
        var maxp = maxp;
        var _name = ;
        var os2 = os2;
        var post = post;
        function log2(v) {
          return Math.log(v) / Math.log(2) | 0;
        }
        function computeCheckSum(bytes) {
          while (bytes.length % 4 !== 0) {
            bytes.push(0);
          }
          var sum = 0;
          for (var i = 0; i < bytes.length; i += 4) {
            sum += (bytes[i] << 24) + (bytes[i + 1] << 16) + (bytes[i + 2] << 8) + bytes[i + 3];
          }
          sum %= Math.pow(2, 32);
          return sum;
        }
        function makeTableRecord(tag, checkSum, offset, length) {
          return new table.Table('Table Record', [
            {
              name: 'tag',
              type: 'TAG',
              value: tag !== undefined ? tag : ''
            },
            {
              name: 'checkSum',
              type: 'ULONG',
              value: checkSum !== undefined ? checkSum : 0
            },
            {
              name: 'offset',
              type: 'ULONG',
              value: offset !== undefined ? offset : 0
            },
            {
              name: 'length',
              type: 'ULONG',
              value: length !== undefined ? length : 0
            }
          ]);
        }
        function makeSfntTable(tables) {
          var sfnt = new table.Table('sfnt', [
              {
                name: 'version',
                type: 'TAG',
                value: 'OTTO'
              },
              {
                name: 'numTables',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'searchRange',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'entrySelector',
                type: 'USHORT',
                value: 0
              },
              {
                name: 'rangeShift',
                type: 'USHORT',
                value: 0
              }
            ]);
          sfnt.tables = tables;
          sfnt.numTables = tables.length;
          var highestPowerOf2 = Math.pow(2, log2(sfnt.numTables));
          sfnt.searchRange = 16 * highestPowerOf2;
          sfnt.entrySelector = log2(highestPowerOf2);
          sfnt.rangeShift = sfnt.numTables * 16 - sfnt.searchRange;
          var recordFields = [];
          var tableFields = [];
          var offset = sfnt.sizeOf() + makeTableRecord().sizeOf() * sfnt.numTables;
          while (offset % 4 !== 0) {
            offset += 1;
            tableFields.push({
              name: 'padding',
              type: 'BYTE',
              value: 0
            });
          }
          for (var i = 0; i < tables.length; i += 1) {
            var t = tables[i];
            check.argument(t.tableName.length === 4, 'Table name' + t.tableName + ' is invalid.');
            var tableLength = t.sizeOf();
            var tableRecord = makeTableRecord(t.tableName, computeCheckSum(t.encode()), offset, tableLength);
            recordFields.push({
              name: tableRecord.tag + ' Table Record',
              type: 'TABLE',
              value: tableRecord
            });
            tableFields.push({
              name: t.tableName + ' table',
              type: 'TABLE',
              value: t
            });
            offset += tableLength;
            check.argument(!isNaN(offset), 'Something went wrong calculating the offset.');
            while (offset % 4 !== 0) {
              offset += 1;
              tableFields.push({
                name: 'padding',
                type: 'BYTE',
                value: 0
              });
            }
          }
          recordFields.sort(function (r1, r2) {
            if (r1.value.tag > r2.value.tag) {
              return 1;
            } else {
              return -1;
            }
          });
          sfnt.fields = sfnt.fields.concat(recordFields);
          sfnt.fields = sfnt.fields.concat(tableFields);
          return sfnt;
        }
        function metricsForChar(font, chars, notFoundMetrics) {
          for (var i = 0; i < chars.length; i += 1) {
            var glyphIndex = font.charToGlyphIndex(chars[i]);
            if (glyphIndex > 0) {
              var glyph = font.glyphs[glyphIndex];
              return glyph.getMetrics();
            }
          }
          return notFoundMetrics;
        }
        function average(vs) {
          var sum = 0;
          for (var i = 0; i < vs.length; i += 1) {
            sum += vs[i];
          }
          return sum / vs.length;
        }
        function fontToSfntTable(font) {
          var xMins = [];
          var yMins = [];
          var xMaxs = [];
          var yMaxs = [];
          var advanceWidths = [];
          var leftSideBearings = [];
          var rightSideBearings = [];
          var firstCharIndex = null;
          var lastCharIndex = 0;
          var ulUnicodeRange1 = 0;
          var ulUnicodeRange2 = 0;
          var ulUnicodeRange3 = 0;
          var ulUnicodeRange4 = 0;
          for (var i = 0; i < font.glyphs.length; i += 1) {
            var glyph = font.glyphs[i];
            var unicode = glyph.unicode | 0;
            if (firstCharIndex > unicode || firstCharIndex === null) {
              firstCharIndex = unicode;
            }
            if (lastCharIndex < unicode) {
              lastCharIndex = unicode;
            }
            var position = os2.getUnicodeRange(unicode);
            if (position < 32) {
              ulUnicodeRange1 |= 1 << position;
            } else if (position < 64) {
              ulUnicodeRange2 |= 1 << position - 32;
            } else if (position < 96) {
              ulUnicodeRange3 |= 1 << position - 64;
            } else if (position < 123) {
              ulUnicodeRange4 |= 1 << position - 96;
            } else {
              throw new Error('Unicode ranges bits > 123 are reserved for internal usage');
            }
            if (glyph.name === '.notdef')
              continue;
            var metrics = glyph.getMetrics();
            xMins.push(metrics.xMin);
            yMins.push(metrics.yMin);
            xMaxs.push(metrics.xMax);
            yMaxs.push(metrics.yMax);
            leftSideBearings.push(metrics.leftSideBearing);
            rightSideBearings.push(metrics.rightSideBearing);
            advanceWidths.push(glyph.advanceWidth);
          }
          var globals = {
              xMin: Math.min.apply(null, xMins),
              yMin: Math.min.apply(null, yMins),
              xMax: Math.max.apply(null, xMaxs),
              yMax: Math.max.apply(null, yMaxs),
              advanceWidthMax: Math.max.apply(null, advanceWidths),
              advanceWidthAvg: average(advanceWidths),
              minLeftSideBearing: Math.min.apply(null, leftSideBearings),
              maxLeftSideBearing: Math.max.apply(null, leftSideBearings),
              minRightSideBearing: Math.min.apply(null, rightSideBearings)
            };
          globals.ascender = font.ascender !== undefined ? font.ascender : globals.yMax;
          globals.descender = font.descender !== undefined ? font.descender : globals.yMin;
          var headTable = head.make({
              unitsPerEm: font.unitsPerEm,
              xMin: globals.xMin,
              yMin: globals.yMin,
              xMax: globals.xMax,
              yMax: globals.yMax
            });
          var hheaTable = hhea.make({
              ascender: globals.ascender,
              descender: globals.descender,
              advanceWidthMax: globals.advanceWidthMax,
              minLeftSideBearing: globals.minLeftSideBearing,
              minRightSideBearing: globals.minRightSideBearing,
              xMaxExtent: globals.maxLeftSideBearing + (globals.xMax - globals.xMin),
              numberOfHMetrics: font.glyphs.length
            });
          var maxpTable = maxp.make(font.glyphs.length);
          var os2Table = os2.make({
              xAvgCharWidth: Math.round(globals.advanceWidthAvg),
              usWeightClass: 500,
              usWidthClass: 5,
              usFirstCharIndex: firstCharIndex,
              usLastCharIndex: lastCharIndex,
              ulUnicodeRange1: ulUnicodeRange1,
              ulUnicodeRange2: ulUnicodeRange2,
              ulUnicodeRange3: ulUnicodeRange3,
              ulUnicodeRange4: ulUnicodeRange4,
              sTypoAscender: globals.ascender,
              sTypoDescender: globals.descender,
              sTypoLineGap: 0,
              usWinAscent: globals.ascender,
              usWinDescent: -globals.descender,
              sxHeight: metricsForChar(font, 'xyvw', { yMax: 0 }).yMax,
              sCapHeight: metricsForChar(font, 'HIKLEFJMNTZBDPRAGOQSUVWXY', globals).yMax,
              usBreakChar: font.hasChar(' ') ? 32 : 0
            });
          var hmtxTable = hmtx.make(font.glyphs);
          var cmapTable = cmap.make(font.glyphs);
          var fullName = font.familyName + ' ' + font.styleName;
          var postScriptName = font.familyName.replace(/\s/g, '') + '-' + font.styleName;
          var nameTable = _name.make({
              copyright: font.copyright,
              fontFamily: font.familyName,
              fontSubfamily: font.styleName,
              uniqueID: font.manufacturer + ':' + fullName,
              fullName: fullName,
              version: font.version,
              postScriptName: postScriptName,
              trademark: font.trademark,
              manufacturer: font.manufacturer,
              designer: font.designer,
              description: font.description,
              manufacturerURL: font.manufacturerURL,
              designerURL: font.designerURL,
              license: font.license,
              licenseURL: font.licenseURL,
              preferredFamily: font.familyName,
              preferredSubfamily: font.styleName
            });
          var postTable = post.make();
          var cffTable = cff.make(font.glyphs, {
              version: font.version,
              fullName: fullName,
              familyName: font.familyName,
              weightName: font.styleName,
              postScriptName: postScriptName
            });
          var tables = [
              headTable,
              hheaTable,
              maxpTable,
              os2Table,
              nameTable,
              cmapTable,
              postTable,
              cffTable,
              hmtxTable
            ];
          var sfntTable = makeSfntTable(tables);
          var bytes = sfntTable.encode();
          var checkSum = computeCheckSum(bytes);
          var tableFields = sfntTable.fields;
          var checkSumAdjusted = false;
          for (i = 0; i < tableFields.length; i += 1) {
            if (tableFields[i].name === 'head table') {
              tableFields[i].value.checkSumAdjustment = 2981146554 - checkSum;
              checkSumAdjusted = true;
              break;
            }
          }
          if (!checkSumAdjusted) {
            throw new Error('Could not find head table with checkSum to adjust.');
          }
          return sfntTable;
        }
        exports.computeCheckSum = computeCheckSum;
        exports.make = makeSfntTable;
        exports.fontToTable = fontToSfntTable;
      },
      {
        '../check': 1,
        '../table': 9,
        './cff': 10,
        './cmap': 11,
        './head': 14,
        './hhea': 15,
        './hmtx': 16,
        './maxp': 19,
        './name': 20,
        './os2': 21,
        './post': 22
      }
    ],
    24: [
      function (require, module, exports) {
        'use strict';
        var check = check;
        var LIMIT16 = 32768;
        var LIMIT32 = 2147483648;
        var decode = {};
        var encode = {};
        var sizeOf = {};
        function constant(v) {
          return function () {
            return v;
          };
        }
        encode.BYTE = function (v) {
          check.argument(v >= 0 && v <= 255, 'Byte value should be between 0 and 255.');
          return [v];
        };
        sizeOf.BYTE = constant(1);
        encode.CHAR = function (v) {
          return [v.charCodeAt(0)];
        };
        sizeOf.BYTE = constant(1);
        encode.CHARARRAY = function (v) {
          var b = [];
          for (var i = 0; i < v.length; i += 1) {
            b.push(v.charCodeAt(i));
          }
          return b;
        };
        sizeOf.CHARARRAY = function (v) {
          return v.length;
        };
        encode.USHORT = function (v) {
          return [
            v >> 8 & 255,
            v & 255
          ];
        };
        sizeOf.USHORT = constant(2);
        encode.SHORT = function (v) {
          if (v >= LIMIT16) {
            v = -(2 * LIMIT16 - v);
          }
          return [
            v >> 8 & 255,
            v & 255
          ];
        };
        sizeOf.SHORT = constant(2);
        encode.UINT24 = function (v) {
          return [
            v >> 16 & 255,
            v >> 8 & 255,
            v & 255
          ];
        };
        sizeOf.UINT24 = constant(3);
        encode.ULONG = function (v) {
          return [
            v >> 24 & 255,
            v >> 16 & 255,
            v >> 8 & 255,
            v & 255
          ];
        };
        sizeOf.ULONG = constant(4);
        encode.LONG = function (v) {
          if (v >= LIMIT32) {
            v = -(2 * LIMIT32 - v);
          }
          return [
            v >> 24 & 255,
            v >> 16 & 255,
            v >> 8 & 255,
            v & 255
          ];
        };
        sizeOf.LONG = constant(4);
        encode.FIXED = encode.ULONG;
        sizeOf.FIXED = sizeOf.ULONG;
        encode.FWORD = encode.SHORT;
        sizeOf.FWORD = sizeOf.SHORT;
        encode.UFWORD = encode.USHORT;
        sizeOf.UFWORD = sizeOf.USHORT;
        encode.LONGDATETIME = function () {
          return [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ];
        };
        sizeOf.LONGDATETIME = constant(8);
        encode.TAG = function (v) {
          check.argument(v.length === 4, 'Tag should be exactly 4 ASCII characters.');
          return [
            v.charCodeAt(0),
            v.charCodeAt(1),
            v.charCodeAt(2),
            v.charCodeAt(3)
          ];
        };
        sizeOf.TAG = constant(4);
        encode.Card8 = encode.BYTE;
        sizeOf.Card8 = sizeOf.BYTE;
        encode.Card16 = encode.USHORT;
        sizeOf.Card16 = sizeOf.USHORT;
        encode.OffSize = encode.BYTE;
        sizeOf.OffSize = sizeOf.BYTE;
        encode.SID = encode.USHORT;
        sizeOf.SID = sizeOf.USHORT;
        encode.NUMBER = function (v) {
          if (v >= -107 && v <= 107) {
            return [v + 139];
          } else if (v >= 108 && v <= 1131) {
            v = v - 108;
            return [
              (v >> 8) + 247,
              v & 255
            ];
          } else if (v >= -1131 && v <= -108) {
            v = -v - 108;
            return [
              (v >> 8) + 251,
              v & 255
            ];
          } else if (v >= -32768 && v <= 32767) {
            return encode.NUMBER16(v);
          } else {
            return encode.NUMBER32(v);
          }
        };
        sizeOf.NUMBER = function (v) {
          return encode.NUMBER(v).length;
        };
        encode.NUMBER16 = function (v) {
          return [
            28,
            v >> 8 & 255,
            v & 255
          ];
        };
        sizeOf.NUMBER16 = constant(2);
        encode.NUMBER32 = function (v) {
          return [
            29,
            v >> 24 & 255,
            v >> 16 & 255,
            v >> 8 & 255,
            v & 255
          ];
        };
        sizeOf.NUMBER32 = constant(4);
        encode.NAME = encode.CHARARRAY;
        sizeOf.NAME = sizeOf.CHARARRAY;
        encode.STRING = encode.CHARARRAY;
        sizeOf.STRING = sizeOf.CHARARRAY;
        encode.UTF16 = function (v) {
          var b = [];
          for (var i = 0; i < v.length; i += 1) {
            b.push(0);
            b.push(v.charCodeAt(i));
          }
          return b;
        };
        sizeOf.UTF16 = function (v) {
          return v.length * 2;
        };
        encode.INDEX = function (l) {
          var i;
          var offset = 1;
          var offsets = [offset];
          var data = [];
          var dataSize = 0;
          for (i = 0; i < l.length; i += 1) {
            var v = encode.OBJECT(l[i]);
            Array.prototype.push.apply(data, v);
            dataSize += v.length;
            offset += v.length;
            offsets.push(offset);
          }
          if (data.length === 0) {
            return [
              0,
              0
            ];
          }
          var encodedOffsets = [];
          var offSize = 1 + Math.floor(Math.log(dataSize) / Math.log(2)) / 8 | 0;
          var offsetEncoder = [
              undefined,
              encode.BYTE,
              encode.USHORT,
              encode.UINT24,
              encode.ULONG
            ][offSize];
          for (i = 0; i < offsets.length; i += 1) {
            var encodedOffset = offsetEncoder(offsets[i]);
            Array.prototype.push.apply(encodedOffsets, encodedOffset);
          }
          return Array.prototype.concat(encode.Card16(l.length), encode.OffSize(offSize), encodedOffsets, data);
        };
        sizeOf.INDEX = function (v) {
          return encode.INDEX(v).length;
        };
        encode.DICT = function (m) {
          var d = [];
          var keys = Object.keys(m);
          var length = keys.length;
          for (var i = 0; i < length; i += 1) {
            var k = parseInt(keys[i], 0);
            var v = m[k];
            d = d.concat(encode.OPERAND(v.value, v.type));
            d = d.concat(encode.OPERATOR(k));
          }
          return d;
        };
        sizeOf.DICT = function (m) {
          return encode.DICT(m).length;
        };
        encode.OPERATOR = function (v) {
          if (v < 1200) {
            return [v];
          } else {
            return [
              12,
              v - 1200
            ];
          }
        };
        encode.OPERAND = function (v, type) {
          var d = [];
          if (Array.isArray(type)) {
            for (var i = 0; i < type.length; i += 1) {
              check.argument(v.length === type.length, 'Not enough arguments given for type' + type);
              d = d.concat(encode.OPERAND(v[i], type[i]));
            }
          } else {
            if (type === 'SID') {
              d = d.concat(encode.NUMBER(v));
            } else if (type === 'offset') {
              d = d.concat(encode.NUMBER32(v));
            } else {
              d = d.concat(encode.NUMBER(v));
            }
          }
          return d;
        };
        encode.OP = encode.BYTE;
        sizeOf.OP = sizeOf.BYTE;
        var wmm = typeof WeakMap === 'function' && new WeakMap();
        encode.CHARSTRING = function (ops) {
          if (wmm && wmm.has(ops)) {
            return wmm.get(ops);
          }
          var d = [];
          var length = ops.length;
          for (var i = 0; i < length; i += 1) {
            var op = ops[i];
            d = d.concat(encode[op.type](op.value));
          }
          if (wmm) {
            wmm.set(ops, d);
          }
          return d;
        };
        sizeOf.CHARSTRING = function (ops) {
          return encode.CHARSTRING(ops).length;
        };
        encode.OBJECT = function (v) {
          var encodingFunction = encode[v.type];
          check.argument(encodingFunction !== undefined, 'No encoding function for type ' + v.type);
          return encodingFunction(v.value);
        };
        encode.TABLE = function (table) {
          var d = [];
          var length = table.fields.length;
          for (var i = 0; i < length; i += 1) {
            var field = table.fields[i];
            var encodingFunction = encode[field.type];
            check.argument(encodingFunction !== undefined, 'No encoding function for field type ' + field.type);
            var value = table[field.name];
            if (value === undefined) {
              value = field.value;
            }
            var bytes = encodingFunction(value);
            d = d.concat(bytes);
          }
          return d;
        };
        encode.LITERAL = function (v) {
          return v;
        };
        sizeOf.LITERAL = function (v) {
          return v.length;
        };
        exports.decode = decode;
        exports.encode = encode;
        exports.sizeOf = sizeOf;
      },
      { './check': 1 }
    ]
  }, {}, [6])(6);
}));
amdclean['outputfiles'] = function (require, core) {
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
}({}, amdclean['core']);
amdclean['outputimage'] = function (require, core) {
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
}({}, amdclean['core']);
amdclean['outputtext_area'] = function (require, core) {
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
}({}, amdclean['core']);
amdclean['renderingrendering'] = function (require, core, constants) {
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
  p5.prototype.resizeCanvas = function (w, h, noRedraw) {
    if (this._defaultGraphics) {
      this._defaultGraphics.resize(w, h);
      this._defaultGraphics._applyDefaults();
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
    if (mode === constants.BLEND || mode === constants.DARKEST || mode === constants.LIGHTEST || mode === constants.DIFFERENCE || mode === constants.MULTIPLY || mode === constants.EXCLUSION || mode === constants.SCREEN || mode === constants.REPLACE || mode === constants.OVERLAY || mode === constants.HARD_LIGHT || mode === constants.SOFT_LIGHT || mode === constants.DODGE || mode === constants.BURN || mode === constants.ADD || mode === constants.NORMAL) {
      this.drawingContext.globalCompositeOperation = mode;
    } else {
      throw new Error('Mode ' + mode + ' not recognized.');
    }
  };
  return p5;
}({}, amdclean['core'], amdclean['constants']);
amdclean['shape2d_primitives'] = function (require, core, canvas, constants) {
  'use strict';
  var p5 = core;
  var canvas = canvas;
  var constants = constants;
  var EPSILON = 0.00001;
  function createArc(radius, startAngle, endAngle) {
    var twoPI = Math.PI * 2;
    var curves = [];
    var piOverTwo = Math.PI / 2;
    var sgn = startAngle < endAngle ? 1 : -1;
    var a1 = startAngle;
    var totalAngle = Math.min(twoPI, Math.abs(endAngle - startAngle));
    for (; totalAngle > EPSILON;) {
      var a2 = a1 + sgn * Math.min(totalAngle, piOverTwo);
      curves.push(createSmallArc(radius, a1, a2));
      totalAngle -= Math.abs(a2 - a1);
      a1 = a2;
    }
    return curves;
  }
  function createSmallArc(r, a1, a2) {
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
  }
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
    var curves = createArc(1, start, stop);
    var rx = vals.w / 2;
    var ry = vals.h / 2;
    ctx.beginPath();
    curves.forEach(function (curve, index) {
      if (index === 0) {
        ctx.moveTo(vals.x + curve.x1 * rx, vals.y + curve.y1 * ry);
      }
      ctx.bezierCurveTo(vals.x + curve.x2 * rx, vals.y + curve.y2 * ry, vals.x + curve.x3 * rx, vals.y + curve.y3 * ry, vals.x + curve.x4 * rx, vals.y + curve.y4 * ry);
    });
    if (this._doFill) {
      if (mode === constants.PIE || mode == null) {
        ctx.lineTo(vals.x, vals.y);
      }
      ctx.closePath();
      ctx.fill();
      if (this._doStroke) {
        if (mode === constants.CHORD || mode === constants.PIE) {
          ctx.stroke();
          return this;
        }
      }
    }
    if (this._doStroke) {
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
  p5.prototype.rect = function (x, y, w, h, tl, tr, br, bl) {
    if (!this._doStroke && !this._doFill) {
      return;
    }
    var vals = canvas.modeAdjust(x, y, w, h, this._rectMode);
    var ctx = this.drawingContext;
    if (this._doStroke && ctx.lineWidth % 2 === 1) {
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
}({}, amdclean['core'], amdclean['canvas'], amdclean['constants']);
amdclean['shapeattributes'] = function (require, core, constants) {
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
}({}, amdclean['core'], amdclean['constants']);
amdclean['shapecurves'] = function (require, core) {
  'use strict';
  var p5 = core;
  var bezierDetail = 20;
  var curveDetail = 20;
  p5.prototype._curveTightness = 0;
  p5.prototype.bezier = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    if (!this._doStroke) {
      return;
    }
    this.beginShape();
    this.vertex(x1, y1);
    this.bezierVertex(x2, y2, x3, y3, x4, y4);
    this.endShape();
    this.stroke();
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
    if (!this._doStroke) {
      return;
    }
    this.beginShape();
    this.curveVertex(x1, y1);
    this.curveVertex(x2, y2);
    this.curveVertex(x3, y3);
    this.curveVertex(x4, y4);
    this.endShape();
    this.stroke();
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
}({}, amdclean['core']);
amdclean['shapevertex'] = function (require, core, constants) {
  'use strict';
  var p5 = core;
  var constants = constants;
  var shapeKind = null;
  var vertices = [];
  var contourVertices = [];
  var isBezier = false;
  var isCurve = false;
  var isQuadratic = false;
  var isContour = false;
  p5.prototype._doFillStrokeClose = function () {
    if (this._doFill) {
      this.drawingContext.fill();
    }
    if (this._doStroke) {
      this.drawingContext.stroke();
    }
    this.drawingContext.closePath();
  };
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
    var v;
    if (closeShape && !isContour) {
      vertices.push(vertices[0]);
    }
    var i, j;
    var numVerts = vertices.length;
    if (isCurve && (shapeKind === constants.POLYGON || shapeKind === null)) {
      if (numVerts > 3) {
        var b = [], s = 1 - this._curveTightness;
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
          if (this._doStroke) {
            this.stroke(v[6]);
          }
          this.point(v[0], v[1]);
        }
      } else if (shapeKind === constants.LINES) {
        for (i = 0; i + 1 < numVerts; i += 2) {
          v = vertices[i];
          if (this._doStroke) {
            this.stroke(vertices[i + 1][6]);
          }
          this.line(v[0], v[1], vertices[i + 1][0], vertices[i + 1][1]);
        }
      } else if (shapeKind === constants.TRIANGLES) {
        for (i = 0; i + 2 < numVerts; i += 3) {
          v = vertices[i];
          this.drawingContext.beginPath();
          this.drawingContext.moveTo(v[0], v[1]);
          this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
          this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
          this.drawingContext.lineTo(v[0], v[1]);
          if (this._doFill) {
            this.fill(vertices[i + 2][5]);
            this.drawingContext.fill();
          }
          if (this._doStroke) {
            this.stroke(vertices[i + 2][6]);
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
          if (this._doStroke) {
            this.stroke(vertices[i + 1][6]);
          }
          if (this._doFill) {
            this.fill(vertices[i + 1][5]);
          }
          if (i + 2 < numVerts) {
            this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
            if (this._doStroke) {
              this.stroke(vertices[i + 2][6]);
            }
            if (this._doFill) {
              this.fill(vertices[i + 2][5]);
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
          if (this._doFill) {
            this.fill(vertices[2][5]);
          }
          if (this._doStroke) {
            this.stroke(vertices[2][6]);
          }
          this._doFillStrokeClose();
          for (i = 3; i < numVerts; i++) {
            v = vertices[i];
            this.drawingContext.beginPath();
            this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
            this.drawingContext.lineTo(vertices[i - 1][0], vertices[i - 1][1]);
            this.drawingContext.lineTo(v[0], v[1]);
            if (this._doFill) {
              this.fill(v[5]);
            }
            if (this._doStroke) {
              this.stroke(v[6]);
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
          if (this._doFill) {
            this.fill(vertices[i + 3][5]);
          }
          if (this._doStroke) {
            this.stroke(vertices[i + 3][6]);
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
              if (this._doFill) {
                this.fill(vertices[i + 3][5]);
              }
              if (this._doStroke) {
                this.stroke(vertices[i + 3][6]);
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
    vert[5] = this.drawingContext.fillStyle;
    vert[6] = this.drawingContext.strokeStyle;
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
}({}, amdclean['core'], amdclean['constants']);
amdclean['structure'] = function (require, core) {
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
    var userSetup = this.setup || window.setup;
    var userDraw = this.draw || window.draw;
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
  };
  p5.prototype.size = function () {
    throw 'size() not implemented, see createCanvas()';
  };
  return p5;
}({}, amdclean['core']);
amdclean['transform'] = function (require, core, constants, outputtext_area) {
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
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
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
}({}, amdclean['core'], amdclean['constants'], amdclean['outputtext_area']);
amdclean['typographyattributes'] = function (require, core, constants) {
  'use strict';
  var p5 = core;
  var constants = constants;
  p5.prototype._textLeading = 15;
  p5.prototype._textFont = 'sans-serif';
  p5.prototype._textSize = 12;
  p5.prototype._textStyle = constants.NORMAL;
  p5.prototype._textAscent = null;
  p5.prototype._textDescent = null;
  p5.prototype.textAlign = function (h, v) {
    if (h === constants.LEFT || h === constants.RIGHT || h === constants.CENTER) {
      this.drawingContext.textAlign = h;
    }
    if (v === constants.TOP || v === constants.BOTTOM || v === constants.CENTER || v === constants.BASELINE) {
      this.drawingContext.textBaseline = v;
    }
  };
  p5.prototype.textLeading = function (l) {
    this._setProperty('_textLeading', l);
  };
  p5.prototype.textSize = function (s) {
    this._setProperty('_textSize', s);
    this._setProperty('_textLeading', s * 1.25);
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
}({}, amdclean['core'], amdclean['constants']);
amdclean['typographyloading_displaying'] = function (require, core) {
  'use strict';
  var p5 = core;
  p5.prototype.text = function (str, x, y, maxWidth, maxHeight) {
    if (typeof str !== 'string') {
      str = str.toString();
    }
    if (typeof maxWidth !== 'undefined') {
      y += this._textLeading;
      maxHeight += y;
    }
    str = str.replace(/(\t)/g, '  ');
    var cars = str.split('\n');
    for (var ii = 0; ii < cars.length; ii++) {
      var line = '';
      var words = cars[ii].split(' ');
      for (var n = 0; n < words.length; n++) {
        if (y + this._textLeading <= maxHeight || typeof maxHeight === 'undefined') {
          var testLine = line + words[n] + ' ';
          var metrics = this.drawingContext.measureText(testLine);
          var testWidth = metrics.width;
          if (typeof maxWidth !== 'undefined' && testWidth > maxWidth) {
            if (this._doFill) {
              this.drawingContext.fillText(line, x, y);
            }
            if (this._doStroke) {
              this.drawingContext.strokeText(line, x, y);
            }
            line = words[n] + ' ';
            y += this._textLeading;
          } else {
            line = testLine;
          }
        }
      }
      if (this._doFill) {
        this.drawingContext.fillText(line, x, y);
      }
      if (this._doStroke) {
        this.drawingContext.strokeText(line, x, y);
      }
      y += this._textLeading;
    }
  };
  p5.prototype.textFont = function (str) {
    this._setProperty('_textFont', str);
    this._applyTextProperties();
  };
  return p5;
}({}, amdclean['core']);
amdclean['src_app'] = function (require, core, p5Color, p5Element, p5Graphics, p5Image, p5File, p5Vector, p5TableRow, p5Table, colorcreating_reading, colorsetting, constants, dataconversion, dataarray_functions, datastring_functions, environment, imageimage, imageloading_displaying, imagepixels, inputfiles, inputkeyboard, inputacceleration, inputmouse, inputtime_date, inputtouch, mathmath, mathcalculation, mathrandom, mathnoise, mathtrigonometry, opentype, outputfiles, outputimage, outputtext_area, renderingrendering, shape2d_primitives, shapeattributes, shapecurves, shapevertex, structure, transform, typographyattributes, typographyloading_displaying) {
  'use strict';
  var p5 = core;
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
}({}, amdclean['core'], amdclean['p5Color'], amdclean['p5Element'], amdclean['p5Graphics'], amdclean['p5Image'], amdclean['p5File'], amdclean['p5Vector'], amdclean['p5TableRow'], amdclean['p5Table'], amdclean['colorcreating_reading'], amdclean['colorsetting'], amdclean['constants'], amdclean['dataconversion'], amdclean['dataarray_functions'], amdclean['datastring_functions'], amdclean['environment'], amdclean['imageimage'], amdclean['imageloading_displaying'], amdclean['imagepixels'], amdclean['inputfiles'], amdclean['inputkeyboard'], amdclean['inputacceleration'], amdclean['inputmouse'], amdclean['inputtime_date'], amdclean['inputtouch'], amdclean['mathmath'], amdclean['mathcalculation'], amdclean['mathrandom'], amdclean['mathnoise'], amdclean['mathtrigonometry'], amdclean['opentype'], amdclean['outputfiles'], amdclean['outputimage'], amdclean['outputtext_area'], amdclean['renderingrendering'], amdclean['shape2d_primitives'], amdclean['shapeattributes'], amdclean['shapecurves'], amdclean['shapevertex'], amdclean['structure'], amdclean['transform'], amdclean['typographyattributes'], amdclean['typographyloading_displaying']);
return amdclean['src_app'];
}));