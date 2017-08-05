'use strict';

var p5 = require('../core/core');

/**
 * p5 Sampler class
 * @class p5.Sampler
 * A class that describes how a user wants a texture to be
 * sampled in WebGL
 * @constructor
 * @param  {String} [upScale] sample mode to use when upscaling
 * @param  {String} [downScale] sample mode to use when downscaling
 * @param  {String} [wrapX] sample mode to use when accessing areas
 * past the horizontal bounds of the texture
 * @param  {String} [wrapY] sample mode to use when accessing areas
 * past the vertical bounds of the texture
 */
p5.Sampler = function
(upScale, downScale, wrapX, wrapY){
  this.upScale = upScale;
  this.downScale = downScale;
  this.wrapX = wrapX;
  this.wrapY = wrapY;
  return this;
};

p5.prototype.createSampler = function
(upScale, downScale, wrapX, wrapY){
  return new p5.Sampler(upScale, downScale, wrapX, wrapY);
};