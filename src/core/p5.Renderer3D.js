import * as constants from "../core/constants";
import { Graphics } from "../core/p5.Graphics";
import { Renderer } from './p5.Renderer';
import GeometryBuilder from "../webgl/GeometryBuilder";
import { Matrix } from "../math/p5.Matrix";
import { Camera } from "../webgl/p5.Camera";
import { Vector } from "../math/p5.Vector";
import { ShapeBuilder } from "../webgl/ShapeBuilder";
import { GeometryBufferCache } from "../webgl/GeometryBufferCache";
import { filterParamDefaults } from "../image/const";
import { PrimitiveToVerticesConverter } from "../shape/custom_shapes";
import { Color } from "../color/p5.Color";
import { Element } from "../dom/p5.Element";
import { Framebuffer } from "../webgl/p5.Framebuffer";
import { DataArray } from "../webgl/p5.DataArray";
import { textCoreConstants } from "../type/textCore";
import { RenderBuffer } from "../webgl/p5.RenderBuffer";
import { Image } from "../image/p5.Image";
import { Texture } from "../webgl/p5.Texture";

export function getStrokeDefs(shaderConstant) {
  const STROKE_CAP_ENUM = {};
  const STROKE_JOIN_ENUM = {};
  let lineDefs = "";
  const defineStrokeCapEnum = function (key, val) {
    lineDefs += shaderConstant(`STROKE_CAP_${key}`, `${val}`, 'u32');
    STROKE_CAP_ENUM[constants[key]] = val;
  };
  const defineStrokeJoinEnum = function (key, val) {
    lineDefs += shaderConstant(`STROKE_JOIN_${key}`, `${val}`, 'u32');
    STROKE_JOIN_ENUM[constants[key]] = val;
  };

  // Define constants in line shaders for each type of cap/join, and also record
  // the values in JS objects
  defineStrokeCapEnum("ROUND", 0);
  defineStrokeCapEnum("PROJECT", 1);
  defineStrokeCapEnum("SQUARE", 2);
  defineStrokeJoinEnum("ROUND", 0);
  defineStrokeJoinEnum("MITER", 1);
  defineStrokeJoinEnum("BEVEL", 2);

  return { STROKE_CAP_ENUM, STROKE_JOIN_ENUM, lineDefs };
}

const { STROKE_CAP_ENUM, STROKE_JOIN_ENUM } = getStrokeDefs(()=>"");

export class Renderer3D extends Renderer {
  constructor(pInst, w, h, isMainCanvas, elt) {
    super(pInst, w, h, isMainCanvas);

    // Create new canvas
    this.canvas = this.elt = elt || document.createElement("canvas");
    this.contextReady = this.setupContext();

    if (this._isMainCanvas) {
      // for pixel method sharing with pimage
      this._pInst._curElement = this;
      this._pInst.canvas = this.canvas;
    } else {
      // hide if offscreen buffer by default
      this.canvas.style.display = "none";
    }
    this.elt.id = "defaultCanvas0";
    this.elt.classList.add("p5Canvas");

    // Set and return p5.Element
    this.wrappedElt = new Element(this.elt, this._pInst);

    // Extend renderer with methods of p5.Element with getters
    for (const p of Object.getOwnPropertyNames(Element.prototype)) {
      if (p !== 'constructor' && p[0] !== '_') {
        Object.defineProperty(this, p, {
          get() {
            return this.wrappedElt[p];
          }
        })
      }
    }

    const dimensions = this._adjustDimensions(w, h);
    w = dimensions.adjustedWidth;
    h = dimensions.adjustedHeight;

    this.width = w;
    this.height = h;

    // Set canvas size
    this.elt.width = w * this._pixelDensity;
    this.elt.height = h * this._pixelDensity;
    this.elt.style.width = `${w}px`;
    this.elt.style.height = `${h}px`;
    this._updateViewport();

    // Attach canvas element to DOM
    if (this._pInst._userNode) {
      // user input node case
      this._pInst._userNode.appendChild(this.elt);
    } else {
      //create main element
      if (document.getElementsByTagName("main").length === 0) {
        let m = document.createElement("main");
        document.body.appendChild(m);
      }
      //append canvas to main
      document.getElementsByTagName("main")[0].appendChild(this.elt);
    }

    this.isP3D = true; //lets us know we're in 3d mode

    // When constructing a new Geometry, this will represent the builder
    this.geometryBuilder = undefined;

    // Push/pop state
    this.states.uModelMatrix = new Matrix(4);
    this.states.uViewMatrix = new Matrix(4);
    this.states.uPMatrix = new Matrix(4);

    this.mainCamera = new Camera(this);
    if (!this.states.curCamera) {
      this.states.curCamera = this.mainCamera;
    }
    this.states.uPMatrix.set(this.states.curCamera.projMatrix);
    this.states.uViewMatrix.set(this.states.curCamera.cameraMatrix);

    this.states.enableLighting = false;
    this.states.ambientLightColors = [];
    this.states.specularColors = [1, 1, 1];
    this.states.directionalLightDirections = [];
    this.states.directionalLightDiffuseColors = [];
    this.states.directionalLightSpecularColors = [];
    this.states.pointLightPositions = [];
    this.states.pointLightDiffuseColors = [];
    this.states.pointLightSpecularColors = [];
    this.states.spotLightPositions = [];
    this.states.spotLightDirections = [];
    this.states.spotLightDiffuseColors = [];
    this.states.spotLightSpecularColors = [];
    this.states.spotLightAngle = [];
    this.states.spotLightConc = [];
    this.states.activeImageLight = null;

    this.states.curFillColor = [1, 1, 1, 1];
    this.states.curAmbientColor = [1, 1, 1, 1];
    this.states.curSpecularColor = [0, 0, 0, 0];
    this.states.curEmissiveColor = [0, 0, 0, 0];
    this.states.curStrokeColor = [0, 0, 0, 1];

    this.states.curBlendMode = constants.BLEND;

    this.states._hasSetAmbient = false;
    this.states._useSpecularMaterial = false;
    this.states._useEmissiveMaterial = false;
    this.states._useNormalMaterial = false;
    this.states._useShininess = 1;
    this.states._useMetalness = 0;

    this.states.tint = [255, 255, 255, 255];

    this.states.constantAttenuation = 1;
    this.states.linearAttenuation = 0;
    this.states.quadraticAttenuation = 0;

    this.states._currentNormal = new Vector(0, 0, 1);

    this.states.drawMode = constants.FILL;

    this.states._tex = null;
    this.states.textureMode = constants.IMAGE;
    this.states.textureWrapX = constants.CLAMP;
    this.states.textureWrapY = constants.CLAMP;

    // erasing
    this._isErasing = false;

    // simple lines
    this._simpleLines = false;

    // clipping
    this._clipDepths = [];
    this._isClipApplied = false;
    this._stencilTestOn = false;

    this.mixedAmbientLight = [];
    this.mixedSpecularColor = [];

    // p5.framebuffer for this are calculated in getDiffusedTexture function
    this.diffusedTextures = new Map();
    // p5.framebuffer for this are calculated in getSpecularTexture function
    this.specularTextures = new Map();

    this.preEraseBlend = undefined;
    this._cachedFillStyle = [1, 1, 1, 1];
    this._cachedStrokeStyle = [0, 0, 0, 1];
    this._isBlending = false;

    this._useLineColor = false;
    this._useVertexColor = false;

    this.registerEnabled = new Set();

    // Camera
    this.mainCamera._computeCameraDefaultSettings();
    this.mainCamera._setDefaultCamera();

    // FilterCamera
    this.filterCamera = new Camera(this);
    this.filterCamera._computeCameraDefaultSettings();
    this.filterCamera._setDefaultCamera();
    // Information about the previous frame's touch object
    // for executing orbitControl()
    this.prevTouches = [];
    // Velocity variable for use with orbitControl()
    this.zoomVelocity = 0;
    this.rotateVelocity = new Vector(0, 0);
    this.moveVelocity = new Vector(0, 0);
    // Flags for recording the state of zooming, rotation and moving
    this.executeZoom = false;
    this.executeRotateAndMove = false;

    this._drawingFilter = false;
    this._drawingImage = false;

    this.specularShader = undefined;
    this.sphereMapping = undefined;
    this.diffusedShader = undefined;
    this._baseFilterShader = undefined;
    this._defaultLightShader = undefined;
    this._defaultImmediateModeShader = undefined;
    this._defaultNormalShader = undefined;
    this._defaultColorShader = undefined;
    this._defaultPointShader = undefined;

    this.states.userFillShader = undefined;
    this.states.userStrokeShader = undefined;
    this.states.userPointShader = undefined;
    this.states.userImageShader = undefined;

    this.states.curveDetail = 1 / 4;

    // Used by beginShape/endShape functions to construct a p5.Geometry
    this.shapeBuilder = new ShapeBuilder(this);

    this.geometryBufferCache = new GeometryBufferCache(this);

    this.curStrokeCap = constants.ROUND;
    this.curStrokeJoin = constants.ROUND;

    // map of texture sources to textures created in this gl context via this.getTexture(src)
    this.textures = new Map();

    // set of framebuffers in use
    this.framebuffers = new Set();
    // stack of active framebuffers
    this.activeFramebuffers = [];

    // for post processing step
    this.states.filterShader = undefined;
    this.filterLayer = undefined;
    this.filterLayerTemp = undefined;
    this.defaultFilterShaders = {};

    this.fontInfos = {};

    this._curShader = undefined;
    this.drawShapeCount = 1;

    this.scratchMat3 = new Matrix(3);

    // Whether or not to remove degenerate faces from geometry. This is usually
    // set to false for performance.
    this._validateFaces = false;

    this.buffers = {
      fill: [
        new RenderBuffer(
          3,
          "vertices",
          "vertexBuffer",
          "aPosition",
          this,
          this._vToNArray
        ),
        new RenderBuffer(
          3,
          "vertexNormals",
          "normalBuffer",
          "aNormal",
          this,
          this._vToNArray
        ),
        new RenderBuffer(
          4,
          "vertexColors",
          "colorBuffer",
          "aVertexColor",
          this
        ).default((geometry) => geometry.vertices.flatMap(() => [-1, -1, -1, -1])),
        new RenderBuffer(
          3,
          "vertexAmbients",
          "ambientBuffer",
          "aAmbientColor",
          this
        ),
        new RenderBuffer(2, "uvs", "uvBuffer", "aTexCoord", this, (arr) =>
          arr.flat()
        ),
      ],
      stroke: [
        new RenderBuffer(
          4,
          "lineVertexColors",
          "lineColorBuffer",
          "aVertexColor",
          this
        ).default((geometry) => geometry.lineVertices.flatMap(() => [-1, -1, -1, -1])),
        new RenderBuffer(
          3,
          "lineVertices",
          "lineVerticesBuffer",
          "aPosition",
          this
        ),
        new RenderBuffer(
          3,
          "lineTangentsIn",
          "lineTangentsInBuffer",
          "aTangentIn",
          this
        ),
        new RenderBuffer(
          3,
          "lineTangentsOut",
          "lineTangentsOutBuffer",
          "aTangentOut",
          this
        ),
        new RenderBuffer(1, "lineSides", "lineSidesBuffer", "aSide", this),
      ],
      text: [
        new RenderBuffer(
          3,
          "vertices",
          "vertexBuffer",
          "aPosition",
          this,
          this._vToNArray
        ),
        new RenderBuffer(2, "uvs", "uvBuffer", "aTexCoord", this, (arr) =>
          arr.flat()
        ),
      ],
      user: [],
    };
  }

  //This is helper function to reset the context anytime the attributes
  //are changed with setAttributes()

  async _resetContext(options, callback, ctor = Renderer3D) {
    const w = this.width;
    const h = this.height;
    const defaultId = this.canvas.id;
    const isPGraphics = this._pInst instanceof Graphics;

    // Preserve existing position and styles before recreation
    const prevStyle = {
      position: this.canvas.style.position,
      top: this.canvas.style.top,
      left: this.canvas.style.left,
    };

    if (isPGraphics) {
      // Handle PGraphics: remove and recreate the canvas
      const pg = this._pInst;
      pg.canvas.parentNode.removeChild(pg.canvas);
      pg.canvas = document.createElement("canvas");
      const node = pg._pInst._userNode || document.body;
      node.appendChild(pg.canvas);
      Element.call(pg, pg.canvas, pg._pInst);
      // Restore previous width and height
      pg.width = w;
      pg.height = h;
    } else {
      // Handle main canvas: remove and recreate it
      let c = this.canvas;
      if (c) {
        c.parentNode.removeChild(c);
      }
      c = document.createElement("canvas");
      c.id = defaultId;
      // Attach the new canvas to the correct parent node
      if (this._pInst._userNode) {
        this._pInst._userNode.appendChild(c);
      } else {
        document.body.appendChild(c);
      }
      this._pInst.canvas = c;
      this.canvas = c;

      // Restore the saved position
      this.canvas.style.position = prevStyle.position;
      this.canvas.style.top = prevStyle.top;
      this.canvas.style.left = prevStyle.left;
    }

    const renderer = new ctor(
      this._pInst,
      w,
      h,
      !isPGraphics,
      this._pInst.canvas
    );
    this._pInst._renderer = renderer;

    renderer._applyDefaults();

    if (renderer.contextReady) {
      await renderer.contextReady
    }

    if (typeof callback === "function") {
      //setTimeout with 0 forces the task to the back of the queue, this ensures that
      //we finish switching out the renderer
      setTimeout(() => {
        callback.apply(window._renderer, options);
      }, 0);
    }
  }

  remove() {
    this.wrappedElt.remove();
    this.wrappedElt = null;
    this.canvas = null;
    this.elt = null;
  }

  //////////////////////////////////////////////
  // Geometry Building
  //////////////////////////////////////////////

  /**
   * Starts creating a new p5.Geometry. Subsequent shapes drawn will be added
   * to the geometry and then returned when
   * <a href="#/p5/endGeometry">endGeometry()</a> is called. One can also use
   * <a href="#/p5/buildGeometry">buildGeometry()</a> to pass a function that
   * draws shapes.
   *
   * If you need to draw complex shapes every frame which don't change over time,
   * combining them upfront with `beginGeometry()` and `endGeometry()` and then
   * drawing that will run faster than repeatedly drawing the individual pieces.
   * @private
   */
  beginGeometry() {
    if (this.geometryBuilder) {
      throw new Error(
        "It looks like `beginGeometry()` is being called while another p5.Geometry is already being build."
      );
    }
    this.geometryBuilder = new GeometryBuilder(this);
    this.geometryBuilder.prevFillColor = this.states.fillColor;
    this.fill(new Color([-1, -1, -1, -1]));
  }

  /**
   * Finishes creating a new <a href="#/p5.Geometry">p5.Geometry</a> that was
   * started using <a href="#/p5/beginGeometry">beginGeometry()</a>. One can also
   * use <a href="#/p5/buildGeometry">buildGeometry()</a> to pass a function that
   * draws shapes.
   * @private
   *
   * @returns {p5.Geometry} The model that was built.
   */
  endGeometry() {
    if (!this.geometryBuilder) {
      throw new Error(
        "Make sure you call beginGeometry() before endGeometry()!"
      );
    }
    const geometry = this.geometryBuilder.finish();
    if (this.geometryBuilder.prevFillColor) {
      this.fill(this.geometryBuilder.prevFillColor);
    } else {
      this.noFill();
    }
    this.geometryBuilder = undefined;
    return geometry;
  }

  /**
   * Creates a new <a href="#/p5.Geometry">p5.Geometry</a> that contains all
   * the shapes drawn in a provided callback function. The returned combined shape
   * can then be drawn all at once using <a href="#/p5/model">model()</a>.
   *
   * If you need to draw complex shapes every frame which don't change over time,
   * combining them with `buildGeometry()` once and then drawing that will run
   * faster than repeatedly drawing the individual pieces.
   *
   * One can also draw shapes directly between
   * <a href="#/p5/beginGeometry">beginGeometry()</a> and
   * <a href="#/p5/endGeometry">endGeometry()</a> instead of using a callback
   * function.
   * @param {Function} callback A function that draws shapes.
   * @returns {p5.Geometry} The model that was built from the callback function.
   */
  buildGeometry(callback) {
    this.beginGeometry();
    callback();
    return this.endGeometry();
  }

  //////////////////////////////////////////////
  // Shape drawing
  //////////////////////////////////////////////

  beginShape(...args) {
    super.beginShape(...args);
    // TODO remove when shape refactor is complete
    // this.shapeBuilder.beginShape(...args);
  }

  curveDetail(d) {
    if (d === undefined) {
      return this.states.curveDetail;
    } else {
      this.states.setValue("curveDetail", d);
    }
  }

  drawShape(shape) {
    const visitor = new PrimitiveToVerticesConverter({
      curveDetail: this.states.curveDetail,
    });
    shape.accept(visitor);
    this.shapeBuilder.constructFromContours(shape, visitor.contours);

    if (this.geometryBuilder) {
      this.geometryBuilder.addImmediate(
        this.shapeBuilder.geometry,
        this.shapeBuilder.shapeMode,
        { validateFaces: this._validateFaces }
      );
    } else if (this.states.fillColor || this.states.strokeColor) {
      this._drawGeometry(this.shapeBuilder.geometry, {
        mode: this.shapeBuilder.shapeMode,
        count: this.drawShapeCount
      });
    }
    this.drawShapeCount = 1;
  }

  endShape(mode, count) {
    this.drawShapeCount = count;
    super.endShape(mode, count);
  }

  vertexProperty(...args) {
    this.currentShape.vertexProperty(...args);
  }

  normal(xorv, y, z) {
    if (xorv instanceof Vector) {
      this.states.setValue("_currentNormal", xorv);
    } else {
      this.states.setValue("_currentNormal", new Vector(xorv, y, z));
    }
    this.updateShapeVertexProperties();
  }

  model(model, count = 1) {
    if (model.vertices.length > 0) {
      if (this.geometryBuilder) {
        this.geometryBuilder.addRetained(model);
      } else {
        if (!this.geometryInHash(model.gid)) {
          model._edgesToVertices();
          this._getOrMakeCachedBuffers(model);
        }

        this._drawGeometry(model, { count });
      }
    }
  }

  _getOrMakeCachedBuffers(geometry) {
    return this.geometryBufferCache.ensureCached(geometry);
  }

  //////////////////////////////////////////////
  // Rendering
  //////////////////////////////////////////////

  _drawGeometry(geometry, { mode = constants.TRIANGLES, count = 1 } = {}) {
    for (const propName in geometry.userVertexProperties) {
      const prop = geometry.userVertexProperties[propName];
      this.buffers.user.push(
        new RenderBuffer(
          prop.getDataSize(),
          prop.getSrcName(),
          prop.getDstName(),
          prop.getName(),
          this
        )
      );
    }

    if (
      this.states.fillColor &&
      geometry.vertices.length >= 3 &&
      ![constants.LINES, constants.POINTS].includes(mode)
    ) {
      this._drawFills(geometry, { mode, count });
    }

    if (this.states.strokeColor && geometry.lineVertices.length >= 1) {
      this._drawStrokes(geometry, { count });
    }

    this.buffers.user = [];
  }

  _drawFills(geometry, { count, mode } = {}) {
    this._useVertexColor = geometry.vertexColors.length > 0 &&
      !geometry.vertexColors.isDefault;

    const shader =
      !this._drawingFilter && this.states.userFillShader
        ? this.states.userFillShader
        : this._getFillShader();
    shader.bindShader('fill');
    this._setGlobalUniforms(shader);
    this._setFillUniforms(shader);
    shader.bindTextures();

    for (const buff of this.buffers.fill) {
      buff._prepareBuffer(geometry, shader);
    }
    this._prepareUserAttributes(geometry, shader);
    this._disableRemainingAttributes(shader);

    this._applyColorBlend(
      this.states.curFillColor,
      geometry.hasFillTransparency()
    );

    this._drawBuffers(geometry, { mode, count });

    shader.unbindShader();
  }

  _drawStrokes(geometry, { count } = {}) {

    this._useLineColor = geometry.vertexStrokeColors.length > 0;

    const shader = this._getStrokeShader();
    shader.bindShader('stroke');
    this._setGlobalUniforms(shader);
    this._setStrokeUniforms(shader);
    shader.bindTextures();

    for (const buff of this.buffers.stroke) {
      buff._prepareBuffer(geometry, shader);
    }
    this._prepareUserAttributes(geometry, shader);
    this._disableRemainingAttributes(shader);

    this._applyColorBlend(
      this.states.curStrokeColor,
      geometry.hasStrokeTransparency()
    );

    this._drawBuffers(geometry, {count})

    shader.unbindShader();
  }

  _prepareUserAttributes(geometry, shader) {
    for (const buff of this.buffers.user) {
      if (!this._pInst.constructor.disableFriendleErrors) {
        // Check for the right data size
        const prop = geometry.userVertexProperties[buff.attr];
        if (prop) {
          const adjustedLength = prop.getSrcArray().length / prop.getDataSize();
          if (adjustedLength > geometry.vertices.length) {
            this._pInst.constructor._friendlyError(
              `One of the geometries has a custom vertex property '${prop.getName()}' with more values than vertices. This is probably caused by directly using the Geometry.vertexProperty() method.`,
              "vertexProperty()"
            );
          } else if (adjustedLength < geometry.vertices.length) {
            this._pInst.constructor._friendlyError(
              `One of the geometries has a custom vertex property '${prop.getName()}' with fewer values than vertices. This is probably caused by directly using the Geometry.vertexProperty() method.`,
              "vertexProperty()"
            );
          }
        }
      }
      buff._prepareBuffer(geometry, shader);
    }
  }

  _drawGeometryScaled(model, scaleX, scaleY, scaleZ) {
    let originalModelMatrix = this.states.uModelMatrix;
    this.states.setValue("uModelMatrix", this.states.uModelMatrix.clone());
    try {
      this.states.uModelMatrix.scale(scaleX, scaleY, scaleZ);

      if (this.geometryBuilder) {
        this.geometryBuilder.addRetained(model);
      } else {
        this._drawGeometry(model);
      }
    } finally {
      this.states.setValue("uModelMatrix", originalModelMatrix);
    }
  }

  _update() {
    // reset model view and apply initial camera transform
    // (containing only look at info; no projection).
    this.states.setValue("uModelMatrix", this.states.uModelMatrix.clone());
    this.states.uModelMatrix.reset();
    this.states.setValue("uViewMatrix", this.states.uViewMatrix.clone());
    this.states.uViewMatrix.set(this.states.curCamera.cameraMatrix);

    // reset light data for new frame.

    this.states.setValue("ambientLightColors", []);
    this.states.setValue("specularColors", [1, 1, 1]);

    this.states.setValue("directionalLightDirections", []);
    this.states.setValue("directionalLightDiffuseColors", []);
    this.states.setValue("directionalLightSpecularColors", []);

    this.states.setValue("pointLightPositions", []);
    this.states.setValue("pointLightDiffuseColors", []);
    this.states.setValue("pointLightSpecularColors", []);

    this.states.setValue("spotLightPositions", []);
    this.states.setValue("spotLightDirections", []);
    this.states.setValue("spotLightDiffuseColors", []);
    this.states.setValue("spotLightSpecularColors", []);
    this.states.setValue("spotLightAngle", []);
    this.states.setValue("spotLightConc", []);

    this.states.setValue("enableLighting", false);

    //reset tint value for new frame
    this.states.setValue("tint", [255, 255, 255, 255]);

    //Clear depth every frame
    this._resetBuffersBeforeDraw()
  }

  background(...args) {
    const _col = this._pInst.color(...args);
    this.clear(..._col._getRGBA());
  }

  //////////////////////////////////////////////
  // Positioning
  //////////////////////////////////////////////

  get uModelMatrix() {
    return this.states.uModelMatrix;
  }

  get uViewMatrix() {
    return this.states.uViewMatrix;
  }

  get uPMatrix() {
    return this.states.uPMatrix;
  }

  get uMVMatrix() {
    const m = this.uModelMatrix.copy();
    m.mult(this.uViewMatrix);
    return m;
  }

  /**
   * Get a matrix from world-space to screen-space
   */
  getWorldToScreenMatrix() {
    const modelMatrix = this.states.uModelMatrix;
    const viewMatrix = this.states.uViewMatrix;
    const projectionMatrix = this.states.uPMatrix;
    const projectedToScreenMatrix = new Matrix(4);
    projectedToScreenMatrix.scale(this.width, this.height, 1);
    projectedToScreenMatrix.translate([0.5, 0.5, 0.5]);
    projectedToScreenMatrix.scale(0.5, -0.5, 0.5);

    const modelViewMatrix = modelMatrix.copy().mult(viewMatrix);
    const modelViewProjectionMatrix = modelViewMatrix.mult(projectionMatrix);
    const worldToScreenMatrix = modelViewProjectionMatrix
      .mult(projectedToScreenMatrix);
    return worldToScreenMatrix;
  }

  //////////////////////////////////////////////
  // COLOR
  //////////////////////////////////////////////
  /**
   * Basic fill material for geometry with a given color
   * @param  {Number|Number[]|String|p5.Color} v1  gray value,
   * red or hue value (depending on the current color mode),
   * or color Array, or CSS color string
   * @param  {Number}            [v2] green or saturation value
   * @param  {Number}            [v3] blue or brightness value
   * @param  {Number}            [a]  opacity
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   * }
   *
   * function draw() {
   *   background(0);
   *   noStroke();
   *   fill(100, 100, 240);
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *   box(75, 75, 75);
   * }
   * </code>
   * </div>
   *
   * @alt
   * black canvas with purple cube spinning
   */
  fill(...args) {
    super.fill(...args);
    //see material.js for more info on color blending in webgl
    // const color = fn.color.apply(this._pInst, arguments);
    const color = this.states.fillColor;
    this.states.setValue('curFillColor', color._array);
    this.states.setValue('drawMode', constants.FILL);
    this.states.setValue('_useNormalMaterial', false);
    this.states.setValue('_tex', null);
  }

  /**
   * Basic stroke material for geometry with a given color
   * @param  {Number|Number[]|String|p5.Color} v1  gray value,
   * red or hue value (depending on the current color mode),
   * or color Array, or CSS color string
   * @param  {Number}            [v2] green or saturation value
   * @param  {Number}            [v3] blue or brightness value
   * @param  {Number}            [a]  opacity
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   * }
   *
   * function draw() {
   *   background(0);
   *   stroke(240, 150, 150);
   *   fill(100, 100, 240);
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *   box(75, 75, 75);
   * }
   * </code>
   * </div>
   *
   * @alt
   * black canvas with purple cube with pink outline spinning
   */
  stroke(...args) {
    super.stroke(...args);
    // const color = fn.color.apply(this._pInst, arguments);
    this.states.setValue('curStrokeColor', this.states.strokeColor._array);
  }

  getCommonVertexProperties() {
    return {
      ...super.getCommonVertexProperties(),
      stroke: this.states.strokeColor,
      fill: this.states.fillColor,
      normal: this.states._currentNormal,
    };
  }

  getSupportedIndividualVertexProperties() {
    return {
      textureCoordinates: true,
    };
  }

  strokeCap(cap) {
    this.curStrokeCap = cap;
  }

  strokeJoin(join) {
    this.curStrokeJoin = join;
  }
  getFilterLayer() {
    if (!this.filterLayer) {
      this.filterLayer = new Framebuffer(this);
    }
    return this.filterLayer;
  }
  getFilterLayerTemp() {
    if (!this.filterLayerTemp) {
      this.filterLayerTemp = new Framebuffer(this);
    }
    return this.filterLayerTemp;
  }
  matchSize(fboToMatch, target) {
    if (
      fboToMatch.width !== target.width ||
      fboToMatch.height !== target.height
    ) {
      fboToMatch.resize(target.width, target.height);
    }

    if (fboToMatch.pixelDensity() !== target.pixelDensity()) {
      fboToMatch.pixelDensity(target.pixelDensity());
    }
  }
  filter(...args) {
    let fbo = this.getFilterLayer();

    // use internal shader for filter constants BLUR, INVERT, etc
    let filterParameter = undefined;
    let operation = undefined;
    if (typeof args[0] === 'string') {
      operation = args[0];
      let useDefaultParam =
        operation in filterParamDefaults && args[1] === undefined;
      filterParameter = useDefaultParam
        ? filterParamDefaults[operation]
        : args[1];

      // Create and store shader for constants once on initial filter call.
      // Need to store multiple in case user calls different filters,
      // eg. filter(BLUR) then filter(GRAY)
      if (!(operation in this.defaultFilterShaders)) {
        this.defaultFilterShaders[operation] = this._makeFilterShader(fbo.renderer, operation);
      }
      this.states.setValue(
        'filterShader',
        this.defaultFilterShaders[operation]
      );
    }
    // use custom user-supplied shader
    else {
      this.states.setValue('filterShader', args[0]);
    }

    // Setting the target to the framebuffer when applying a filter to a framebuffer.

    const target = this.activeFramebuffer() || this;

    // Resize the framebuffer 'fbo' and adjust its pixel density if it doesn't match the target.
    this.matchSize(fbo, target);

    fbo.draw(() => this.clear()); // prevent undesirable feedback effects accumulating secretly.

    let texelSize = [
      1 / (target.width * target.pixelDensity()),
      1 / (target.height * target.pixelDensity()),
    ];

    // apply blur shader with multiple passes.
    if (operation === constants.BLUR) {
      // Treating 'tmp' as a framebuffer.
      const tmp = this.getFilterLayerTemp();
      // Resize the framebuffer 'tmp' and adjust its pixel density if it doesn't match the target.
      this.matchSize(tmp, target);
      // setup
      this.push();
      this.states.setValue('strokeColor', null);
      this.blendMode(constants.BLEND);

      // draw main to temp buffer
      this.shader(this.states.filterShader);
      this.states.filterShader.setUniform('texelSize', texelSize);
      this.states.filterShader.setUniform('canvasSize', [
        target.width,
        target.height,
      ]);
      this.states.filterShader.setUniform(
        'radius',
        Math.max(1, filterParameter)
      );

      // Horiz pass: draw `target` to `tmp`
      tmp.draw(() => {
        this.states.filterShader.setUniform('direction', [1, 0]);
        this.states.filterShader.setUniform('tex0', target);
        this.clear();
        this.shader(this.states.filterShader);
        this.noLights();
        this.plane(target.width, target.height);
      });

      // Vert pass: draw `tmp` to `fbo`
      fbo.draw(() => {
        this.states.filterShader.setUniform('direction', [0, 1]);
        this.states.filterShader.setUniform('tex0', tmp);
        this.clear();
        this.shader(this.states.filterShader);
        this.noLights();
        this.plane(target.width, target.height);
      });

      this.pop();
    }
    // every other non-blur shader uses single pass
    else {
      fbo.draw(() => {
        this.states.setValue('strokeColor', null);
        this.blendMode(constants.BLEND);
        this.shader(this.states.filterShader);
        this.states.filterShader.setUniform('tex0', target);
        this.states.filterShader.setUniform('texelSize', texelSize);
        this.states.filterShader.setUniform('canvasSize', [
          target.width,
          target.height,
        ]);
        // filterParameter uniform only used for POSTERIZE, and THRESHOLD
        // but shouldn't hurt to always set
        this.states.filterShader.setUniform('filterParameter', filterParameter);
        this.noLights();
        this.plane(target.width, target.height);
      });
    }
    // draw fbo contents onto main renderer.
    this.push();
    this.states.setValue('strokeColor', null);
    this.clear();
    this.push();
    this.states.setValue('imageMode', constants.CORNER);
    this.blendMode(constants.BLEND);
    target.filterCamera._resize();
    this.setCamera(target.filterCamera);
    this.resetMatrix();
    this._drawingFilter = true;
    this.image(
      fbo,
      0,
      0,
      fbo.width,
      fbo.height,
      -target.width / 2,
      -target.height / 2,
      target.width,
      target.height
    );
    this._drawingFilter = false;
    this.clearDepth();
    this.pop();
    this.pop();
  }

  // Pass this off to the host instance so that we can treat a renderer and a
  // framebuffer the same in filter()

  pixelDensity(newDensity) {
    if (newDensity) {
      return this._pInst.pixelDensity(newDensity);
    }
    return this._pInst.pixelDensity();
  }

  blendMode(mode) {
    if (
      mode === constants.DARKEST ||
      mode === constants.LIGHTEST ||
      mode === constants.ADD ||
      mode === constants.BLEND ||
      mode === constants.SUBTRACT ||
      mode === constants.SCREEN ||
      mode === constants.EXCLUSION ||
      mode === constants.REPLACE ||
      mode === constants.MULTIPLY ||
      mode === constants.REMOVE
    )
      this.states.setValue('curBlendMode', mode);
    else if (
      mode === constants.BURN ||
      mode === constants.OVERLAY ||
      mode === constants.HARD_LIGHT ||
      mode === constants.SOFT_LIGHT ||
      mode === constants.DODGE
    ) {
      console.warn(
        'BURN, OVERLAY, HARD_LIGHT, SOFT_LIGHT, and DODGE only work for blendMode in 2D mode.'
      );
    }
  }

  erase(opacityFill, opacityStroke) {
    if (!this._isErasing) {
      this.preEraseBlend = this.states.curBlendMode;
      this._isErasing = true;
      this.blendMode(constants.REMOVE);
      this._cachedFillStyle = this.states.curFillColor.slice();
      this.states.setValue('curFillColor', [1, 1, 1, opacityFill / 255]);
      this._cachedStrokeStyle = this.states.curStrokeColor.slice();
      this.states.setValue('curStrokeColor', [1, 1, 1, opacityStroke / 255]);
    }
  }

  noErase() {
    if (this._isErasing) {
      // Restore colors
      this.states.setValue('curFillColor', this._cachedFillStyle.slice());
      this.states.setValue('curStrokeColor', this._cachedStrokeStyle.slice());
      // Restore blend mode
      this.states.setValue('curBlendMode', this.preEraseBlend);
      this.blendMode(this.preEraseBlend);
      // Ensure that _applyBlendMode() sets preEraseBlend back to the original blend mode
      this._isErasing = false;
      this._applyBlendMode();
    }
  }

  _applyBlendMode() {
    // By default, a noop
  }

  drawTarget() {
    return this.activeFramebuffers[this.activeFramebuffers.length - 1] || this;
  }

  beginClip(options = {}) {
    super.beginClip(options);

    this.drawTarget()._isClipApplied = true;

    this._applyClip();

    this.push();
    this.resetShader();
    if (this.states.fillColor) this.fill(0, 0);
    if (this.states.strokeColor) this.stroke(0, 0);
  }

  endClip() {
    this.pop();

    this._unapplyClip();

    // Mark the depth at which the clip has been applied so that we can clear it
    // when we pop past this depth
    this._clipDepths.push(this._pushPopDepth);

    super.endClip();
  }

  _clearClip() {
    this._clearClipBuffer();
    if (this._clipDepths.length > 0) {
      this._clipDepths.pop();
    }
    this.drawTarget()._isClipApplied = false;
  }

  /**
   * @private
   * @returns {p5.Framebuffer} A p5.Framebuffer set to match the size and settings
   * of the renderer's canvas. It will be created if it does not yet exist, and
   * reused if it does.
   */
  _getTempFramebuffer() {
    if (!this._tempFramebuffer) {
      this._tempFramebuffer = new Framebuffer(this, {
        format: constants.UNSIGNED_BYTE,
        useDepth: this._pInst._glAttributes.depth,
        depthFormat: constants.UNSIGNED_INT,
        antialias: this._pInst._glAttributes.antialias,
      });
    }
    return this._tempFramebuffer;
  }

  //////////////////////////////////////////////
  // HASH | for geometry
  //////////////////////////////////////////////

  geometryInHash(gid) {
    return this.geometryBufferCache.isCached(gid);
  }

  /**
   * [resize description]
   * @private
   * @param  {Number} w [description]
   * @param  {Number} h [description]
   */
  resize(w, h) {
    super.resize(w, h);

    // save canvas properties
    const props = {};
    for (const key in this.drawingContext) {
      const val = this.drawingContext[key];
      if (typeof val !== "object" && typeof val !== "function") {
        props[key] = val;
      }
    }

    const dimensions = this._adjustDimensions(w, h);
    w = dimensions.adjustedWidth;
    h = dimensions.adjustedHeight;

    this.width = w;
    this.height = h;

    this.canvas.width = w * this._pixelDensity;
    this.canvas.height = h * this._pixelDensity;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this._updateViewport();
    this._updateSize();

    this.mainCamera._resize();
    if (this.states.curCamera !== this.mainCamera) {
      this.states.curCamera._resize();
    }

    //resize pixels buffer
    if (typeof this.pixels !== "undefined") {
      this._createPixelsArray();
    }

    for (const framebuffer of this.framebuffers) {
      // Notify framebuffers of the resize so that any auto-sized framebuffers
      // can also update their size
      this.flushDraw?.();
      framebuffer._canvasSizeChanged();
    }
    this.flushDraw?.();

    // reset canvas properties
    for (const savedKey in props) {
      try {
        this.drawingContext[savedKey] = props[savedKey];
      } catch (err) {
        // ignore read-only property errors
      }
    }
  }

  applyMatrix(a, b, c, d, e, f) {
    this.states.setValue("uModelMatrix", this.states.uModelMatrix.clone());
    if (arguments.length === 16) {
      // this.states.uModelMatrix.apply(arguments);
      Matrix.prototype.apply.apply(this.states.uModelMatrix, arguments);
    } else {
      this.states.uModelMatrix.apply([
        a,
        b,
        0,
        0,
        c,
        d,
        0,
        0,
        0,
        0,
        1,
        0,
        e,
        f,
        0,
        1,
      ]);
    }
  }

  /**
   * [translate description]
   * @private
   * @param  {Number} x [description]
   * @param  {Number} y [description]
   * @param  {Number} z [description]
   * @chainable
   * @todo implement handle for components or vector as args
   */
  translate(x, y, z) {
    if (x instanceof Vector) {
      z = x.z;
      y = x.y;
      x = x.x;
    }
    this.states.setValue("uModelMatrix", this.states.uModelMatrix.clone());
    this.states.uModelMatrix.translate([x, y, z]);
    return this;
  }

  /**
   * Scales the Model View Matrix by a vector
   * @private
   * @param  {Number | p5.Vector | Array} x [description]
   * @param  {Number} [y] y-axis scalar
   * @param  {Number} [z] z-axis scalar
   * @chainable
   */
  scale(x, y, z) {
    this.states.setValue("uModelMatrix", this.states.uModelMatrix.clone());
    this.states.uModelMatrix.scale(x, y, z);
    return this;
  }

  rotate(rad, axis) {
    if (typeof axis === "undefined") {
      return this.rotateZ(rad);
    }
    this.states.setValue("uModelMatrix", this.states.uModelMatrix.clone());
    Matrix.prototype.rotate4x4.apply(this.states.uModelMatrix, arguments);
    return this;
  }

  rotateX(rad) {
    this.rotate(rad, 1, 0, 0);
    return this;
  }

  rotateY(rad) {
    this.rotate(rad, 0, 1, 0);
    return this;
  }

  rotateZ(rad) {
    this.rotate(rad, 0, 0, 1);
    return this;
  }

  pop(...args) {
    if (
      this._clipDepths.length > 0 &&
      this._pushPopDepth === this._clipDepths[this._clipDepths.length - 1]
    ) {
      this._clearClip();
      if (!this._userEnabledStencil) {
        this._internalDisable.call(this.GL, this.GL.STENCIL_TEST);
      }

    // Reset saved state
    // this._userEnabledStencil = this._savedStencilTestState;
    }
    super.pop(...args);
    this._applyStencilTestIfClipping();
  }

  resetMatrix() {
    this.states.setValue("uModelMatrix", this.states.uModelMatrix.clone());
    this.states.uModelMatrix.reset();
    this.states.setValue("uViewMatrix", this.states.uViewMatrix.clone());
    this.states.uViewMatrix.set(this.states.curCamera.cameraMatrix);
    return this;
  }

  //////////////////////////////////////////////
  // SHADER
  //////////////////////////////////////////////

  _getStrokeShader() {
    // select the stroke shader to use
    const stroke = this.states.userStrokeShader;
    if (stroke) {
      return stroke;
    }
    return this._getLineShader();
  }

  /*
   * This method will handle both image shaders and
   * fill shaders, returning the appropriate shader
   * depending on the current context (image or shape).
   */
  _getFillShader() {
    // If drawing an image, check for user-defined image shader and filters
    if (this._drawingImage) {
      // Use user-defined image shader if available and no filter is applied
      if (this.states.userImageShader && !this._drawingFilter) {
        return this.states.userImageShader;
      } else {
        return this._getLightShader(); // Fallback to light shader
      }
    }
    // If user has defined a fill shader, return that
    else if (this.states.userFillShader) {
      return this.states.userFillShader;
    }
    // Use normal shader if normal material is active
    else if (this.states._useNormalMaterial) {
      return this._getNormalShader();
    }
    // Use light shader if lighting or textures are enabled
    else if (this.states.enableLighting || this.states._tex) {
      return this._getLightShader();
    }
    // Default to color shader if no other conditions are met
    return this._getColorShader();
  }

  _getPointShader() {
    // select the point shader to use
    const point = this.states.userPointShader;
    if (!point || !point.isPointShader()) {
      return this._getPointShader();
    }
    return point;
  }

  baseMaterialShader() {
    return this._getLightShader();
  }

  baseNormalShader() {
    return this._getNormalShader();
  }

  baseColorShader() {
    return this._getColorShader();
  }

  /**
   * TODO(dave): un-private this when there is a way to actually override the
   * shader used for points
   *
   * Get the shader used when drawing points with <a href="#/p5/point">`point()`</a>.
   *
   * You can call <a href="#/p5.Shader/modify">`pointShader().modify()`</a>
   * and change any of the following hooks:
   * - `void beforeVertex`: Called at the start of the vertex shader.
   * - `vec3 getLocalPosition`: Update the position of vertices before transforms are applied. It takes in `vec3 position` and must return a modified version.
   * - `vec3 getWorldPosition`: Update the position of vertices after transforms are applied. It takes in `vec3 position` and pust return a modified version.
   * - `float getPointSize`: Update the size of the point. It takes in `float size` and must return a modified version.
   * - `void afterVertex`: Called at the end of the vertex shader.
   * - `void beforeFragment`: Called at the start of the fragment shader.
   * - `bool shouldDiscard`: Points are drawn inside a square, with the corners discarded in the fragment shader to create a circle. Use this to change this logic. It takes in a `bool willDiscard` and must return a modified version.
   * - `vec4 getFinalColor`: Update the final color after mixing. It takes in a `vec4 color` and must return a modified version.
   * - `void afterFragment`: Called at the end of the fragment shader.
   *
   * Call `pointShader().inspectHooks()` to see all the possible hooks and
   * their default implementations.
   *
   * @returns {p5.Shader} The `point()` shader
   * @private()
   */
  pointShader() {
    return this._getPointShader();
  }

  baseStrokeShader() {
    return this._getLineShader();
  }

  /**
   * @private
   * @returns {p5.Framebuffer|null} The currently active framebuffer, or null if
   * the main canvas is the current draw target.
   */
  activeFramebuffer() {
    return this.activeFramebuffers[this.activeFramebuffers.length - 1] || null;
  }

  createFramebuffer(options) {
    return new Framebuffer(this, options);
  }

  _setGlobalUniforms(shader) {
    const modelMatrix = this.states.uModelMatrix;
    const viewMatrix = this.states.uViewMatrix;
    const projectionMatrix = this.states.uPMatrix;
    const modelViewMatrix = modelMatrix.copy().mult(viewMatrix);

    shader.setUniform(
      "uPerspective",
      this.states.curCamera.useLinePerspective ? 1 : 0
    );
    shader.setUniform("uViewMatrix", viewMatrix.mat4);
    shader.setUniform("uProjectionMatrix", projectionMatrix.mat4);
    shader.setUniform("uModelMatrix", modelMatrix.mat4);
    shader.setUniform("uModelViewMatrix", modelViewMatrix.mat4);
    if (shader.uniforms.uModelViewProjectionMatrix) {
      const modelViewProjectionMatrix = modelViewMatrix.copy();
      modelViewProjectionMatrix.mult(projectionMatrix);
      shader.setUniform(
        "uModelViewProjectionMatrix",
        modelViewProjectionMatrix.mat4
      );
    }
    if (shader.uniforms.uNormalMatrix) {
      this.scratchMat3.inverseTranspose4x4(modelViewMatrix);
      shader.setUniform("uNormalMatrix", this.scratchMat3.mat3);
    }
    if (shader.uniforms.uModelNormalMatrix) {
      this.scratchMat3.inverseTranspose4x4(this.states.uModelMatrix);
      shader.setUniform("uModelNormalMatrix", this.scratchMat3.mat3);
    }
    if (shader.uniforms.uCameraNormalMatrix) {
      this.scratchMat3.inverseTranspose4x4(this.states.uViewMatrix);
      shader.setUniform("uCameraNormalMatrix", this.scratchMat3.mat3);
    }
    if (shader.uniforms.uCameraRotation) {
      this.scratchMat3.inverseTranspose4x4(this.states.uViewMatrix);
      shader.setUniform("uCameraRotation", this.scratchMat3.mat3);
    }
    shader.setUniform("uViewport", this._viewport);
  }

  _setStrokeUniforms(strokeShader) {
    // set the uniform values
    strokeShader.setUniform("uSimpleLines", this._simpleLines);
    strokeShader.setUniform("uUseLineColor", this._useLineColor);
    strokeShader.setUniform("uMaterialColor", this.states.curStrokeColor);
    strokeShader.setUniform("uStrokeWeight", this.states.strokeWeight);
    strokeShader.setUniform("uStrokeCap", STROKE_CAP_ENUM[this.curStrokeCap]);
    strokeShader.setUniform(
      "uStrokeJoin",
      STROKE_JOIN_ENUM[this.curStrokeJoin]
    );
  }

  _setFillUniforms(fillShader) {
    this.mixedSpecularColor = [...this.states.curSpecularColor];
    const empty = this._getEmptyTexture();

    if (this.states._useMetalness > 0) {
      this.mixedSpecularColor = this.mixedSpecularColor.map(
        (mixedSpecularColor, index) =>
          this.states.curFillColor[index] * this.states._useMetalness +
          mixedSpecularColor * (1 - this.states._useMetalness)
      );
    }

    // TODO: optimize
    fillShader.setUniform("uUseVertexColor", this._useVertexColor);
    fillShader.setUniform("uMaterialColor", this.states.curFillColor);
    fillShader.setUniform("isTexture", !!this.states._tex);
    // We need to explicitly set uSampler back to an empty texture here.
    // In general, we record the last set texture so we can re-apply it
    // the next time a shader is used. However, the texture() function
    // works differently and is global p5 state. If the p5 state has
    // been cleared, we also need to clear the value in uSampler to match.
    fillShader.setUniform("uSampler", this.states._tex || empty);
    fillShader.setUniform("uTint", this.states.tint);

    fillShader.setUniform("uHasSetAmbient", this.states._hasSetAmbient);
    fillShader.setUniform("uAmbientMatColor", this.states.curAmbientColor);
    fillShader.setUniform("uSpecularMatColor", this.mixedSpecularColor);
    fillShader.setUniform("uEmissiveMatColor", this.states.curEmissiveColor);
    fillShader.setUniform("uSpecular", this.states._useSpecularMaterial);
    fillShader.setUniform("uEmissive", this.states._useEmissiveMaterial);
    fillShader.setUniform("uShininess", this.states._useShininess);
    fillShader.setUniform("uMetallic", this.states._useMetalness);

    this._setImageLightUniforms(fillShader);

    fillShader.setUniform("uUseLighting", this.states.enableLighting);

    const pointLightCount = this.states.pointLightDiffuseColors.length / 3;
    fillShader.setUniform("uPointLightCount", pointLightCount);
    fillShader.setUniform(
      "uPointLightLocation",
      this.states.pointLightPositions
    );
    fillShader.setUniform(
      "uPointLightDiffuseColors",
      this.states.pointLightDiffuseColors
    );
    fillShader.setUniform(
      "uPointLightSpecularColors",
      this.states.pointLightSpecularColors
    );

    const directionalLightCount =
      this.states.directionalLightDiffuseColors.length / 3;
    fillShader.setUniform("uDirectionalLightCount", directionalLightCount);
    fillShader.setUniform(
      "uLightingDirection",
      this.states.directionalLightDirections
    );
    fillShader.setUniform(
      "uDirectionalDiffuseColors",
      this.states.directionalLightDiffuseColors
    );
    fillShader.setUniform(
      "uDirectionalSpecularColors",
      this.states.directionalLightSpecularColors
    );

    // TODO: sum these here...
    let mixedAmbientLight = [0, 0, 0];
    for (let i = 0; i < this.states.ambientLightColors.length; i += 3) {
      for (let off = 0; off < 3; off++) {
        if (this.states._useMetalness > 0) {
          mixedAmbientLight[off] += Math.max(
            0,
            this.states.ambientLightColors[i + off] - this.states._useMetalness
          );
        } else {
          mixedAmbientLight[off] += this.states.ambientLightColors[i + off];
        }
      }
    }
    fillShader.setUniform("uAmbientColor", mixedAmbientLight);

    const spotLightCount = this.states.spotLightDiffuseColors.length / 3;
    fillShader.setUniform("uSpotLightCount", spotLightCount);
    fillShader.setUniform("uSpotLightAngle", this.states.spotLightAngle);
    fillShader.setUniform("uSpotLightConc", this.states.spotLightConc);
    fillShader.setUniform(
      "uSpotLightDiffuseColors",
      this.states.spotLightDiffuseColors
    );
    fillShader.setUniform(
      "uSpotLightSpecularColors",
      this.states.spotLightSpecularColors
    );
    fillShader.setUniform("uSpotLightLocation", this.states.spotLightPositions);
    fillShader.setUniform(
      "uSpotLightDirection",
      this.states.spotLightDirections
    );

    fillShader.setUniform(
      "uConstantAttenuation",
      this.states.constantAttenuation
    );
    fillShader.setUniform("uLinearAttenuation", this.states.linearAttenuation);
    fillShader.setUniform(
      "uQuadraticAttenuation",
      this.states.quadraticAttenuation
    );
  }

  // getting called from _setFillUniforms
  _setImageLightUniforms(shader) {
    //set uniform values
    shader.setUniform("uUseImageLight", this.states.activeImageLight != null);
    // true
    if (this.states.activeImageLight) {
      // this.states.activeImageLight has image as a key
      // look up the texture from the diffusedTexture map
      let diffusedLight = this.getDiffusedTexture(this.states.activeImageLight);
      shader.setUniform("environmentMapDiffused", diffusedLight);
      let specularLight = this.getSpecularTexture(this.states.activeImageLight);

      shader.setUniform("environmentMapSpecular", specularLight);
    }
  }

  /**
   * @private
   * Note: DO NOT CALL THIS while in the middle of binding another texture,
   * since it will change the texture binding in order to allocate the empty
   * texture! Grab its value beforehand!
   */
  _getEmptyTexture() {
    if (!this._emptyTexture) {
      // a plain white texture RGBA, full alpha, single pixel.
      const im = new Image(1, 1);
      im.set(0, 0, 255);
      this._emptyTexture = new Texture(this, im);
    }
    return this._emptyTexture;
  }

  getTexture(input) {
    let src = input;
    if (src instanceof Framebuffer) {
      src = src.color;
    }

    const texture = this.textures.get(src);
    if (texture) {
      return texture;
    }

    const tex = new Texture(this, src);
    this.textures.set(src, tex);
    return tex;
  }

  //////////////////////////////////////////////
  // Buffers
  //////////////////////////////////////////////

  _normalizeBufferData(values, type = Float32Array) {
    if (!values) return null;
    if (values instanceof DataArray) {
      return values.dataArray();
    }
    if (values instanceof type) {
      return values;
    }
    return new type(values);
  }

  ///////////////////////////////
  //// UTILITY FUNCTIONS
  //////////////////////////////
  _arraysEqual(a, b) {
    const aLength = a.length;
    if (aLength !== b.length) return false;
    return a.every((ai, i) => ai === b[i]);
  }

  _isTypedArray(arr) {
    return [
      Float32Array,
      Float64Array,
      Int16Array,
      Uint16Array,
      Uint32Array,
    ].some((x) => arr instanceof x);
  }

  /**
   * turn a p5.Vector Array into a one dimensional number array
   * @private
   * @param  {p5.Vector[]} arr  an array of p5.Vector
   * @return {Number[]}     a one dimensional array of numbers
   * [p5.Vector(1, 2, 3), p5.Vector(4, 5, 6)] ->
   * [1, 2, 3, 4, 5, 6]
   */
  _vToNArray(arr) {
    return arr.flatMap((item) => [item.x, item.y, item.z]);
  }

  ///////////////////////////////
  //// TEXT SUPPORT METHODS
  //////////////////////////////

  textCanvas() {
    if (!this._textCanvas) {
      this._textCanvas = document.createElement('canvas');
      this._textCanvas.width = 1;
      this._textCanvas.height = 1;
      this._textCanvas.style.display = 'none';
      // Has to be added to the DOM for measureText to work properly!
      this.canvas.parentElement.insertBefore(this._textCanvas, this.canvas);
    }
    return this._textCanvas;
  }

  textDrawingContext() {
    if (!this._textDrawingContext) {
      const textCanvas = this.textCanvas();
      this._textDrawingContext = textCanvas.getContext('2d');
    }
    return this._textDrawingContext;
  }

  _positionLines(x, y, width, height, lines) {
    let { textLeading, textAlign } = this.states;
    const widths = lines.map(line => this._fontWidthSingle(line));
    let adjustedX, lineData = new Array(lines.length);
    let adjustedW = typeof width === 'undefined' ? Math.max(0, ...widths) : width;
    let adjustedH = typeof height === 'undefined' ? 0 : height;

    for (let i = 0; i < lines.length; i++) {
      switch (textAlign) {
        case textCoreConstants.START:
          throw new Error('textBounds: START not yet supported for textAlign'); // default to LEFT
        case constants.LEFT:
          adjustedX = x;
          break;
        case constants.CENTER:
          adjustedX = x +
            (adjustedW - widths[i]) / 2 -
            adjustedW / 2 +
            (width || 0) / 2;
          break;
        case constants.RIGHT:
          adjustedX = x + adjustedW - widths[i] - adjustedW + (width || 0);
          break;
        case textCoreConstants.END:
          throw new Error('textBounds: END not yet supported for textAlign');
        default:
          adjustedX = x;
          break;
      }
      lineData[i] = { text: lines[i], x: adjustedX, y: y + i * textLeading };
    }

    return this._yAlignOffset(lineData, adjustedH);
  }

  _yAlignOffset(dataArr, height) {
    if (typeof height === 'undefined') {
      throw Error('_yAlignOffset: height is required');
    }

    let { textLeading, textBaseline, textSize, textFont } = this.states;
    let yOff = 0, numLines = dataArr.length;
    let totalHeight = textSize * numLines +
      ((textLeading - textSize) * (numLines - 1));
    switch (textBaseline) { // drawingContext ?
      case constants.TOP:
        yOff = textSize;
        break;
      case constants.BASELINE:
        break;
      case textCoreConstants._CTX_MIDDLE:
        yOff = -totalHeight / 2 + textSize + (height || 0) / 2;
        break;
      case constants.BOTTOM:
        yOff = -(totalHeight - textSize) + (height || 0);
        break;
      default:
        console.warn(`${textBaseline} is not supported in WebGL mode.`); // FES?
        break;
    }
    yOff += this.states.textFont.font?._verticalAlign(textSize) || 0;
    dataArr.forEach(ele => ele.y += yOff);
    return dataArr;
  }

  remove() {
    if (this._textCanvas) {
      this._textCanvas.parentElement.removeChild(this._textCanvas);
    }
    super.remove();
  }
}
