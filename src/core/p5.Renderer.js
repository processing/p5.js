/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

import { Color } from '../color/p5.Color';
import * as constants from '../core/constants';
import { Image } from '../image/p5.Image';
import { Vector } from '../math/p5.Vector';
import { Shape } from '../shape/custom_shapes';
import { States } from './States';

class ClonableObject {
  constructor(obj = {}) {
    for (const key in obj) {
      this[key] = obj[key];
    }
  }

  clone() {
    return new ClonableObject(this);
  }
};

class Renderer {
  static states = {
    strokeColor: null,
    strokeSet: false,
    fillColor: null,
    fillSet: false,
    tint: null,

    imageMode: constants.CORNER,
    rectMode: constants.CORNER,
    ellipseMode: constants.CENTER,
    strokeWeight: 1,

    textFont: { family: 'sans-serif' },
    textLeading: 15,
    leadingSet: false,
    textSize: 12,
    textAlign: constants.LEFT,
    textBaseline: constants.BASELINE,
    bezierOrder: 3,
    splineProperties: new ClonableObject({ ends: constants.INCLUDE, tightness: 0 }),
    textWrap: constants.WORD,

    // added v2.0
    fontStyle: constants.NORMAL, // v1: textStyle
    fontStretch: constants.NORMAL,
    fontWeight: constants.NORMAL,
    lineHeight: constants.NORMAL,
    fontVariant: constants.NORMAL,
    direction: 'inherit'
  }

  constructor(pInst, w, h, isMainCanvas) {
    this._pInst = pInst;
    this._isMainCanvas = isMainCanvas;
    this.pixels = [];
    this._pixelDensity = Math.ceil(window.devicePixelRatio) || 1;

    this.width = w;
    this.height = h;

    this._events = {};

    if (isMainCanvas) {
      this._isMainCanvas = true;
    }

    // Renderer state machine
    this.states = new States(Renderer.states);

    this.states.strokeColor = new Color([0, 0, 0]);
    this.states.fillColor = new Color([1, 1, 1]);

    this._pushPopStack = [];
    // NOTE: can use the length of the push pop stack instead
    this._pushPopDepth = 0;

    this._clipping = false;
    this._clipInvert = false;

    this._currentShape = undefined; // Lazily generate current shape
  }

  get currentShape() {
    if (!this._currentShape) {
      this._currentShape = new Shape(this.getCommonVertexProperties());
    }
    return this._currentShape;
  }

  remove() {

  }

  pixelDensity(val){
    let returnValue;
    if (typeof val === 'number') {
      if (val !== this._pixelDensity) {
        this._pixelDensity = val;
      }
      returnValue = this;
      this.resize(this.width, this.height);
    } else {
      returnValue = this._pixelDensity;
    }
    return returnValue;
  }

  // Makes a shallow copy of the current states
  // and push it into the push pop stack
  push() {
    this._pushPopDepth++;
    this._pushPopStack.push(this.states.getDiff());
  }

  // Pop the previous states out of the push pop stack and
  // assign it back to the current state
  pop() {
    this._pushPopDepth--;
    const diff = this._pushPopStack.pop() || {};
    const modified = this.states.getModified();
    this.states.applyDiff(diff);
    this.updateShapeVertexProperties(modified);
    this.updateShapeProperties(modified);
  }

  bezierOrder(order) {
    if (order === undefined) {
      return this.states.bezierOrder;
    } else {
      this.states.setValue('bezierOrder', order);
      this.updateShapeProperties();
    }
  }

  bezierVertex(x, y, z = 0, u = 0, v = 0) {
    const position = new Vector(x, y, z);
    const textureCoordinates = this.getSupportedIndividualVertexProperties().textureCoordinates
      ? new Vector(u, v)
      : undefined;
    this.currentShape.bezierVertex(position, textureCoordinates);
  }

  splineProperty(key, value) {
    if (value === undefined) {
      return this.states.splineProperties[key];
    } else {
      this.states.setValue('splineProperties', this.states.splineProperties.clone());
      this.states.splineProperties[key] = value;
    }
    this.updateShapeProperties();
  }

  splineProperties(values) {
    if (values) {
      for (const key in values) {
        this.splineProperty(key, values[key]);
      }
    } else {
      return { ...this.states.splineProperties };
    }
  }

  splineVertex(x, y, z = 0, u = 0, v = 0) {
    const position = new Vector(x, y, z);
    const textureCoordinates = this.getSupportedIndividualVertexProperties().textureCoordinates
      ? new Vector(u, v)
      : undefined;
    this.currentShape.splineVertex(position, textureCoordinates);
  }

  curveDetail(d) {
    if (d === undefined) {
      return this.states.curveDetail;
    } else {
      this.states.setValue('curveDetail', d);
    }
  }

  beginShape(...args) {
    this.currentShape.reset();
    this.updateShapeVertexProperties();
    this.currentShape.beginShape(...args);
  }

  endShape(...args) {
    this.currentShape.endShape(...args);
    this.drawShape(this.currentShape);
  }

  beginContour(shapeKind) {
    this.currentShape.beginContour(shapeKind);
  }

  endContour(mode) {
    this.currentShape.endContour(mode);
  }

  drawShape(shape, count) {
    throw new Error('Unimplemented')
  }

  vertex(x, y, z = 0, u = 0, v = 0) {
    const position = new Vector(x, y, z);
    const textureCoordinates = this.getSupportedIndividualVertexProperties().textureCoordinates
      ? new Vector(u, v)
      : undefined;
    this.currentShape.vertex(position, textureCoordinates);
  }

  bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
    const oldOrder = this._pInst.bezierOrder();
    this._pInst.bezierOrder(oldOrder);
    this._pInst.beginShape();
    this._pInst.bezierVertex(x1, y1);
    this._pInst.bezierVertex(x2, y2);
    this._pInst.bezierVertex(x3, y3);
    this._pInst.bezierVertex(x4, y4);
    this._pInst.endShape();
    return this;
  }

  spline(...args) {
    if (args.length === 2 * 4) {
      const [x1, y1, x2, y2, x3, y3, x4, y4] = args;
      this._pInst.beginShape();
      this._pInst.splineVertex(x1, y1);
      this._pInst.splineVertex(x2, y2);
      this._pInst.splineVertex(x3, y3);
      this._pInst.splineVertex(x4, y4);
      this._pInst.endShape();
    } else if (args.length === 3 * 4) {
      const [x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4] = args;
      this._pInst.beginShape();
      this._pInst.splineVertex(x1, y1, z1);
      this._pInst.splineVertex(x2, y2, z2);
      this._pInst.splineVertex(x3, y3, z3);
      this._pInst.splineVertex(x4, y4, z4);
      this._pInst.endShape();
    }
    return this;
  }

  beginClip(options = {}) {
    if (this._clipping) {
      throw new Error("It looks like you're trying to clip while already in the middle of clipping. Did you forget to endClip()?");
    }
    this._clipping = true;
    this._clipInvert = options.invert;
  }

  endClip() {
    if (!this._clipping) {
      throw new Error("It looks like you've called endClip() without beginClip(). Did you forget to call beginClip() first?");
    }
    this._clipping = false;
  }

  /**
   * Resize our canvas element.
   */
  resize(w, h) {
    this.width = w;
    this.height = h;
  }

  get(x, y, w, h) {
    const pd = this._pixelDensity;
    const canvas = this.canvas;

    if (typeof x === 'undefined' && typeof y === 'undefined') {
    // get()
      x = y = 0;
      w = this.width;
      h = this.height;
    } else {
      x *= pd;
      y *= pd;

      if (typeof w === 'undefined' && typeof h === 'undefined') {
      // get(x,y)
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
          return [0, 0, 0, 0];
        }

        return this._getPixel(x, y);
      }
    // get(x,y,w,h)
    }

    const region = new Image(w*pd, h*pd);
    region.pixelDensity(pd);
    region.canvas
      .getContext('2d')
      .drawImage(canvas, x, y, w * pd, h * pd, 0, 0, w*pd, h*pd);

    return region;
  }

  scale(x, y){

  }

  fill(...args) {
    this.states.setValue('fillSet', true);
    this.states.setValue('fillColor', this._pInst.color(...args));
    this.updateShapeVertexProperties();
  }

  noFill() {
    this.states.setValue('fillColor', null);
  }

  strokeWeight(w) {
    if (w === undefined) {
      return this.states.strokeWeight;
    } else {
      this.states.setValue('strokeWeight', w);
    }
  }

  stroke(...args) {
    this.states.setValue('strokeSet', true);
    this.states.setValue('strokeColor', this._pInst.color(...args));
    this.updateShapeVertexProperties();
  }

  noStroke() {
    this.states.setValue('strokeColor', null);
  }

  getCommonVertexProperties() {
    return {}
  }

  getSupportedIndividualVertexProperties() {
    return {
      textureCoordinates: false,
    }
  }

  updateShapeProperties(modified) {
    if (!modified || modified.bezierOrder || modified.splineProperties) {
      const shape = this.currentShape;
      shape.bezierOrder(this.states.bezierOrder);
      shape.splineProperty('ends', this.states.splineProperties.ends);
      shape.splineProperty('tightness', this.states.splineProperties.tightness);
    }
  }

  updateShapeVertexProperties(modified) {
    const props = this.getCommonVertexProperties();
    if (!modified || Object.keys(modified).some((k) => k in props)) {
      const shape = this.currentShape;
      for (const key in props) {
        shape[key](props[key]);
      }
    }
  }

  _applyDefaults() {
    return this;
  }

};

function renderer(p5, fn){
  /**
   * Main graphics and rendering context, as well as the base API
   * implementation for p5.js "core". To be used as the superclass for
   * Renderer2D and Renderer3D classes, respectively.
   *
   * @class p5.Renderer
   * @param {HTMLElement} elt DOM node that is wrapped
   * @param {p5} [pInst] pointer to p5 instance
   * @param {Boolean} [isMainCanvas] whether we're using it as main canvas
   * @private
   */
  p5.Renderer = Renderer;
}

/**
 * Helper fxn to measure ascent and descent.
 * Adapted from http://stackoverflow.com/a/25355178
 * @private
 */
function calculateOffset(object) {
  let currentLeft = 0,
    currentTop = 0;
  if (object.offsetParent) {
    do {
      currentLeft += object.offsetLeft;
      currentTop += object.offsetTop;
    } while ((object = object.offsetParent));
  } else {
    currentLeft += object.offsetLeft;
    currentTop += object.offsetTop;
  }
  return [currentLeft, currentTop];
}

export default renderer;
export { Renderer };
