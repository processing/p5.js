'use strict';

var p5 = require('../core/core');

(function thunkRendererMethods() {
  // prettier-ignore
  var rendererMethods = [
    // attributes.js
    'noSmooth', 'smooth', 'strokeCap', 'strokeJoin', 'strokeWeight',
    // 2d_primitives.js
    'line', 'point', 'quad', 'rect', 'triangle',
    // curves.js
    'bezier', 'curve',
    // vertex.js
    'normal', 'vertex', 'bezierVertex', 'beginShape',
    // pixels.js
    'copy', 'loadPixels', 'get', 'set', 'updatePixels',
    // transform.js
    'applyMatrix', 'resetMatrix', 'rotate', 'rotateX', 'rotateY', 'rotateZ',
    'translate', 'shearX', 'shearY',
    // typography/attributes.js
    'textAlign', 'textLeading', 'textSize', 'textStyle', 'textWidth',
    'textAscent', 'textDescent' /*"_updateTextMetrics", */,
    // typography/loading_displaying.js
    'text',
    // webgl/p5.RendererGL.js 
    'setAttributes',
    // webgl/lights.js 
    'lights', 'noLights', 'lightSpecular', 'lightFalloff', 'ambientLight',
    'directionalLight', 'pointLight',
    // webgl/camera.js 
    'perspective', 'camera', 'ortho',
    // webgl/loading.js 
    'model',
    // webgl/material.js 
    'shader', 'normalMaterial', 'texture', 'ambient', 'ambientMaterial',
    'specular', 'specularMaterial', 'shininess', 'resetShader',
    'createShader',
    // webgl/primitives.js 
    'plane', 'box', 'sphere', 'cylinder', 'cone', 'ellipsoid', 'torus',
    // webgl/interaction.js
    'orbitControl'
  ];
  var rendererPrototype = p5.Renderer.prototype;
  for (var im = 0; im < rendererMethods.length; im++) {
    var m = rendererMethods[im];

    if (typeof IS_MINIFIED === 'undefined' && p5.prototype[m]) {
      console.warn('p5.' + m + '() already defined!');
    }

    // create the proxy in p5 that calls into the _renderer
    p5.prototype[m] = (function(m) {
      return function() {
        // validate the parameters
        p5._validateParameters(m, arguments);

        // thunk through to the underlying renderer method
        var ret = this._renderer[m].apply(this._renderer, arguments);

        // if the renderer returned 'undefined', method is chainable
        if (typeof ret === 'undefined') ret = this;
        return ret;
      };
    })(m);

    // add an unimplemented warning in the base class
    if (!rendererPrototype.hasOwnProperty(m)) {
      rendererPrototype[m] = (function(m) {
        return function() {
          console.warn(m + '() is not supported in this rendering mode.');
        };
      })(m);
    }
  }
})();

/**
 * _globalInit
 *
 * TODO: ???
 * if sketch is on window
 * assume "global" mode
 * and instantiate p5 automatically
 * otherwise do nothing
 *
 * @private
 * @return {Undefined}
 */
var _globalInit = function() {
  if (!window.PHANTOMJS && !window.mocha) {
    // If there is a setup or draw function on the window
    // then instantiate p5 in "global" mode
    if (
      ((window.setup && typeof window.setup === 'function') ||
        (window.draw && typeof window.draw === 'function')) &&
      !p5.instance
    ) {
      new p5();
    }
  }
};

// TODO: ???
if (document.readyState === 'complete') {
  _globalInit();
} else {
  window.addEventListener('load', _globalInit, false);
}
