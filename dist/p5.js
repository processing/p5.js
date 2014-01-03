(function () {
/**
 * almond 0.2.7 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("node_modules/almond/almond", function(){});

define('src/var/shim',['require'],function(require) {

  // requestAnim shim layer by Paul Irish
  window.requestDraw = (function(){
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function(callback, element){
             window.setTimeout(callback, 1000 / 60);
           };
  })();

});
define('src/var/constants',['require'],function(require) {

  var PI = Math.PI;

  return {

    // ENVIRONMENT
    CROSS: 'crosshair',
    HAND: 'pointer',
    MOVE: 'move',
    TEXT: 'text',
    WAIT: 'wait',

    // TRIGONOMETRY
    HALF_PI: PI / 2,
    PI: PI,
    QUARTER_PI: PI / 4,
    TAU: PI * 2,
    TWO_PI: PI * 2,
    DEGREES: "degrees",
    RADIANS: "radians",

    // SHAPE
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
    PROJECT: 'square', // PEND: careful this is counterintuitive
    SQUARE: 'butt',
    ROUND: 'round',
    BEVEL: 'bevel',
    MITER: 'miter',

    // COLOR
    RGB: 'rgb',
    HSB: 'hsb',

    // DOM EXTENSION
    AUTO: 'auto',

    // TYPOGRAPHY
    NORMAL: 'normal',
    ITALIC: 'italic',
    BOLD: 'bold'

  };

});
define('src/core/core',['require','../var/shim','../var/constants'],function (require) {

  

  require('../var/shim');

  // Core needs the PVariables object
  var constants = require('../var/constants');

  // Create the Processing constructor
  var Processing = function() {

    // Keep a reference to when this instance was created
    this.startTime = new Date().getTime();
    this.preload_count = 0;

    this.isGlobal = false;

    // Environment
    this.frameCount = 0;
    this._frameRate = 30;
    this.focused = true;

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

      curSketchIndex: -1,

      mousePressed: false,

      angleMode: constants.RADIANS
    };

    this.sketches = [];
    this.sketchCanvases = [];
    this.styles = [];


    // If the user has created a global setup function,
    // assume "beginner mode" and make everything global
    if (window.setup && typeof window.setup === 'function') {

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

    }

    this._start();

  };

  // Create is called at window.onload
  Processing._init = function() {

    // If the user has created a global setup function,
    // assume "beginner mode" and make everything global
    if (window.setup && typeof window.setup === 'function') {

      // Create a processing instance
      var p = new Processing();

    }

  };

  Processing.prototype._start = function() {

    // Create the default canvas
    this.createGraphics(800, 600, true);

    var preload = this.preload || window.preload;
    var context = this.isGlobal ? window : this;

    if (preload) {

      context.loadJSON = function(path) { return this.preloadFunc("loadJSON", path); };
      context.loadStrings = function(path) { return this.preloadFunc("loadStrings", path); };
      context.loadXML = function(path) { return this.preloadFunc("loadXML", path); };
      context.loadImage = function(path) { return this.preloadFunc("loadImage", path); };

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
    var self = this;
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

    for (var i = 0; i < self.sketches.length; i++) {

      var s = self.sketches[i];

      if (typeof s.draw === 'function') {
        self.settings.curSketchIndex = i;
        self.pushStyle();
        s.draw();
        self.popStyle();
        self.settings.curSketchIndex = -1;
      }
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
define('src/color/creating_reading',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.alpha = function(rgb) {
    if (rgb.length > 3) return rgb[3];
    else return 255;
  };

  Processing.prototype.blue = function(rgb) {
    if (rgb.length > 2) return rgb[2];
    else return 0;
  };

  Processing.prototype.brightness = function(hsv) {
    if (hsv.length > 2) return hsv[2];
    else return 0;
  };

  Processing.prototype.color = function() {
    return PHelper.getNormalizedColor(arguments);
  };

  Processing.prototype.green = function(rgb) {
    if (rgb.length > 2) return rgb[1];
    else return 0;
  };

  Processing.prototype.hue = function(hsv) {
    if (hsv.length > 2) return hsv[0];
    else return 0;
  };

  Processing.prototype.lerpColor = function(c1, c2, amt) {
    var c = [];
    for (var i=0; i<c1.length; i++) {
      c.push(lerp(c1[i], c2[i], amt));
    }
    return c;
  };

  Processing.prototype.red = function(rgb) {
    if (rgb.length > 2) return rgb[0];
    else return 0;
  };

  Processing.prototype.saturation = function(hsv) {
    if (hsv.length > 2) return hsv[1];
    else return 0;
  };

  return Processing;

});

define('src/color/setting',['require','../core/core','../var/constants'],function (require) {

  

  var Processing = require('../core/core');
  var constants = require('../var/constants');

  Processing.prototype.background = function() {
    var c = this.getNormalizedColor(arguments);
    // save out the fill
    var curFill = this.curElement.context.fillStyle;
    // create background rect
    this.curElement.context.fillStyle = this.getCSSRGBAColor(c);
    this.curElement.context.fillRect(0, 0, this.width, this.height);
    // reset fill
    this.curElement.context.fillStyle = curFill;
  };
  Processing.prototype.clear = function() {
    this.curElement.context.clearRect(0, 0, this.width, this.height);
  };
  Processing.prototype.colorMode = function(mode) {
    if (mode == constants.RGB || mode == constants.HSB)
      this.settings.colorMode = mode;
  };
  Processing.prototype.fill = function() {
    var c = this.getNormalizedColor(arguments);
    this.curElement.context.fillStyle = this.getCSSRGBAColor(c);
  };
  Processing.prototype.noFill = function() {
    this.curElement.context.fillStyle = 'rgba(0,0,0,0)';
  };
  Processing.prototype.noStroke = function() {
    this.curElement.context.strokeStyle = 'rgba(0,0,0,0)';
  };
  Processing.prototype.stroke = function() {
    var c = this.getNormalizedColor(arguments);
    this.curElement.context.strokeStyle = this.getCSSRGBAColor(c);
  };


  /**
  * getNormalizedColor For a number of different inputs,
  *                    returns a color formatted as [r, g, b, a]
  *
  * @param {'array-like' object} args An 'array-like' object that
  *                                   represents a list of arguments
  *
  * @return {Array} returns a color formatted as [r, g, b, a]
  *                 input        ==> output
  *                 g            ==> [g, g, g, 255]
  *                 g,a          ==> [g, g, g, a]
  *                 r, g, b      ==> [r, g, b, 255]
  *                 r, g, b, a   ==> [r, g, b, a]
  *                 [g]          ==> [g, g, g, 255]
  *                 [g, a]       ==> [g, g, g, a]
  *                 [r, g, b]    ==> [r, g, b, 255]
  *                 [r, g, b, a] ==> [r, g, b, a]
  */
  Processing.prototype.getNormalizedColor = function(args) {
    var r, g, b, a, rgba;
    var _args = typeof args[0].length === 'number' ? args[0] : args;
    if (_args.length >= 3) {
      r = _args[0];
      g = _args[1];
      b = _args[2];
      a = typeof _args[3] === 'number' ? _args[3] : 255;
    } else {
      r = g = b = _args[0];
      a = typeof _args[1] === 'number' ? _args[1] : 255;
    }
    if (this.settings.colorMode == constants.HSB) {
      rgba = hsv2rgb(r, g, b).concat(a);
    } else {
      rgba = [r, g, b, a];
    }

    return rgba;
  };

  Processing.prototype.getCSSRGBAColor = function(arr) {
    var a = arr.map(function(val) {
      return Math.floor(val);
    });
    var alpha = a[3] ? (a[3]/255.0) : 1;
    return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
  };

  return Processing;

});

define('src/data/array_functions',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.append = function(array, value) {
    array.push(value);
    return array;
  };

  Processing.prototype.arrayCopy = function(src, a, b, c, d) { //src, srcPosition, dst, dstPosition, length
    if (typeof d !== 'undefined') {
      for (var i=a; i<min(a+d, src.length); i++) {
        b[dstPosition+i] = src[i];
      }
    }
    else if (typeof b !== 'undefined') { //src, dst, length
      a = src.slice(0, min(b, src.length));
    }
    else { //src, dst
      a = src.slice(0);
    }
  };

  Processing.prototype.concat = function(list0, list1) {
    return list0.concat(list1);
  };

  Processing.prototype.reverse = function(list) {
    return list.reverse();
  };

  Processing.prototype.shorten = function(list) {
    list.pop();
    return list;
  };

  Processing.prototype.sort = function(list, count) {
    var arr = count ? list.slice(0, min(count, list.length)) : list;
    var rest = count ? list.slice(min(count, list.length)) : [];
    if (typeof arr[0] === 'string') {
      arr = arr.sort();
    } else {
      arr = arr.sort(function(a,b){return a-b;});
    }
    return arr.concat(rest);
  };

  Processing.prototype.splice = function(list, value, index) {
    return list.splice(index,0,value);
  };

  Processing.prototype.subset = function(list, start, count) {
    if (typeof count !== 'undefined') return list.slice(start, start+count);
    else return list.slice(start, list.length-1);
  };

  return Processing;

});
define('src/data/string_functions',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  return Processing;

  Processing.prototype.join = function(list, separator) {
    return list.join(separator);
  };

  Processing.prototype.match =  function(str, reg) {
    return str.match(reg);
  };

  Processing.prototype.matchAll = function(str, reg) {
    var re = new RegExp(reg, "g");
    match = re.exec(str);
    var matches = [];
    while (match !== null) {
      matches.push(match);
      // matched text: match[0]
      // match start: match.index
      // capturing group n: match[n]
      match = re.exec(str);
    }
    return matches;
  };

  Processing.prototype.nf = function() {
    if (arguments[0] instanceof Array) {
      var a = arguments[1];
      var b = arguments[2];
      return arguments[0].map(function(x) { return doNf(x, a, b);});
    } else {
      return doNf.apply(this, arguments);
    }
  };

  function doNf() {
    var num = arguments[0];
    var neg = (num < 0);
    var n = neg ? num.toString().substring(1) : num.toString();
    var decimalInd = n.indexOf('.');
    var intPart =  decimalInd != -1 ? n.substring(0, decimalInd) : n;
    var decPart = decimalInd != -1 ? n.substring(decimalInd+1) : '';

    var str = neg ? '-' : '';

    if (arguments.length == 3) {
      for (var i=0; i<arguments[1]-intPart.length; i++) { str += '0'; }
      str += intPart;
      str += '.';
      str += decPart;
      for (var j=0; j<arguments[2]-decPart.length; j++) { str += '0'; }
      return str;
    } else {
      for (var k=0; k<max(arguments[1]-intPart.length, 0); k++) { str += '0'; }
      str += n;
      return str;
    }
  }

  Processing.prototype.nfc = function() {
    if (arguments[0] instanceof Array) {
      var a = arguments[1];
      return arguments[0].map(function(x) { return doNfc(x, a);});
    } else {
      return doNfc.apply(this, arguments);
    }
  };

  function doNfc() {
    var num = arguments[0].toString();
    var dec = num.indexOf('.');
    var rem = dec != -1 ? num.substring(dec) : '';
    var n = dec != -1 ? num.substring(0, dec) : num;
    n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (arguments.length > 1) rem = rem.substring(0, arguments[1]+1);
    return n+rem;
  }

  Processing.prototype.nfp = function() {
    var nfRes = nf.apply(this, arguments);
    if (nfRes instanceof Array) {
      return nfRes.map(addNfp);
    } else {
      return addNfp(nfRes);
    }
  };

  function addNfp() {
    return (parseFloat(arguments[0]) > 0) ? '+'+arguments[0].toString() : arguments[0].toString();
  }

  Processing.prototype.nfs = function() {
    var nfRes = nf.apply(this, arguments);
    if (nfRes instanceof Array) {
      return nfRes.map(addNfs);
    } else {
      return addNfs(nfRes);
    }
  };

  function addNfs() {
    return (parseFloat(arguments[0]) > 0) ? ' '+arguments[0].toString() : arguments[0].toString();
  }

  Processing.prototype.split = function(str, delim) {
    return str.split(delim);
  };

  Processing.prototype.splitTokens = function() {
    var d = (arguments.length > 0) ? arguments[1] : /\s/g;
    return arguments[0].split(d).filter(function(n){return n;});
  };

  Processing.prototype.trim = function(str) {
    if (str instanceof Array) {
      return str.map(trim);
    } else return str.trim();
  };

  return Processing;

});
define('src/input/mouse',['require','../core/core','../var/constants'],function (require) {

  

  var Processing = require('../core/core');
  var constants = require('../var/constants');

  /*
  // Another possibility: mouseX, mouseY, etc. are properties with a getter
  // that returns the relative coordinates depending on the current element.
  // I think is overkill and might screw up things in unexpected ways in other
  // parts of pjs.
  Object.defineProperty(exports, "mouseX", {
    get: function() {
      var bounds = this.curElement.elt.getBoundingClientRect();
      return absMouseX - bounds.left;
    },
    set: undefined
  });
  */

  Processing.prototype.isMousePressed = Processing.prototype.mouseIsPressed = function() {
    return this.mousePressed;
  };

  Processing.prototype.updateMouseCoords = function(e) {
    this._setProperty('pmouseX', this.mouseX);
    this._setProperty('pmouseY', this.mouseY);

    // TODO: These are based on the window, not the curElement
    this._setProperty('mouseX', e.pageX);  // - parseInt(this.curElement.elt.style.left, 10);
    this._setProperty('mouseY', e.pageY);  // - parseInt(this.curElement.elt.style.top, 10);


    for (var n = 0; n < this.sketchCanvases.length; n++) {
      var s = this.sketches[n];
      var c = this.sketchCanvases[n];
      var bounds = c.elt.getBoundingClientRect();
      s.pmouseX = s.mouseX;
      s.pmouseY = s.mouseY;
      s.mouseX = this.mouseX - bounds.left;
      s.mouseY = this.mouseY - bounds.top;
    }

    // console.log(mouseX+' '+mouseY);
    // console.log('mx = '+mouseX+' my = '+mouseY);
  };

  Processing.prototype.setMouseButton = function(e) {

    if (e.button == 1) {
      this._setProperty('mouseButton', constants.CENTER);
    } else if (e.button == 2) {
      this._setProperty('mouseButton', constants.RIGHT);
    } else {
     this._setProperty('mouseButton', constants.LEFT);
    }

    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      s.mouseButton = this.mouseButton;
    }
  };

  Processing.prototype.onmousemove = function(e){
    this.updateMouseCoords(e);
    if (!this.mousePressed && typeof mouseMoved === 'function') {
      mouseMoved(e);
    }
    if (this.mousePressed && typeof mouseDragged === 'function') {
      mouseDragged(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (!this.mousePressed && typeof s.mouseMoved === 'function') {
        s.mouseMoved(e);
      }
      if (this.mousePressed && typeof s.mouseDragged === 'function') {
        s.mouseDragged(e);
      }
    }
  };

  Processing.prototype.onmousedown = function(e) {
    this.mousePressed = true;
    this.setMouseButton(e);
    if (typeof mousePressed === 'function') {
      mousePressed(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.mousePressed === 'function') {
        s.mousePressed(e);
      }
    }
  };

  Processing.prototype.onmouseup = function(e) {
    this.mousePressed = false;
    if (typeof mouseReleased === 'function') {
      mouseReleased(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.mouseReleased === 'function') {
        s.mouseReleased(e);
      }
    }
  };

  Processing.prototype.onmouseclick = function(e) {
    if (typeof mouseClicked === 'function') {
      mouseClicked(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.mouseClicked === 'function') {
        s.mouseClicked(e);
      }
    }
  };

  Processing.prototype.onmousewheel = function(e) {
    if (typeof mouseWheel === 'function') {
      mouseWheel(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.mouseWheel === 'function') {
        s.mouseWheel(e);
      }
    }
  };

  return Processing;

});

define('src/input/touch',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.setTouchPoints = function(e) {
    this._setProperty('touchX', e.changedTouches[0].pageX);
    this._setProperty('touchY', e.changedTouches[0].pageY);
    var touches = [];
    for (var n = 0; n < this.sketchCanvases.length; n++) {
      this.sketches[n].touches = [];
    }
    for(var i = 0; i < e.changedTouches.length; i++){
      var ct = e.changedTouches[i];
      touches[i] = {x: ct.pageX, y: ct.pageY};
      for (var m = 0; m < this.sketchCanvases.length; n++) {
        var s = this.sketches[m];
        var c = this.sketchCanvases[m];
        var bounds = c.elt.getBoundingClientRect();
        s.touches[i] = {x: ct.pageX - bounds.left, y: ct.pageY - bounds.top};
      }
    }
    this._setProperty('touches', touches);
  };

  Processing.prototype.ontouchstart = function(e) {
    this.setTouchPoints(e);
    if(typeof touchStarted === 'function') {
      touchStarted(e);
    }
    var m = typeof touchMoved === 'function';
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.touchStarted === 'function') {
        s.touchStarted(e);
      }
      m |= typeof s.touchMoved === 'function';
    }
    if(m) {
      e.preventDefault();
    }
  };
  Processing.prototype.ontouchmove = function(e) {
    this.setTouchPoints(e);
    if(typeof touchMoved === 'function') {
      touchMoved(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.touchMoved === 'function') {
        s.touchMoved(e);
      }
    }
  };
  Processing.prototype.ontouchend = function(e) {
    this.setTouchPoints(e);
    if(typeof touchEnded === 'function') {
      touchEnded(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.touchEnded === 'function') {
        s.touchEnded(e);
      }
    }
  };

  return Processing;

});

define('src/dom/pelement',['require'],function(require) {

  function PElement(elt, pInst) {
    this.elt = elt;
    this.pInst = pInst;
    this.width = this.elt.offsetWidth;
    this.height = this.elt.offsetHeight;
    this.elt.style.position = 'absolute';
    this.x = 0;
    this.y = 0;
    this.elt.style.left = this.x+ 'px';
    this.elt.style.top = this.y+ 'px';
    if (elt instanceof HTMLCanvasElement) {
      this.context = elt.getContext('2d');
    }
  }
  PElement.prototype.html = function(html) {
    this.elt.innerHTML = html;
  };
  PElement.prototype.position = function(x, y) {
    this.x = x;
    this.y = y;
    this.elt.style.left = x+'px';
    this.elt.style.top = y+'px';
  };
  PElement.prototype.size = function(w, h) {
    var aW = w, aH = h;
    if (aW != AUTO || aH != AUTO) {
      if (aW == AUTO) aW = h * this.elt.width / this.elt.height;
      else if (aH == AUTO) aH = w * this.elt.height / this.elt.width;
      if (this.elt instanceof HTMLCanvasElement) { // set diff for cnv vs normal div
        this.elt.setAttribute('width', aW);
        this.elt.setAttribute('height', aH);
      } else {
        this.elt.style.width = aW;
        this.elt.style.height = aH;
      }
      this.width = this.elt.offsetWidth;
      this.height = this.elt.offsetHeight;
      if (this.pInst.curElement.elt == this.elt) {
        width = this.elt.offsetWidth;
        height = this.elt.offsetHeight;
      }
    }
  };
  PElement.prototype.style = function(s) {
    this.elt.style.cssText += s;
  };
  PElement.prototype.id = function(id) {
    this.elt.id = id;
  };
  PElement.prototype.class = function(c) {
    this.elt.className = c;
  };
  PElement.prototype.show = function() {
    this.elt.style.display = 'block';
  };
  PElement.prototype.hide = function() {
    this.elt.style.display = 'none';
  };
  PElement.prototype.mousePressed = function(fxn) {
    var _this = this; this.elt.addEventListener('click', function(e){fxn(e, _this);}, false);
  }; // pend false?
  PElement.prototype.mouseOver = function(fxn) {
    var _this = this; this.elt.addEventListener('mouseover', function(e){fxn(e, _this);}, false);
  };
  PElement.prototype.mouseOut = function(fxn) {
    var _this = this; this.elt.addEventListener('mouseout', function(e){fxn(e, _this);}, false);
  };

  return PElement;
});

define('src/dom/manipulate',['require','../core/core','../input/mouse','../input/touch','./pelement'],function(require) {

  var Processing = require('../core/core');
  require('../input/mouse');
  require('../input/touch');

  var PElement = require('./pelement');

  Processing.prototype.createGraphics = function(w, h, isDefault, targetID) {
    var c = document.createElement('canvas');
    c.setAttribute('width', w);
    c.setAttribute('height', h);
    if (isDefault) {
      c.id = 'defaultCanvas';
      document.body.appendChild(c);
    } else { // remove the default canvas if new one is created
      var defaultCanvas = document.getElementById('defaultCanvas');
      if (defaultCanvas) {
        defaultCanvas.parentNode.removeChild(defaultCanvas);
      }
      if (targetID) {
        target = document.getElementById(targetID);
        if (target) target.appendChild(c);
        else document.body.appendChild(c);
      } else {
        document.body.appendChild(c);
      }
    }

    var cnv =  new PElement(c, this);
    this.context(cnv);
    this._applyDefaults();

    return cnv;
  };

  Processing.prototype.createHTML = function(html) {
    var elt = document.createElement('div');
    elt.innerHTML = html;
    document.body.appendChild(elt);
    c =  new PElement(elt, this);
    context(c);
    return c;
  };

  Processing.prototype.createHTMLImage = function(src, alt) {
    var elt = document.createElement('img');
    elt.src = src;
    if (typeof alt !== 'undefined') {
      elt.alt = alt;
    }
    document.body.appendChild(elt);
    c =  new PElement(elt, this);
    context(c);
    return c;
  };

  Processing.prototype.find = function(e) {
    var res = document.getElementById(e);
    if (res) return [new PElement(res, this)];
    else {
      res = document.getElementsByClassName(e);
      if (res) {
        var arr = [];
        for(var i = 0, resl = res.length; i != resl; arr.push(new PElement(res[i++], this)));
        return arr;
      }
    }
    return [];
  };

  Processing.prototype.context = function(e) {
    var obj;
    if (typeof e == 'string' || e instanceof String) {
      var elt = document.getElementById(e);
      obj = elt ? new PElement(elt, this) : null;
    } else {
      obj = e;
    }
    if (typeof obj !== 'undefined') {
      this.curElement = obj;
      this._setProperty('width', obj.elt.offsetWidth);
      this._setProperty('height', obj.elt.offsetHeight);

      this.curElement.onfocus = function() {
        this.focused = true;
      };

      this.curElement.onblur = function() {
        this.focused = false;
      };

      this.curElement.onmousemove = this.onmousemove.bind(this);
      this.curElement.onmousedown = this.onmousedown.bind(this);
      this.curElement.onmouseup = this.onmouseup.bind(this);
      this.curElement.onmouseclick = this.onmouseclick.bind(this);
      this.curElement.onmousewheel = this.onmousewheel.bind(this);
      this.curElement.onkeydown = this.onkeydown.bind(this);
      this.curElement.onkeyup = this.onkeyup.bind(this);
      this.curElement.onkeypress = this.onkeypress.bind(this);
      this.curElement.ontouchstart = this.ontouchstart.bind(this);
      this.curElement.ontouchmove = this.ontouchmove.bind(this);
      this.curElement.ontouchend = this.ontouchend.bind(this);

      if (typeof this.curElement.context !== 'undefined') this.curElement.context.setTransform(1, 0, 0, 1, 0, 0);

      if (-1 < this.curSketchIndex && this.sketchCanvases.length <= this.curSketchIndex) {
        this.sketchCanvases[this.curSketchIndex] = this.curElement;
      }
    }
  };

  return Processing;

});

define('src/environment/environment',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.cursor = function(type) {
    this.curElement.style.cursor = type || 'auto';
  };

  Processing.prototype.frameRate = function(fps) {
    if (fps == null) {
      return this._frameRate;
    } else {
      this._setProperty('_frameRate', fps);
      this._runFrames();
      return this;
    }
  };

  Processing.prototype.getFrameRate = function() {
    return this.frameRate();
  };

  Processing.prototype.setFrameRate = function(fps) {
    return this.frameRate(fps);
  };

  Processing.prototype.noCursor = function() {
    this.curElement.style.cursor = 'none';
  };

  return Processing;

});
define('src/image/image',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.createImage = function(w, h, format) {
    return new PImage(w, h, this);
  }; //pend format?

  Processing.prototype.loadImage = function(path, callback) {
    var pimg = new PImage(null, null, this);
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

  Processing.prototype.preloadImage = function(path) {
    this.preload_count++;
    return this.loadImage(path, function () {
      if (--this.preload_count === 0) setup();
    });
  };

  function PImage(w, h, pInst) {
    this.width = w || 1;
    this.height = h || 1;
    this.pInst = pInst;
    this.pixels = [];
  }
  PImage.prototype.loadPixels = function() {
    this.pixels = [];
    var imageData = this.pInst.curElement.context.createImageData(this.width, this.height);
    for (var i = 3, len = imageData.length; i < len; i += 4) {
      imageData[i] = 255;
    }
    var data = this.imageData.data;
    for (var j=0; j<data.length; j+=4) {
      this.pixels.push([data[j], data[j+1], data[j+2], data[j+3]]);
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
    var op = this.curElement.context.globalCompositeOperation;
    this.curElement.context.drawImage(m.image, 0, 0);
    this.curElement.context.globalCompositeOperation = 'source-atop';
    this.curElement.context.drawImage(this.image, 0, 0);
    this.curElement.context.globalCompositeOperation = op;
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

  return PImage;

});

define('src/var/canvas',['require','./constants'],function(require) {

  var constants = require('./constants');

  return {
    modeAdjust: function(a, b, c, d, mode) {
      if (mode == constants.CORNER) {
        return { x: a, y: b, w: c, h: d };
      } else if (mode == constants.CORNERS) {
        return { x: a, y: b, w: c-a, h: d-b };
      } else if (mode == constants.RADIUS) {
        return { x: a-c, y: b-d, w: 2*c, h: 2*d };
      } else if (mode == constants.CENTER) {
        return { x: a-c*0.5, y: b-d*0.5, w: c, h: d };
      }
    }

  };

});
define('src/image/loading_displaying',['require','../core/core','../var/canvas','../var/constants'],function (require) {

  

  var Processing = require('../core/core');
  var canvas = require('../var/canvas');
  var constants = require('../var/constants');

  Processing.prototype.image = function() {
    var vals;
    if (arguments.length < 5) {
      vals = canvas.modeAdjust(arguments[1], arguments[2], arguments[0].width, arguments[0].height, this.settings.imageMode);
    } else {
      vals = canvas.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], this.settings.imageMode);
    }
    this.curElement.context.drawImage(arguments[0].sourceImage, vals.x, vals.y, vals.w, vals.h);
  };

  Processing.prototype.imageMode = function(m) {
    if (m == constants.CORNER || m == constants.CORNERS || m == constants.CENTER) {
      this.settings.imageMode = m;
    }
  };

  function getPixels(img) {
    var c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    var ctx = c.getContext('2d');
    ctx.drawImage(img);
    return ctx.getImageData(0,0,c.width,c.height);
  }

  //// PIXELS ////////////////////////////////

  Processing.prototype.blend = function() {
    // TODO

  };

  Processing.prototype.copy = function() {
    // TODO

  };

  Processing.prototype.filter = function() {
    // TODO

  };

  Processing.prototype.get = function(x, y) {
    var pix = this.curElement.context.getImageData(0, 0, width, height).data;
    /*if (typeof w !== 'undefined' && typeof h !== 'undefined') {
      var region = [];
      for (var j=0; j<h; j++) {
        for (var i=0; i<w; i++) {
          region[i*w+j] = pix[(y+j)*width+(x+i)];
        }
      }
      return region;
    }*/
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        var offset = 4*y*width+4*x;
        var c = [pix[offset], pix[offset+1], pix[offset+2], pix[offset+3]];
        return c;
      } else {
        return [0, 0, 0, 255];
      }
    } else {
      return [0, 0, 0, 255];
    }
  };

  Processing.prototype.loadPixels = function() {
    var a = this.curElement.context.getImageData(0, 0, width, height).data;
    var pixels = [];
    for (var i=0; i < a.length; i+=4) {
      pixels.push([a[i], a[i+1], a[i+2], a[i+3]]); // each pixels entry: [r, g, b, a]
    }
    this._setProperty('pixels', pixels);
  };

  Processing.prototype.set = function() {
    // TODO

  };

  Processing.prototype.updatePixels = function() {
    /*if (typeof this.pixels !== 'undefined') {
      var imgd = this.curElement.context.getImageData(x, y, width, height);
      imgd = this.pixels;
      context.putImageData(imgd, 0, 0);
    }*/
  };

  return Processing;

});

/*! version: 0.9.6
  * Reqwest! A general purpose XHR connection manager
  * license MIT (c) Dustin Diaz 2013
  * https://github.com/ded/reqwest
  */

!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define('node_modules/reqwest/reqwest',definition)
  else context[name] = definition()
}('reqwest', this, function () {

  var win = window
    , doc = document
    , twoHundo = /^(20\d|1223)$/
    , byTag = 'getElementsByTagName'
    , readyState = 'readyState'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , head = doc[byTag]('head')[0]
    , uniqid = 0
    , callbackPrefix = 'reqwest_' + (+new Date())
    , lastValue // data stored by the most recent JSONP callback
    , xmlHttpRequest = 'XMLHttpRequest'
    , xDomainRequest = 'XDomainRequest'
    , noop = function () {}

    , isArray = typeof Array.isArray == 'function'
        ? Array.isArray
        : function (a) {
            return a instanceof Array
          }

    , defaultHeaders = {
          'contentType': 'application/x-www-form-urlencoded'
        , 'requestedWith': xmlHttpRequest
        , 'accept': {
              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
            , 'xml':  'application/xml, text/xml'
            , 'html': 'text/html'
            , 'text': 'text/plain'
            , 'json': 'application/json, text/javascript'
            , 'js':   'application/javascript, text/javascript'
          }
      }

    , xhr = function(o) {
        // is it x-domain
        if (o['crossOrigin'] === true) {
          var xhr = win[xmlHttpRequest] ? new XMLHttpRequest() : null
          if (xhr && 'withCredentials' in xhr) {
            return xhr
          } else if (win[xDomainRequest]) {
            return new XDomainRequest()
          } else {
            throw new Error('Browser does not support cross-origin requests')
          }
        } else if (win[xmlHttpRequest]) {
          return new XMLHttpRequest()
        } else {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
      }
    , globalSetupOptions = {
        dataFilter: function (data) {
          return data
        }
      }

  function handleReadyState(r, success, error) {
    return function () {
      // use _aborted to mitigate against IE err c00c023f
      // (can't read props on aborted request objects)
      if (r._aborted) return error(r.request)
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop
        if (twoHundo.test(r.request.status))
          success(r.request)
        else
          error(r.request)
      }
    }
  }

  function setHeaders(http, o) {
    var headers = o['headers'] || {}
      , h

    headers['Accept'] = headers['Accept']
      || defaultHeaders['accept'][o['type']]
      || defaultHeaders['accept']['*']

    // breaks cross-origin requests with legacy browsers
    if (!o['crossOrigin'] && !headers[requestedWith]) headers[requestedWith] = defaultHeaders['requestedWith']
    if (!headers[contentType]) headers[contentType] = o['contentType'] || defaultHeaders['contentType']
    for (h in headers)
      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
  }

  function setCredentials(http, o) {
    if (typeof o['withCredentials'] !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o['withCredentials']
    }
  }

  function generalCallback(data) {
    lastValue = data
  }

  function urlappend (url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s
  }

  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++
      , cbkey = o['jsonpCallback'] || 'callback' // the 'callback' key
      , cbval = o['jsonpCallbackName'] || reqwest.getcallbackPrefix(reqId)
      // , cbval = o['jsonpCallbackName'] || ('reqwest_' + reqId) // the 'callback' value
      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
      , match = url.match(cbreg)
      , script = doc.createElement('script')
      , loaded = 0
      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1

    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
      } else {
        cbval = match[3] // provided callback func name
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
    }

    win[cbval] = generalCallback

    script.type = 'text/javascript'
    script.src = url
    script.async = true
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      // need this for IE due to out-of-order onreadystatechange(), binding script
      // execution to an event listener gives us control over when the script
      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      //
      // if this hack is used in IE10 jsonp callback are never called
      script.event = 'onclick'
      script.htmlFor = script.id = '_reqwest_' + reqId
    }

    script.onload = script.onreadystatechange = function () {
      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
        return false
      }
      script.onload = script.onreadystatechange = null
      script.onclick && script.onclick()
      // Call the user callback with the last value stored and clean up values and scripts.
      fn(lastValue)
      lastValue = undefined
      head.removeChild(script)
      loaded = 1
    }

    // Add the script to the DOM head
    head.appendChild(script)

    // Enable JSONP timeout
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null
        err({}, 'Request is aborted: timeout', {})
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
    }
  }

  function getRequest(fn, err) {
    var o = this.o
      , method = (o['method'] || 'GET').toUpperCase()
      , url = typeof o === 'string' ? o : o['url']
      // convert non-string objects to query-string form unless o['processData'] is false
      , data = (o['processData'] !== false && o['data'] && typeof o['data'] !== 'string')
        ? reqwest.toQueryString(o['data'])
        : (o['data'] || null)
      , http
      , sendWait = false

    // if we're working on a GET request and we have data then we should append
    // query string to end of URL and not post data
    if ((o['type'] == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data)
      data = null
    }

    if (o['type'] == 'jsonp') return handleJsonp(o, fn, err, url)

    http = xhr(o)
    http.open(method, url, o['async'] === false ? false : true)
    setHeaders(http, o)
    setCredentials(http, o)
    if (win[xDomainRequest] && http instanceof win[xDomainRequest]) {
        http.onload = fn
        http.onerror = err
        // NOTE: see
        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
        http.onprogress = function() {}
        sendWait = true
    } else {
      http.onreadystatechange = handleReadyState(this, fn, err)
    }
    o['before'] && o['before'](http)
    if (sendWait) {
      setTimeout(function () {
        http.send(data)
      }, 200)
    } else {
      http.send(data)
    }
    return http
  }

  function Reqwest(o, fn) {
    this.o = o
    this.fn = fn

    init.apply(this, arguments)
  }

  function setType(url) {
    var m = url.match(/\.(json|jsonp|html|xml)(\?|$)/)
    return m ? m[1] : 'js'
  }

  function init(o, fn) {

    this.url = typeof o == 'string' ? o : o['url']
    this.timeout = null

    // whether request has been fulfilled for purpose
    // of tracking the Promises
    this._fulfilled = false
    // success handlers
    this._successHandler = function(){}
    this._fulfillmentHandlers = []
    // error handlers
    this._errorHandlers = []
    // complete (both success and fail) handlers
    this._completeHandlers = []
    this._erred = false
    this._responseArgs = {}

    var self = this
      , type = o['type'] || setType(this.url)

    fn = fn || function () {}

    if (o['timeout']) {
      this.timeout = setTimeout(function () {
        self.abort()
      }, o['timeout'])
    }

    if (o['success']) {
      this._successHandler = function () {
        o['success'].apply(o, arguments)
      }
    }

    if (o['error']) {
      this._errorHandlers.push(function () {
        o['error'].apply(o, arguments)
      })
    }

    if (o['complete']) {
      this._completeHandlers.push(function () {
        o['complete'].apply(o, arguments)
      })
    }

    function complete (resp) {
      o['timeout'] && clearTimeout(self.timeout)
      self.timeout = null
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp)
      }
    }

    function success (resp) {
      resp = (type !== 'jsonp') ? self.request : resp
      // use global data filter on response text
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
        , r = filteredResponse
      try {
        resp.responseText = r
      } catch (e) {
        // can't assign this in IE<=8, just ignore
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err)
          }
          break
        case 'js':
          resp = eval(r)
          break
        case 'html':
          resp = r
          break
        case 'xml':
          resp = resp.responseXML
              && resp.responseXML.parseError // IE trololo
              && resp.responseXML.parseError.errorCode
              && resp.responseXML.parseError.reason
            ? null
            : resp.responseXML
          break
        }
      }

      self._responseArgs.resp = resp
      self._fulfilled = true
      fn(resp)
      self._successHandler(resp)
      while (self._fulfillmentHandlers.length > 0) {
        resp = self._fulfillmentHandlers.shift()(resp)
      }

      complete(resp)
    }

    function error(resp, msg, t) {
      resp = self.request
      self._responseArgs.resp = resp
      self._responseArgs.msg = msg
      self._responseArgs.t = t
      self._erred = true
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t)
      }
      complete(resp)
    }

    this.request = getRequest.call(this, success, error)
  }

  Reqwest.prototype = {
    abort: function () {
      this._aborted = true
      this.request.abort()
    }

  , retry: function () {
      init.call(this, this.o, this.fn)
    }

    /**
     * Small deviation from the Promises A CommonJs specification
     * http://wiki.commonjs.org/wiki/Promises/A
     */

    /**
     * `then` will execute upon successful requests
     */
  , then: function (success, fail) {
      success = success || function () {}
      fail = fail || function () {}
      if (this._fulfilled) {
        this._responseArgs.resp = success(this._responseArgs.resp)
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._fulfillmentHandlers.push(success)
        this._errorHandlers.push(fail)
      }
      return this
    }

    /**
     * `always` will execute whether the request succeeds or fails
     */
  , always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp)
      } else {
        this._completeHandlers.push(fn)
      }
      return this
    }

    /**
     * `fail` will execute when the request fails
     */
  , fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._errorHandlers.push(fn)
      }
      return this
    }
  }

  function reqwest(o, fn) {
    return new Reqwest(o, fn)
  }

  // normalize newline variants according to spec -> CRLF
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : ''
  }

  function serial(el, cb) {
    var n = el.name
      , t = el.tagName.toLowerCase()
      , optCb = function (o) {
          // IE gives value="" even where there is no value attribute
          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
          if (o && !o['disabled'])
            cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']))
        }
      , ch, ra, val, i

    // don't serialize elements that are disabled or without a name
    if (el.disabled || !n) return

    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type)
        ra = /radio/i.test(el.type)
        val = el.value
        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
      }
      break
    case 'textarea':
      cb(n, normalize(el.value))
      break
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i])
        }
      }
      break
    }
  }

  // collect up all form elements found from the passed argument elements all
  // the way down to child elements; pass a '<form>' or form fields.
  // called with 'this'=callback to use for serial() on each element
  function eachFormElement() {
    var cb = this
      , e, i
      , serializeSubtags = function (e, tags) {
          var i, j, fa
          for (i = 0; i < tags.length; i++) {
            fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }

    for (i = 0; i < arguments.length; i++) {
      e = arguments[i]
      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
    }
  }

  // standard query string style serialization
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
  }

  // { 'name': 'value', ... } style serialization
  function serializeHash() {
    var hash = {}
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
        hash[name].push(value)
      } else hash[name] = value
    }, arguments)
    return hash
  }

  // [ { name: 'name', value: 'value' }, ... ] style serialization
  reqwest.serializeArray = function () {
    var arr = []
    eachFormElement.apply(function (name, value) {
      arr.push({name: name, value: value})
    }, arguments)
    return arr
  }

  reqwest.serialize = function () {
    if (arguments.length === 0) return ''
    var opt, fn
      , args = Array.prototype.slice.call(arguments, 0)

    opt = args.pop()
    opt && opt.nodeType && args.push(opt) && (opt = null)
    opt && (opt = opt.type)

    if (opt == 'map') fn = serializeHash
    else if (opt == 'array') fn = reqwest.serializeArray
    else fn = serializeQueryString

    return fn.apply(null, args)
  }

  reqwest.toQueryString = function (o, trad) {
    var prefix, i
      , traditional = trad || false
      , s = []
      , enc = encodeURIComponent
      , add = function (key, value) {
          // If value is a function, invoke it and return its value
          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
          s[s.length] = enc(key) + '=' + enc(value)
        }
    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++) add(o[i]['name'], o[i]['value'])
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in o) {
        if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix], traditional, add)
      }
    }

    // spaces should be + according to spec
    return s.join('&').replace(/%20/g, '+')
  }

  function buildParams(prefix, obj, traditional, add) {
    var name, i, v
      , rbracket = /\[\]$/

    if (isArray(obj)) {
      // Serialize array item.
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i]
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v)
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj)
    }
  }

  reqwest.getcallbackPrefix = function () {
    return callbackPrefix
  }

  // jQuery and Zepto compatibility, differences can be remapped here so you can call
  // .ajax.compat(options, callback)
  reqwest.compat = function (o, fn) {
    if (o) {
      o['type'] && (o['method'] = o['type']) && delete o['type']
      o['dataType'] && (o['type'] = o['dataType'])
      o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback']
      o['jsonp'] && (o['jsonpCallback'] = o['jsonp'])
    }
    return new Reqwest(o, fn)
  }

  reqwest.ajaxSetup = function (options) {
    options = options || {}
    for (var k in options) {
      globalSetupOptions[k] = options[k]
    }
  }

  return reqwest
});

define('src/input/files',['require','../core/core','../../node_modules/reqwest/reqwest'],function (require) {

  

  var Processing = require('../core/core');
  var reqwest = require('../../node_modules/reqwest/reqwest');

  //BufferedReader
  Processing.prototype.createInput = function() {
    // TODO

  };

  Processing.prototype.createReader = function() {
    // TODO

  };

  Processing.prototype.loadBytes = function() {
    // TODO

  };

  Processing.prototype.loadJSON = function(path, callback) {
    var ret = [];
    var t = path.indexOf('http') == -1 ? 'json' : 'jsonp';
    reqwest({url: path, type: t, success: function (resp) {
      for (var k in resp) ret[k] = resp[k];
      if (typeof callback !== 'undefined') callback(resp);
    }});
    return ret;
  };

  Processing.prototype.loadStrings = function(path, callback) {
    var ret = [];
    var req = new XMLHttpRequest();
    req.open('GET', path, true);
    req.onreadystatechange = function () {
      if((req.readyState === 4) && (req.status === 200 || req.status === 0)) {
        var arr = req.responseText.match(/[^\r\n]+/g);
        for (var k in arr) ret[k] = arr[k];
        if (typeof callback !== 'undefined') callback();
      }
    };
    req.send(null);
    return ret;
  };

  Processing.prototype.loadTable = function () {
    // TODO

  };


  Processing.prototype.loadXML = function(path, callback) {
    this.temp = [];
    var ret = [];
    reqwest(path, function (resp) {
      console.log(resp);
      this.temp = resp;
      ret[0] = resp;
      if (typeof callback !== 'undefined') callback(resp);
    });
    return ret;
  };

  Processing.prototype.open = function() {
    // TODO

  };

  Processing.prototype.parseXML = function() {
    // TODO

  };

  Processing.prototype.saveTable = function() {
    // TODO

  };

  Processing.prototype.selectFolder = function() {
    // TODO

  };

  Processing.prototype.selectInput = function() {
    // TODO

  };

  return Processing;

});

define('src/input/keyboard',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.isKeyPressed = Processing.prototype.keyIsPressed = function() {
    return this.keyPressed;
  };

  Processing.prototype.onkeydown = function(e) {
    var keyPressed = this.keyPressed || window.keyPressed;

    this._setProperty('keyDown', true);
    this._setProperty('keyCode', e.keyCode);
    this._setProperty('key', String.fromCharCode(e.keyCode));
    if (typeof keyPressed === 'function') {
      keyPressed(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.keyPressed === 'function') {
        s.keyPressed(e);
      }
    }
  };

  Processing.prototype.onkeyup = function(e) {
    var keyReleased = this.keyReleased || window.keyReleased;

    this._setProperty('keyDown', false);
    if (typeof keyReleased === 'function') {
      keyReleased(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.keyReleased === 'function') {
        s.keyReleased(e);
      }
    }
  };

  Processing.prototype.onkeypress = function(e) {
    var keyTyped = this.keyTyped || window.keyTyped;

    if (typeof keyTyped === 'function') {
      keyTyped(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.keyTyped === 'function') {
        s.keyTyped(e);
      }
    }
  };

  return Processing;

});

define('src/input/time_date',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.day = function() {
    return new Date().getDate();
  };

  Processing.prototype.hour = function() {
    return new Date().getHours();
  };

  Processing.prototype.minute = function() {
    return new Date().getMinutes();
  };

  Processing.prototype.millis = function() {
    return new Date().getTime() - this.startTime;
  };

  Processing.prototype.month = function() {
    return new Date().getMonth();
  };

  Processing.prototype.second = function() {
    return new Date().getSeconds();
  };

  Processing.prototype.year = function() {
    return new Date().getFullYear();
  };

  return Processing;

});
define('src/math/calculation',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.abs = Math.abs;

  Processing.prototype.ceil = Math.ceil;

  Processing.prototype.constrain = function(n, l, h) {
    return max(min(n, h), l);
  };

  Processing.prototype.dist = function(x1, y1, x2, y2) {
    var xs = x2-x1;
    var ys = y2-y1;
    return Math.sqrt( xs*xs + ys*ys );
  };

  Processing.prototype.exp = Math.exp;

  Processing.prototype.floor = Math.floor;

  Processing.prototype.lerp = function(start, stop, amt) {
    return amt*(stop-start)+start;
  };

  Processing.prototype.log = Math.log;

  Processing.prototype.mag = function(x, y) {
    return Math.sqrt(x*x+y*y);
  };

  Processing.prototype.map = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };

  Processing.prototype.max = Math.max;

  Processing.prototype.min = Math.min;

  Processing.prototype.norm = function(n, start, stop) { return map(n, start, stop, 0, 1); };

  Processing.prototype.pow = Math.pow;

  Processing.prototype.round = Math.round;

  Processing.prototype.sq = function(n) { return n*n; };

  Processing.prototype.sqrt = Math.sqrt;

  return Processing;

});

define('src/var/polargeometry',['require'],function(require) {

  return {

    degreesToRadians: function(x) {
      return 2 * Math.PI * x / 360;
    },

    radiansToDegrees: function(x) {
      return 360 * x / (2 * Math.PI);
    }

  };

});
define('src/math/pvector',['require','../core/core','../var/polargeometry'],function (require) {

  

  var Processing = require('../core/core');
  var polarGeometry = require('../var/polargeometry');

  function PVector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  PVector.prototype.set = function (x, y, z) {
    if (x instanceof PVector) { return this.set(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.set(x[0], x[1], x[2]); }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };

  PVector.prototype.get = function () {
    return new PVector(this.x, this.y, this.z);
  };

  PVector.prototype.add = function (x, y, z) {
    if (x instanceof PVector) { return this.add(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.add(x[0], x[1], x[2]); }
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
  };

  PVector.prototype.sub = function (x, y, z) {
    if (x instanceof PVector) { return this.sub(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.sub(x[0], x[1], x[2]); }
    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    return this;
  };

  PVector.prototype.mult = function (n) {
    this.x *= n || 0;
    this.y *= n || 0;
    this.z *= n || 0;
    return this;
  };

  PVector.prototype.div = function (n) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this;
  };

  PVector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
  };

  PVector.prototype.magSq = function () {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };

  PVector.prototype.dot = function (x, y, z) {
    if (x instanceof PVector) {
      return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) +
           this.y * (y || 0) +
           this.z * (z || 0);
  };

  PVector.prototype.cross = function (v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;
    return new PVector(x, y, z);
  };

  PVector.prototype.dist = function (v) {
    var d = v.get().sub(this);
    return d.mag();
  };

  PVector.prototype.normalize = function () {
    return this.div(this.mag());
  };

  PVector.prototype.limit = function (l) {
    var mSq = this.magSq();
    if(mSq > l*l) {
      this.div(Math.sqrt(mSq)); //normalize it
      this.mult(l);
    }
    return this;
  };

  PVector.prototype.setMag = function (n) {
    return this.normalize().mult(n);
  };

  PVector.prototype.heading = function () {
    return Math.atan2(this.y, this.x);
  };

  PVector.prototype.rotate2D = function (a) {
    var newHeading = this.heading() + polarGeometry.convertToRadians(a);
    var mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  };

  PVector.prototype.lerp = function (x, y, z, amt) {
    if (x instanceof PVector) {
      return this.lerp(x.x, x.y, x.z, y);
    }
    this.x += (x - this.x) * amt || 0;
    this.y += (y - this.y) * amt || 0;
    this.z += (z - this.z) * amt || 0;
    return this;
  };

  PVector.prototype.array = function () {
    return [this.x || 0, this.y || 0, this.z || 0];
  };


  // Static Methods

  PVector.random2D = function () {
    //TODO:
  };

  PVector.random3D = function () {
    //TODO:
  };

  PVector.add = function (v1, v2) {
    return v1.get().add(v2);
  };

  PVector.sub = function (v1, v2) {
    return v1.get().sub(v2);
  };

  PVector.mult = function (v, n) {
    return v.get().mult(n);
  };

  PVector.div = function (v, n) {
    return v.get().div(n);
  };

  PVector.dot = function (v1, v2) {
    return v1.dot(v2);
  };

  PVector.cross = function (v1, v2) {
    return v1.cross(v2);
  };

  PVector.dist = function (v1,v2) {
    return v1.dist(v2);
  };

  PVector.lerp = function (v1, v2, amt) {
    return v1.get().lerp(v2, amt);
  };

  PVector.angleBetween = function (v1, v2) {
    return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
  };

  Processing.PVector = PVector;

  return Processing;

});

define('src/math/random',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.random = function(x, y) {
    // might want to use this kind of check instead:
    // if (arguments.length === 0) {
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      return (y-x)*Math.random()+x;
    } else if (typeof x !== 'undefined') {
      return x*Math.random();
    } else {
      return Math.random();
    }
  };

  return Processing;

});

define('src/math/trigonometry',['require','../core/core','../var/polargeometry'],function (require) {

  

  var Processing = require('../core/core');
  var polarGeometry = require('../var/polargeometry');

  Processing.prototype.acos = Math.acos;

  Processing.prototype.asin = Math.asin;

  Processing.prototype.atan = Math.atan;

  Processing.prototype.atan2 = Math.atan2;

  Processing.prototype.cos = function(x) {
    return Math.cos(this.radians(x));
  };

  Processing.prototype.degrees = function(angle) {
    return this.settings.angleMode === 'degrees' ? angle : polarGeometry.radiansToDegrees(angle);
  };

  Processing.prototype.radians = function(angle) {
    return this.settings.angleMode === 'radians' ? angle : polarGeometry.degreesToRadians(angle);
  };

  Processing.prototype.sin = function(x) {
    return Math.sin(this.radians(x));
  };

  Processing.prototype.tan = function(x) {
    return Math.tan(this.radians(x));
  };

  return Processing;

});
define('src/output/files',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.beginRaw = function() {
    // TODO

  };

  Processing.prototype.beginRecord = function() {
    // TODO

  };

  Processing.prototype.createOutput = function() {
    // TODO

  };

  Processing.prototype.createWriter  = function(name) {
    if (this.pWriters.indexOf(name) == -1) { // check it doesn't already exist
      this.pWriters.name = new PrintWriter(name);
    }
  };

  Processing.prototype.endRaw = function() {
    // TODO

  };

  Processing.prototype.endRecord  = function() {
    // TODO

  };

  Processing.prototype.PrintWriter = function(name) {
     this.name = name;
     this.content = '';
     this.print = function(data) { this.content += data; };
     this.println = function(data) { this.content += data + '\n'; };
     this.flush = function() { this.content = ''; };
     this.close = function() { writeFile(this.content); };
  };

  Processing.prototype.saveBytes = function() {
    // TODO

  };

  Processing.prototype.saveJSONArray = function() {
    // TODO

  };

  Processing.prototype.saveJSONObject = function() {
    // TODO

  };

  Processing.prototype.saveStream = function() {
    // TODO

  };

  Processing.prototype.saveStrings = function(list) {
    this.writeFile(list.join('\n'));
  };

  Processing.prototype.saveXML = function() {
    // TODO

  };

  Processing.prototype.selectOutput = function() {
    // TODO

  };

  Processing.prototype.writeFile = function(content) {
    this.open('data:text/json;charset=utf-8,' + escape(content), 'download');
  };

  return Processing;

});

define('src/output/image',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.save = function() {
    this.open(this.curElement.elt.toDataURL('image/png'));
  };

  return Processing;
});
define('src/output/text_area',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.print = console.log.bind(console);
  Processing.prototype.println = console.log.bind(console);

  return Processing;
});
define('src/shape/2d_primitives',['require','../core/core','../var/canvas'],function (require) {

  

  var Processing = require('../core/core');
  var canvas = require('../var/canvas');

	Processing.prototype.arc = function() {
    // pend todo

  };

  Processing.prototype.ellipse = function(a, b, c, d) {
    var vals = canvas.modeAdjust(a, b, c, d, this.settings.ellipseMode);
    var kappa = 0.5522848,
      ox = (vals.w / 2) * kappa, // control point offset horizontal
      oy = (vals.h / 2) * kappa, // control point offset vertical
      xe = vals.x + vals.w,      // x-end
      ye = vals.y + vals.h,      // y-end
      xm = vals.x + vals.w / 2,  // x-middle
      ym = vals.y + vals.h / 2;  // y-middle
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(vals.x, ym);
    this.curElement.context.bezierCurveTo(vals.x, ym - oy, xm - ox, vals.y, xm, vals.y);
    this.curElement.context.bezierCurveTo(xm + ox, vals.y, xe, ym - oy, xe, ym);
    this.curElement.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this.curElement.context.bezierCurveTo(xm - ox, ye, vals.x, ym + oy, vals.x, ym);
    this.curElement.context.closePath();
    this.curElement.context.fill();
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.line = function(x1, y1, x2, y2) {
    if (this.curElement.context.strokeStyle === 'rgba(0,0,0,0)') {
      return;
    }
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    this.curElement.context.lineTo(x2, y2);
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.point = function(x, y) {
    var s = this.curElement.context.strokeStyle;
    var f = this.curElement.context.fillStyle;
    if (s === 'rgba(0,0,0,0)') {
      return;
    }
    x = Math.round(x);
    y = Math.round(y);
    this.curElement.context.fillStyle = s;
    if (this.curElement.context.lineWidth > 1) {
      this.curElement.context.beginPath();
      this.curElement.context.arc(x, y, this.curElement.context.lineWidth / 2, 0, TWO_PI, false);
      this.curElement.context.fill();
    } else {
      this.curElement.context.fillRect(x, y, 1, 1);
    }
    this.curElement.context.fillStyle = f;

    return this;
  };

  Processing.prototype.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    this.curElement.context.lineTo(x2, y2);
    this.curElement.context.lineTo(x3, y3);
    this.curElement.context.lineTo(x4, y4);
    this.curElement.context.closePath();
    this.curElement.context.fill();
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.rect = function(a, b, c, d) {
    var vals = canvas.modeAdjust(a, b, c, d, this.settings.rectMode);
    this.curElement.context.beginPath();
    this.curElement.context.rect(vals.x, vals.y, vals.w, vals.h);
    this.curElement.context.fill();
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.triangle = function(x1, y1, x2, y2, x3, y3) {
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    this.curElement.context.lineTo(x2, y2);
    this.curElement.context.lineTo(x3, y3);
    this.curElement.context.closePath();
    this.curElement.context.fill();
    this.curElement.context.stroke();

    return this;
  };

  return Processing;

});

define('src/shape/attributes',['require','../core/core','../var/constants'],function (require) {

  

  var Processing = require('../core/core');
  var constants = require('../var/constants');

  Processing.prototype.ellipseMode = function(m) {
    if (m == constants.CORNER || m == constants.CORNERS || m == constants.RADIUS || m == constants.CENTER) {
      this.settings.ellipseMode = m;
    }

    return this;
  };

  Processing.prototype.noSmooth = function() {
    this.curElement.context.mozImageSmoothingEnabled = false;
    this.curElement.context.webkitImageSmoothingEnabled = false;

    return this;
  };

  Processing.prototype.rectMode = function(m) {
    if (m == constants.CORNER || m == constants.CORNERS || m == constants.RADIUS || m == constants.CENTER) {
      this.settings.rectMode = m;
    }

    return this;
  };

  Processing.prototype.smooth = function() {
    this.curElement.context.mozImageSmoothingEnabled = true;
    this.curElement.context.webkitImageSmoothingEnabled = true;

    return this;
  };

  Processing.prototype.strokeCap = function(cap) {
    if (cap == constants.ROUND || cap == constants.SQUARE || cap == constants.PROJECT) {
      this.curElement.context.lineCap=cap;
    }

    return this;
  };

  Processing.prototype.strokeJoin = function(join) {
    if (join == constants.ROUND || join == constants.BEVEL || join == constants.MITER) {
      this.curElement.context.lineJoin = join;
    }

    return this;
  };

  Processing.prototype.strokeWeight = function(w) {
    if (typeof w === 'undefined' || w === 0)
      this.curElement.context.lineWidth = 0.0001; // hack because lineWidth 0 doesn't work
    else this.curElement.context.lineWidth = w;

    return this;
  };

  return Processing;

});

define('src/shape/curves',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    this.curElement.context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.bezierDetail = function() {
    // TODO

  };

  Processing.prototype.bezierPoint = function() {
    // TODO

  };

  Processing.prototype.bezierTangent = function() {
    // TODO

  };

  Processing.prototype.curve = function() {
    // TODO

  };

  Processing.prototype.curveDetail = function() {
    // TODO

  };

  Processing.prototype.curvePoint = function() {
    // TODO

  };

  Processing.prototype.curveTangent = function() {
    // TODO

  };

  Processing.prototype.curveTightness = function() {
    // TODO

  };

  return Processing;

});
define('src/shape/vertex',['require','../core/core','../var/constants'],function (require) {

  

  var Processing = require('../core/core');
  var constants = require('../var/constants');

  Processing.prototype.beginContour = function() {
    // TODO

  };

  Processing.prototype.beginShape = function(kind) {
    if (kind == constants.POINTS || kind == constants.LINES || kind == constants.TRIANGLES || kind == constants.TRIANGLE_FAN || kind == constants.TRIANGLE_STRIP || kind == constants.QUADS || kind == constants.QUAD_STRIP)
      this.shapeKind = kind;
    else this.shapeKind = null;
    this.shapeInited = true;
    this.curElement.context.beginPath();

    return this;
  };

  Processing.prototype.bezierVertex = function(x1, y1, x2, y2, x3, y3) {
    this.curElement.context.bezierCurveTo(x1, y1, x2, y2, x3, y3);

    return this;
  };

  Processing.prototype.curveVertex = function() {
    // TODO

  };

  Processing.prototype.endContour = function() {
    // TODO

  };

  Processing.prototype.endShape = function(mode) {
    if (mode == constants.CLOSE) {
      this.curElement.context.closePath();
      this.curElement.context.fill();
    }
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.quadraticVertex = function(cx, cy, x3, y3) {
    this.curElement.context.quadraticCurveTo(cx, cy, x3, y3);

    return this;
  };

  Processing.prototype.vertex = function(x, y) {
    if (this.shapeInited) {
      this.curElement.context.moveTo(x, y);
    } else {
      this.curElement.context.lineTo(x, y); // pend this is where check for kind and do other stuff
    }
    this.shapeInited = false;

    return this;
  };

  return Processing;

});
define('src/structure/structure',['require','../core/core'],function (require) {

  

  var Processing = require('../core/core');

  Processing.prototype.exit = function() {
    throw "Not implemented";
  };

  Processing.prototype.noLoop = function() {
    this.settings.loop = false;
  };

  Processing.prototype.loop = function() {
    this.settings.loop = true;
  };

  Processing.prototype.pushStyle = function() {

    this.styles.push({
      fillStyle: this.curElement.context.fillStyle, // fill
      strokeStyle: this.curElement.context.strokeStyle, // stroke
      lineWidth: this.curElement.context.lineWidth, // strokeWeight
      // @todo tint
      lineCap: this.curElement.context.lineCap, // strokeCap
      lineJoin: this.curElement.context.lineJoin, // strokeJoin
      imageMode: this.settings.imageMode, // imageMode
      rectMode: this.settings.rectMode, // rectMode
      ellipseMode: this.settings.ellipseMode, // ellipseMode
      // @todo shapeMode
      colorMode: this.settings.colorMode, // colorMode
      textAlign: this.curElement.context.textAlign, // textAlign
      textFont: this.settings.textFont,
      textLeading: this.settings.textLeading, // textLeading
      textSize: this.settings.textSize, // textSize
      textStyle: this.settings.textStyle // textStyle
    });
  };

  Processing.prototype.popStyle = function() {

    var lastS = this.styles.pop();

    this.curElement.context.fillStyle = lastS.fillStyle; // fill
    this.curElement.context.strokeStyle = lastS.strokeStyle; // stroke
    this.curElement.context.lineWidth = lastS.lineWidth; // strokeWeight
    // @todo tint
    this.curElement.context.lineCap = lastS.lineCap; // strokeCap
    this.curElement.context.lineJoin = lastS.lineJoin; // strokeJoin
    this.settings.imageMode = lastS.imageMode; // imageMode
    this.settings.rectMode = lastS.rectMode; // rectMode
    this.settings.ellipseMode = lastS.ellipseMode; // elllipseMode
    // @todo shapeMode
    this.settings.colorMode = lastS.colorMode; // colorMode
    this.curElement.context.textAlign = lastS.textAlign; // textAlign
    this.settings.textFont = lastS.textFont;
    this.settings.textLeading = lastS.textLeading; // textLeading
    this.settings.textSize = lastS.textSize; // textSize
    this.settings.textStyle = lastS.textStyle; // textStyle

  };

  Processing.prototype.redraw = function() {
    throw "Not implemented";
  };

  Processing.prototype.size = function() {
    throw "Not implemented";
  };

  return Processing;

});
define('src/var/linearalgebra',['require'],function(require) {

  return {

    // TODO: Replace with an optimized matrix-multiplication algorithm
    pMultiplyMatrix: function(m1, m2) {

      var result = [];
      var m1Length = m1.length;
      var m2Length = m2.length;
      var m10Length = m1[0].length;

      for(var j = 0; j < m2Length; j++) {

        result[j] = [];

        for(var k = 0; k < m10Length; k++) {

          var sum = 0;

          for(var i = 0; i < m1Length; i++) {

            sum += m1[i][k] * m2[j][i];

          }

          result[j].push(sum);

        }

      }

      return result;
    }

  };

});
/* Transform
    applyMatrix()
    popMatrix()
    printMatrix()
    pushMatrix()
    resetMatrix()
    rotate()
    rotateX()
    rotateY()
    rotateZ()
    scale()
    shearX()
    shearY()
    translate()
*/

define('src/transform/transform',['require','../core/core','../var/linearalgebra'],function (require) {

  

  var Processing = require('../core/core');
  var linearAlgebra = require('../var/linearalgebra');

  Processing.prototype.applyMatrix = function(n00, n01, n02, n10, n11, n12) {
    this.curElement.context.transform(n00, n01, n02, n10, n11, n12);
    var m = this.matrices[this.matrices.length-1];
    m = linearAlgebra.pMultiplyMatrix(m, [n00, n01, n02, n10, n11, n12]);

    return this;
  };

  Processing.prototype.popMatrix = function() {
    this.curElement.context.restore();
    this.matrices.pop();

    return this;
  };

  Processing.prototype.printMatrix = function() {
    console.log(this.matrices[this.matrices.length-1]);

    return this;
  };

  Processing.prototype.pushMatrix = function() {
    this.curElement.context.save();
    this.matrices.push([1,0,0,1,0,0]);

    return this;
  };

  Processing.prototype.resetMatrix = function() {
    this.curElement.context.setTransform();
    this.matrices[this.matrices.length-1] = [1,0,0,1,0,0];

    return this;
  };

  Processing.prototype.rotate = function(r) {
    r = this.radians(r);
    this.curElement.context.rotate(r);
    var m = this.matrices[this.matrices.length-1];
    var c = Math.cos(r);
    var s = Math.sin(r);
    var m11 = m[0] * c + m[2] * s;
    var m12 = m[1] * c + m[3] * s;
    var m21 = m[0] * -s + m[2] * c;
    var m22 = m[1] * -s + m[3] * c;
    m[0] = m11;
    m[1] = m12;
    m[2] = m21;
    m[3] = m22;

    return this;
  };

  Processing.prototype.rotateX = function() {


    // return this;
  };

  Processing.prototype.rotateY = function() {


    // return this;
  };

  Processing.prototype.rotateZ = function() {


    // return this;
  };

  Processing.prototype.scale = function() {
    var x = 1.0, y = 1.0;
    if (arguments.length == 1) {
      x = y = arguments[0];
    } else {
      x = arguments[0];
      y = arguments[1];
    }
    this.curElement.context.scale(x, y);
    var m = this.matrices[this.matrices.length-1];
    m[0] *= x;
    m[1] *= x;
    m[2] *= y;
    m[3] *= y;

    return this;
  };

  Processing.prototype.shearX = function(angle) {
    this.curElement.context.transform(1, 0, tan(angle), 1, 0, 0);
    var m = this.matrices[this.matrices.length-1];
    m = linearAlgebra.pMultiplyMatrix(m, [1, 0, tan(angle), 1, 0, 0]);

    return this;
  };

  Processing.prototype.shearY = function(angle) {
    this.curElement.context.transform(1, tan(angle), 0, 1, 0, 0);
    var m = this.matrices[this.matrices.length-1];
    m = linearAlgebra.pMultiplyMatrix(m, [1, tan(angle), 0, 1, 0, 0]);

    return this;
  };

  Processing.prototype.translate = function(x, y) {
    this.curElement.context.translate(x, y);
    var m = this.matrices[this.matrices.length-1];
    m[4] += m[0] * x + m[2] * y;
    m[5] += m[1] * x + m[3] * y;

    return this;
  };

  return Processing;

});
define('src/typography/attributes',['require','../core/core','../var/constants'],function (require) {

  

  var Processing = require('../core/core');
  var constants = require('../var/constants');

  Processing.prototype.textAlign = function(a) {
    if (a == constants.LEFT || a == constants.RIGHT || a == constants.CENTER) {
      this.curElement.context.textAlign = a;
    }
  };

  Processing.prototype.textFont = function(str) {
    this._setProperty('_textFont', str); //pend temp?
  };

  Processing.prototype.textHeight = function(s) {
    return this.curElement.context.measureText(s).height;
  };

  Processing.prototype.textLeading = function(l) {
    this._setProperty('_textLeading', l);
  };

  Processing.prototype.textSize = function(s) {
    this._setProperty('_textSize', s);
  };

  Processing.prototype.textStyle = function(s) {
    if (s == constants.NORMAL || s == constants.ITALIC || s == constants.BOLD) {
      this._setProperty('_textStyle', s);
    }
  };

  Processing.prototype.textWidth = function(s) {
    return this.curElement.context.measureText(s).width;
  };

  return Processing;

});

define('src/typography/loading_displaying',['require','../core/core','../var/canvas'],function (require) {

  

  var Processing = require('../core/core');
  var canvas = require('../var/canvas');

  /*
    text(str, x, y)
    text(str, x1, y1, x2, y2)
  */
  Processing.prototype.text = function() {

    this.curElement.context.font=this._textStyle+' '+this._textSize+'px '+this._textFont;

    if (arguments.length == 3) {

      this.curElement.context.fillText(arguments[0], arguments[1], arguments[2]);
      this.curElement.context.strokeText(arguments[0], arguments[1], arguments[2]);

    } else if (arguments.length == 5) {

      var words = arguments[0].split(' ');
      var line = '';
      var vals = this.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], this.rectMode);

      vals.y += this.textLeading;

      for(var n = 0; n < words.length; n++) {

        var testLine = line + words[n] + ' ';
        var metrics = this.curElement.context.measureText(testLine);
        var testWidth = metrics.width;

        if (vals.y > vals.h) {

          break;

        } else if (testWidth > vals.w && n > 0) {

          this.curElement.context.fillText(line, vals.x, vals.y);
          this.curElement.context.strokeText(line, vals.x, vals.y);
          line = words[n] + ' ';
          vals.y += this.textLeading;

        } else {

          line = testLine;

        }
      }

      if (vals.y <= vals.h) {

        this.curElement.context.fillText(line, vals.x, vals.y);
        this.curElement.context.strokeText(line, vals.x, vals.y);
      }
    }
  };

  return Processing;

});

define('src/p5',['require','./core/core','./color/creating_reading','./color/setting','./data/array_functions','./data/string_functions','./dom/manipulate','./dom/pelement','./environment/environment','./image/image','./image/loading_displaying','./input/files','./input/keyboard','./input/mouse','./input/time_date','./input/touch','./math/calculation','./math/pvector','./math/random','./math/trigonometry','./output/files','./output/image','./output/text_area','./shape/2d_primitives','./shape/attributes','./shape/curves','./shape/vertex','./structure/structure','./transform/transform','./typography/attributes','./typography/loading_displaying'],function (require) {

  

  var Processing = require('./core/core');
  require('./color/creating_reading');
  require('./color/setting');
  require('./data/array_functions');
  require('./data/string_functions');
  require('./dom/manipulate');
  require('./dom/pelement');
  require('./environment/environment');
  require('./image/image');
  require('./image/loading_displaying');
  require('./input/files');
  require('./input/keyboard');
  require('./input/mouse');
  require('./input/time_date');
  require('./input/touch');
  require('./math/calculation');
  require('./math/pvector');
  require('./math/random');
  require('./math/trigonometry');
  require('./output/files');
  require('./output/image');
  require('./output/text_area');
  require('./shape/2d_primitives');
  require('./shape/attributes');
  require('./shape/curves');
  require('./shape/vertex');
  require('./structure/structure');
  require('./transform/transform');
  require('./typography/attributes');
  require('./typography/loading_displaying');

  if (document.readyState === 'complete') {
    Processing._init();
  } else {
    window.addEventListener('load', Processing._init , false);
  }

  window.Processing = Processing;

  return Processing;

});
require(["src/p5"]);
}());