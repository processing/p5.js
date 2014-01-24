(function () {
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
            NORMAL: 'normal',
            ITALIC: 'italic',
            BOLD: 'bold'
        };
    }({});
var core = function (require, shim, constants) {
        'use strict';
        var constants = constants;
        var Processing = function (canvs, sketchProc) {
            var self = this;
            this.startTime = new Date().getTime();
            this.preload_count = 0;
            this.isGlobal = false;
            this.frameCount = 0;
            this._frameRate = 30;
            this.focused = true;
            this.shapeKind = null;
            this.shapeInited = false;
            this.mouseX = 0;
            this.mouseY = 0;
            this.pmouseX = 0;
            this.pmouseY = 0;
            this.mouseButton = 0;
            this.key = '';
            this.keyCode = 0;
            this.keyDown = false;
            this.touchX = 0;
            this.touchY = 0;
            this.pWriters = [];
            this._textLeading = 15;
            this._textFont = 'sans-serif';
            this._textSize = 12;
            this._textStyle = constants.NORMAL;
            this.curElement = null;
            this.matrices = [[
                    1,
                    0,
                    0,
                    1,
                    0,
                    0
                ]];
            this.settings = {
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
            if (!sketchProc) {
                this.isGlobal = true;
                for (var method in Processing.prototype) {
                    window[method] = Processing.prototype[method].bind(this);
                }
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
        Processing._init = function () {
            if (window.setup && typeof window.setup === 'function') {
                new Processing();
            }
        };
        Processing.prototype._start = function () {
            this.createGraphics(800, 600, true);
            var preload = this.preload || window.preload;
            var context = this.isGlobal ? window : this;
            if (preload) {
                context.loadJSON = function (path) {
                    return this.preloadFunc('loadJSON', path);
                };
                context.loadStrings = function (path) {
                    return this.preloadFunc('loadStrings', path);
                };
                context.loadXML = function (path) {
                    return this.preloadFunc('loadXML', path);
                };
                context.loadImage = function (path) {
                    return this.preloadFunc('loadImage', path);
                };
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
        Processing.prototype.preloadFunc = function (func, path) {
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
        Processing.prototype._setup = function () {
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
                setTimeout(function () {
                    window.requestDraw(self._drawSketch.bind(self));
                }, 1000 / self.frameRate());
            }
            if (typeof userDraw === 'function') {
                userDraw();
            }
            self.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
        };
        Processing.prototype._runFrames = function () {
            var self = this;
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            this.updateInterval = setInterval(function () {
                self._setProperty('frameCount', self.frameCount + 1);
            }, 1000 / self.frameRate());
        };
        Processing.prototype._applyDefaults = function () {
            this.curElement.context.fillStyle = '#FFFFFF';
            this.curElement.context.strokeStyle = '#000000';
            this.curElement.context.lineCap = constants.ROUND;
        };
        Processing.prototype._setProperty = function (prop, value) {
            this[prop] = value;
            if (this.isGlobal) {
                window[prop] = value;
            }
        };
        return Processing;
    }({}, shim, constants);
var mathpvector = function (require) {
        'use strict';
        function PVector(x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
        PVector.prototype.set = function (x, y, z) {
            if (x instanceof PVector) {
                return this.set(x.x, x.y, x.z);
            }
            if (x instanceof Array) {
                return this.set(x[0], x[1], x[2]);
            }
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        };
        PVector.prototype.get = function () {
            return new PVector(this.x, this.y, this.z);
        };
        PVector.prototype.add = function (x, y, z) {
            if (x instanceof PVector) {
                return this.add(x.x, x.y, x.z);
            }
            if (x instanceof Array) {
                return this.add(x[0], x[1], x[2]);
            }
            this.x += x || 0;
            this.y += y || 0;
            this.z += z || 0;
            return this;
        };
        PVector.prototype.sub = function (x, y, z) {
            if (x instanceof PVector) {
                return this.sub(x.x, x.y, x.z);
            }
            if (x instanceof Array) {
                return this.sub(x[0], x[1], x[2]);
            }
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
            return x * x + y * y + z * z;
        };
        PVector.prototype.dot = function (x, y, z) {
            if (x instanceof PVector) {
                return this.dot(x.x, x.y, x.z);
            }
            return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
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
            if (mSq > l * l) {
                this.div(Math.sqrt(mSq));
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
            var newHeading = this.heading() + a;
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
            return [
                this.x || 0,
                this.y || 0,
                this.z || 0
            ];
        };
        PVector.random2D = function () {
        };
        PVector.random3D = function () {
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
        PVector.dist = function (v1, v2) {
            return v1.dist(v2);
        };
        PVector.lerp = function (v1, v2, amt) {
            return v1.get().lerp(v2, amt);
        };
        PVector.angleBetween = function (v1, v2) {
            return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
        };
        return PVector;
    }({});
var mathcalculation = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.abs = Math.abs;
        Processing.prototype.ceil = Math.ceil;
        Processing.prototype.constrain = function (n, l, h) {
            return this.max(this.min(n, h), l);
        };
        Processing.prototype.dist = function (x1, y1, x2, y2) {
            var xs = x2 - x1;
            var ys = y2 - y1;
            return Math.sqrt(xs * xs + ys * ys);
        };
        Processing.prototype.exp = Math.exp;
        Processing.prototype.floor = Math.floor;
        Processing.prototype.lerp = function (start, stop, amt) {
            return amt * (stop - start) + start;
        };
        Processing.prototype.log = Math.log;
        Processing.prototype.mag = function (x, y) {
            return Math.sqrt(x * x + y * y);
        };
        Processing.prototype.map = function (n, start1, stop1, start2, stop2) {
            return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        };
        Processing.prototype.max = Math.max;
        Processing.prototype.min = Math.min;
        Processing.prototype.norm = function (n, start, stop) {
            return this.map(n, start, stop, 0, 1);
        };
        Processing.prototype.pow = Math.pow;
        Processing.prototype.round = Math.round;
        Processing.prototype.sq = function (n) {
            return n * n;
        };
        Processing.prototype.sqrt = Math.sqrt;
        return Processing;
    }({}, core);
var colorcreating_reading = function (require, core, mathcalculation) {
        'use strict';
        var Processing = core;
        var calculation = mathcalculation;
        Processing.prototype.alpha = function (rgb) {
            if (rgb.length > 3) {
                return rgb[3];
            } else {
                return 255;
            }
        };
        Processing.prototype.blue = function (rgb) {
            if (rgb.length > 2) {
                return rgb[2];
            } else {
                return 0;
            }
        };
        Processing.prototype.brightness = function (hsv) {
            if (hsv.length > 2) {
                return hsv[2];
            } else {
                return 0;
            }
        };
        Processing.prototype.color = function () {
            return this.getNormalizedColor(arguments);
        };
        Processing.prototype.green = function (rgb) {
            if (rgb.length > 2) {
                return rgb[1];
            } else {
                return 0;
            }
        };
        Processing.prototype.hue = function (hsv) {
            if (hsv.length > 2) {
                return hsv[0];
            } else {
                return 0;
            }
        };
        Processing.prototype.lerpColor = function (c1, c2, amt) {
            var c = [];
            for (var i = 0; i < c1.length; i++) {
                c.push(calculation.lerp(c1[i], c2[i], amt));
            }
            return c;
        };
        Processing.prototype.red = function (rgb) {
            if (rgb.length > 2) {
                return rgb[0];
            } else {
                return 0;
            }
        };
        Processing.prototype.saturation = function (hsv) {
            if (hsv.length > 2) {
                return hsv[1];
            } else {
                return 0;
            }
        };
        return Processing;
    }({}, core, mathcalculation);
var colorsetting = function (require, core, constants) {
        'use strict';
        var Processing = core;
        var constants = constants;
        Processing.prototype.background = function () {
            var c = this.getNormalizedColor(arguments);
            var curFill = this.curElement.context.fillStyle;
            this.curElement.context.fillStyle = this.getCSSRGBAColor(c);
            this.curElement.context.fillRect(0, 0, this.width, this.height);
            this.curElement.context.fillStyle = curFill;
        };
        Processing.prototype.clear = function () {
            this.curElement.context.clearRect(0, 0, this.width, this.height);
        };
        Processing.prototype.colorMode = function (mode) {
            if (mode === constants.RGB || mode === constants.HSB) {
                this.settings.colorMode = mode;
            }
        };
        Processing.prototype.fill = function () {
            var c = this.getNormalizedColor(arguments);
            this.curElement.context.fillStyle = this.getCSSRGBAColor(c);
        };
        Processing.prototype.noFill = function () {
            this.curElement.context.fillStyle = 'rgba(0,0,0,0)';
        };
        Processing.prototype.noStroke = function () {
            this.curElement.context.strokeStyle = 'rgba(0,0,0,0)';
        };
        Processing.prototype.stroke = function () {
            var c = this.getNormalizedColor(arguments);
            this.curElement.context.strokeStyle = this.getCSSRGBAColor(c);
        };
        Processing.prototype.getNormalizedColor = function (args) {
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
            if (this.settings.colorMode === constants.HSB) {
                rgba = this.hsv2rgb(r, g, b).concat(a);
            } else {
                rgba = [
                    r,
                    g,
                    b,
                    a
                ];
            }
            return rgba;
        };
        Processing.prototype.hsv2rgb = function (h, s, b) {
            return [
                h,
                s,
                b
            ];
        };
        Processing.prototype.getCSSRGBAColor = function (arr) {
            var a = arr.map(function (val) {
                    return Math.floor(val);
                });
            var alpha = a[3] ? a[3] / 255 : 1;
            return 'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + alpha + ')';
        };
        return Processing;
    }({}, core, constants);
var dataarray_functions = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.append = function (array, value) {
            array.push(value);
            return array;
        };
        Processing.prototype.arrayCopy = function (src, srcPosition, dst, dstPosition, length) {
            if (typeof length !== 'undefined') {
                for (var i = srcPosition; i < Math.min(srcPosition + length, src.length); i++) {
                    dst[dstPosition + i] = src[i];
                }
            } else if (typeof dst !== 'undefined') {
                srcPosition = src.slice(0, Math.min(dst, src.length));
            } else {
                srcPosition = src.slice(0);
            }
        };
        Processing.prototype.concat = function (list0, list1) {
            return list0.concat(list1);
        };
        Processing.prototype.reverse = function (list) {
            return list.reverse();
        };
        Processing.prototype.shorten = function (list) {
            list.pop();
            return list;
        };
        Processing.prototype.sort = function (list, count) {
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
        Processing.prototype.splice = function (list, value, index) {
            return list.splice(index, 0, value);
        };
        Processing.prototype.subset = function (list, start, count) {
            if (typeof count !== 'undefined') {
                return list.slice(start, start + count);
            } else {
                return list.slice(start, list.length - 1);
            }
        };
        return Processing;
    }({}, core);
var datastring_functions = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.join = function (list, separator) {
            return list.join(separator);
        };
        Processing.prototype.match = function (str, reg) {
            return str.match(reg);
        };
        Processing.prototype.matchAll = function (str, reg) {
            var re = new RegExp(reg, 'g');
            var match = re.exec(str);
            var matches = [];
            while (match !== null) {
                matches.push(match);
                match = re.exec(str);
            }
            return matches;
        };
        Processing.prototype.nf = function () {
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
        Processing.prototype.nfc = function () {
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
        Processing.prototype.nfp = function () {
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
        Processing.prototype.nfs = function () {
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
        Processing.prototype.split = function (str, delim) {
            return str.split(delim);
        };
        Processing.prototype.splitTokens = function () {
            var d = arguments.length > 0 ? arguments[1] : /\s/g;
            return arguments[0].split(d).filter(function (n) {
                return n;
            });
        };
        Processing.prototype.trim = function (str) {
            if (str instanceof Array) {
                return str.map(this.trim);
            } else {
                return str.trim();
            }
        };
        return Processing;
    }({}, core);
var inputmouse = function (require, core, constants) {
        'use strict';
        var Processing = core;
        var constants = constants;
        Processing.prototype.isMousePressed = Processing.prototype.mouseIsPressed = function () {
            return this.mousePressed;
        };
        Processing.prototype.updateMouseCoords = function (e) {
            this._setProperty('pmouseX', this.mouseX);
            this._setProperty('pmouseY', this.mouseY);
            this._setProperty('mouseX', e.pageX);
            this._setProperty('mouseY', e.pageY);
        };
        Processing.prototype.setMouseButton = function (e) {
            if (e.button === 1) {
                this._setProperty('mouseButton', constants.CENTER);
            } else if (e.button === 2) {
                this._setProperty('mouseButton', constants.RIGHT);
            } else {
                this._setProperty('mouseButton', constants.LEFT);
            }
        };
        Processing.prototype.onmousemove = function (e) {
            this.updateMouseCoords(e);
            if (!this.mousePressed && typeof this.mouseMoved === 'function') {
                this.mouseMoved(e);
            }
            if (this.mousePressed && typeof this.mouseDragged === 'function') {
                this.mouseDragged(e);
            }
        };
        Processing.prototype.onmousedown = function (e) {
            this.mousePressed = true;
            this.setMouseButton(e);
            if (typeof this.mousePressed === 'function') {
                this.mousePressed(e);
            }
        };
        Processing.prototype.onmouseup = function (e) {
            this.mousePressed = false;
            if (typeof this.mouseReleased === 'function') {
                this.mouseReleased(e);
            }
        };
        Processing.prototype.onmouseclick = function (e) {
            if (typeof this.mouseClicked === 'function') {
                this.mouseClicked(e);
            }
        };
        Processing.prototype.onmousewheel = function (e) {
            if (typeof this.mouseWheel === 'function') {
                this.mouseWheel(e);
            }
        };
        return Processing;
    }({}, core, constants);
var inputtouch = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.setTouchPoints = function (e) {
            this._setProperty('touchX', e.changedTouches[0].pageX);
            this._setProperty('touchY', e.changedTouches[0].pageY);
            var touches = [];
            for (var i = 0; i < e.changedTouches.length; i++) {
                var ct = e.changedTouches[i];
                touches[i] = {
                    x: ct.pageX,
                    y: ct.pageY
                };
            }
            this._setProperty('touches', touches);
        };
        Processing.prototype.ontouchstart = function (e) {
            this.setTouchPoints(e);
            if (typeof this.touchStarted === 'function') {
                this.touchStarted(e);
            }
            var m = typeof touchMoved === 'function';
            if (m) {
                e.preventDefault();
            }
        };
        Processing.prototype.ontouchmove = function (e) {
            this.setTouchPoints(e);
            if (typeof this.touchMoved === 'function') {
                this.touchMoved(e);
            }
        };
        Processing.prototype.ontouchend = function (e) {
            this.setTouchPoints(e);
            if (typeof this.touchEnded === 'function') {
                this.touchEnded(e);
            }
        };
        return Processing;
    }({}, core);
var dompelement = function (require, constants) {
        var constants = constants;
        function PElement(elt, pInst) {
            this.elt = elt;
            this.pInst = pInst;
            this.width = this.elt.offsetWidth;
            this.height = this.elt.offsetHeight;
            this.elt.style.position = 'absolute';
            this.x = 0;
            this.y = 0;
            this.elt.style.left = this.x + 'px';
            this.elt.style.top = this.y + 'px';
            if (elt instanceof HTMLCanvasElement) {
                this.context = elt.getContext('2d');
            }
        }
        PElement.prototype.html = function (html) {
            this.elt.innerHTML = html;
        };
        PElement.prototype.position = function (x, y) {
            this.x = x;
            this.y = y;
            this.elt.style.left = x + 'px';
            this.elt.style.top = y + 'px';
        };
        PElement.prototype.size = function (w, h) {
            var aW = w;
            var aH = h;
            var AUTO = constants.AUTO;
            if (aW !== AUTO || aH !== AUTO) {
                if (aW === AUTO) {
                    aW = h * this.elt.width / this.elt.height;
                } else if (aH === AUTO) {
                    aH = w * this.elt.height / this.elt.width;
                }
                if (this.elt instanceof HTMLCanvasElement) {
                    this.elt.setAttribute('width', aW);
                    this.elt.setAttribute('height', aH);
                } else {
                    this.elt.style.width = aW;
                    this.elt.style.height = aH;
                }
                this.width = this.elt.offsetWidth;
                this.height = this.elt.offsetHeight;
                if (this.pInst.curElement.elt === this.elt) {
                    this.pInst.width = this.elt.offsetWidth;
                    this.pInst.height = this.elt.offsetHeight;
                }
            }
        };
        PElement.prototype.style = function (s) {
            this.elt.style.cssText += s;
        };
        PElement.prototype.id = function (id) {
            this.elt.id = id;
        };
        PElement.prototype.class = function (c) {
            this.elt.className = c;
        };
        PElement.prototype.show = function () {
            this.elt.style.display = 'block';
        };
        PElement.prototype.hide = function () {
            this.elt.style.display = 'none';
        };
        PElement.prototype.mousePressed = function (fxn) {
            var _this = this;
            this.elt.addEventListener('click', function (e) {
                fxn(e, _this);
            }, false);
        };
        PElement.prototype.mouseOver = function (fxn) {
            var _this = this;
            this.elt.addEventListener('mouseover', function (e) {
                fxn(e, _this);
            }, false);
        };
        PElement.prototype.mouseOut = function (fxn) {
            var _this = this;
            this.elt.addEventListener('mouseout', function (e) {
                fxn(e, _this);
            }, false);
        };
        return PElement;
    }({}, constants);
var dommanipulate = function (require, core, inputmouse, inputtouch, dompelement) {
        var Processing = core;
        var PElement = dompelement;
        Processing.prototype.createGraphics = function (w, h, isDefault, targetID) {
            var c = document.createElement('canvas');
            c.setAttribute('width', w);
            c.setAttribute('height', h);
            if (isDefault) {
                c.id = 'defaultCanvas';
                document.body.appendChild(c);
            } else {
                var defaultCanvas = document.getElementById('defaultCanvas');
                if (defaultCanvas) {
                    defaultCanvas.parentNode.removeChild(defaultCanvas);
                }
                if (targetID) {
                    var target = document.getElementById(targetID);
                    if (target) {
                        target.appendChild(c);
                    } else {
                        document.body.appendChild(c);
                    }
                } else {
                    document.body.appendChild(c);
                }
            }
            var cnv = new PElement(c, this);
            this.context(cnv);
            this._applyDefaults();
            return cnv;
        };
        Processing.prototype.createHTML = function (html) {
            var elt = document.createElement('div');
            elt.innerHTML = html;
            document.body.appendChild(elt);
            var c = new PElement(elt, this);
            this.context(c);
            return c;
        };
        Processing.prototype.createHTMLImage = function (src, alt) {
            var elt = document.createElement('img');
            elt.src = src;
            if (typeof alt !== 'undefined') {
                elt.alt = alt;
            }
            document.body.appendChild(elt);
            var c = new PElement(elt, this);
            this.context(c);
            return c;
        };
        Processing.prototype.find = function (e) {
            var res = document.getElementById(e);
            if (res) {
                return [new PElement(res, this)];
            } else {
                res = document.getElementsByClassName(e);
                if (res) {
                    var arr = [];
                    for (var i = 0, resl = res.length; i !== resl; i++) {
                        arr.push(new PElement(res[i], this));
                    }
                    return arr;
                }
            }
            return [];
        };
        Processing.prototype.context = function (e) {
            var obj;
            if (typeof e === 'string' || e instanceof String) {
                var elt = document.getElementById(e);
                obj = elt ? new PElement(elt, this) : null;
            } else {
                obj = e;
            }
            if (typeof obj !== 'undefined') {
                this.curElement = obj;
                this._setProperty('width', obj.elt.offsetWidth);
                this._setProperty('height', obj.elt.offsetHeight);
                this.curElement.onfocus = function () {
                    this.focused = true;
                };
                this.curElement.onblur = function () {
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
                if (typeof this.curElement.context !== 'undefined') {
                    this.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
                }
            }
        };
        return Processing;
    }({}, core, inputmouse, inputtouch, dompelement);
var environment = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.cursor = function (type) {
            this.curElement.style.cursor = type || 'auto';
        };
        Processing.prototype.frameRate = function (fps) {
            if (fps == null) {
                return this._frameRate;
            } else {
                this._setProperty('_frameRate', fps);
                this._runFrames();
                return this;
            }
        };
        Processing.prototype.getFrameRate = function () {
            return this.frameRate();
        };
        Processing.prototype.setFrameRate = function (fps) {
            return this.frameRate(fps);
        };
        Processing.prototype.noCursor = function () {
            this.curElement.style.cursor = 'none';
        };
        return Processing;
    }({}, core);
var image = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.createImage = function (w, h, format) {
            return new PImage(w, h, this);
        };
        Processing.prototype.loadImage = function (path, callback) {
            var pimg = new PImage(null, null, this);
            pimg.sourceImage = new Image();
            pimg.sourceImage.onload = function () {
                pimg.width = pimg.sourceImage.width;
                pimg.height = pimg.sourceImage.height;
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = pimg.width;
                canvas.height = pimg.height;
                ctx.drawImage(pimg.sourceImage, 0, 0);
                if (typeof callback !== 'undefined') {
                    callback();
                }
            };
            pimg.sourceImage.src = path;
            return pimg;
        };
        Processing.prototype.preloadImage = function (path) {
            this.preload_count++;
            return this.loadImage(path, function () {
                if (--this.preload_count === 0) {
                    this.setup();
                }
            });
        };
        function PImage(w, h, pInst) {
            this.width = w || 1;
            this.height = h || 1;
            this.pInst = pInst;
            this.pixels = [];
        }
        PImage.prototype.loadPixels = function () {
            this.pixels = [];
            var imageData = this.pInst.curElement.context.createImageData(this.width, this.height);
            for (var i = 3, len = imageData.length; i < len; i += 4) {
                imageData[i] = 255;
            }
            var data = this.imageData.data;
            for (var j = 0; j < data.length; j += 4) {
                this.pixels.push([
                    data[j],
                    data[j + 1],
                    data[j + 2],
                    data[j + 3]
                ]);
            }
        };
        PImage.prototype.resize = function () {
        };
        PImage.prototype.get = function (x, y, w, h) {
            var wp = w ? w : 1;
            var hp = h ? h : 1;
            var vals = [];
            for (var j = y; j < y + hp; j++) {
                for (var i = x; i < x + wp; i++) {
                    vals.push(this.pixels[j * this.width + i]);
                }
            }
        };
        PImage.prototype.set = function (x, y, val) {
            var ind = y * this.width + x;
            if (typeof val.image === 'undefined') {
                if (ind < this.pixels.length) {
                    this.pixels[ind] = val;
                }
            } else {
            }
        };
        PImage.prototype.filter = function () {
        };
        PImage.prototype.copy = function () {
        };
        PImage.prototype.blend = function () {
        };
        PImage.prototype.save = function () {
        };
        return PImage;
    }({}, core);
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
            }
        };
    }({}, constants);
var imageloading_displaying = function (require, core, canvas, constants) {
        'use strict';
        var Processing = core;
        var canvas = canvas;
        var constants = constants;
        Processing.prototype.image = function () {
            var vals;
            if (arguments.length < 5) {
                vals = canvas.modeAdjust(arguments[1], arguments[2], arguments[0].width, arguments[0].height, this.settings.imageMode);
            } else {
                vals = canvas.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], this.settings.imageMode);
            }
            this.curElement.context.drawImage(arguments[0].sourceImage, vals.x, vals.y, vals.w, vals.h);
        };
        Processing.prototype.imageMode = function (m) {
            if (m === constants.CORNER || m === constants.CORNERS || m === constants.CENTER) {
                this.settings.imageMode = m;
            }
        };
        Processing.prototype.blend = function () {
        };
        Processing.prototype.copy = function () {
        };
        Processing.prototype.filter = function () {
        };
        Processing.prototype.get = function (x, y) {
            var width = this.width;
            var height = this.height;
            var pix = this.curElement.context.getImageData(0, 0, width, height).data;
            if (typeof x !== 'undefined' && typeof y !== 'undefined') {
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    var offset = 4 * y * width + 4 * x;
                    var c = [
                            pix[offset],
                            pix[offset + 1],
                            pix[offset + 2],
                            pix[offset + 3]
                        ];
                    return c;
                } else {
                    return [
                        0,
                        0,
                        0,
                        255
                    ];
                }
            } else {
                return [
                    0,
                    0,
                    0,
                    255
                ];
            }
        };
        Processing.prototype.loadPixels = function () {
            var width = this.width;
            var height = this.height;
            var a = this.curElement.context.getImageData(0, 0, width, height).data;
            var pixels = [];
            for (var i = 0; i < a.length; i += 4) {
                pixels.push([
                    a[i],
                    a[i + 1],
                    a[i + 2],
                    a[i + 3]
                ]);
            }
            this._setProperty('pixels', pixels);
        };
        Processing.prototype.set = function () {
        };
        Processing.prototype.updatePixels = function () {
        };
        return Processing;
    }({}, core, canvas, constants);
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
        http = xhr(o);
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
        var Processing = core;
        var reqwest = reqwest;
        Processing.prototype.createInput = function () {
        };
        Processing.prototype.createReader = function () {
        };
        Processing.prototype.loadBytes = function () {
        };
        Processing.prototype.loadJSON = function (path, callback) {
            var ret = [];
            var t = path.indexOf('http') === -1 ? 'json' : 'jsonp';
            reqwest({
                url: path,
                type: t,
                success: function (resp) {
                    for (var k in resp) {
                        ret[k] = resp[k];
                    }
                    if (typeof callback !== 'undefined') {
                        callback(resp);
                    }
                }
            });
            return ret;
        };
        Processing.prototype.loadStrings = function (path, callback) {
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
                        callback();
                    }
                }
            };
            req.send(null);
            return ret;
        };
        Processing.prototype.loadTable = function () {
        };
        Processing.prototype.loadXML = function (path, callback) {
            var ret = [];
            var self = this;
            self.temp = [];
            reqwest(path, function (resp) {
                self.log(resp);
                self.temp = resp;
                ret[0] = resp;
                if (typeof callback !== 'undefined') {
                    callback(resp);
                }
            });
            return ret;
        };
        Processing.prototype.open = function () {
        };
        Processing.prototype.parseXML = function () {
        };
        Processing.prototype.saveTable = function () {
        };
        Processing.prototype.selectFolder = function () {
        };
        Processing.prototype.selectInput = function () {
        };
        return Processing;
    }({}, core, reqwest);
var inputkeyboard = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.isKeyPressed = Processing.prototype.keyIsPressed = function () {
            return this.keyDown;
        };
        Processing.prototype.onkeydown = function (e) {
            var keyPressed = this.keyPressed || window.keyPressed;
            this._setProperty('keyDown', true);
            this._setProperty('keyCode', e.keyCode);
            this._setProperty('key', String.fromCharCode(e.keyCode));
            if (typeof keyPressed === 'function') {
                keyPressed(e);
            }
        };
        Processing.prototype.onkeyup = function (e) {
            var keyReleased = this.keyReleased || window.keyReleased;
            this._setProperty('keyDown', false);
            if (typeof keyReleased === 'function') {
                keyReleased(e);
            }
        };
        Processing.prototype.onkeypress = function (e) {
            var keyTyped = this.keyTyped || window.keyTyped;
            if (typeof keyTyped === 'function') {
                keyTyped(e);
            }
        };
        return Processing;
    }({}, core);
var inputtime_date = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.day = function () {
            return new Date().getDate();
        };
        Processing.prototype.hour = function () {
            return new Date().getHours();
        };
        Processing.prototype.minute = function () {
            return new Date().getMinutes();
        };
        Processing.prototype.millis = function () {
            return new Date().getTime() - this.startTime;
        };
        Processing.prototype.month = function () {
            return new Date().getMonth();
        };
        Processing.prototype.second = function () {
            return new Date().getSeconds();
        };
        Processing.prototype.year = function () {
            return new Date().getFullYear();
        };
        return Processing;
    }({}, core);
var mathrandom = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.random = function (x, y) {
            if (typeof x !== 'undefined' && typeof y !== 'undefined') {
                return (y - x) * Math.random() + x;
            } else if (typeof x !== 'undefined') {
                return x * Math.random();
            } else {
                return Math.random();
            }
        };
        return Processing;
    }({}, core);
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
var mathtrigonometry = function (require, core, polargeometry, constants) {
        'use strict';
        var Processing = core;
        var polarGeometry = polargeometry;
        var constants = constants;
        Processing.prototype.acos = Math.acos;
        Processing.prototype.asin = Math.asin;
        Processing.prototype.atan = Math.atan;
        Processing.prototype.atan2 = Math.atan2;
        Processing.prototype.cos = function (x) {
            return Math.cos(this.radians(x));
        };
        Processing.prototype.degrees = function (angle) {
            return this.settings.angleMode === constants.DEGREES ? angle : polarGeometry.radiansToDegrees(angle);
        };
        Processing.prototype.radians = function (angle) {
            return this.settings.angleMode === constants.RADIANS ? angle : polarGeometry.degreesToRadians(angle);
        };
        Processing.prototype.sin = function (x) {
            return Math.sin(this.radians(x));
        };
        Processing.prototype.tan = function (x) {
            return Math.tan(this.radians(x));
        };
        Processing.prototype.angleMode = function (mode) {
            if (mode === constants.DEGREES || mode === constants.RADIANS) {
                this.settings.angleMode = mode;
            }
        };
        return Processing;
    }({}, core, polargeometry, constants);
var outputfiles = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.beginRaw = function () {
        };
        Processing.prototype.beginRecord = function () {
        };
        Processing.prototype.createOutput = function () {
        };
        Processing.prototype.createWriter = function (name) {
            if (this.pWriters.indexOf(name) === -1) {
                this.pWriters.name = new this.PrintWriter(name);
            }
        };
        Processing.prototype.endRaw = function () {
        };
        Processing.prototype.endRecord = function () {
        };
        Processing.prototype.escape = function (content) {
            return content;
        };
        Processing.prototype.PrintWriter = function (name) {
            this.name = name;
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
                this.writeFile(this.content);
            };
        };
        Processing.prototype.saveBytes = function () {
        };
        Processing.prototype.saveJSONArray = function () {
        };
        Processing.prototype.saveJSONObject = function () {
        };
        Processing.prototype.saveStream = function () {
        };
        Processing.prototype.saveStrings = function (list) {
            this.writeFile(list.join('\n'));
        };
        Processing.prototype.saveXML = function () {
        };
        Processing.prototype.selectOutput = function () {
        };
        Processing.prototype.writeFile = function (content) {
            this.open('data:text/json;charset=utf-8,' + this.escape(content), 'download');
        };
        return Processing;
    }({}, core);
var outputimage = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.save = function () {
            this.open(this.curElement.elt.toDataURL('image/png'));
        };
        return Processing;
    }({}, core);
var log = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.log = function () {
            if (window.console && console.log) {
                console.log.apply(console, arguments);
            }
        };
        return Processing;
    }({}, core);
var outputtext_area = function (require, core, log) {
        'use strict';
        var Processing = core;
        Processing.prototype.print = Processing.prototype.log;
        Processing.prototype.println = Processing.prototype.log;
        return Processing;
    }({}, core, log);
var shape2d_primitives = function (require, core, canvas, constants) {
        'use strict';
        var Processing = core;
        var canvas = canvas;
        var constants = constants;
        Processing.prototype.arc = function () {
        };
        Processing.prototype.ellipse = function (a, b, c, d) {
            var vals = canvas.modeAdjust(a, b, c, d, this.settings.ellipseMode);
            var kappa = 0.5522848, ox = vals.w / 2 * kappa, oy = vals.h / 2 * kappa, xe = vals.x + vals.w, ye = vals.y + vals.h, xm = vals.x + vals.w / 2, ym = vals.y + vals.h / 2;
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
        Processing.prototype.line = function (x1, y1, x2, y2) {
            if (this.curElement.context.strokeStyle === 'rgba(0,0,0,0)') {
                return;
            }
            this.curElement.context.beginPath();
            this.curElement.context.moveTo(x1, y1);
            this.curElement.context.lineTo(x2, y2);
            this.curElement.context.stroke();
            return this;
        };
        Processing.prototype.point = function (x, y) {
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
                this.curElement.context.arc(x, y, this.curElement.context.lineWidth / 2, 0, constants.TWO_PI, false);
                this.curElement.context.fill();
            } else {
                this.curElement.context.fillRect(x, y, 1, 1);
            }
            this.curElement.context.fillStyle = f;
            return this;
        };
        Processing.prototype.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
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
        Processing.prototype.rect = function (a, b, c, d) {
            var vals = canvas.modeAdjust(a, b, c, d, this.settings.rectMode);
            this.curElement.context.beginPath();
            this.curElement.context.rect(vals.x, vals.y, vals.w, vals.h);
            this.curElement.context.fill();
            this.curElement.context.stroke();
            return this;
        };
        Processing.prototype.triangle = function (x1, y1, x2, y2, x3, y3) {
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
    }({}, core, canvas, constants);
var shapeattributes = function (require, core, constants) {
        'use strict';
        var Processing = core;
        var constants = constants;
        Processing.prototype.ellipseMode = function (m) {
            if (m === constants.CORNER || m === constants.CORNERS || m === constants.RADIUS || m === constants.CENTER) {
                this.settings.ellipseMode = m;
            }
            return this;
        };
        Processing.prototype.noSmooth = function () {
            this.curElement.context.mozImageSmoothingEnabled = false;
            this.curElement.context.webkitImageSmoothingEnabled = false;
            return this;
        };
        Processing.prototype.rectMode = function (m) {
            if (m === constants.CORNER || m === constants.CORNERS || m === constants.RADIUS || m === constants.CENTER) {
                this.settings.rectMode = m;
            }
            return this;
        };
        Processing.prototype.smooth = function () {
            this.curElement.context.mozImageSmoothingEnabled = true;
            this.curElement.context.webkitImageSmoothingEnabled = true;
            return this;
        };
        Processing.prototype.strokeCap = function (cap) {
            if (cap === constants.ROUND || cap === constants.SQUARE || cap === constants.PROJECT) {
                this.curElement.context.lineCap = cap;
            }
            return this;
        };
        Processing.prototype.strokeJoin = function (join) {
            if (join === constants.ROUND || join === constants.BEVEL || join === constants.MITER) {
                this.curElement.context.lineJoin = join;
            }
            return this;
        };
        Processing.prototype.strokeWeight = function (w) {
            if (typeof w === 'undefined' || w === 0) {
                this.curElement.context.lineWidth = 0.0001;
            } else {
                this.curElement.context.lineWidth = w;
            }
            return this;
        };
        return Processing;
    }({}, core, constants);
var shapecurves = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.bezier = function (x1, y1, x2, y2, x3, y3, x4, y4) {
            this.curElement.context.beginPath();
            this.curElement.context.moveTo(x1, y1);
            this.curElement.context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
            this.curElement.context.stroke();
            return this;
        };
        Processing.prototype.bezierDetail = function () {
        };
        Processing.prototype.bezierPoint = function () {
        };
        Processing.prototype.bezierTangent = function () {
        };
        Processing.prototype.curve = function () {
        };
        Processing.prototype.curveDetail = function () {
        };
        Processing.prototype.curvePoint = function () {
        };
        Processing.prototype.curveTangent = function () {
        };
        Processing.prototype.curveTightness = function () {
        };
        return Processing;
    }({}, core);
var shapevertex = function (require, core, constants) {
        'use strict';
        var Processing = core;
        var constants = constants;
        Processing.prototype.beginContour = function () {
        };
        Processing.prototype.beginShape = function (kind) {
            if (kind === constants.POINTS || kind === constants.LINES || kind === constants.TRIANGLES || kind === constants.TRIANGLE_FAN || kind === constants.TRIANGLE_STRIP || kind === constants.QUADS || kind === constants.QUAD_STRIP) {
                this.shapeKind = kind;
            } else {
                this.shapeKind = null;
            }
            this.shapeInited = true;
            this.curElement.context.beginPath();
            return this;
        };
        Processing.prototype.bezierVertex = function (x1, y1, x2, y2, x3, y3) {
            this.curElement.context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
            return this;
        };
        Processing.prototype.curveVertex = function () {
        };
        Processing.prototype.endContour = function () {
        };
        Processing.prototype.endShape = function (mode) {
            if (mode === constants.CLOSE) {
                this.curElement.context.closePath();
                this.curElement.context.fill();
            }
            this.curElement.context.stroke();
            return this;
        };
        Processing.prototype.quadraticVertex = function (cx, cy, x3, y3) {
            this.curElement.context.quadraticCurveTo(cx, cy, x3, y3);
            return this;
        };
        Processing.prototype.vertex = function (x, y) {
            if (this.shapeInited) {
                this.curElement.context.moveTo(x, y);
            } else {
                this.curElement.context.lineTo(x, y);
            }
            this.shapeInited = false;
            return this;
        };
        return Processing;
    }({}, core, constants);
var structure = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.exit = function () {
            throw 'Not implemented';
        };
        Processing.prototype.noLoop = function () {
            this.settings.loop = false;
        };
        Processing.prototype.loop = function () {
            this.settings.loop = true;
        };
        Processing.prototype.pushStyle = function () {
            this.styles.push({
                fillStyle: this.curElement.context.fillStyle,
                strokeStyle: this.curElement.context.strokeStyle,
                lineWidth: this.curElement.context.lineWidth,
                lineCap: this.curElement.context.lineCap,
                lineJoin: this.curElement.context.lineJoin,
                imageMode: this.settings.imageMode,
                rectMode: this.settings.rectMode,
                ellipseMode: this.settings.ellipseMode,
                colorMode: this.settings.colorMode,
                textAlign: this.curElement.context.textAlign,
                textFont: this.settings.textFont,
                textLeading: this.settings.textLeading,
                textSize: this.settings.textSize,
                textStyle: this.settings.textStyle
            });
        };
        Processing.prototype.popStyle = function () {
            var lastS = this.styles.pop();
            this.curElement.context.fillStyle = lastS.fillStyle;
            this.curElement.context.strokeStyle = lastS.strokeStyle;
            this.curElement.context.lineWidth = lastS.lineWidth;
            this.curElement.context.lineCap = lastS.lineCap;
            this.curElement.context.lineJoin = lastS.lineJoin;
            this.settings.imageMode = lastS.imageMode;
            this.settings.rectMode = lastS.rectMode;
            this.settings.ellipseMode = lastS.ellipseMode;
            this.settings.colorMode = lastS.colorMode;
            this.curElement.context.textAlign = lastS.textAlign;
            this.settings.textFont = lastS.textFont;
            this.settings.textLeading = lastS.textLeading;
            this.settings.textSize = lastS.textSize;
            this.settings.textStyle = lastS.textStyle;
        };
        Processing.prototype.redraw = function () {
            throw 'Not implemented';
        };
        Processing.prototype.size = function () {
            throw 'Not implemented';
        };
        return Processing;
    }({}, core);
var linearalgebra = function (require) {
        return {
            pMultiplyMatrix: function (m1, m2) {
                var result = [];
                var m1Length = m1.length;
                var m2Length = m2.length;
                var m10Length = m1[0].length;
                for (var j = 0; j < m2Length; j++) {
                    result[j] = [];
                    for (var k = 0; k < m10Length; k++) {
                        var sum = 0;
                        for (var i = 0; i < m1Length; i++) {
                            sum += m1[i][k] * m2[j][i];
                        }
                        result[j].push(sum);
                    }
                }
                return result;
            }
        };
    }({});
var transform = function (require, core, linearalgebra, log) {
        'use strict';
        var Processing = core;
        var linearAlgebra = linearalgebra;
        Processing.prototype.applyMatrix = function (n00, n01, n02, n10, n11, n12) {
            this.curElement.context.transform(n00, n01, n02, n10, n11, n12);
            var m = this.matrices[this.matrices.length - 1];
            m = linearAlgebra.pMultiplyMatrix(m, [
                n00,
                n01,
                n02,
                n10,
                n11,
                n12
            ]);
            return this;
        };
        Processing.prototype.popMatrix = function () {
            this.curElement.context.restore();
            this.matrices.pop();
            return this;
        };
        Processing.prototype.printMatrix = function () {
            this.log(this.matrices[this.matrices.length - 1]);
            return this;
        };
        Processing.prototype.pushMatrix = function () {
            this.curElement.context.save();
            this.matrices.push([
                1,
                0,
                0,
                1,
                0,
                0
            ]);
            return this;
        };
        Processing.prototype.resetMatrix = function () {
            this.curElement.context.setTransform();
            this.matrices[this.matrices.length - 1] = [
                1,
                0,
                0,
                1,
                0,
                0
            ];
            return this;
        };
        Processing.prototype.rotate = function (r) {
            r = this.radians(r);
            this.curElement.context.rotate(r);
            var m = this.matrices[this.matrices.length - 1];
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
        Processing.prototype.rotateX = function () {
        };
        Processing.prototype.rotateY = function () {
        };
        Processing.prototype.rotateZ = function () {
        };
        Processing.prototype.scale = function () {
            var x = 1, y = 1;
            if (arguments.length === 1) {
                x = y = arguments[0];
            } else {
                x = arguments[0];
                y = arguments[1];
            }
            this.curElement.context.scale(x, y);
            var m = this.matrices[this.matrices.length - 1];
            m[0] *= x;
            m[1] *= x;
            m[2] *= y;
            m[3] *= y;
            return this;
        };
        Processing.prototype.shearX = function (angle) {
            this.curElement.context.transform(1, 0, this.tan(angle), 1, 0, 0);
            var m = this.matrices[this.matrices.length - 1];
            m = linearAlgebra.pMultiplyMatrix(m, [
                1,
                0,
                this.tan(angle),
                1,
                0,
                0
            ]);
            return this;
        };
        Processing.prototype.shearY = function (angle) {
            this.curElement.context.transform(1, this.tan(angle), 0, 1, 0, 0);
            var m = this.matrices[this.matrices.length - 1];
            m = linearAlgebra.pMultiplyMatrix(m, [
                1,
                this.tan(angle),
                0,
                1,
                0,
                0
            ]);
            return this;
        };
        Processing.prototype.translate = function (x, y) {
            this.curElement.context.translate(x, y);
            var m = this.matrices[this.matrices.length - 1];
            m[4] += m[0] * x + m[2] * y;
            m[5] += m[1] * x + m[3] * y;
            return this;
        };
        return Processing;
    }({}, core, linearalgebra, log);
var typographyattributes = function (require, core, constants) {
        'use strict';
        var Processing = core;
        var constants = constants;
        Processing.prototype.textAlign = function (a) {
            if (a === constants.LEFT || a === constants.RIGHT || a === constants.CENTER) {
                this.curElement.context.textAlign = a;
            }
        };
        Processing.prototype.textFont = function (str) {
            this._setProperty('_textFont', str);
        };
        Processing.prototype.textHeight = function (s) {
            return this.curElement.context.measureText(s).height;
        };
        Processing.prototype.textLeading = function (l) {
            this._setProperty('_textLeading', l);
        };
        Processing.prototype.textSize = function (s) {
            this._setProperty('_textSize', s);
        };
        Processing.prototype.textStyle = function (s) {
            if (s === constants.NORMAL || s === constants.ITALIC || s === constants.BOLD) {
                this._setProperty('_textStyle', s);
            }
        };
        Processing.prototype.textWidth = function (s) {
            return this.curElement.context.measureText(s).width;
        };
        return Processing;
    }({}, core, constants);
var typographyloading_displaying = function (require, core) {
        'use strict';
        var Processing = core;
        Processing.prototype.text = function () {
            this.curElement.context.font = this._textStyle + ' ' + this._textSize + 'px ' + this._textFont;
            if (arguments.length === 3) {
                this.curElement.context.fillText(arguments[0], arguments[1], arguments[2]);
                this.curElement.context.strokeText(arguments[0], arguments[1], arguments[2]);
            } else if (arguments.length === 5) {
                var words = arguments[0].split(' ');
                var line = '';
                var vals = this.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], this.rectMode);
                vals.y += this.textLeading;
                for (var n = 0; n < words.length; n++) {
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
    }({}, core);
var src_p5 = function (require, core, mathpvector, colorcreating_reading, colorsetting, dataarray_functions, datastring_functions, dommanipulate, dompelement, environment, image, imageloading_displaying, inputfiles, inputkeyboard, inputmouse, inputtime_date, inputtouch, mathcalculation, mathrandom, mathtrigonometry, outputfiles, outputimage, outputtext_area, shape2d_primitives, shapeattributes, shapecurves, shapevertex, structure, transform, typographyattributes, typographyloading_displaying) {
        'use strict';
        var Processing = core;
        var PVector = mathpvector;
        if (document.readyState === 'complete') {
            Processing._init();
        } else {
            window.addEventListener('load', Processing._init, false);
        }
        window.Processing = Processing;
        window.PVector = PVector;
        return Processing;
    }({}, core, mathpvector, colorcreating_reading, colorsetting, dataarray_functions, datastring_functions, dommanipulate, dompelement, environment, image, imageloading_displaying, inputfiles, inputkeyboard, inputmouse, inputtime_date, inputtouch, mathcalculation, mathrandom, mathtrigonometry, outputfiles, outputimage, outputtext_area, shape2d_primitives, shapeattributes, shapecurves, shapevertex, structure, transform, typographyattributes, typographyloading_displaying);}());