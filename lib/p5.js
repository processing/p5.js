/*! p5.js v0.4.5 May 29, 2015 */
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
  (function () {
    'use strict';
    if (typeof Uint8ClampedArray !== 'undefined') {
      Uint8ClampedArray.prototype.slice = Array.prototype.slice;
    }
  }());
}({});
amdclean['constants'] = function (require) {
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
amdclean['core'] = function (require, shim, constants) {
  'use strict';
  var constants = constants;
  var p5 = function (sketch, node, sync) {
    if (arguments.length === 2 && typeof node === 'boolean') {
      sync = node;
      node = undefined;
    }
    this._setupDone = false;
    this.pixelDensity = window.devicePixelRatio || 1;
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
    this._converted_color = this._convertTo255(pInst);
    var isHSB = pInst._colorMode === constants.HSB;
    if (isHSB) {
      this.hsba = this.color_array;
      this.rgba = color_utils.hsbaToRGBA(this._converted_color);
    } else {
      this.rgba = this.color_array;
      this.hsba = color_utils.rgbaToHSBA(this._converted_color);
    }
    return this;
  };
  p5.Color.prototype._convertTo255 = function (pInst) {
    var isRGB = pInst._colorMode === constants.RGB;
    var maxArr = isRGB ? pInst._maxRGB : pInst._maxHSB;
    var arr = [];
    arr[0] = this.color_array[0] * 255 / maxArr[0];
    arr[1] = this.color_array[1] * 255 / maxArr[1];
    arr[2] = this.color_array[2] * 255 / maxArr[2];
    arr[3] = this.color_array[3] * 255 / maxArr[3];
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
amdclean['p5Graphics'] = function (require, core) {
  var p5 = core;
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
    this.drawingContext.scale(this._pInst.pixelDensity, this._pInst.pixelDensity);
  };
  return p5.Graphics;
}({}, amdclean['core']);
amdclean['p5Graphics2D'] = function (require, core, canvas, constants, filters, p5Graphics) {
  var p5 = core;
  var canvas = canvas;
  var constants = constants;
  var filters = filters;
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
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
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
    var p = this._pInst, cars, n, ii, jj, line, testLine, testWidth, words, totalHeight;
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
          y += maxHeight - totalHeight;
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
    return p;
  };
  p5.Graphics2D.prototype._renderText = function (p, line, x, y) {
    if (p._isOpenType()) {
      return p._textFont.renderPath(line, x, y);
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
}({}, amdclean['core'], amdclean['canvas'], amdclean['constants'], amdclean['filters'], amdclean['p5Graphics']);
amdclean['shaders'] = function (require) {
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
amdclean['mat4'] = function (require) {
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
amdclean['p5Graphics3D'] = function (require, core, shaders, p5Graphics, mat4) {
  var p5 = core;
  var shaders = shaders;
  var mat4 = mat4;
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
}({}, amdclean['core'], amdclean['shaders'], amdclean['p5Graphics'], amdclean['mat4']);
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
amdclean['p5Font'] = function (require, core, constants) {
  'use strict';
  var p5 = core;
  var constants = constants;
  p5.Font = function (p) {
    this.parent = p;
    this.font = undefined;
  };
  p5.Font.prototype.renderPath = function (line, x, y, fontSize, options) {
    var path, p = this.parent, textWidth, textHeight, textAscent, textDescent;
    fontSize = fontSize || p._textSize;
    options = options || {};
    textWidth = p.textWidth(line);
    textAscent = p.textAscent();
    textDescent = p.textDescent();
    textHeight = textAscent + textDescent;
    if (p.drawingContext.textAlign === constants.CENTER) {
      x -= textWidth / 2;
    } else if (p.drawingContext.textAlign === constants.RIGHT) {
      x -= textWidth;
    }
    if (p.drawingContext.textBaseline === constants.TOP) {
      y += textHeight;
    } else if (p.drawingContext.textBaseline === constants._CTX_MIDDLE) {
      y += textHeight / 2 - textDescent;
    } else if (p.drawingContext.textBaseline === constants.BOTTOM) {
      y -= textDescent;
    }
    path = this.font.getPath(line, x, y, fontSize, options);
    if (p._doStroke && p._strokeSet) {
      path.strokeWidth = p.drawingContext.lineWidth;
      path.stroke = p.drawingContext.strokeStyle;
    }
    if (p._doFill) {
      path.fill = p._fillSet ? p.drawingContext.fillStyle : constants._DEFAULT_TEXT_FILL;
    }
    path.draw(p.drawingContext);
  };
  p5.Font.prototype.textBounds = function (str, x, y, fontSize) {
    if (!this.parent._isOpenType()) {
      throw Error('not supported for system fonts');
    }
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize || this.parent._textSize;
    var xCoords = [], yCoords = [], scale = 1 / this.font.unitsPerEm * fontSize;
    this.font.forEachGlyph(str, x, y, fontSize, {}, function (glyph, gX, gY) {
      if (glyph.name !== 'space') {
        gX = gX !== undefined ? gX : 0;
        gY = gY !== undefined ? gY : 0;
        var gm = glyph.getMetrics();
        var x1 = gX + gm.xMin * scale;
        var y1 = gY + -gm.yMin * scale;
        var x2 = gX + gm.xMax * scale;
        var y2 = gY + -gm.yMax * scale;
        xCoords.push(x1);
        yCoords.push(y1);
        xCoords.push(x2);
        yCoords.push(y2);
      }
    });
    var minX = Math.min.apply(null, xCoords);
    var minY = Math.min.apply(null, yCoords);
    var maxX = Math.max.apply(null, xCoords);
    var maxY = Math.max.apply(null, yCoords);
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
}({}, amdclean['core'], amdclean['constants']);
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
  p5.prototype._strokeSet = false;
  p5.prototype._fillSet = false;
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
      this._graphics.background.apply(this._graphics, arguments);
    }
    return this;
  };
  p5.prototype.clear = function () {
    this._graphics.clear();
    return this;
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
amdclean['helpers'] = function (require, core) {
  'use strict';
  var p5 = core;
  var PARAM_COUNT = 0;
  var EMPTY_VAR = 1;
  var WRONG_TYPE = 2;
  var typeColors = [
      '#008851',
      '#C83C00',
      '#4DB200'
    ];
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
  function report(message, func, color) {
    if ('undefined' === getType(color)) {
      color = '#B40033';
    } else if (getType(color) === 'number') {
      color = typeColors[color];
    }
    console.log('%c> p5.js says: ' + message + '%c [http://p5js.org/reference/#p5/' + func + ']', 'background-color:' + color + ';color:#FFF;', 'background-color:transparent;color:' + color + ';');
  }
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
  return p5;
}({}, amdclean['core']);
amdclean['imageloading_displaying'] = function (require, core, filters, canvas, constants, helpers) {
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
}({}, amdclean['core'], amdclean['filters'], amdclean['canvas'], amdclean['constants'], amdclean['helpers']);
amdclean['imagepixels'] = function (require, core, filters, p5Color) {
  'use strict';
  var p5 = core;
  var Filters = filters;
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
    p5.prototype.print = function (args) {
      var newArgs = JSON.parse(JSON.stringify(args));
      console.log(newArgs);
    };
  } else {
    p5.prototype.print = function () {
    };
  }
  p5.prototype.println = p5.prototype.print;
  return p5;
}({}, amdclean['core']);
amdclean['renderingrendering'] = function (require, core, constants, p5Graphics2D, p5Graphics3D) {
  var p5 = core;
  var constants = constants;
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
        this._graphics = new p5.Graphics3D(c, this, true);
        this._defaultGraphics = this._graphics;
        this._elements.push(this._defaultGraphics);
      }
    } else {
      if (!this._defaultGraphics) {
        this._graphics = new p5.Graphics2D(c, this, true);
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
      this.drawingContext.globalCompositeOperation = mode;
    } else {
      throw new Error('Mode ' + mode + ' not recognized.');
    }
  };
  return p5;
}({}, amdclean['core'], amdclean['constants'], amdclean['p5Graphics2D'], amdclean['p5Graphics3D']);
amdclean['shape2d_primitives'] = function (require, core, constants, helpers) {
  'use strict';
  var p5 = core;
  var constants = constants;
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
}({}, amdclean['core'], amdclean['constants'], amdclean['helpers']);
amdclean['shape3d_primitives'] = function (require, core) {
  'use strict';
  var p5 = core;
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
}({}, amdclean['core']);
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
}({}, amdclean['core'], amdclean['constants']);
amdclean['shapecurves'] = function (require, core, helpers) {
  'use strict';
  var p5 = core;
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
}({}, amdclean['core'], amdclean['helpers']);
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
}({}, amdclean['core']);
amdclean['transform'] = function (require, core, constants, outputtext_area) {
  'use strict';
  var p5 = core;
  var constants = constants;
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
}({}, amdclean['core'], amdclean['constants'], amdclean['outputtext_area']);
amdclean['typographyattributes'] = function (require, core, constants) {
  'use strict';
  var p5 = core;
  var constants = constants;
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
}({}, amdclean['core'], amdclean['constants']);
amdclean['typographyloading_displaying'] = function (require, core, constants, helpers) {
  'use strict';
  var p5 = core;
  var constants = constants;
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
}({}, amdclean['core'], amdclean['constants'], amdclean['helpers']);
amdclean['src_app'] = function (require, core, p5Color, p5Element, p5Graphics2D, p5Graphics3D, p5Image, p5File, p5Font, p5Vector, p5TableRow, p5Table, colorcreating_reading, colorsetting, constants, dataconversion, dataarray_functions, datastring_functions, environment, imageimage, imageloading_displaying, imagepixels, inputfiles, inputkeyboard, inputacceleration, inputmouse, inputtime_date, inputtouch, mathmath, mathcalculation, mathrandom, mathnoise, mathtrigonometry, outputfiles, outputimage, outputtext_area, renderingrendering, shape2d_primitives, shape3d_primitives, shapeattributes, shapecurves, shapevertex, structure, transform, typographyattributes, typographyloading_displaying, shaders) {
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
}({}, amdclean['core'], amdclean['p5Color'], amdclean['p5Element'], amdclean['p5Graphics2D'], amdclean['p5Graphics3D'], amdclean['p5Image'], amdclean['p5File'], amdclean['p5Font'], amdclean['p5Vector'], amdclean['p5TableRow'], amdclean['p5Table'], amdclean['colorcreating_reading'], amdclean['colorsetting'], amdclean['constants'], amdclean['dataconversion'], amdclean['dataarray_functions'], amdclean['datastring_functions'], amdclean['environment'], amdclean['imageimage'], amdclean['imageloading_displaying'], amdclean['imagepixels'], amdclean['inputfiles'], amdclean['inputkeyboard'], amdclean['inputacceleration'], amdclean['inputmouse'], amdclean['inputtime_date'], amdclean['inputtouch'], amdclean['mathmath'], amdclean['mathcalculation'], amdclean['mathrandom'], amdclean['mathnoise'], amdclean['mathtrigonometry'], amdclean['outputfiles'], amdclean['outputimage'], amdclean['outputtext_area'], amdclean['renderingrendering'], amdclean['shape2d_primitives'], amdclean['shape3d_primitives'], amdclean['shapeattributes'], amdclean['shapecurves'], amdclean['shapevertex'], amdclean['structure'], amdclean['transform'], amdclean['typographyattributes'], amdclean['typographyloading_displaying'], amdclean['shaders']);
return amdclean['src_app'];
}));(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.opentype = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Run-time checking of preconditions.

'use strict';

// Precondition function that checks if the given predicate is true.
// If not, it will throw an error.
exports.argument = function(predicate, message) {
    if (!predicate) {
        throw new Error(message);
    }
};

// Precondition function that checks if the given assertion is true.
// If not, it will throw an error.
exports.assert = exports.argument;

},{}],2:[function(require,module,exports){
// Drawing utility functions.

'use strict';

// Draw a line on the given context from point `x1,y1` to point `x2,y2`.
function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

exports.line = line;

},{}],3:[function(require,module,exports){
// Glyph encoding

'use strict';

var cffStandardStrings = [
    '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent', 'sterling',
    'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft',
    'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl', 'periodcentered', 'paragraph',
    'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand',
    'questiondown', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', 'ring',
    'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE',
    'ordmasculine', 'ae', 'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu',
    'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter', 'divide', 'brokenbar', 'degree', 'thorn',
    'threequarters', 'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright',
    'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex',
    'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex',
    'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute',
    'Ydieresis', 'Zcaron', 'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla', 'eacute',
    'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute',
    'ocircumflex', 'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis', 'ugrave',
    'yacute', 'ydieresis', 'zcaron', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior',
    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', '266 ff', 'onedotenleader',
    'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle',
    'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior', 'threequartersemdash', 'periodsuperior',
    'questionsmall', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
    'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior', 'ff', 'ffi', 'ffl',
    'parenleftinferior', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall',
    'centoldstyle', 'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall',
    'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall',
    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds',
    'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
    'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior',
    'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior',
    'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall',
    'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall',
    'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall',
    'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall',
    'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall', '001.000',
    '001.001', '001.002', '001.003', 'Black', 'Bold', 'Book', 'Light', 'Medium', 'Regular', 'Roman', 'Semibold'];

var cffStandardEncoding = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle',
    'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', '', 'endash', 'dagger',
    'daggerdbl', 'periodcentered', '', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright',
    'guillemotright', 'ellipsis', 'perthousand', '', 'questiondown', '', 'grave', 'acute', 'circumflex', 'tilde',
    'macron', 'breve', 'dotaccent', 'dieresis', '', 'ring', 'cedilla', '', 'hungarumlaut', 'ogonek', 'caron',
    'emdash', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'AE', '', 'ordfeminine', '', '', '',
    '', 'Lslash', 'Oslash', 'OE', 'ordmasculine', '', '', '', '', '', 'ae', '', '', '', 'dotlessi', '', '',
    'lslash', 'oslash', 'oe', 'germandbls'];

var cffExpertEncoding = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', 'space', 'exclamsmall', 'Hungarumlautsmall', '', 'dollaroldstyle', 'dollarsuperior',
    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader',
    'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle',
    'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon',
    'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', '', 'asuperior',
    'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', '', '', 'isuperior', '', '', 'lsuperior', 'msuperior',
    'nsuperior', 'osuperior', '', '', 'rsuperior', 'ssuperior', 'tsuperior', '', 'ff', 'fi', 'fl', 'ffi', 'ffl',
    'parenleftinferior', '', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'exclamdownsmall', 'centoldstyle', 'Lslashsmall', '', '', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall',
    'Brevesmall', 'Caronsmall', '', 'Dotaccentsmall', '', '', 'Macronsmall', '', '', 'figuredash', 'hypheninferior',
    '', '', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', '', '', '', 'onequarter', 'onehalf', 'threequarters',
    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', '',
    '', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
    'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior',
    'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior',
    'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall',
    'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall',
    'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
    'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall',
    'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall',
    'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall'];

var standardNames = [
    '.notdef', '.null', 'nonmarkingreturn', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
    'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash',
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less',
    'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright',
    'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde',
    'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde', 'Odieresis', 'Udieresis', 'aacute', 'agrave',
    'acircumflex', 'adieresis', 'atilde', 'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis',
    'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute', 'ograve', 'ocircumflex', 'odieresis',
    'otilde', 'uacute', 'ugrave', 'ucircumflex', 'udieresis', 'dagger', 'degree', 'cent', 'sterling', 'section',
    'bullet', 'paragraph', 'germandbls', 'registered', 'copyright', 'trademark', 'acute', 'dieresis', 'notequal',
    'AE', 'Oslash', 'infinity', 'plusminus', 'lessequal', 'greaterequal', 'yen', 'mu', 'partialdiff', 'summation',
    'product', 'pi', 'integral', 'ordfeminine', 'ordmasculine', 'Omega', 'ae', 'oslash', 'questiondown',
    'exclamdown', 'logicalnot', 'radical', 'florin', 'approxequal', 'Delta', 'guillemotleft', 'guillemotright',
    'ellipsis', 'nonbreakingspace', 'Agrave', 'Atilde', 'Otilde', 'OE', 'oe', 'endash', 'emdash', 'quotedblleft',
    'quotedblright', 'quoteleft', 'quoteright', 'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction',
    'currency', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl', 'periodcentered', 'quotesinglbase',
    'quotedblbase', 'perthousand', 'Acircumflex', 'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute',
    'Icircumflex', 'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple', 'Ograve', 'Uacute', 'Ucircumflex',
    'Ugrave', 'dotlessi', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut',
    'ogonek', 'caron', 'Lslash', 'lslash', 'Scaron', 'scaron', 'Zcaron', 'zcaron', 'brokenbar', 'Eth', 'eth',
    'Yacute', 'yacute', 'Thorn', 'thorn', 'minus', 'multiply', 'onesuperior', 'twosuperior', 'threesuperior',
    'onehalf', 'onequarter', 'threequarters', 'franc', 'Gbreve', 'gbreve', 'Idotaccent', 'Scedilla', 'scedilla',
    'Cacute', 'cacute', 'Ccaron', 'ccaron', 'dcroat'];

// This is the encoding used for fonts created from scratch.
// It loops through all glyphs and finds the appropriate unicode value.
// Since it's linear time, other encodings will be faster.
function DefaultEncoding(font) {
    this.font = font;
}

DefaultEncoding.prototype.charToGlyphIndex = function(c) {
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

CmapEncoding.prototype.charToGlyphIndex = function(c) {
    return this.cmap.glyphIndexMap[c.charCodeAt(0)] || 0;
};

function CffEncoding(encoding, charset) {
    this.encoding = encoding;
    this.charset = charset;
}

CffEncoding.prototype.charToGlyphIndex = function(s) {
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

GlyphNames.prototype.nameToGlyphIndex = function(name) {
    return this.names.indexOf(name);
};

GlyphNames.prototype.glyphIndexToName = function(gid) {
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

},{}],4:[function(require,module,exports){
// The Font object

'use strict';

var path = require('./path');
var sfnt = require('./tables/sfnt');
var encoding = require('./encoding');

// A Font represents a loaded OpenType font file.
// It contains a set of glyphs and methods to draw text on a drawing context,
// or to get a path representing the text.
function Font(options) {
    options = options || {};

    // OS X will complain if the names are empty, so we put a single space everywhere by default.
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

// Check if the font has a glyph for the given character.
Font.prototype.hasChar = function(c) {
    return this.encoding.charToGlyphIndex(c) !== null;
};

// Convert the given character to a single glyph index.
// Note that this function assumes that there is a one-to-one mapping between
// the given character and a glyph; for complex scripts this might not be the case.
Font.prototype.charToGlyphIndex = function(s) {
    return this.encoding.charToGlyphIndex(s);
};

// Convert the given character to a single Glyph object.
// Note that this function assumes that there is a one-to-one mapping between
// the given character and a glyph; for complex scripts this might not be the case.
Font.prototype.charToGlyph = function(c) {
    var glyphIndex = this.charToGlyphIndex(c);
    var glyph = this.glyphs[glyphIndex];
    if (!glyph) {
        // .notdef
        glyph = this.glyphs[0];
    }

    return glyph;
};

// Convert the given text to a list of Glyph objects.
// Note that there is no strict one-to-one mapping between characters and
// glyphs, so the list of returned glyphs can be larger or smaller than the
// length of the given string.
Font.prototype.stringToGlyphs = function(s) {
    var glyphs = [];
    for (var i = 0; i < s.length; i += 1) {
        var c = s[i];
        glyphs.push(this.charToGlyph(c));
    }

    return glyphs;
};

Font.prototype.nameToGlyphIndex = function(name) {
    return this.glyphNames.nameToGlyphIndex(name);
};

Font.prototype.nameToGlyph = function(name) {
    var glyphIndex = this.nametoGlyphIndex(name);
    var glyph = this.glyphs[glyphIndex];
    if (!glyph) {
        // .notdef
        glyph = this.glyphs[0];
    }

    return glyph;
};

Font.prototype.glyphIndexToName = function(gid) {
    if (!this.glyphNames.glyphIndexToName) {
        return '';
    }

    return this.glyphNames.glyphIndexToName(gid);
};

// Retrieve the value of the kerning pair between the left glyph (or its index)
// and the right glyph (or its index). If no kerning pair is found, return 0.
// The kerning value gets added to the advance width when calculating the spacing
// between glyphs.
Font.prototype.getKerningValue = function(leftGlyph, rightGlyph) {
    leftGlyph = leftGlyph.index || leftGlyph;
    rightGlyph = rightGlyph.index || rightGlyph;
    var gposKerning = this.getGposKerningValue;
    return gposKerning ? gposKerning(leftGlyph, rightGlyph) :
        (this.kerningPairs[leftGlyph + ',' + rightGlyph] || 0);
};

// Helper function that invokes the given callback for each glyph in the given text.
// The callback gets `(glyph, x, y, fontSize, options)`.
Font.prototype.forEachGlyph = function(text, x, y, fontSize, options, callback) {
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

// Create a Path object that represents the given text.
//
// text - The text to create.
// x - Horizontal position of the beginning of the text. (default: 0)
// y - Vertical position of the *baseline* of the text. (default: 0)
// fontSize - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`. (default: 72)
// Options is an optional object that contains:
// - kerning - Whether to take kerning information into account. (default: true)
//
// Returns a Path object.
Font.prototype.getPath = function(text, x, y, fontSize, options) {
    var fullPath = new path.Path();
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        var glyphPath = glyph.getPath(gX, gY, gFontSize);
        fullPath.extend(glyphPath);
    });

    return fullPath;
};

// Draw the text on the given drawing context.
//
// ctx - A 2D drawing context, like Canvas.
// text - The text to create.
// x - Horizontal position of the beginning of the text. (default: 0)
// y - Vertical position of the *baseline* of the text. (default: 0)
// fontSize - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`. (default: 72)
// Options is an optional object that contains:
// - kerning - Whether to take kerning information into account. (default: true)
Font.prototype.draw = function(ctx, text, x, y, fontSize, options) {
    this.getPath(text, x, y, fontSize, options).draw(ctx);
};

// Draw the points of all glyphs in the text.
// On-curve points will be drawn in blue, off-curve points will be drawn in red.
//
// ctx - A 2D drawing context, like Canvas.
// text - The text to create.
// x - Horizontal position of the beginning of the text. (default: 0)
// y - Vertical position of the *baseline* of the text. (default: 0)
// fontSize - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`. (default: 72)
// Options is an optional object that contains:
// - kerning - Whether to take kerning information into account. (default: true)
Font.prototype.drawPoints = function(ctx, text, x, y, fontSize, options) {
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        glyph.drawPoints(ctx, gX, gY, gFontSize);
    });
};

// Draw lines indicating important font measurements for all glyphs in the text.
// Black lines indicate the origin of the coordinate system (point 0,0).
// Blue lines indicate the glyph bounding box.
// Green line indicates the advance width of the glyph.
//
// ctx - A 2D drawing context, like Canvas.
// text - The text to create.
// x - Horizontal position of the beginning of the text. (default: 0)
// y - Vertical position of the *baseline* of the text. (default: 0)
// fontSize - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`. (default: 72)
// Options is an optional object that contains:
// - kerning - Whether to take kerning information into account. (default: true)
Font.prototype.drawMetrics = function(ctx, text, x, y, fontSize, options) {
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        glyph.drawMetrics(ctx, gX, gY, gFontSize);
    });
};

// Validate
Font.prototype.validate = function() {
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

    // Identification information
    assertStringAttribute('familyName');
    assertStringAttribute('weightName');
    assertStringAttribute('manufacturer');
    assertStringAttribute('copyright');
    assertStringAttribute('version');

    // Dimension information
    assert(this.unitsPerEm > 0, 'No unitsPerEm specified.');
};

// Convert the font object to a SFNT data structure.
// This structure contains all the necessary tables and metadata to create a binary OTF file.
Font.prototype.toTables = function() {
    return sfnt.fontToTable(this);
};

Font.prototype.toBuffer = function() {
    var sfntTable = this.toTables();
    var bytes = sfntTable.encode();
    var buffer = new ArrayBuffer(bytes.length);
    var intArray = new Uint8Array(buffer);
    for (var i = 0; i < bytes.length; i++) {
        intArray[i] = bytes[i];
    }

    return buffer;
};

// Initiate a download of the OpenType font.
Font.prototype.download = function() {
    var fileName = this.familyName.replace(/\s/g, '') + '-' + this.styleName + '.otf';
    var buffer = this.toBuffer();

    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.TEMPORARY, buffer.byteLength, function(fs) {
        fs.root.getFile(fileName, {create: true}, function(fileEntry) {
            fileEntry.createWriter(function(writer) {
                var dataView = new DataView(buffer);
                var blob = new Blob([dataView], {type: 'font/opentype'});
                writer.write(blob);

                writer.addEventListener('writeend', function() {
                    // Navigating to the file will download it.
                    location.href = fileEntry.toURL();
                }, false);
            });
        });
    },

    function(err) {
        throw err;
    });
};

exports.Font = Font;

},{"./encoding":3,"./path":8,"./tables/sfnt":23}],5:[function(require,module,exports){
// The Glyph object

'use strict';

var check = require('./check');
var draw = require('./draw');
var path = require('./path');

// A Glyph is an individual mark that often corresponds to a character.
// Some glyphs, such as ligatures, are a combination of many characters.
// Glyphs are the basic building blocks of a font.
//
// The `Glyph` class contains utility methods for drawing the path and its points.
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

Glyph.prototype.addUnicode = function(unicode) {
    if (this.unicodes.length === 0) {
        this.unicode = unicode;
    }

    this.unicodes.push(unicode);
};

// Convert the glyph to a Path we can draw on a drawing context.
//
// x - Horizontal position of the glyph. (default: 0)
// y - Vertical position of the *baseline* of the glyph. (default: 0)
// fontSize - Font size, in pixels (default: 72).
Glyph.prototype.getPath = function(x, y, fontSize) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 72;
    var scale = 1 / this.font.unitsPerEm * fontSize;
    var p = new path.Path();
    var commands = this.path.commands;
    for (var i = 0; i < commands.length; i += 1) {
        var cmd = commands[i];
        if (cmd.type === 'M') {
            p.moveTo(x + (cmd.x * scale), y + (-cmd.y * scale));
        } else if (cmd.type === 'L') {
            p.lineTo(x + (cmd.x * scale), y + (-cmd.y * scale));
        } else if (cmd.type === 'Q') {
            p.quadraticCurveTo(x + (cmd.x1 * scale), y + (-cmd.y1 * scale),
                               x + (cmd.x * scale), y + (-cmd.y * scale));
        } else if (cmd.type === 'C') {
            p.curveTo(x + (cmd.x1 * scale), y + (-cmd.y1 * scale),
                      x + (cmd.x2 * scale), y + (-cmd.y2 * scale),
                      x + (cmd.x * scale), y + (-cmd.y * scale));
        } else if (cmd.type === 'Z') {
            p.closePath();
        }
    }

    return p;
};

// Split the glyph into contours.
// This function is here for backwards compatibility, and to
// provide raw access to the TrueType glyph outlines.
Glyph.prototype.getContours = function() {
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

// Calculate the xMin/yMin/xMax/yMax/lsb/rsb for a Glyph.
Glyph.prototype.getMetrics = function() {
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

// Draw the glyph on the given context.
//
// ctx - The drawing context.
// x - Horizontal position of the glyph. (default: 0)
// y - Vertical position of the *baseline* of the glyph. (default: 0)
// fontSize - Font size, in pixels (default: 72).
Glyph.prototype.draw = function(ctx, x, y, fontSize) {
    this.getPath(x, y, fontSize).draw(ctx);
};

// Draw the points of the glyph.
// On-curve points will be drawn in blue, off-curve points will be drawn in red.
//
// ctx - The drawing context.
// x - Horizontal position of the glyph. (default: 0)
// y - Vertical position of the *baseline* of the glyph. (default: 0)
// fontSize - Font size, in pixels (default: 72).
Glyph.prototype.drawPoints = function(ctx, x, y, fontSize) {

    function drawCircles(l, x, y, scale) {
        var PI_SQ = Math.PI * 2;
        ctx.beginPath();
        for (var j = 0; j < l.length; j += 1) {
            ctx.moveTo(x + (l[j].x * scale), y + (l[j].y * scale));
            ctx.arc(x + (l[j].x * scale), y + (l[j].y * scale), 2, 0, PI_SQ, false);
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
            blueCircles.push({x: cmd.x, y: -cmd.y});
        }

        if (cmd.x1 !== undefined) {
            redCircles.push({x: cmd.x1, y: -cmd.y1});
        }

        if (cmd.x2 !== undefined) {
            redCircles.push({x: cmd.x2, y: -cmd.y2});
        }
    }

    ctx.fillStyle = 'blue';
    drawCircles(blueCircles, x, y, scale);
    ctx.fillStyle = 'red';
    drawCircles(redCircles, x, y, scale);
};

// Draw lines indicating important font measurements.
// Black lines indicate the origin of the coordinate system (point 0,0).
// Blue lines indicate the glyph bounding box.
// Green line indicates the advance width of the glyph.
//
// ctx - The drawing context.
// x - Horizontal position of the glyph. (default: 0)
// y - Vertical position of the *baseline* of the glyph. (default: 0)
// fontSize - Font size, in pixels (default: 72).
Glyph.prototype.drawMetrics = function(ctx, x, y, fontSize) {
    var scale;
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 24;
    scale = 1 / this.font.unitsPerEm * fontSize;
    ctx.lineWidth = 1;

    // Draw the origin
    ctx.strokeStyle = 'black';
    draw.line(ctx, x, -10000, x, 10000);
    draw.line(ctx, -10000, y, 10000, y);

    // Draw the glyph box
    ctx.strokeStyle = 'blue';
    draw.line(ctx, x + (this.xMin * scale), -10000, x + (this.xMin * scale), 10000);
    draw.line(ctx, x + (this.xMax * scale), -10000, x + (this.xMax * scale), 10000);
    draw.line(ctx, -10000, y + (-this.yMin * scale), 10000, y + (-this.yMin * scale));
    draw.line(ctx, -10000, y + (-this.yMax * scale), 10000, y + (-this.yMax * scale));

    // Draw the advance width
    ctx.strokeStyle = 'green';
    draw.line(ctx, x + (this.advanceWidth * scale), -10000, x + (this.advanceWidth * scale), 10000);
};

exports.Glyph = Glyph;

},{"./check":1,"./draw":2,"./path":8}],6:[function(require,module,exports){
// opentype.js
// https://github.com/nodebox/opentype.js
// (c) 2014 Frederik De Bleser
// opentype.js may be freely distributed under the MIT license.

/* global ArrayBuffer, DataView, Uint8Array, XMLHttpRequest  */

'use strict';

var encoding = require('./encoding');
var _font = require('./font');
var glyph = require('./glyph');
var parse = require('./parse');
var path = require('./path');

var cmap = require('./tables/cmap');
var cff = require('./tables/cff');
var glyf = require('./tables/glyf');
var gpos = require('./tables/gpos');
var head = require('./tables/head');
var hhea = require('./tables/hhea');
var hmtx = require('./tables/hmtx');
var kern = require('./tables/kern');
var loca = require('./tables/loca');
var maxp = require('./tables/maxp');
var _name = require('./tables/name');
var os2 = require('./tables/os2');
var post = require('./tables/post');

// File loaders /////////////////////////////////////////////////////////

// Convert a Node.js Buffer to an ArrayBuffer
function toArrayBuffer(buffer) {
    var arrayBuffer = new ArrayBuffer(buffer.length);
    var data = new Uint8Array(arrayBuffer);
    for (var i = 0; i < buffer.length; i += 1) {
        data[i] = buffer[i];
    }

    return arrayBuffer;
}

function loadFromFile(path, callback) {
    var fs = require('fs');
    fs.readFile(path, function(err, buffer) {
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
    request.onload = function() {
        if (request.status !== 200) {
            return callback('Font could not be loaded: ' + request.statusText);
        }

        return callback(null, request.response);
    };

    request.send();
}

// Public API ///////////////////////////////////////////////////////////

// Parse the OpenType file data (as an ArrayBuffer) and return a Font object.
// If the file could not be parsed (most likely because it contains Postscript outlines)
// we return an empty Font object with the `supported` flag set to `false`.
function parseBuffer(buffer) {
    var indexToLocFormat;
    var hmtxOffset;
    var glyfOffset;
    var locaOffset;
    var cffOffset;
    var kernOffset;
    var gposOffset;

    // OpenType fonts use big endian byte ordering.
    // We can't rely on typed array view types, because they operate with the endianness of the host computer.
    // Instead we use DataViews where we can specify endianness.

    var font = new _font.Font();
    var data = new DataView(buffer, 0);

    var version = parse.getFixed(data, 0);
    if (version === 1.0) {
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

    // Offset into the table records.
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

// Asynchronously load the font from a URL or a filesystem. When done, call the callback
// with two arguments `(err, font)`. The `err` will be null on success,
// the `font` is a Font object.
//
// We use the node.js callback convention so that
// opentype.js can integrate with frameworks like async.js.
function load(url, callback) {
    var isNode = typeof window === 'undefined';
    var loadFn = isNode ? loadFromFile : loadFromUrl;
    loadFn(url, function(err, arrayBuffer) {
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

},{"./encoding":3,"./font":4,"./glyph":5,"./parse":7,"./path":8,"./tables/cff":10,"./tables/cmap":11,"./tables/glyf":12,"./tables/gpos":13,"./tables/head":14,"./tables/hhea":15,"./tables/hmtx":16,"./tables/kern":17,"./tables/loca":18,"./tables/maxp":19,"./tables/name":20,"./tables/os2":21,"./tables/post":22,"fs":undefined}],7:[function(require,module,exports){
// Parsing utility functions

'use strict';

// Retrieve an unsigned byte from the DataView.
exports.getByte = function getByte(dataView, offset) {
    return dataView.getUint8(offset);
};

exports.getCard8 = exports.getByte;

// Retrieve an unsigned 16-bit short from the DataView.
// The value is stored in big endian.
exports.getUShort = function(dataView, offset) {
    return dataView.getUint16(offset, false);
};

exports.getCard16 = exports.getUShort;

// Retrieve a signed 16-bit short from the DataView.
// The value is stored in big endian.
exports.getShort = function(dataView, offset) {
    return dataView.getInt16(offset, false);
};

// Retrieve an unsigned 32-bit long from the DataView.
// The value is stored in big endian.
exports.getULong = function(dataView, offset) {
    return dataView.getUint32(offset, false);
};

// Retrieve a 32-bit signed fixed-point number (16.16) from the DataView.
// The value is stored in big endian.
exports.getFixed = function(dataView, offset) {
    var decimal = dataView.getInt16(offset, false);
    var fraction = dataView.getUint16(offset + 2, false);
    return decimal + fraction / 65535;
};

// Retrieve a 4-character tag from the DataView.
// Tags are used to identify tables.
exports.getTag = function(dataView, offset) {
    var tag = '';
    for (var i = offset; i < offset + 4; i += 1) {
        tag += String.fromCharCode(dataView.getInt8(i));
    }

    return tag;
};

// Retrieve an offset from the DataView.
// Offsets are 1 to 4 bytes in length, depending on the offSize argument.
exports.getOffset = function(dataView, offset, offSize) {
    var v = 0;
    for (var i = 0; i < offSize; i += 1) {
        v <<= 8;
        v += dataView.getUint8(offset + i);
    }

    return v;
};

// Retrieve a number of bytes from start offset to the end offset from the DataView.
exports.getBytes = function(dataView, startOffset, endOffset) {
    var bytes = [];
    for (var i = startOffset; i < endOffset; i += 1) {
        bytes.push(dataView.getUint8(i));
    }

    return bytes;
};

// Convert the list of bytes to a string.
exports.bytesToString = function(bytes) {
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

// A stateful parser that changes the offset whenever a value is retrieved.
// The data is a DataView.
function Parser(data, offset) {
    this.data = data;
    this.offset = offset;
    this.relativeOffset = 0;
}

Parser.prototype.parseByte = function() {
    var v = this.data.getUint8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseChar = function() {
    var v = this.data.getInt8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseCard8 = Parser.prototype.parseByte;

Parser.prototype.parseUShort = function() {
    var v = this.data.getUint16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
Parser.prototype.parseSID = Parser.prototype.parseUShort;
Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;

Parser.prototype.parseShort = function() {
    var v = this.data.getInt16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseF2Dot14 = function() {
    var v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseULong = function() {
    var v = exports.getULong(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseFixed = function() {
    var v = exports.getFixed(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseOffset16List =
Parser.prototype.parseUShortList = function(count) {
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

Parser.prototype.parseString = function(length) {
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    var string = '';
    this.relativeOffset += length;
    for (var i = 0; i < length; i++) {
        string += String.fromCharCode(dataView.getUint8(offset + i));
    }

    return string;
};

Parser.prototype.parseTag = function() {
    return this.parseString(4);
};

// LONGDATETIME is a 64-bit integer.
// JavaScript and unix timestamps traditionally use 32 bits, so we
// only take the last 32 bits.
Parser.prototype.parseLongDateTime = function() {
    var v = exports.getULong(this.data, this.offset + this.relativeOffset + 4);
    this.relativeOffset += 8;
    return v;
};

Parser.prototype.parseFixed = function() {
    var v = exports.getULong(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v / 65536;
};

Parser.prototype.parseVersion = function() {
    var major = exports.getUShort(this.data, this.offset + this.relativeOffset);

    // How to interpret the minor version is very vague in the spec. 0x5000 is 5, 0x1000 is 1
    // This returns the correct number if minor = 0xN000 where N is 0-9
    var minor = exports.getUShort(this.data, this.offset + this.relativeOffset + 2);
    this.relativeOffset += 4;
    return major + minor / 0x1000 / 10;
};

Parser.prototype.skip = function(type, amount) {
    if (amount === undefined) {
        amount = 1;
    }

    this.relativeOffset += typeOffsets[type] * amount;
};

exports.Parser = Parser;

},{}],8:[function(require,module,exports){
// Geometric objects

'use strict';

// A bézier path containing a set of path commands similar to a SVG path.
// Paths can be drawn on a context using `draw`.
function Path() {
    this.commands = [];
    this.fill = 'black';
    this.stroke = null;
    this.strokeWidth = 1;
}

Path.prototype.moveTo = function(x, y) {
    this.commands.push({
        type: 'M',
        x: x,
        y: y
    });
};

Path.prototype.lineTo = function(x, y) {
    this.commands.push({
        type: 'L',
        x: x,
        y: y
    });
};

Path.prototype.curveTo = Path.prototype.bezierCurveTo = function(x1, y1, x2, y2, x, y) {
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

Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function(x1, y1, x, y) {
    this.commands.push({
        type: 'Q',
        x1: x1,
        y1: y1,
        x: x,
        y: y
    });
};

Path.prototype.close = Path.prototype.closePath = function() {
    this.commands.push({
        type: 'Z'
    });
};

// Add the given path or list of commands to the commands of this path.
Path.prototype.extend = function(pathOrCommands) {
    if (pathOrCommands.commands) {
        pathOrCommands = pathOrCommands.commands;
    }

    Array.prototype.push.apply(this.commands, pathOrCommands);
};

// Draw the path to a 2D context.
Path.prototype.draw = function(ctx) {
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

// Convert the Path to a string of path data instructions
// See http://www.w3.org/TR/SVG/paths.html#PathData
// Parameters:
// - decimalPlaces: The amount of decimal places for floating-point values (default: 2)
Path.prototype.toPathData = function(decimalPlaces) {
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

// Convert the path to a SVG <path> element, as a string.
// Parameters:
// - decimalPlaces: The amount of decimal places for floating-point values (default: 2)
Path.prototype.toSVG = function(decimalPlaces) {
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

},{}],9:[function(require,module,exports){
// Table metadata

'use strict';

var check = require('./check');
var encode = require('./types').encode;
var sizeOf = require('./types').sizeOf;

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

Table.prototype.sizeOf = function() {
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

Table.prototype.encode = function() {
    return encode.TABLE(this);
};

exports.Table = Table;

},{"./check":1,"./types":24}],10:[function(require,module,exports){
// The `CFF` table contains the glyph outlines in PostScript format.
// https://www.microsoft.com/typography/OTSPEC/cff.htm
// http://download.microsoft.com/download/8/0/1/801a191c-029d-4af3-9642-555f6fe514ee/cff.pdf
// http://download.microsoft.com/download/8/0/1/801a191c-029d-4af3-9642-555f6fe514ee/type2.pdf

'use strict';

var encoding = require('../encoding');
var _glyph = require('../glyph');
var parse = require('../parse');
var path = require('../path');
var table = require('../table');

// Custom equals function that can also check lists.
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

// Parse a `CFF` INDEX array.
// An index array consists of a list of offsets, then a list of objects at those offsets.
function parseCFFIndex(data, start, conversionFn) {
    //var i, objectOffset, endOffset;
    var offsets = [];
    var objects = [];
    var count = parse.getCard16(data, start);
    var i;
    var objectOffset;
    var endOffset;
    if (count !== 0) {
        var offsetSize = parse.getByte(data, start + 2);
        objectOffset = start + ((count + 1) * offsetSize) + 2;
        var pos = start + 3;
        for (i = 0; i < count + 1; i += 1) {
            offsets.push(parse.getOffset(data, pos, offsetSize));
            pos += offsetSize;
        }

        // The total size of the index array is 4 header bytes + the value of the last offset.
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

    return {objects: objects, startOffset: start, endOffset: endOffset};
}

// Parse a `CFF` DICT real value.
function parseFloatOperand(parser) {
    var s = '';
    var eof = 15;
    var lookup = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'E', 'E-', null, '-'];
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

// Parse a `CFF` DICT operand.
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

// Convert the entries returned by `parseDict` to a proper dictionary.
// If a value is a list of one, it is unpacked.
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

// Parse a `CFF` DICT object.
// A dictionary contains key-value pairs in a compact tokenized format.
function parseCFFDict(data, start, size) {
    start = start !== undefined ? start : 0;
    var parser = new parse.Parser(data, start);
    var entries = [];
    var operands = [];
    size = size !== undefined ? size : data.length;

    while (parser.relativeOffset < size) {
        var op = parser.parseByte();

        // The first byte for each dict item distinguishes between operator (key) and operand (value).
        // Values <= 21 are operators.
        if (op <= 21) {
            // Two-byte operators have an initial escape byte of 12.
            if (op === 12) {
                op = 1200 + parser.parseByte();
            }

            entries.push([op, operands]);
            operands = [];
        } else {
            // Since the operands (values) come before the operators (keys), we store all operands in a list
            // until we encounter an operator.
            operands.push(parseOperand(parser, op));
        }
    }

    return entriesToObject(entries);
}

// Given a String Index (SID), return the value of the string.
// Strings below index 392 are standard CFF strings and are not encoded in the font.
function getCFFString(strings, index) {
    if (index <= 390) {
        index = encoding.cffStandardStrings[index];
    } else {
        index = strings[index - 391];
    }

    return index;
}

// Interpret a dictionary and return a new dictionary with readable keys and values for missing entries.
// This function takes `meta` which is a list of objects containing `operand`, `name` and `default`.
function interpretDict(dict, meta, strings) {
    var newDict = {};

    // Because we also want to include missing values, we start out from the meta list
    // and lookup values in the dict.
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

// Parse the CFF header.
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
    {name: 'version', op: 0, type: 'SID'},
    {name: 'notice', op: 1, type: 'SID'},
    {name: 'copyright', op: 1200, type: 'SID'},
    {name: 'fullName', op: 2, type: 'SID'},
    {name: 'familyName', op: 3, type: 'SID'},
    {name: 'weight', op: 4, type: 'SID'},
    {name: 'isFixedPitch', op: 1201, type: 'number', value: 0},
    {name: 'italicAngle', op: 1202, type: 'number', value: 0},
    {name: 'underlinePosition', op: 1203, type: 'number', value: -100},
    {name: 'underlineThickness', op: 1204, type: 'number', value: 50},
    {name: 'paintType', op: 1205, type: 'number', value: 0},
    {name: 'charstringType', op: 1206, type: 'number', value: 2},
    {name: 'fontMatrix', op: 1207, type: ['real', 'real', 'real', 'real', 'real', 'real'], value: [0.001, 0, 0, 0.001, 0, 0]},
    {name: 'uniqueId', op: 13, type: 'number'},
    {name: 'fontBBox', op: 5, type: ['number', 'number', 'number', 'number'], value: [0, 0, 0, 0]},
    {name: 'strokeWidth', op: 1208, type: 'number', value: 0},
    {name: 'xuid', op: 14, type: [], value: null},
    {name: 'charset', op: 15, type: 'offset', value: 0},
    {name: 'encoding', op: 16, type: 'offset', value: 0},
    {name: 'charStrings', op: 17, type: 'offset', value: 0},
    {name: 'private', op: 18, type: ['number', 'offset'], value: [0, 0]}
];

var PRIVATE_DICT_META = [
    {name: 'subrs', op: 19, type: 'offset', value: 0},
    {name: 'defaultWidthX', op: 20, type: 'number', value: 0},
    {name: 'nominalWidthX', op: 21, type: 'number', value: 0}
];

// Parse the CFF top dictionary. A CFF table can contain multiple fonts, each with their own top dictionary.
// The top dictionary contains the essential metadata for the font, together with the private dictionary.
function parseCFFTopDict(data, strings) {
    var dict = parseCFFDict(data, 0, data.byteLength);
    return interpretDict(dict, TOP_DICT_META, strings);
}

// Parse the CFF private dictionary. We don't fully parse out all the values, only the ones we need.
function parseCFFPrivateDict(data, start, size, strings) {
    var dict = parseCFFDict(data, start, size);
    return interpretDict(dict, PRIVATE_DICT_META, strings);
}

// Parse the CFF charset table, which contains internal names for all the glyphs.
// This function will return a list of glyph names.
// See Adobe TN #5176 chapter 13, "Charsets".
function parseCFFCharset(data, start, nGlyphs, strings) {
    var i;
    var sid;
    var count;
    var parser = new parse.Parser(data, start);

    // The .notdef glyph is not included, so subtract 1.
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

// Parse the CFF encoding data. Only one encoding can be specified per font.
// See Adobe TN #5176 chapter 12, "Encodings".
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

// Take in charstring code and return a Glyph object.
// The encoding is described in the Type 2 Charstring Format
// https://www.microsoft.com/typography/OTSPEC/charstr2.htm
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

        // The number of stem operators on the stack is always even.
        // If the value is uneven, that means a width is specified.
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
            case 1: // hstem
                parseStems();
                break;
            case 3: // vstem
                parseStems();
                break;
            case 4: // vmoveto
                if (stack.length > 1 && !haveWidth) {
                    width = stack.shift() + font.nominalWidthX;
                    haveWidth = true;
                }

                y += stack.pop();
                newContour(x, y);
                break;
            case 5: // rlineto
                while (stack.length > 0) {
                    x += stack.shift();
                    y += stack.shift();
                    p.lineTo(x, y);
                }

                break;
            case 6: // hlineto
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
            case 7: // vlineto
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
            case 8: // rrcurveto
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
            case 10: // callsubr
                codeIndex = stack.pop() + font.subrsBias;
                subrCode = font.subrs[codeIndex];
                if (subrCode) {
                    parse(subrCode);
                }

                break;
            case 11: // return
                return;
            case 12: // flex operators
                v = code[i];
                i += 1;
                switch (v) {
                case 35: // flex
                    // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 dx6 dy6 fd flex (12 35) |-
                    c1x = x   + stack.shift();    // dx1
                    c1y = y   + stack.shift();    // dy1
                    c2x = c1x + stack.shift();    // dx2
                    c2y = c1y + stack.shift();    // dy2
                    jpx = c2x + stack.shift();    // dx3
                    jpy = c2y + stack.shift();    // dy3
                    c3x = jpx + stack.shift();    // dx4
                    c3y = jpy + stack.shift();    // dy4
                    c4x = c3x + stack.shift();    // dx5
                    c4y = c3y + stack.shift();    // dy5
                    x = c4x + stack.shift();      // dx6
                    y = c4y + stack.shift();      // dy6
                    stack.shift();                // flex depth
                    p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                    p.curveTo(c3x, c3y, c4x, c4y, x, y);
                    break;
                case 34: // hflex
                    // |- dx1 dx2 dy2 dx3 dx4 dx5 dx6 hflex (12 34) |-
                    c1x = x   + stack.shift();    // dx1
                    c1y = y;                      // dy1
                    c2x = c1x + stack.shift();    // dx2
                    c2y = c1y + stack.shift();    // dy2
                    jpx = c2x + stack.shift();    // dx3
                    jpy = c2y;                    // dy3
                    c3x = jpx + stack.shift();    // dx4
                    c3y = c2y;                    // dy4
                    c4x = c3x + stack.shift();    // dx5
                    c4y = y;                      // dy5
                    x = c4x + stack.shift();      // dx6
                    p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                    p.curveTo(c3x, c3y, c4x, c4y, x, y);
                    break;
                case 36: // hflex1
                    // |- dx1 dy1 dx2 dy2 dx3 dx4 dx5 dy5 dx6 hflex1 (12 36) |-
                    c1x = x   + stack.shift();    // dx1
                    c1y = y   + stack.shift();    // dy1
                    c2x = c1x + stack.shift();    // dx2
                    c2y = c1y + stack.shift();    // dy2
                    jpx = c2x + stack.shift();    // dx3
                    jpy = c2y;                    // dy3
                    c3x = jpx + stack.shift();    // dx4
                    c3y = c2y;                    // dy4
                    c4x = c3x + stack.shift();    // dx5
                    c4y = c3y + stack.shift();    // dy5
                    x = c4x + stack.shift();      // dx6
                    p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                    p.curveTo(c3x, c3y, c4x, c4y, x, y);
                    break;
                case 37: // flex1
                    // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 d6 flex1 (12 37) |-
                    c1x = x   + stack.shift();    // dx1
                    c1y = y   + stack.shift();    // dy1
                    c2x = c1x + stack.shift();    // dx2
                    c2y = c1y + stack.shift();    // dy2
                    jpx = c2x + stack.shift();    // dx3
                    jpy = c2y + stack.shift();    // dy3
                    c3x = jpx + stack.shift();    // dx4
                    c3y = jpy + stack.shift();    // dy4
                    c4x = c3x + stack.shift();    // dx5
                    c4y = c3y + stack.shift();    // dy5
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
            case 14: // endchar
                if (stack.length > 0 && !haveWidth) {
                    width = stack.shift() + font.nominalWidthX;
                    haveWidth = true;
                }

                if (open) {
                    p.closePath();
                    open = false;
                }

                break;
            case 18: // hstemhm
                parseStems();
                break;
            case 19: // hintmask
            case 20: // cntrmask
                parseStems();
                i += (nStems + 7) >> 3;
                break;
            case 21: // rmoveto
                if (stack.length > 2 && !haveWidth) {
                    width = stack.shift() + font.nominalWidthX;
                    haveWidth = true;
                }

                y += stack.pop();
                x += stack.pop();
                newContour(x, y);
                break;
            case 22: // hmoveto
                if (stack.length > 1 && !haveWidth) {
                    width = stack.shift() + font.nominalWidthX;
                    haveWidth = true;
                }

                x += stack.pop();
                newContour(x, y);
                break;
            case 23: // vstemhm
                parseStems();
                break;
            case 24: // rcurveline
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
            case 25: // rlinecurve
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
            case 26: // vvcurveto
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
            case 27: // hhcurveto
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
            case 28: // shortint
                b1 = code[i];
                b2 = code[i + 1];
                stack.push(((b1 << 24) | (b2 << 16)) >> 16);
                i += 2;
                break;
            case 29: // callgsubr
                codeIndex = stack.pop() + font.gsubrsBias;
                subrCode = font.gsubrs[codeIndex];
                if (subrCode) {
                    parse(subrCode);
                }

                break;
            case 30: // vhcurveto
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
            case 31: // hvcurveto
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
                    stack.push(((b1 << 24) | (b2 << 16) | (b3 << 8) | b4) / 65536);
                }
            }
        }
    }

    parse(code);
    var glyph = new _glyph.Glyph({font: font, index: index});
    glyph.path = p;
    glyph.advanceWidth = width;
    return glyph;
}

// Subroutines are encoded using the negative half of the number space.
// See type 2 chapter 4.7 "Subroutine operators".
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

// Parse the `CFF` table, which contains the glyph outlines in PostScript format.
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

    // Offsets in the top dict are relative to the beginning of the CFF data, so add the CFF start offset.
    var charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
    font.nGlyphs = charStringsIndex.objects.length;

    var charset = parseCFFCharset(data, start + topDict.charset, font.nGlyphs, stringIndex.objects);
    if (topDict.encoding === 0) { // Standard encoding
        font.cffEncoding = new encoding.CffEncoding(encoding.cffStandardEncoding, charset);
    } else if (topDict.encoding === 1) { // Expert encoding
        font.cffEncoding = new encoding.CffEncoding(encoding.cffExpertEncoding, charset);
    } else {
        font.cffEncoding = parseCFFEncoding(data, start + topDict.encoding, charset);
    }

    // Prefer the CMAP encoding to the CFF encoding.
    font.encoding = font.encoding || font.cffEncoding;

    font.glyphs = [];
    for (var i = 0; i < font.nGlyphs; i += 1) {
        var charString = charStringsIndex.objects[i];
        font.glyphs.push(parseCFFCharstring(charString, font, i));
    }
}

// Convert a string to a String ID (SID).
// The list of strings is modified in place.
function encodeString(s, strings) {
    var sid;

    // Is the string in the CFF standard strings?
    var i = encoding.cffStandardStrings.indexOf(s);
    if (i >= 0) {
        sid = i;
    }

    // Is the string already in the string index?
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
        {name: 'major', type: 'Card8', value: 1},
        {name: 'minor', type: 'Card8', value: 0},
        {name: 'hdrSize', type: 'Card8', value: 4},
        {name: 'major', type: 'Card8', value: 1}
    ]);
}

function makeNameIndex(fontNames) {
    var t = new table.Table('Name INDEX', [
        {name: 'names', type: 'INDEX', value: []}
    ]);
    t.names = [];
    for (var i = 0; i < fontNames.length; i += 1) {
        t.names.push({name: 'name_' + i, type: 'NAME', value: fontNames[i]});
    }

    return t;
}

// Given a dictionary's metadata, create a DICT structure.
function makeDict(meta, attrs, strings) {
    var m = {};
    for (var i = 0; i < meta.length; i += 1) {
        var entry = meta[i];
        var value = attrs[entry.name];
        if (value !== undefined && !equals(value, entry.value)) {
            if (entry.type === 'SID') {
                value = encodeString(value, strings);
            }

            m[entry.op] = {name: entry.name, type: entry.type, value: value};
        }
    }

    return m;
}

// The Top DICT houses the global font attributes.
function makeTopDict(attrs, strings) {
    var t = new table.Table('Top DICT', [
        {name: 'dict', type: 'DICT', value: {}}
    ]);
    t.dict = makeDict(TOP_DICT_META, attrs, strings);
    return t;
}

function makeTopDictIndex(topDict) {
    var t = new table.Table('Top DICT INDEX', [
        {name: 'topDicts', type: 'INDEX', value: []}
    ]);
    t.topDicts = [{name: 'topDict_0', type: 'TABLE', value: topDict}];
    return t;
}

function makeStringIndex(strings) {
    var t = new table.Table('String INDEX', [
        {name: 'strings', type: 'INDEX', value: []}
    ]);
    t.strings = [];
    for (var i = 0; i < strings.length; i += 1) {
        t.strings.push({name: 'string_' + i, type: 'STRING', value: strings[i]});
    }

    return t;
}

function makeGlobalSubrIndex() {
    // Currently we don't use subroutines.
    return new table.Table('Global Subr INDEX', [
        {name: 'subrs', type: 'INDEX', value: []}
    ]);
}

function makeCharsets(glyphNames, strings) {
    var t = new table.Table('Charsets', [
        {name: 'format', type: 'Card8', value: 0}
    ]);
    for (var i = 0; i < glyphNames.length; i += 1) {
        var glyphName = glyphNames[i];
        var glyphSID = encodeString(glyphName, strings);
        t.fields.push({name: 'glyph_' + i, type: 'SID', value: glyphSID});
    }

    return t;
}

function glyphToOps(glyph) {
    var ops = [];
    var path = glyph.path;
    ops.push({name: 'width', type: 'NUMBER', value: glyph.advanceWidth});
    var x = 0;
    var y = 0;
    for (var i = 0; i < path.commands.length; i += 1) {
        var dx;
        var dy;
        var cmd = path.commands[i];
        if (cmd.type === 'Q') {
            // CFF only supports bézier curves, so convert the quad to a bézier.
            var _13 = 1 / 3;
            var _23 = 2 / 3;

            // We're going to create a new command so we don't change the original path.
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
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rmoveto', type: 'OP', value: 21});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        } else if (cmd.type === 'L') {
            dx = Math.round(cmd.x - x);
            dy = Math.round(cmd.y - y);
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rlineto', type: 'OP', value: 5});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        } else if (cmd.type === 'C') {
            var dx1 = Math.round(cmd.x1 - x);
            var dy1 = Math.round(cmd.y1 - y);
            var dx2 = Math.round(cmd.x2 - cmd.x1);
            var dy2 = Math.round(cmd.y2 - cmd.y1);
            dx = Math.round(cmd.x - cmd.x2);
            dy = Math.round(cmd.y - cmd.y2);
            ops.push({name: 'dx1', type: 'NUMBER', value: dx1});
            ops.push({name: 'dy1', type: 'NUMBER', value: dy1});
            ops.push({name: 'dx2', type: 'NUMBER', value: dx2});
            ops.push({name: 'dy2', type: 'NUMBER', value: dy2});
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rrcurveto', type: 'OP', value: 8});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        }

        // Contours are closed automatically.

    }

    ops.push({name: 'endchar', type: 'OP', value: 14});
    return ops;
}

function makeCharStringsIndex(glyphs) {
    var t = new table.Table('CharStrings INDEX', [
        {name: 'charStrings', type: 'INDEX', value: []}
    ]);
    for (var i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs[i];
        var ops = glyphToOps(glyph);
        t.charStrings.push({name: glyph.name, type: 'CHARSTRING', value: ops});
    }

    return t;
}

function makePrivateDict(attrs, strings) {
    var t = new table.Table('Private DICT', [
        {name: 'dict', type: 'DICT', value: {}}
    ]);
    t.dict = makeDict(PRIVATE_DICT_META, attrs, strings);
    return t;
}

function makePrivateDictIndex(privateDict) {
    var t = new table.Table('Private DICT INDEX', [
        {name: 'privateDicts', type: 'INDEX', value: []}
    ]);
    t.privateDicts = [{name: 'privateDict_0', type: 'TABLE', value: privateDict}];
    return t;
}

function makeCFFTable(glyphs, options) {
    var t = new table.Table('CFF ', [
        {name: 'header', type: 'TABLE'},
        {name: 'nameIndex', type: 'TABLE'},
        {name: 'topDictIndex', type: 'TABLE'},
        {name: 'stringIndex', type: 'TABLE'},
        {name: 'globalSubrIndex', type: 'TABLE'},
        {name: 'charsets', type: 'TABLE'},
        {name: 'charStringsIndex', type: 'TABLE'},
        {name: 'privateDictIndex', type: 'TABLE'}
    ]);

    // We use non-zero values for the offsets so that the DICT encodes them.
    // This is important because the size of the Top DICT plays a role in offset calculation,
    // and the size shouldn't change after we've written correct offsets.
    var attrs = {
        version: options.version,
        fullName: options.fullName,
        familyName: options.familyName,
        weight: options.weightName,
        charset: 999,
        encoding: 0,
        charStrings: 999,
        private: [0, 999]
    };

    var privateAttrs = {};

    var glyphNames = [];

    // Skip first glyph (.notdef)
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

    // Needs to come at the end, to encode all custom strings used in the font.
    t.stringIndex = makeStringIndex(strings);

    var startOffset = t.header.sizeOf() +
        t.nameIndex.sizeOf() +
        t.topDictIndex.sizeOf() +
        t.stringIndex.sizeOf() +
        t.globalSubrIndex.sizeOf();
    attrs.charset = startOffset;

    // We use the CFF standard encoding; proper encoding will be handled in cmap.
    attrs.encoding = 0;
    attrs.charStrings = attrs.charset + t.charsets.sizeOf();
    attrs.private[1] = attrs.charStrings + t.charStringsIndex.sizeOf();

    // Recreate the Top DICT INDEX with the correct offsets.
    topDict = makeTopDict(attrs, strings);
    t.topDictIndex = makeTopDictIndex(topDict);

    return t;
}

exports.parse = parseCFFTable;
exports.make = makeCFFTable;

},{"../encoding":3,"../glyph":5,"../parse":7,"../path":8,"../table":9}],11:[function(require,module,exports){
// The `cmap` table stores the mappings from characters to glyphs.
// https://www.microsoft.com/typography/OTSPEC/cmap.htm

'use strict';

var check = require('../check');
var parse = require('../parse');
var table = require('../table');

// Parse the `cmap` table. This table stores the mappings from characters to glyphs.
// There are many available formats, but we only support the Windows format 4.
// This function returns a `CmapEncoding` object or null if no supported format could be found.
function parseCmapTable(data, start) {
    var i;
    var cmap = {};
    cmap.version = parse.getUShort(data, start);
    check.argument(cmap.version === 0, 'cmap table version should be 0.');

    // The cmap table can contain many sub-tables, each with their own format.
    // We're only interested in a "platform 3" table. This is a Windows format.
    cmap.numTables = parse.getUShort(data, start + 2);
    var offset = -1;
    for (i = 0; i < cmap.numTables; i += 1) {
        var platformId = parse.getUShort(data, start + 4 + (i * 8));
        var encodingId = parse.getUShort(data, start + 4 + (i * 8) + 2);
        if (platformId === 3 && (encodingId === 1 || encodingId === 0)) {
            offset = parse.getULong(data, start + 4 + (i * 8) + 4);
            break;
        }
    }

    if (offset === -1) {
        // There is no cmap table in the font that we support, so return null.
        // This font will be marked as unsupported.
        return null;
    }

    var p = new parse.Parser(data, start + offset);
    cmap.format = p.parseUShort();
    check.argument(cmap.format === 4, 'Only format 4 cmap tables are supported.');

    // Length in bytes of the sub-tables.
    cmap.length = p.parseUShort();
    cmap.language = p.parseUShort();

    // segCount is stored x 2.
    var segCount;
    cmap.segCount = segCount = p.parseUShort() >> 1;

    // Skip searchRange, entrySelector, rangeShift.
    p.skip('uShort', 3);

    // The "unrolled" mapping from character codes to glyph indices.
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
                // The idRangeOffset is relative to the current position in the idRangeOffset array.
                // Take the current offset in the idRangeOffset array.
                glyphIndexOffset = (idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2);

                // Add the value of the idRangeOffset, which will move us into the glyphIndex array.
                glyphIndexOffset += idRangeOffset;

                // Then add the character index of the current segment, multiplied by 2 for USHORTs.
                glyphIndexOffset += (c - startCount) * 2;
                glyphIndex = parse.getUShort(data, glyphIndexOffset);
                if (glyphIndex !== 0) {
                    glyphIndex = (glyphIndex + idDelta) & 0xFFFF;
                }
            } else {
                glyphIndex = (c + idDelta) & 0xFFFF;
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
        end: 0xFFFF,
        start: 0xFFFF,
        delta: 1,
        offset: 0
    });
}

function makeCmapTable(glyphs) {
    var i;
    var t = new table.Table('cmap', [
        {name: 'version', type: 'USHORT', value: 0},
        {name: 'numTables', type: 'USHORT', value: 1},
        {name: 'platformID', type: 'USHORT', value: 3},
        {name: 'encodingID', type: 'USHORT', value: 1},
        {name: 'offset', type: 'ULONG', value: 12},
        {name: 'format', type: 'USHORT', value: 4},
        {name: 'length', type: 'USHORT', value: 0},
        {name: 'language', type: 'USHORT', value: 0},
        {name: 'segCountX2', type: 'USHORT', value: 0},
        {name: 'searchRange', type: 'USHORT', value: 0},
        {name: 'entrySelector', type: 'USHORT', value: 0},
        {name: 'rangeShift', type: 'USHORT', value: 0}
    ]);

    t.segments = [];
    for (i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs[i];
        for (var j = 0; j < glyph.unicodes.length; j += 1) {
            addSegment(t, glyph.unicodes[j], i);
        }

        t.segments = t.segments.sort(function(a, b) {
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

    // Set up parallel segment arrays.
    var endCounts = [];
    var startCounts = [];
    var idDeltas = [];
    var idRangeOffsets = [];
    var glyphIds = [];

    for (i = 0; i < segCount; i += 1) {
        var segment = t.segments[i];
        endCounts = endCounts.concat({name: 'end_' + i, type: 'USHORT', value: segment.end});
        startCounts = startCounts.concat({name: 'start_' + i, type: 'USHORT', value: segment.start});
        idDeltas = idDeltas.concat({name: 'idDelta_' + i, type: 'SHORT', value: segment.delta});
        idRangeOffsets = idRangeOffsets.concat({name: 'idRangeOffset_' + i, type: 'USHORT', value: segment.offset});
        if (segment.glyphId !== undefined) {
            glyphIds = glyphIds.concat({name: 'glyph_' + i, type: 'USHORT', value: segment.glyphId});
        }
    }

    t.fields = t.fields.concat(endCounts);
    t.fields.push({name: 'reservedPad', type: 'USHORT', value: 0});
    t.fields = t.fields.concat(startCounts);
    t.fields = t.fields.concat(idDeltas);
    t.fields = t.fields.concat(idRangeOffsets);
    t.fields = t.fields.concat(glyphIds);

    t.length = 14 + // Subtable header
        endCounts.length * 2 +
        2 + // reservedPad
        startCounts.length * 2 +
        idDeltas.length * 2 +
        idRangeOffsets.length * 2 +
        glyphIds.length * 2;

    return t;
}

exports.parse = parseCmapTable;
exports.make = makeCmapTable;

},{"../check":1,"../parse":7,"../table":9}],12:[function(require,module,exports){
// The `glyf` table describes the glyphs in TrueType outline format.
// http://www.microsoft.com/typography/otspec/glyf.htm

'use strict';

var check = require('../check');
var _glyph = require('../glyph');
var parse = require('../parse');
var path = require('../path');

// Parse the coordinate data for a glyph.
function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
    var v;
    if ((flag & shortVectorBitMask) > 0) {
        // The coordinate is 1 byte long.
        v = p.parseByte();
        // The `same` bit is re-used for short values to signify the sign of the value.
        if ((flag & sameBitMask) === 0) {
            v = -v;
        }

        v = previousValue + v;
    } else {
        //  The coordinate is 2 bytes long.
        // If the `same` bit is set, the coordinate is the same as the previous coordinate.
        if ((flag & sameBitMask) > 0) {
            v = previousValue;
        } else {
            // Parse the coordinate as a signed 16-bit delta value.
            v = previousValue + p.parseShort();
        }
    }

    return v;
}

// Parse a TrueType glyph.
function parseGlyph(data, start, index, font) {
    //var p, glyph, flag, i, j, flags,
    //    endPointIndices, numberOfCoordinates, repeatCount, points, point, px, py,
    //    component, moreComponents;
    var p = new parse.Parser(data, start);
    var glyph = new _glyph.Glyph({font: font, index: index});
    glyph.numberOfContours = p.parseShort();
    glyph.xMin = p.parseShort();
    glyph.yMin = p.parseShort();
    glyph.xMax = p.parseShort();
    glyph.yMax = p.parseShort();
    var flags;
    var flag;
    if (glyph.numberOfContours > 0) {
        var i;
        // This glyph is not a composite.
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
            // If bit 3 is set, we repeat this flag n times, where n is the next byte.
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
            // X/Y coordinates are relative to the previous point, except for the first point which is relative to 0,0.
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
                // The arguments are words
                component.dx = p.parseShort();
                component.dy = p.parseShort();
            } else {
                // The arguments are bytes
                component.dx = p.parseChar();
                component.dy = p.parseChar();
            }

            if ((flags & 8) > 0) {
                // We have a scale
                component.xScale = component.yScale = p.parseF2Dot14();
            } else if ((flags & 64) > 0) {
                // We have an X / Y scale
                component.xScale = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
            } else if ((flags & 128) > 0) {
                // We have a 2x2 transformation
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

// Transform an array of points and return a new array.
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

// Convert the TrueType glyph outline to a Path.
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
            // The first point will be consumed by the moveTo command,
            // so skip it in the loop.
            realFirstPoint = true;
        } else {
            if (lastPt.onCurve) {
                // If the first point is off-curve and the last point is on-curve,
                // start at the last point.
                firstPt = lastPt;
            } else {
                // If both first and last points are off-curve, start at their middle.
                firstPt = { x: (firstPt.x + lastPt.x) / 2, y: (firstPt.y + lastPt.y) / 2 };
            }

            curvePt = firstPt;
            // The first point is synthesized, so don't skip the real first point.
            realFirstPoint = false;
        }

        p.moveTo(firstPt.x, firstPt.y);

        for (var j = realFirstPoint ? 1 : 0; j < contour.length; j += 1) {
            var pt = contour[j];
            var prevPt = j === 0 ? firstPt : contour[j - 1];
            if (prevPt.onCurve && pt.onCurve) {
                // This is a straight line.
                p.lineTo(pt.x, pt.y);
            } else if (prevPt.onCurve && !pt.onCurve) {
                curvePt = pt;
            } else if (!prevPt.onCurve && !pt.onCurve) {
                var midPt = { x: (prevPt.x + pt.x) / 2, y: (prevPt.y + pt.y) / 2 };
                p.quadraticCurveTo(prevPt.x, prevPt.y, midPt.x, midPt.y);
                curvePt = pt;
            } else if (!prevPt.onCurve && pt.onCurve) {
                // Previous point off-curve, this point on-curve.
                p.quadraticCurveTo(curvePt.x, curvePt.y, pt.x, pt.y);
                curvePt = null;
            } else {
                throw new Error('Invalid state.');
            }
        }

        if (firstPt !== lastPt) {
            // Connect the last and first points
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

// Parse all the glyphs according to the offsets from the `loca` table.
function parseGlyfTable(data, start, loca, font) {
    var glyphs = [];
    var i;
    // The last element of the loca table is invalid.
    for (i = 0; i < loca.length - 1; i += 1) {
        var offset = loca[i];
        var nextOffset = loca[i + 1];
        if (offset !== nextOffset) {
            glyphs.push(parseGlyph(data, start + offset, i, font));
        } else {
            glyphs.push(new _glyph.Glyph({font: font, index: i}));
        }
    }
    // Go over the glyphs again, resolving the composite glyphs.
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

},{"../check":1,"../glyph":5,"../parse":7,"../path":8}],13:[function(require,module,exports){
// The `GPOS` table contains kerning pairs, among other things.
// https://www.microsoft.com/typography/OTSPEC/gpos.htm

'use strict';

var check = require('../check');
var parse = require('../parse');

// Parse ScriptList and FeatureList tables of GPOS, GSUB, GDEF, BASE, JSTF tables.
// These lists are unused by now, this function is just the basis for a real parsing.
function parseTaggedListTable(data, start) {
    var p = new parse.Parser(data, start);
    var n = p.parseUShort();
    var list = [];
    for (var i = 0; i < n; i++) {
        list[p.parseTag()] = { offset: p.parseUShort() };
    }

    return list;
}

// Parse a coverage table in a GSUB, GPOS or GDEF table.
// Format 1 is a simple list of glyph ids,
// Format 2 is a list of ranges. It is expanded in a list of glyphs, maybe not the best idea.
function parseCoverageTable(data, start) {
    var p = new parse.Parser(data, start);
    var format = p.parseUShort();
    var count =  p.parseUShort();
    if (format === 1) {
        return p.parseUShortList(count);
    }
    else if (format === 2) {
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

// Parse a Class Definition Table in a GSUB, GPOS or GDEF table.
// Returns a function that gets a class value from a glyph ID.
function parseClassDefTable(data, start) {
    var p = new parse.Parser(data, start);
    var format = p.parseUShort();
    if (format === 1) {
        // Format 1 specifies a range of consecutive glyph indices, one class per glyph ID.
        var startGlyph = p.parseUShort();
        var glyphCount = p.parseUShort();
        var classes = p.parseUShortList(glyphCount);
        return function(glyphID) {
            return classes[glyphID - startGlyph] || 0;
        };
    }
    else if (format === 2) {
        // Format 2 defines multiple groups of glyph indices that belong to the same class.
        var rangeCount = p.parseUShort();
        var startGlyphs = [];
        var endGlyphs = [];
        var classValues = [];
        for (var i = 0; i < rangeCount; i++) {
            startGlyphs[i] = p.parseUShort();
            endGlyphs[i] = p.parseUShort();
            classValues[i] = p.parseUShort();
        }

        return function(glyphID) {
            var l = 0;
            var r = startGlyphs.length - 1;
            while (l < r) {
                var c = (l + r + 1) >> 1;
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

// Parse a pair adjustment positioning subtable, format 1 or format 2
// The subtable is returned in the form of a lookup function.
function parsePairPosSubTable(data, start) {
    var p = new parse.Parser(data, start);
    // This part is common to format 1 and format 2 subtables
    var format = p.parseUShort();
    var coverageOffset = p.parseUShort();
    var coverage = parseCoverageTable(data, start + coverageOffset);
    // valueFormat 4: XAdvance only, 1: XPlacement only, 0: no ValueRecord for second glyph
    // Only valueFormat1=4 and valueFormat2=0 is supported.
    var valueFormat1 = p.parseUShort();
    var valueFormat2 = p.parseUShort();
    var value1;
    var value2;
    if (valueFormat1 !== 4 || valueFormat2 !== 0) return;
    var sharedPairSets = {};
    if (format === 1) {
        // Pair Positioning Adjustment: Format 1
        var pairSetCount = p.parseUShort();
        var pairSet = [];
        // Array of offsets to PairSet tables-from beginning of PairPos subtable-ordered by Coverage Index
        var pairSetOffsets = p.parseOffset16List(pairSetCount);
        for (var firstGlyph = 0; firstGlyph < pairSetCount; firstGlyph++) {
            var pairSetOffset = pairSetOffsets[firstGlyph];
            var sharedPairSet = sharedPairSets[pairSetOffset];
            if (!sharedPairSet) {
                // Parse a pairset table in a pair adjustment subtable format 1
                sharedPairSet = {};
                p.relativeOffset = pairSetOffset;
                var pairValueCount = p.parseUShort();
                for (; pairValueCount--;) {
                    var secondGlyph = p.parseUShort();
                    if (valueFormat1) value1 = p.parseShort();
                    if (valueFormat2) value2 = p.parseShort();
                    // We only support valueFormat1 = 4 and valueFormat2 = 0,
                    // so value1 is the XAdvance and value2 is empty.
                    sharedPairSet[secondGlyph] = value1;
                }
            }

            pairSet[coverage[firstGlyph]] = sharedPairSet;
        }

        return function(leftGlyph, rightGlyph) {
            var pairs = pairSet[leftGlyph];
            if (pairs) return pairs[rightGlyph];
        };
    }
    else if (format === 2) {
        // Pair Positioning Adjustment: Format 2
        var classDef1Offset = p.parseUShort();
        var classDef2Offset = p.parseUShort();
        var class1Count = p.parseUShort();
        var class2Count = p.parseUShort();
        var getClass1 = parseClassDefTable(data, start + classDef1Offset);
        var getClass2 = parseClassDefTable(data, start + classDef2Offset);

        // Parse kerning values by class pair.
        var kerningMatrix = [];
        for (var i = 0; i < class1Count; i++) {
            var kerningRow = kerningMatrix[i] = [];
            for (var j = 0; j < class2Count; j++) {
                if (valueFormat1) value1 = p.parseShort();
                if (valueFormat2) value2 = p.parseShort();
                // We only support valueFormat1 = 4 and valueFormat2 = 0,
                // so value1 is the XAdvance and value2 is empty.
                kerningRow[j] = value1;
            }
        }

        // Convert coverage list to a hash
        var covered = {};
        for (i = 0; i < coverage.length; i++) covered[coverage[i]] = 1;

        // Get the kerning value for a specific glyph pair.
        return function(leftGlyph, rightGlyph) {
            if (!covered[leftGlyph]) return;
            var class1 = getClass1(leftGlyph);
            var class2 = getClass2(rightGlyph);
            var kerningRow = kerningMatrix[class1];

            if (kerningRow) {
                return kerningRow[class2];
            }
        };
    }
}

// Parse a LookupTable (present in of GPOS, GSUB, GDEF, BASE, JSTF tables).
function parseLookupTable(data, start) {
    var p = new parse.Parser(data, start);
    var lookupType = p.parseUShort();
    var lookupFlag = p.parseUShort();
    var useMarkFilteringSet = lookupFlag & 0x10;
    var subTableCount = p.parseUShort();
    var subTableOffsets = p.parseOffset16List(subTableCount);
    var table = {
        lookupType: lookupType,
        lookupFlag: lookupFlag,
        markFilteringSet: useMarkFilteringSet ? p.parseUShort() : -1
    };
    // LookupType 2, Pair adjustment
    if (lookupType === 2) {
        var subtables = [];
        for (var i = 0; i < subTableCount; i++) {
            subtables.push(parsePairPosSubTable(data, start + subTableOffsets[i]));
        }
        // Return a function which finds the kerning values in the subtables.
        table.getKerningValue = function(leftGlyph, rightGlyph) {
            for (var i = subtables.length; i--;) {
                var value = subtables[i](leftGlyph, rightGlyph);
                if (value !== undefined) return value;
            }

            return 0;
        };
    }

    return table;
}

// Parse the `GPOS` table which contains, among other things, kerning pairs.
// https://www.microsoft.com/typography/OTSPEC/gpos.htm
function parseGposTable(data, start, font) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseFixed();
    check.argument(tableVersion === 1, 'Unsupported GPOS table version.');

    // ScriptList and FeatureList - ignored for now
    parseTaggedListTable(data, start + p.parseUShort());
    // 'kern' is the feature we are looking for.
    parseTaggedListTable(data, start + p.parseUShort());

    // LookupList
    var lookupListOffset = p.parseUShort();
    p.relativeOffset = lookupListOffset;
    var lookupCount = p.parseUShort();
    var lookupTableOffsets = p.parseOffset16List(lookupCount);
    var lookupListAbsoluteOffset = start + lookupListOffset;
    for (var i = 0; i < lookupCount; i++) {
        var table = parseLookupTable(data, lookupListAbsoluteOffset + lookupTableOffsets[i]);
        if (table.lookupType === 2 && !font.getGposKerningValue) font.getGposKerningValue = table.getKerningValue;
    }
}

exports.parse = parseGposTable;

},{"../check":1,"../parse":7}],14:[function(require,module,exports){
// The `head` table contains global information about the font.
// https://www.microsoft.com/typography/OTSPEC/head.htm

'use strict';

var check = require('../check');
var parse = require('../parse');
var table = require('../table');

// Parse the header `head` table
function parseHeadTable(data, start) {
    var head = {};
    var p = new parse.Parser(data, start);
    head.version = p.parseVersion();
    head.fontRevision = Math.round(p.parseFixed() * 1000) / 1000;
    head.checkSumAdjustment = p.parseULong();
    head.magicNumber = p.parseULong();
    check.argument(head.magicNumber === 0x5F0F3CF5, 'Font header has wrong magic number.');
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
    head.indexToLocFormat = p.parseShort();     // 50
    head.glyphDataFormat = p.parseShort();
    return head;
}

function makeHeadTable(options) {
    return new table.Table('head', [
        {name: 'version', type: 'FIXED', value: 0x00010000},
        {name: 'fontRevision', type: 'FIXED', value: 0x00010000},
        {name: 'checkSumAdjustment', type: 'ULONG', value: 0},
        {name: 'magicNumber', type: 'ULONG', value: 0x5F0F3CF5},
        {name: 'flags', type: 'USHORT', value: 0},
        {name: 'unitsPerEm', type: 'USHORT', value: 1000},
        {name: 'created', type: 'LONGDATETIME', value: 0},
        {name: 'modified', type: 'LONGDATETIME', value: 0},
        {name: 'xMin', type: 'SHORT', value: 0},
        {name: 'yMin', type: 'SHORT', value: 0},
        {name: 'xMax', type: 'SHORT', value: 0},
        {name: 'yMax', type: 'SHORT', value: 0},
        {name: 'macStyle', type: 'USHORT', value: 0},
        {name: 'lowestRecPPEM', type: 'USHORT', value: 0},
        {name: 'fontDirectionHint', type: 'SHORT', value: 2},
        {name: 'indexToLocFormat', type: 'SHORT', value: 0},
        {name: 'glyphDataFormat', type: 'SHORT', value: 0}
    ], options);
}

exports.parse = parseHeadTable;
exports.make = makeHeadTable;

},{"../check":1,"../parse":7,"../table":9}],15:[function(require,module,exports){
// The `hhea` table contains information for horizontal layout.
// https://www.microsoft.com/typography/OTSPEC/hhea.htm

'use strict';

var parse = require('../parse');
var table = require('../table');

// Parse the horizontal header `hhea` table
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
        {name: 'version', type: 'FIXED', value: 0x00010000},
        {name: 'ascender', type: 'FWORD', value: 0},
        {name: 'descender', type: 'FWORD', value: 0},
        {name: 'lineGap', type: 'FWORD', value: 0},
        {name: 'advanceWidthMax', type: 'UFWORD', value: 0},
        {name: 'minLeftSideBearing', type: 'FWORD', value: 0},
        {name: 'minRightSideBearing', type: 'FWORD', value: 0},
        {name: 'xMaxExtent', type: 'FWORD', value: 0},
        {name: 'caretSlopeRise', type: 'SHORT', value: 1},
        {name: 'caretSlopeRun', type: 'SHORT', value: 0},
        {name: 'caretOffset', type: 'SHORT', value: 0},
        {name: 'reserved1', type: 'SHORT', value: 0},
        {name: 'reserved2', type: 'SHORT', value: 0},
        {name: 'reserved3', type: 'SHORT', value: 0},
        {name: 'reserved4', type: 'SHORT', value: 0},
        {name: 'metricDataFormat', type: 'SHORT', value: 0},
        {name: 'numberOfHMetrics', type: 'USHORT', value: 0}
    ], options);
}

exports.parse = parseHheaTable;
exports.make = makeHheaTable;

},{"../parse":7,"../table":9}],16:[function(require,module,exports){
// The `hmtx` table contains the horizontal metrics for all glyphs.
// https://www.microsoft.com/typography/OTSPEC/hmtx.htm

'use strict';

var parse = require('../parse');
var table = require('../table');

// Parse the `hmtx` table, which contains the horizontal metrics for all glyphs.
// This function augments the glyph array, adding the advanceWidth and leftSideBearing to each glyph.
function parseHmtxTable(data, start, numMetrics, numGlyphs, glyphs) {
    var advanceWidth;
    var leftSideBearing;
    var p = new parse.Parser(data, start);
    for (var i = 0; i < numGlyphs; i += 1) {
        // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
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
        t.fields.push({name: 'advanceWidth_' + i, type: 'USHORT', value: advanceWidth});
        t.fields.push({name: 'leftSideBearing_' + i, type: 'SHORT', value: leftSideBearing});
    }

    return t;
}

exports.parse = parseHmtxTable;
exports.make = makeHmtxTable;

},{"../parse":7,"../table":9}],17:[function(require,module,exports){
// The `kern` table contains kerning pairs.
// Note that some fonts use the GPOS OpenType layout table to specify kerning.
// https://www.microsoft.com/typography/OTSPEC/kern.htm

'use strict';

var check = require('../check');
var parse = require('../parse');

// Parse the `kern` table which contains kerning pairs.
function parseKernTable(data, start) {
    var pairs = {};
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseUShort();
    check.argument(tableVersion === 0, 'Unsupported kern table version.');
    // Skip nTables.
    p.skip('uShort', 1);
    var subTableVersion = p.parseUShort();
    check.argument(subTableVersion === 0, 'Unsupported kern sub-table version.');
    // Skip subTableLength, subTableCoverage
    p.skip('uShort', 2);
    var nPairs = p.parseUShort();
    // Skip searchRange, entrySelector, rangeShift.
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

},{"../check":1,"../parse":7}],18:[function(require,module,exports){
// The `loca` table stores the offsets to the locations of the glyphs in the font.
// https://www.microsoft.com/typography/OTSPEC/loca.htm

'use strict';

var parse = require('../parse');

// Parse the `loca` table. This table stores the offsets to the locations of the glyphs in the font,
// relative to the beginning of the glyphData table.
// The number of glyphs stored in the `loca` table is specified in the `maxp` table (under numGlyphs)
// The loca table has two versions: a short version where offsets are stored as uShorts, and a long
// version where offsets are stored as uLongs. The `head` table specifies which version to use
// (under indexToLocFormat).
function parseLocaTable(data, start, numGlyphs, shortVersion) {
    var p = new parse.Parser(data, start);
    var parseFn = shortVersion ? p.parseUShort : p.parseULong;
    // There is an extra entry after the last index element to compute the length of the last glyph.
    // That's why we use numGlyphs + 1.
    var glyphOffsets = [];
    for (var i = 0; i < numGlyphs + 1; i += 1) {
        var glyphOffset = parseFn.call(p);
        if (shortVersion) {
            // The short table version stores the actual offset divided by 2.
            glyphOffset *= 2;
        }

        glyphOffsets.push(glyphOffset);
    }

    return glyphOffsets;
}

exports.parse = parseLocaTable;

},{"../parse":7}],19:[function(require,module,exports){
// The `maxp` table establishes the memory requirements for the font.
// We need it just to get the number of glyphs in the font.
// https://www.microsoft.com/typography/OTSPEC/maxp.htm

'use strict';

var parse = require('../parse');
var table = require('../table');

// Parse the maximum profile `maxp` table.
function parseMaxpTable(data, start) {
    var maxp = {};
    var p = new parse.Parser(data, start);
    maxp.version = p.parseVersion();
    maxp.numGlyphs = p.parseUShort();
    if (maxp.version === 1.0) {
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
        {name: 'version', type: 'FIXED', value: 0x00005000},
        {name: 'numGlyphs', type: 'USHORT', value: numGlyphs}
    ]);
}

exports.parse = parseMaxpTable;
exports.make = makeMaxpTable;

},{"../parse":7,"../table":9}],20:[function(require,module,exports){
// The `name` naming table.
// https://www.microsoft.com/typography/OTSPEC/name.htm

'use strict';

var encode = require('../types').encode;
var parse = require('../parse');
var table = require('../table');

// NameIDs for the name table.
var nameTableNames = [
    'copyright',              // 0
    'fontFamily',             // 1
    'fontSubfamily',          // 2
    'uniqueID',               // 3
    'fullName',               // 4
    'version',                // 5
    'postScriptName',         // 6
    'trademark',              // 7
    'manufacturer',           // 8
    'designer',               // 9
    'description',            // 10
    'manufacturerURL',        // 11
    'designerURL',            // 12
    'licence',                // 13
    'licenceURL',             // 14
    'reserved',               // 15
    'preferredFamily',        // 16
    'preferredSubfamily',     // 17
    'compatibleFullName',     // 18
    'sampleText',             // 19
    'postScriptFindFontName', // 20
    'wwsFamily',              // 21
    'wwsSubfamily'            // 22
];

// Parse the naming `name` table
// Only Windows Unicode English names are supported.
// Format 1 additional fields are not supported
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
        // platformID - encodingID - languageID standard combinations :
        // 1 - 0 - 0 : Macintosh, Roman, English
        // 3 - 1 - 0x409 : Windows, Unicode BMP (UCS-2), en-US
        if (platformID === 3 && encodingID === 1 && languageID === 0x409) {
            var codePoints = [];
            var length = byteLength / 2;
            for (var j = 0; j < length; j++, offset += 2) {
                codePoints[j] = parse.getShort(data, stringOffset + offset);
            }

            var str = String.fromCharCode.apply(null, codePoints);
            if (property) {
                name[property] = str;
            }
            else {
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
        {name: 'platformID', type: 'USHORT', value: platformID},
        {name: 'encodingID', type: 'USHORT', value: encodingID},
        {name: 'languageID', type: 'USHORT', value: languageID},
        {name: 'nameID', type: 'USHORT', value: nameID},
        {name: 'length', type: 'USHORT', value: length},
        {name: 'offset', type: 'USHORT', value: offset}
    ]);
}

function addMacintoshNameRecord(t, recordID, s, offset) {
    // Macintosh, Roman, English
    var stringBytes = encode.STRING(s);
    t.records.push(makeNameRecord(1, 0, 0, recordID, stringBytes.length, offset));
    t.strings.push(stringBytes);
    offset += stringBytes.length;
    return offset;
}

function addWindowsNameRecord(t, recordID, s, offset) {
    // Windows, Unicode BMP (UCS-2), US English
    var utf16Bytes = encode.UTF16(s);
    t.records.push(makeNameRecord(3, 1, 0x0409, recordID, utf16Bytes.length, offset));
    t.strings.push(utf16Bytes);
    offset += utf16Bytes.length;
    return offset;
}

function makeNameTable(options) {
    var t = new table.Table('name', [
        {name: 'format', type: 'USHORT', value: 0},
        {name: 'count', type: 'USHORT', value: 0},
        {name: 'stringOffset', type: 'USHORT', value: 0}
    ]);
    t.records = [];
    t.strings = [];
    var offset = 0;
    var i;
    var s;
    // Add Macintosh records first
    for (i = 0; i < nameTableNames.length; i += 1) {
        if (options[nameTableNames[i]] !== undefined) {
            s = options[nameTableNames[i]];
            offset = addMacintoshNameRecord(t, i, s, offset);
        }
    }
    // Then add Windows records
    for (i = 0; i < nameTableNames.length; i += 1) {
        if (options[nameTableNames[i]] !== undefined) {
            s = options[nameTableNames[i]];
            offset = addWindowsNameRecord(t, i, s, offset);
        }
    }

    t.count = t.records.length;
    t.stringOffset = 6 + t.count * 12;
    for (i = 0; i < t.records.length; i += 1) {
        t.fields.push({name: 'record_' + i, type: 'TABLE', value: t.records[i]});
    }

    for (i = 0; i < t.strings.length; i += 1) {
        t.fields.push({name: 'string_' + i, type: 'LITERAL', value: t.strings[i]});
    }

    return t;
}

exports.parse = parseNameTable;
exports.make = makeNameTable;

},{"../parse":7,"../table":9,"../types":24}],21:[function(require,module,exports){
// The `OS/2` table contains metrics required in OpenType fonts.
// https://www.microsoft.com/typography/OTSPEC/os2.htm

'use strict';

var parse = require('../parse');
var table = require('../table');

var unicodeRanges = [
    {begin: 0x0000, end: 0x007F}, // Basic Latin
    {begin: 0x0080, end: 0x00FF}, // Latin-1 Supplement
    {begin: 0x0100, end: 0x017F}, // Latin Extended-A
    {begin: 0x0180, end: 0x024F}, // Latin Extended-B
    {begin: 0x0250, end: 0x02AF}, // IPA Extensions
    {begin: 0x02B0, end: 0x02FF}, // Spacing Modifier Letters
    {begin: 0x0300, end: 0x036F}, // Combining Diacritical Marks
    {begin: 0x0370, end: 0x03FF}, // Greek and Coptic
    {begin: 0x2C80, end: 0x2CFF}, // Coptic
    {begin: 0x0400, end: 0x04FF}, // Cyrillic
    {begin: 0x0530, end: 0x058F}, // Armenian
    {begin: 0x0590, end: 0x05FF}, // Hebrew
    {begin: 0xA500, end: 0xA63F}, // Vai
    {begin: 0x0600, end: 0x06FF}, // Arabic
    {begin: 0x07C0, end: 0x07FF}, // NKo
    {begin: 0x0900, end: 0x097F}, // Devanagari
    {begin: 0x0980, end: 0x09FF}, // Bengali
    {begin: 0x0A00, end: 0x0A7F}, // Gurmukhi
    {begin: 0x0A80, end: 0x0AFF}, // Gujarati
    {begin: 0x0B00, end: 0x0B7F}, // Oriya
    {begin: 0x0B80, end: 0x0BFF}, // Tamil
    {begin: 0x0C00, end: 0x0C7F}, // Telugu
    {begin: 0x0C80, end: 0x0CFF}, // Kannada
    {begin: 0x0D00, end: 0x0D7F}, // Malayalam
    {begin: 0x0E00, end: 0x0E7F}, // Thai
    {begin: 0x0E80, end: 0x0EFF}, // Lao
    {begin: 0x10A0, end: 0x10FF}, // Georgian
    {begin: 0x1B00, end: 0x1B7F}, // Balinese
    {begin: 0x1100, end: 0x11FF}, // Hangul Jamo
    {begin: 0x1E00, end: 0x1EFF}, // Latin Extended Additional
    {begin: 0x1F00, end: 0x1FFF}, // Greek Extended
    {begin: 0x2000, end: 0x206F}, // General Punctuation
    {begin: 0x2070, end: 0x209F}, // Superscripts And Subscripts
    {begin: 0x20A0, end: 0x20CF}, // Currency Symbol
    {begin: 0x20D0, end: 0x20FF}, // Combining Diacritical Marks For Symbols
    {begin: 0x2100, end: 0x214F}, // Letterlike Symbols
    {begin: 0x2150, end: 0x218F}, // Number Forms
    {begin: 0x2190, end: 0x21FF}, // Arrows
    {begin: 0x2200, end: 0x22FF}, // Mathematical Operators
    {begin: 0x2300, end: 0x23FF}, // Miscellaneous Technical
    {begin: 0x2400, end: 0x243F}, // Control Pictures
    {begin: 0x2440, end: 0x245F}, // Optical Character Recognition
    {begin: 0x2460, end: 0x24FF}, // Enclosed Alphanumerics
    {begin: 0x2500, end: 0x257F}, // Box Drawing
    {begin: 0x2580, end: 0x259F}, // Block Elements
    {begin: 0x25A0, end: 0x25FF}, // Geometric Shapes
    {begin: 0x2600, end: 0x26FF}, // Miscellaneous Symbols
    {begin: 0x2700, end: 0x27BF}, // Dingbats
    {begin: 0x3000, end: 0x303F}, // CJK Symbols And Punctuation
    {begin: 0x3040, end: 0x309F}, // Hiragana
    {begin: 0x30A0, end: 0x30FF}, // Katakana
    {begin: 0x3100, end: 0x312F}, // Bopomofo
    {begin: 0x3130, end: 0x318F}, // Hangul Compatibility Jamo
    {begin: 0xA840, end: 0xA87F}, // Phags-pa
    {begin: 0x3200, end: 0x32FF}, // Enclosed CJK Letters And Months
    {begin: 0x3300, end: 0x33FF}, // CJK Compatibility
    {begin: 0xAC00, end: 0xD7AF}, // Hangul Syllables
    {begin: 0xD800, end: 0xDFFF}, // Non-Plane 0 *
    {begin: 0x10900, end: 0x1091F}, // Phoenicia
    {begin: 0x4E00, end: 0x9FFF}, // CJK Unified Ideographs
    {begin: 0xE000, end: 0xF8FF}, // Private Use Area (plane 0)
    {begin: 0x31C0, end: 0x31EF}, // CJK Strokes
    {begin: 0xFB00, end: 0xFB4F}, // Alphabetic Presentation Forms
    {begin: 0xFB50, end: 0xFDFF}, // Arabic Presentation Forms-A
    {begin: 0xFE20, end: 0xFE2F}, // Combining Half Marks
    {begin: 0xFE10, end: 0xFE1F}, // Vertical Forms
    {begin: 0xFE50, end: 0xFE6F}, // Small Form Variants
    {begin: 0xFE70, end: 0xFEFF}, // Arabic Presentation Forms-B
    {begin: 0xFF00, end: 0xFFEF}, // Halfwidth And Fullwidth Forms
    {begin: 0xFFF0, end: 0xFFFF}, // Specials
    {begin: 0x0F00, end: 0x0FFF}, // Tibetan
    {begin: 0x0700, end: 0x074F}, // Syriac
    {begin: 0x0780, end: 0x07BF}, // Thaana
    {begin: 0x0D80, end: 0x0DFF}, // Sinhala
    {begin: 0x1000, end: 0x109F}, // Myanmar
    {begin: 0x1200, end: 0x137F}, // Ethiopic
    {begin: 0x13A0, end: 0x13FF}, // Cherokee
    {begin: 0x1400, end: 0x167F}, // Unified Canadian Aboriginal Syllabics
    {begin: 0x1680, end: 0x169F}, // Ogham
    {begin: 0x16A0, end: 0x16FF}, // Runic
    {begin: 0x1780, end: 0x17FF}, // Khmer
    {begin: 0x1800, end: 0x18AF}, // Mongolian
    {begin: 0x2800, end: 0x28FF}, // Braille Patterns
    {begin: 0xA000, end: 0xA48F}, // Yi Syllables
    {begin: 0x1700, end: 0x171F}, // Tagalog
    {begin: 0x10300, end: 0x1032F}, // Old Italic
    {begin: 0x10330, end: 0x1034F}, // Gothic
    {begin: 0x10400, end: 0x1044F}, // Deseret
    {begin: 0x1D000, end: 0x1D0FF}, // Byzantine Musical Symbols
    {begin: 0x1D400, end: 0x1D7FF}, // Mathematical Alphanumeric Symbols
    {begin: 0xFF000, end: 0xFFFFD}, // Private Use (plane 15)
    {begin: 0xFE00, end: 0xFE0F}, // Variation Selectors
    {begin: 0xE0000, end: 0xE007F}, // Tags
    {begin: 0x1900, end: 0x194F}, // Limbu
    {begin: 0x1950, end: 0x197F}, // Tai Le
    {begin: 0x1980, end: 0x19DF}, // New Tai Lue
    {begin: 0x1A00, end: 0x1A1F}, // Buginese
    {begin: 0x2C00, end: 0x2C5F}, // Glagolitic
    {begin: 0x2D30, end: 0x2D7F}, // Tifinagh
    {begin: 0x4DC0, end: 0x4DFF}, // Yijing Hexagram Symbols
    {begin: 0xA800, end: 0xA82F}, // Syloti Nagri
    {begin: 0x10000, end: 0x1007F}, // Linear B Syllabary
    {begin: 0x10140, end: 0x1018F}, // Ancient Greek Numbers
    {begin: 0x10380, end: 0x1039F}, // Ugaritic
    {begin: 0x103A0, end: 0x103DF}, // Old Persian
    {begin: 0x10450, end: 0x1047F}, // Shavian
    {begin: 0x10480, end: 0x104AF}, // Osmanya
    {begin: 0x10800, end: 0x1083F}, // Cypriot Syllabary
    {begin: 0x10A00, end: 0x10A5F}, // Kharoshthi
    {begin: 0x1D300, end: 0x1D35F}, // Tai Xuan Jing Symbols
    {begin: 0x12000, end: 0x123FF}, // Cuneiform
    {begin: 0x1D360, end: 0x1D37F}, // Counting Rod Numerals
    {begin: 0x1B80, end: 0x1BBF}, // Sundanese
    {begin: 0x1C00, end: 0x1C4F}, // Lepcha
    {begin: 0x1C50, end: 0x1C7F}, // Ol Chiki
    {begin: 0xA880, end: 0xA8DF}, // Saurashtra
    {begin: 0xA900, end: 0xA92F}, // Kayah Li
    {begin: 0xA930, end: 0xA95F}, // Rejang
    {begin: 0xAA00, end: 0xAA5F}, // Cham
    {begin: 0x10190, end: 0x101CF}, // Ancient Symbols
    {begin: 0x101D0, end: 0x101FF}, // Phaistos Disc
    {begin: 0x102A0, end: 0x102DF}, // Carian
    {begin: 0x1F030, end: 0x1F09F}  // Domino Tiles
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

// Parse the OS/2 and Windows metrics `OS/2` table
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
        {name: 'version', type: 'USHORT', value: 0x0003},
        {name: 'xAvgCharWidth', type: 'SHORT', value: 0},
        {name: 'usWeightClass', type: 'USHORT', value: 0},
        {name: 'usWidthClass', type: 'USHORT', value: 0},
        {name: 'fsType', type: 'USHORT', value: 0},
        {name: 'ySubscriptXSize', type: 'SHORT', value: 650},
        {name: 'ySubscriptYSize', type: 'SHORT', value: 699},
        {name: 'ySubscriptXOffset', type: 'SHORT', value: 0},
        {name: 'ySubscriptYOffset', type: 'SHORT', value: 140},
        {name: 'ySuperscriptXSize', type: 'SHORT', value: 650},
        {name: 'ySuperscriptYSize', type: 'SHORT', value: 699},
        {name: 'ySuperscriptXOffset', type: 'SHORT', value: 0},
        {name: 'ySuperscriptYOffset', type: 'SHORT', value: 479},
        {name: 'yStrikeoutSize', type: 'SHORT', value: 49},
        {name: 'yStrikeoutPosition', type: 'SHORT', value: 258},
        {name: 'sFamilyClass', type: 'SHORT', value: 0},
        {name: 'bFamilyType', type: 'BYTE', value: 0},
        {name: 'bSerifStyle', type: 'BYTE', value: 0},
        {name: 'bWeight', type: 'BYTE', value: 0},
        {name: 'bProportion', type: 'BYTE', value: 0},
        {name: 'bContrast', type: 'BYTE', value: 0},
        {name: 'bStrokeVariation', type: 'BYTE', value: 0},
        {name: 'bArmStyle', type: 'BYTE', value: 0},
        {name: 'bLetterform', type: 'BYTE', value: 0},
        {name: 'bMidline', type: 'BYTE', value: 0},
        {name: 'bXHeight', type: 'BYTE', value: 0},
        {name: 'ulUnicodeRange1', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange2', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange3', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange4', type: 'ULONG', value: 0},
        {name: 'achVendID', type: 'CHARARRAY', value: 'XXXX'},
        {name: 'fsSelection', type: 'USHORT', value: 0},
        {name: 'usFirstCharIndex', type: 'USHORT', value: 0},
        {name: 'usLastCharIndex', type: 'USHORT', value: 0},
        {name: 'sTypoAscender', type: 'SHORT', value: 0},
        {name: 'sTypoDescender', type: 'SHORT', value: 0},
        {name: 'sTypoLineGap', type: 'SHORT', value: 0},
        {name: 'usWinAscent', type: 'USHORT', value: 0},
        {name: 'usWinDescent', type: 'USHORT', value: 0},
        {name: 'ulCodePageRange1', type: 'ULONG', value: 0},
        {name: 'ulCodePageRange2', type: 'ULONG', value: 0},
        {name: 'sxHeight', type: 'SHORT', value: 0},
        {name: 'sCapHeight', type: 'SHORT', value: 0},
        {name: 'usDefaultChar', type: 'USHORT', value: 0},
        {name: 'usBreakChar', type: 'USHORT', value: 0},
        {name: 'usMaxContext', type: 'USHORT', value: 0}
    ], options);
}

exports.unicodeRanges = unicodeRanges;
exports.getUnicodeRange = getUnicodeRange;
exports.parse = parseOS2Table;
exports.make = makeOS2Table;

},{"../parse":7,"../table":9}],22:[function(require,module,exports){
// The `post` table stores additional PostScript information, such as glyph names.
// https://www.microsoft.com/typography/OTSPEC/post.htm

'use strict';

var encoding = require('../encoding');
var parse = require('../parse');
var table = require('../table');

// Parse the PostScript `post` table
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
        {name: 'version', type: 'FIXED', value: 0x00030000},
        {name: 'italicAngle', type: 'FIXED', value: 0},
        {name: 'underlinePosition', type: 'FWORD', value: 0},
        {name: 'underlineThickness', type: 'FWORD', value: 0},
        {name: 'isFixedPitch', type: 'ULONG', value: 0},
        {name: 'minMemType42', type: 'ULONG', value: 0},
        {name: 'maxMemType42', type: 'ULONG', value: 0},
        {name: 'minMemType1', type: 'ULONG', value: 0},
        {name: 'maxMemType1', type: 'ULONG', value: 0}
    ]);
}

exports.parse = parsePostTable;
exports.make = makePostTable;

},{"../encoding":3,"../parse":7,"../table":9}],23:[function(require,module,exports){
// The `sfnt` wrapper provides organization for the tables in the font.
// It is the top-level data structure in a font.
// https://www.microsoft.com/typography/OTSPEC/otff.htm
// Recommendations for creating OpenType Fonts:
// http://www.microsoft.com/typography/otspec140/recom.htm

'use strict';

var check = require('../check');
var table = require('../table');

var cmap = require('./cmap');
var cff = require('./cff');
var head = require('./head');
var hhea = require('./hhea');
var hmtx = require('./hmtx');
var maxp = require('./maxp');
var _name = require('./name');
var os2 = require('./os2');
var post = require('./post');

function log2(v) {
    return Math.log(v) / Math.log(2) | 0;
}

function computeCheckSum(bytes) {
    while (bytes.length % 4 !== 0) {
        bytes.push(0);
    }

    var sum = 0;
    for (var i = 0; i < bytes.length; i += 4) {
        sum += (bytes[i] << 24) +
            (bytes[i + 1] << 16) +
            (bytes[i + 2] << 8) +
            (bytes[i + 3]);
    }

    sum %= Math.pow(2, 32);
    return sum;
}

function makeTableRecord(tag, checkSum, offset, length) {
    return new table.Table('Table Record', [
        {name: 'tag', type: 'TAG', value: tag !== undefined ? tag : ''},
        {name: 'checkSum', type: 'ULONG', value: checkSum !== undefined ? checkSum : 0},
        {name: 'offset', type: 'ULONG', value: offset !== undefined ? offset : 0},
        {name: 'length', type: 'ULONG', value: length !== undefined ? length : 0}
    ]);
}

function makeSfntTable(tables) {
    var sfnt = new table.Table('sfnt', [
        {name: 'version', type: 'TAG', value: 'OTTO'},
        {name: 'numTables', type: 'USHORT', value: 0},
        {name: 'searchRange', type: 'USHORT', value: 0},
        {name: 'entrySelector', type: 'USHORT', value: 0},
        {name: 'rangeShift', type: 'USHORT', value: 0}
    ]);
    sfnt.tables = tables;
    sfnt.numTables = tables.length;
    var highestPowerOf2 = Math.pow(2, log2(sfnt.numTables));
    sfnt.searchRange = 16 * highestPowerOf2;
    sfnt.entrySelector = log2(highestPowerOf2);
    sfnt.rangeShift = sfnt.numTables * 16 - sfnt.searchRange;

    var recordFields = [];
    var tableFields = [];

    var offset = sfnt.sizeOf() + (makeTableRecord().sizeOf() * sfnt.numTables);
    while (offset % 4 !== 0) {
        offset += 1;
        tableFields.push({name: 'padding', type: 'BYTE', value: 0});
    }

    for (var i = 0; i < tables.length; i += 1) {
        var t = tables[i];
        check.argument(t.tableName.length === 4, 'Table name' + t.tableName + ' is invalid.');
        var tableLength = t.sizeOf();
        var tableRecord = makeTableRecord(t.tableName, computeCheckSum(t.encode()), offset, tableLength);
        recordFields.push({name: tableRecord.tag + ' Table Record', type: 'TABLE', value: tableRecord});
        tableFields.push({name: t.tableName + ' table', type: 'TABLE', value: t});
        offset += tableLength;
        check.argument(!isNaN(offset), 'Something went wrong calculating the offset.');
        while (offset % 4 !== 0) {
            offset += 1;
            tableFields.push({name: 'padding', type: 'BYTE', value: 0});
        }
    }

    // Table records need to be sorted alphabetically.
    recordFields.sort(function(r1, r2) {
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

// Get the metrics for a character. If the string has more than one character
// this function returns metrics for the first available character.
// You can provide optional fallback metrics if no characters are available.
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

// Convert the font object to a SFNT data structure.
// This structure contains all the necessary tables and metadata to create a binary OTF file.
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
        // Skip non-important characters.
        if (glyph.name === '.notdef') continue;
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
        usWeightClass: 500, // Medium FIXME Make this configurable
        usWidthClass: 5, // Medium (normal) FIXME Make this configurable
        usFirstCharIndex: firstCharIndex,
        usLastCharIndex: lastCharIndex,
        ulUnicodeRange1: ulUnicodeRange1,
        ulUnicodeRange2: ulUnicodeRange2,
        ulUnicodeRange3: ulUnicodeRange3,
        ulUnicodeRange4: ulUnicodeRange4,
        // See http://typophile.com/node/13081 for more info on vertical metrics.
        // We get metrics for typical characters (such as "x" for xHeight).
        // We provide some fallback characters if characters are unavailable: their
        // ordering was chosen experimentally.
        sTypoAscender: globals.ascender,
        sTypoDescender: globals.descender,
        sTypoLineGap: 0,
        usWinAscent: globals.ascender,
        usWinDescent: -globals.descender,
        sxHeight: metricsForChar(font, 'xyvw', {yMax: 0}).yMax,
        sCapHeight: metricsForChar(font, 'HIKLEFJMNTZBDPRAGOQSUVWXY', globals).yMax,
        usBreakChar: font.hasChar(' ') ? 32 : 0 // Use space as the break character, if available.
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
    // Order the tables according to the the OpenType specification 1.4.
    var tables = [headTable, hheaTable, maxpTable, os2Table, nameTable, cmapTable, postTable, cffTable, hmtxTable];

    var sfntTable = makeSfntTable(tables);

    // Compute the font's checkSum and store it in head.checkSumAdjustment.
    var bytes = sfntTable.encode();
    var checkSum = computeCheckSum(bytes);
    var tableFields = sfntTable.fields;
    var checkSumAdjusted = false;
    for (i = 0; i < tableFields.length; i += 1) {
        if (tableFields[i].name === 'head table') {
            tableFields[i].value.checkSumAdjustment = 0xB1B0AFBA - checkSum;
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

},{"../check":1,"../table":9,"./cff":10,"./cmap":11,"./head":14,"./hhea":15,"./hmtx":16,"./maxp":19,"./name":20,"./os2":21,"./post":22}],24:[function(require,module,exports){
// Data types used in the OpenType font file.
// All OpenType fonts use Motorola-style byte ordering (Big Endian)

/* global WeakMap */

'use strict';

var check = require('./check');

var LIMIT16 = 32768; // The limit at which a 16-bit number switches signs == 2^15
var LIMIT32 = 2147483648; // The limit at which a 32-bit number switches signs == 2 ^ 31

var decode = {};
var encode = {};
var sizeOf = {};

// Return a function that always returns the same value.
function constant(v) {
    return function() {
        return v;
    };
}

// OpenType data types //////////////////////////////////////////////////////

// Convert an 8-bit unsigned integer to a list of 1 byte.
encode.BYTE = function(v) {
    check.argument(v >= 0 && v <= 255, 'Byte value should be between 0 and 255.');
    return [v];
};

sizeOf.BYTE = constant(1);

// Convert a 8-bit signed integer to a list of 1 byte.
encode.CHAR = function(v) {
    return [v.charCodeAt(0)];
};

sizeOf.BYTE = constant(1);

// Convert an ASCII string to a list of bytes.
encode.CHARARRAY = function(v) {
    var b = [];
    for (var i = 0; i < v.length; i += 1) {
        b.push(v.charCodeAt(i));
    }

    return b;
};

sizeOf.CHARARRAY = function(v) {
    return v.length;
};

// Convert a 16-bit unsigned integer to a list of 2 bytes.
encode.USHORT = function(v) {
    return [(v >> 8) & 0xFF, v & 0xFF];
};

sizeOf.USHORT = constant(2);

// Convert a 16-bit signed integer to a list of 2 bytes.
encode.SHORT = function(v) {
    // Two's complement
    if (v >= LIMIT16) {
        v = -(2 * LIMIT16 - v);
    }

    return [(v >> 8) & 0xFF, v & 0xFF];
};

sizeOf.SHORT = constant(2);

// Convert a 24-bit unsigned integer to a list of 3 bytes.
encode.UINT24 = function(v) {
    return [(v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

sizeOf.UINT24 = constant(3);

// Convert a 32-bit unsigned integer to a list of 4 bytes.
encode.ULONG = function(v) {
    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

sizeOf.ULONG = constant(4);

// Convert a 32-bit unsigned integer to a list of 4 bytes.
encode.LONG = function(v) {
    // Two's complement
    if (v >= LIMIT32) {
        v = -(2 * LIMIT32 - v);
    }

    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

sizeOf.LONG = constant(4);

encode.FIXED = encode.ULONG;
sizeOf.FIXED = sizeOf.ULONG;

encode.FWORD = encode.SHORT;
sizeOf.FWORD = sizeOf.SHORT;

encode.UFWORD = encode.USHORT;
sizeOf.UFWORD = sizeOf.USHORT;

// FIXME Implement LONGDATETIME
encode.LONGDATETIME = function() {
    return [0, 0, 0, 0, 0, 0, 0, 0];
};

sizeOf.LONGDATETIME = constant(8);

// Convert a 4-char tag to a list of 4 bytes.
encode.TAG = function(v) {
    check.argument(v.length === 4, 'Tag should be exactly 4 ASCII characters.');
    return [v.charCodeAt(0),
            v.charCodeAt(1),
            v.charCodeAt(2),
            v.charCodeAt(3)];
};

sizeOf.TAG = constant(4);

// CFF data types ///////////////////////////////////////////////////////////

encode.Card8 = encode.BYTE;
sizeOf.Card8 = sizeOf.BYTE;

encode.Card16 = encode.USHORT;
sizeOf.Card16 = sizeOf.USHORT;

encode.OffSize = encode.BYTE;
sizeOf.OffSize = sizeOf.BYTE;

encode.SID = encode.USHORT;
sizeOf.SID = sizeOf.USHORT;

// Convert a numeric operand or charstring number to a variable-size list of bytes.
encode.NUMBER = function(v) {
    if (v >= -107 && v <= 107) {
        return [v + 139];
    } else if (v >= 108 && v <= 1131) {
        v = v - 108;
        return [(v >> 8) + 247, v & 0xFF];
    } else if (v >= -1131 && v <= -108) {
        v = -v - 108;
        return [(v >> 8) + 251, v & 0xFF];
    } else if (v >= -32768 && v <= 32767) {
        return encode.NUMBER16(v);
    } else {
        return encode.NUMBER32(v);
    }
};

sizeOf.NUMBER = function(v) {
    return encode.NUMBER(v).length;
};

// Convert a signed number between -32768 and +32767 to a three-byte value.
// This ensures we always use three bytes, but is not the most compact format.
encode.NUMBER16 = function(v) {
    return [28, (v >> 8) & 0xFF, v & 0xFF];
};

sizeOf.NUMBER16 = constant(2);

// Convert a signed number between -(2^31) and +(2^31-1) to a four-byte value.
// This is useful if you want to be sure you always use four bytes,
// at the expense of wasting a few bytes for smaller numbers.
encode.NUMBER32 = function(v) {
    return [29, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

sizeOf.NUMBER32 = constant(4);

encode.NAME = encode.CHARARRAY;
sizeOf.NAME = sizeOf.CHARARRAY;

encode.STRING = encode.CHARARRAY;
sizeOf.STRING = sizeOf.CHARARRAY;

// Convert a ASCII string to a list of UTF16 bytes.
encode.UTF16 = function(v) {
    var b = [];
    for (var i = 0; i < v.length; i += 1) {
        b.push(0);
        b.push(v.charCodeAt(i));
    }

    return b;
};

sizeOf.UTF16 = function(v) {
    return v.length * 2;
};

// Convert a list of values to a CFF INDEX structure.
// The values should be objects containing name / type / value.
encode.INDEX = function(l) {
    var i;
    //var offset, offsets, offsetEncoder, encodedOffsets, encodedOffset, data,
    //    dataSize, i, v;
    // Because we have to know which data type to use to encode the offsets,
    // we have to go through the values twice: once to encode the data and
    // calculate the offets, then again to encode the offsets using the fitting data type.
    var offset = 1; // First offset is always 1.
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
        return [0, 0];
    }

    var encodedOffsets = [];
    var offSize = (1 + Math.floor(Math.log(dataSize) / Math.log(2)) / 8) | 0;
    var offsetEncoder = [undefined, encode.BYTE, encode.USHORT, encode.UINT24, encode.ULONG][offSize];
    for (i = 0; i < offsets.length; i += 1) {
        var encodedOffset = offsetEncoder(offsets[i]);
        Array.prototype.push.apply(encodedOffsets, encodedOffset);
    }

    return Array.prototype.concat(encode.Card16(l.length),
                           encode.OffSize(offSize),
                           encodedOffsets,
                           data);
};

sizeOf.INDEX = function(v) {
    return encode.INDEX(v).length;
};

// Convert an object to a CFF DICT structure.
// The keys should be numeric.
// The values should be objects containing name / type / value.
encode.DICT = function(m) {
    var d = [];
    var keys = Object.keys(m);
    var length = keys.length;

    for (var i = 0; i < length; i += 1) {
        // Object.keys() return string keys, but our keys are always numeric.
        var k = parseInt(keys[i], 0);
        var v = m[k];
        // Value comes before the key.
        d = d.concat(encode.OPERAND(v.value, v.type));
        d = d.concat(encode.OPERATOR(k));
    }

    return d;
};

sizeOf.DICT = function(m) {
    return encode.DICT(m).length;
};

encode.OPERATOR = function(v) {
    if (v < 1200) {
        return [v];
    } else {
        return [12, v - 1200];
    }
};

encode.OPERAND = function(v, type) {
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
            // We make it easy for ourselves and always encode offsets as
            // 4 bytes. This makes offset calculation for the top dict easier.
            d = d.concat(encode.NUMBER32(v));
        } else {
            // FIXME Add support for booleans
            d = d.concat(encode.NUMBER(v));
        }
    }

    return d;
};

encode.OP = encode.BYTE;
sizeOf.OP = sizeOf.BYTE;

// memoize charstring encoding using WeakMap if available
var wmm = typeof WeakMap === 'function' && new WeakMap();
// Convert a list of CharString operations to bytes.
encode.CHARSTRING = function(ops) {
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

sizeOf.CHARSTRING = function(ops) {
    return encode.CHARSTRING(ops).length;
};

// Utility functions ////////////////////////////////////////////////////////

// Convert an object containing name / type / value to bytes.
encode.OBJECT = function(v) {
    var encodingFunction = encode[v.type];
    check.argument(encodingFunction !== undefined, 'No encoding function for type ' + v.type);
    return encodingFunction(v.value);
};

// Convert a table object to bytes.
// A table contains a list of fields containing the metadata (name, type and default value).
// The table itself has the field values set as attributes.
encode.TABLE = function(table) {
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

// Merge in a list of bytes.
encode.LITERAL = function(v) {
    return v;
};

sizeOf.LITERAL = function(v) {
    return v.length;
};

exports.decode = decode;
exports.encode = encode;
exports.sizeOf = sizeOf;

},{"./check":1}]},{},[6])(6)
});