/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from './main';
import * as C from './constants';

const standardCursors = [C.ARROW, C.CROSS, C.HAND, C.MOVE, C.TEXT, C.WAIT];

p5.prototype._frameRate = 0;
p5.prototype._lastFrameTime = window.performance.now();
p5.prototype._targetFrameRate = 60;

const _windowPrint = window.print;
let windowPrintDisabled = false;

/**
 * Displays text in the web browser's console.
 *
 * `print()` is helpful for printing values while debugging. Each call to
 * `print()` creates a new line of text.
 *
 * Note: Call `print('\n')` to print a blank line. Calling `print()` without
 * an argument opens the browser's dialog for printing documents.
 *
 * @method print
 * @param {Any} contents content to print to the console.
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   // Prints "hello, world" to the console.
 *   print('hello, world');
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function setup() {
 *   let name = 'ada';
 *   // Prints "hello, ada" to the console.
 *   print(`hello, ${name}`);
 * }
 * </code>
 * </div>
 */
p5.prototype.print = function(...args) {
  if (!args.length) {
    if (!windowPrintDisabled) {
      _windowPrint();
      if (
        window.confirm(
          'You just tried to print the webpage. Do you want to prevent this from running again?'
        )
      ) {
        windowPrintDisabled = true;
      }
    }
  } else {
    console.log(...args);
  }
};

p5.prototype.frameCount = 0;
p5.prototype.deltaTime = 0;
p5.prototype.focused = document.hasFocus();

p5.prototype.cursor = function(type, x, y) {
  let cursor = 'auto';
  const canvas = this._curElement.elt;
  if (standardCursors.includes(type)) {
    cursor = type;
  } else if (typeof type === 'string') {
    let coords = '';
    if (x && y && (typeof x === 'number' && typeof y === 'number')) {
      coords = `${x} ${y}`;
    }
    if (
      type.substring(0, 7) === 'http://' ||
      type.substring(0, 8) === 'https://'
    ) {
      cursor = `url(${type}) ${coords}, auto`;
    } else if (/\.(cur|jpg|jpeg|gif|png|CUR|JPG|JPEG|GIF|PNG)$/.test(type)) {
      cursor = `url(${type}) ${coords}, auto`;
    } else {
      cursor = type;
    }
  }
  canvas.style.cursor = cursor;
};

p5.prototype._frameRate = 0;

p5.prototype.frameRate = function(fps) {
  p5._validateParameters('frameRate', arguments);
  if (typeof fps !== 'number' || fps < 0) {
    return this._frameRate;
  } else {
    this._setProperty('_targetFrameRate', fps);
    if (fps === 0) {
      this._setProperty('_frameRate', fps);
    }
    return this;
  }
};

p5.prototype.getFrameRate = function() {
  return this.frameRate();
};

p5.prototype.setFrameRate = function(fps) {
  return this.frameRate(fps);
};

p5.prototype.getTargetFrameRate = function() {
  return this._targetFrameRate;
};

p5.prototype.noCursor = function() {
  this._curElement.elt.style.cursor = 'none';
};

p5.prototype.webglVersion = C.P2D;
p5.prototype.displayWidth = screen.width;
p5.prototype.displayHeight = screen.height;
p5.prototype.windowWidth = 0;
p5.prototype.windowHeight = 0;
p5.prototype.width = 0;
p5.prototype.height = 0;

p5.prototype._onresize = function(e) {
  this._setProperty('windowWidth', getWindowWidth());
  this._setProperty('windowHeight', getWindowHeight());
  const context = this._isGlobal ? window : this;
  let executeDefault;
  if (typeof context.windowResized === 'function') {
    executeDefault = context.windowResized(e);
    if (executeDefault !== undefined && !executeDefault) {
      e.preventDefault();
    }
  }
};

function getWindowWidth() {
  return (
    window.innerWidth ||
    (document.documentElement && document.documentElement.clientWidth) ||
    (document.body && document.body.clientWidth) ||
    0
  );
}

function getWindowHeight() {
  return (
    window.innerHeight ||
    (document.documentElement && document.documentElement.clientHeight) ||
    (document.body && document.body.clientHeight) ||
    0
  );
}

p5.prototype._updateWindowSize = function() {
  this._setProperty('windowWidth', getWindowWidth());
  this._setProperty('windowHeight', getWindowHeight());
};

p5.prototype.fullscreen = function(val) {
  p5._validateParameters('fullscreen', arguments);
  if (typeof val === 'undefined') {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  } else {
    if (val) {
      launchFullscreen(document.documentElement);
    } else {
      exitFullscreen();
    }
  }
};

p5.prototype.pixelDensity = function(val) {
  p5._validateParameters('pixelDensity', arguments);
  let returnValue;
  if (typeof val === 'number') {
    if (val !== this._pixelDensity) {
      this._pixelDensity = this._maxAllowedPixelDimensions = val;
    }
    returnValue = this;
    this.resizeCanvas(this.width, this.height, true);
  } else {
    returnValue = this._pixelDensity;
  }
  return returnValue;
};

p5.prototype.displayDensity = () => window.devicePixelRatio;

function launchFullscreen(element) {
  const enabled =
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled;
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

p5.prototype.getURL = () => location.href;
p5.prototype.getURLPath = () =>
  location.pathname.split('/').filter(v => v !== '');
p5.prototype.getURLParams = function() {
  const re = /[?&]([^&=]+)(?:[&=])([^&=]+)/gim;
  let m;
  const v = {};
  while ((m = re.exec(location.search)) != null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    v[m[1]] = m[2];
  }
  return v;
};

export default p5;
