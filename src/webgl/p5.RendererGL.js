import * as constants from "../core/constants";
import GeometryBuilder from "./GeometryBuilder";
import { Renderer } from "../core/p5.Renderer";
import { Matrix } from "../math/p5.Matrix";
import { Camera } from "./p5.Camera";
import { Vector } from "../math/p5.Vector";
import { RenderBuffer } from "./p5.RenderBuffer";
import { DataArray } from "./p5.DataArray";
import { Shader } from "./p5.Shader";
import { Image } from "../image/p5.Image";
import { Texture, MipmapTexture } from "./p5.Texture";
import { Framebuffer } from "./p5.Framebuffer";
import { Graphics } from "../core/p5.Graphics";
import { Element } from "../dom/p5.Element";
import { ShapeBuilder } from "./ShapeBuilder";
import { GeometryBufferCache } from "./GeometryBufferCache";
import { filterParamDefaults } from "../image/const";

import filterBaseVert from "./shaders/filters/base.vert";
import lightingShader from "./shaders/lighting.glsl";
import webgl2CompatibilityShader from "./shaders/webgl2Compatibility.glsl";
import normalVert from "./shaders/normal.vert";
import normalFrag from "./shaders/normal.frag";
import basicFrag from "./shaders/basic.frag";
import sphereMappingFrag from "./shaders/sphereMapping.frag";
import lightVert from "./shaders/light.vert";
import lightTextureFrag from "./shaders/light_texture.frag";
import phongVert from "./shaders/phong.vert";
import phongFrag from "./shaders/phong.frag";
import fontVert from "./shaders/font.vert";
import fontFrag from "./shaders/font.frag";
import lineVert from "./shaders/line.vert";
import lineFrag from "./shaders/line.frag";
import pointVert from "./shaders/point.vert";
import pointFrag from "./shaders/point.frag";
import imageLightVert from "./shaders/imageLight.vert";
import imageLightDiffusedFrag from "./shaders/imageLightDiffused.frag";
import imageLightSpecularFrag from "./shaders/imageLightSpecular.frag";

import filterBaseFrag from "./shaders/filters/base.frag";
import filterGrayFrag from "./shaders/filters/gray.frag";
import filterErodeFrag from "./shaders/filters/erode.frag";
import filterDilateFrag from "./shaders/filters/dilate.frag";
import filterBlurFrag from "./shaders/filters/blur.frag";
import filterPosterizeFrag from "./shaders/filters/posterize.frag";
import filterOpaqueFrag from "./shaders/filters/opaque.frag";
import filterInvertFrag from "./shaders/filters/invert.frag";
import filterThresholdFrag from "./shaders/filters/threshold.frag";
import filterShaderVert from "./shaders/filters/default.vert";
import { PrimitiveToVerticesConverter } from "../shape/custom_shapes";
import { Color } from "../color/p5.Color";

const STROKE_CAP_ENUM = {};
const STROKE_JOIN_ENUM = {};
let lineDefs = "";
const defineStrokeCapEnum = function (key, val) {
  lineDefs += `#define STROKE_CAP_${key} ${val}\n`;
  STROKE_CAP_ENUM[constants[key]] = val;
};
const defineStrokeJoinEnum = function (key, val) {
  lineDefs += `#define STROKE_JOIN_${key} ${val}\n`;
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

const defaultShaders = {
  normalVert,
  normalFrag,
  basicFrag,
  sphereMappingFrag,
  lightVert: lightingShader + lightVert,
  lightTextureFrag,
  phongVert,
  phongFrag: lightingShader + phongFrag,
  fontVert,
  fontFrag,
  lineVert: lineDefs + lineVert,
  lineFrag: lineDefs + lineFrag,
  pointVert,
  pointFrag,
  imageLightVert,
  imageLightDiffusedFrag,
  imageLightSpecularFrag,
  filterBaseVert,
  filterBaseFrag,
};
let sphereMapping = defaultShaders.sphereMappingFrag;
for (const key in defaultShaders) {
  defaultShaders[key] = webgl2CompatibilityShader + defaultShaders[key];
}

const filterShaderFrags = {
  [constants.GRAY]: filterGrayFrag,
  [constants.ERODE]: filterErodeFrag,
  [constants.DILATE]: filterDilateFrag,
  [constants.BLUR]: filterBlurFrag,
  [constants.POSTERIZE]: filterPosterizeFrag,
  [constants.OPAQUE]: filterOpaqueFrag,
  [constants.INVERT]: filterInvertFrag,
  [constants.THRESHOLD]: filterThresholdFrag,
};

/**
 * 3D graphics class
 * @private
 * @class p5.RendererGL
 * @extends p5.Renderer
 * @todo extend class to include public method for offscreen
 * rendering (FBO).
 */
class RendererGL extends Renderer {
  constructor(pInst, w, h, isMainCanvas, elt, attr) {
    super(pInst, w, h, isMainCanvas);

    // Create new canvas
    this.canvas = this.elt = elt || document.createElement("canvas");
    this._setAttributeDefaults(pInst);
    this._initContext();
    // This redundant property is useful in reminding you that you are
    // interacting with WebGLRenderingContext, still worth considering future removal
    this.GL = this.drawingContext;

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
    this._origViewport = {
      width: this.GL.drawingBufferWidth,
      height: this.GL.drawingBufferHeight,
    };
    this.viewport(this._origViewport.width, this._origViewport.height);

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

    this.states.curCamera = new Camera(this);
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
    this._cachedBlendMode = undefined;
    this._cachedFillStyle = [1, 1, 1, 1];
    this._cachedStrokeStyle = [0, 0, 0, 1];
    if (this.webglVersion === constants.WEBGL2) {
      this.blendExt = this.GL;
    } else {
      this.blendExt = this.GL.getExtension("EXT_blend_minmax");
    }
    this._isBlending = false;

    this._useLineColor = false;
    this._useVertexColor = false;

    this.registerEnabled = new Set();

    // Camera
    this.states.curCamera._computeCameraDefaultSettings();
    this.states.curCamera._setDefaultCamera();

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
        ),
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
        ),
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
      point: this.GL.createBuffer(),
      user: [],
    };

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

    this._userEnabledStencil = false;
    // Store original methods for internal use
    this._internalEnable = this.drawingContext.enable;
    this._internalDisable = this.drawingContext.disable;

    // Override WebGL enable function
    this.drawingContext.enable = (key) => {
      if (key === this.drawingContext.STENCIL_TEST) {
        if (!this._clipping) {
          this._userEnabledStencil = true;
        }
      }
      return this._internalEnable.call(this.drawingContext, key);
    };

    // Override WebGL disable function
    this.drawingContext.disable = (key) => {
      if (key === this.drawingContext.STENCIL_TEST) {
          this._userEnabledStencil = false;
      }
      return this._internalDisable.call(this.drawingContext, key);
    };
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
    this.fill(this.geometryBuilder.prevFillColor);
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
        this.shapeBuilder.shapeMode
      );
    } else if (this.states.fillColor || this.states.strokeColor) {
      if (this.shapeBuilder.shapeMode === constants.POINTS) {
        this._drawPoints(
          this.shapeBuilder.geometry.vertices,
          this.buffers.point
        );
      } else {
        this._drawGeometry(this.shapeBuilder.geometry, {
          mode: this.shapeBuilder.shapeMode,
          count: this.drawShapeCount,
        });
      }
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

  _drawFills(geometry, { count, mode } = {}) {
    this._useVertexColor = geometry.vertexColors.length > 0;

    const shader =
      !this._drawingFilter && this.states.userFillShader
        ? this.states.userFillShader
        : this._getFillShader();
    shader.bindShader();
    this._setGlobalUniforms(shader);
    this._setFillUniforms(shader);
    shader.bindTextures();

    for (const buff of this.buffers.fill) {
      buff._prepareBuffer(geometry, shader);
    }
    this._prepareUserAttributes(geometry, shader);
    shader.disableRemainingAttributes();

    this._applyColorBlend(
      this.states.curFillColor,
      geometry.hasFillTransparency()
    );

    this._drawBuffers(geometry, { mode, count });

    shader.unbindShader();
  }

  _drawStrokes(geometry, { count } = {}) {
    const gl = this.GL;

    this._useLineColor = geometry.vertexStrokeColors.length > 0;

    const shader = this._getStrokeShader();
    shader.bindShader();
    this._setGlobalUniforms(shader);
    this._setStrokeUniforms(shader);
    shader.bindTextures();

    for (const buff of this.buffers.stroke) {
      buff._prepareBuffer(geometry, shader);
    }
    this._prepareUserAttributes(geometry, shader);
    shader.disableRemainingAttributes();

    this._applyColorBlend(
      this.states.curStrokeColor,
      geometry.hasStrokeTransparency()
    );

    if (count === 1) {
      gl.drawArrays(gl.TRIANGLES, 0, geometry.lineVertices.length / 3);
    } else {
      try {
        gl.drawArraysInstanced(
          gl.TRIANGLES,
          0,
          geometry.lineVertices.length / 3,
          count
        );
      } catch (e) {
        console.log(
          "🌸 p5.js says: Instancing is only supported in WebGL2 mode"
        );
      }
    }

    shader.unbindShader();
  }

  _drawPoints(vertices, vertexBuffer) {
    const gl = this.GL;
    const pointShader = this._getPointShader();
    pointShader.bindShader();
    this._setGlobalUniforms(pointShader);
    this._setPointUniforms(pointShader);
    pointShader.bindTextures();

    this._bindBuffer(
      vertexBuffer,
      gl.ARRAY_BUFFER,
      this._vToNArray(vertices),
      Float32Array,
      gl.STATIC_DRAW
    );

    pointShader.enableAttrib(pointShader.attributes.aPosition, 3);

    this._applyColorBlend(this.states.curStrokeColor);

    gl.drawArrays(gl.Points, 0, vertices.length);

    pointShader.unbindShader();
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

  _drawBuffers(geometry, { mode = this.GL.TRIANGLES, count }) {
    const gl = this.GL;
    const glBuffers = this.geometryBufferCache.getCached(geometry);

    if (!glBuffers) return;

    if (glBuffers.indexBuffer) {
      this._bindBuffer(glBuffers.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);

      // If this model is using a Uint32Array we need to ensure the
      // OES_element_index_uint WebGL extension is enabled.
      if (
        this._pInst.webglVersion !== constants.WEBGL2 &&
        glBuffers.indexBufferType === gl.UNSIGNED_INT
      ) {
        if (!gl.getExtension("OES_element_index_uint")) {
          throw new Error(
            "Unable to render a 3d model with > 65535 triangles. Your web browser does not support the WebGL Extension OES_element_index_uint."
          );
        }
      }

      if (count === 1) {
        gl.drawElements(
          gl.TRIANGLES,
          geometry.faces.length * 3,
          glBuffers.indexBufferType,
          0
        );
      } else {
        try {
          gl.drawElementsInstanced(
            gl.TRIANGLES,
            geometry.faces.length * 3,
            glBuffers.indexBufferType,
            0,
            count
          );
        } catch (e) {
          console.log(
            "🌸 p5.js says: Instancing is only supported in WebGL2 mode"
          );
        }
      }
    } else {
      if (count === 1) {
        gl.drawArrays(mode, 0, geometry.vertices.length);
      } else {
        try {
          gl.drawArraysInstanced(mode, 0, geometry.vertices.length, count);
        } catch (e) {
          console.log(
            "🌸 p5.js says: Instancing is only supported in WebGL2 mode"
          );
        }
      }
    }
  }

  _getOrMakeCachedBuffers(geometry) {
    return this.geometryBufferCache.ensureCached(geometry);
  }

  //////////////////////////////////////////////
  // Setting
  //////////////////////////////////////////////

  _setAttributeDefaults(pInst) {
    // See issue #3850, safer to enable AA in Safari
    const applyAA = navigator.userAgent.toLowerCase().includes("safari");
    const defaults = {
      alpha: true,
      depth: true,
      stencil: true,
      antialias: applyAA,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      perPixelLighting: true,
      version: 2,
    };
    if (pInst._glAttributes === null) {
      pInst._glAttributes = defaults;
    } else {
      pInst._glAttributes = Object.assign(defaults, pInst._glAttributes);
    }
    return;
  }

  _initContext() {
    if (this._pInst._glAttributes?.version !== 1) {
      // Unless WebGL1 is explicitly asked for, try to create a WebGL2 context
      this.drawingContext = this.canvas.getContext(
        "webgl2",
        this._pInst._glAttributes
      );
    }
    this.webglVersion = this.drawingContext
      ? constants.WEBGL2
      : constants.WEBGL;
    // If this is the main canvas, make sure the global `webglVersion` is set
    this._pInst.webglVersion = this.webglVersion;
    if (!this.drawingContext) {
      // If we were unable to create a WebGL2 context (either because it was
      // disabled via `setAttributes({ version: 1 })` or because the device
      // doesn't support it), fall back to a WebGL1 context
      this.drawingContext =
        this.canvas.getContext("webgl", this._pInst._glAttributes) ||
        this.canvas.getContext("experimental-webgl", this._pInst._glAttributes);
    }
    if (this.drawingContext === null) {
      throw new Error("Error creating webgl context");
    } else {
      const gl = this.drawingContext;
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      // Make sure all images are loaded into the canvas premultiplied so that
      // they match the way we render colors. This will make framebuffer textures
      // be encoded the same way as textures from everything else.
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      this._viewport = this.drawingContext.getParameter(
        this.drawingContext.VIEWPORT
      );
    }
  }

  _getMaxTextureSize() {
    const gl = this.drawingContext;
    return gl.getParameter(gl.MAX_TEXTURE_SIZE);
  }

  _adjustDimensions(width, height) {
    if (!this._maxTextureSize) {
      this._maxTextureSize = this._getMaxTextureSize();
    }
    let maxTextureSize = this._maxTextureSize;

    let maxAllowedPixelDimensions = Math.floor(
      maxTextureSize / this._pixelDensity
    );
    let adjustedWidth = Math.min(width, maxAllowedPixelDimensions);
    let adjustedHeight = Math.min(height, maxAllowedPixelDimensions);

    if (adjustedWidth !== width || adjustedHeight !== height) {
      console.warn(
        "Warning: The requested width/height exceeds hardware limits. " +
          `Adjusting dimensions to width: ${adjustedWidth}, height: ${adjustedHeight}.`
      );
    }

    return { adjustedWidth, adjustedHeight };
  }

  //This is helper function to reset the context anytime the attributes
  //are changed with setAttributes()

  _resetContext(options, callback) {
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

    const renderer = new RendererGL(
      this._pInst,
      w,
      h,
      !isPGraphics,
      this._pInst.canvas
    );
    this._pInst._renderer = renderer;

    renderer._applyDefaults();

    if (typeof callback === "function") {
      //setTimeout with 0 forces the task to the back of the queue, this ensures that
      //we finish switching out the renderer
      setTimeout(() => {
        callback.apply(window._renderer, options);
      }, 0);
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
    this.GL.clearStencil(0);
    this.GL.clear(this.GL.DEPTH_BUFFER_BIT | this.GL.STENCIL_BUFFER_BIT);
    if (!this._userEnabledStencil) {
      this._internalDisable.call(this.GL, this.GL.STENCIL_TEST);
    }

  }

  /**
   * [background description]
   */
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
    const worldToScreenMatrix = modelViewProjectionMatrix.mult(projectedToScreenMatrix);
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
    this.states.setValue("curFillColor", color._array);
    this.states.setValue("drawMode", constants.FILL);
    this.states.setValue("_useNormalMaterial", false);
    this.states.setValue("_tex", null);
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
    this.states.setValue("curStrokeColor", this.states.strokeColor._array);
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
    if (typeof args[0] === "string") {
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
        this.defaultFilterShaders[operation] = new Shader(
          fbo.renderer,
          filterShaderVert,
          filterShaderFrags[operation]
        );
      }
      this.states.setValue(
        "filterShader",
        this.defaultFilterShaders[operation]
      );
    }
    // use custom user-supplied shader
    else {
      this.states.setValue("filterShader", args[0]);
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
      this.states.setValue("strokeColor", null);
      this.blendMode(constants.BLEND);

      // draw main to temp buffer
      this.shader(this.states.filterShader);
      this.states.filterShader.setUniform("texelSize", texelSize);
      this.states.filterShader.setUniform("canvasSize", [
        target.width,
        target.height,
      ]);
      this.states.filterShader.setUniform(
        "radius",
        Math.max(1, filterParameter)
      );

      // Horiz pass: draw `target` to `tmp`
      tmp.draw(() => {
        this.states.filterShader.setUniform("direction", [1, 0]);
        this.states.filterShader.setUniform("tex0", target);
        this.clear();
        this.shader(this.states.filterShader);
        this.noLights();
        this.plane(target.width, target.height);
      });

      // Vert pass: draw `tmp` to `fbo`
      fbo.draw(() => {
        this.states.filterShader.setUniform("direction", [0, 1]);
        this.states.filterShader.setUniform("tex0", tmp);
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
        this.states.setValue("strokeColor", null);
        this.blendMode(constants.BLEND);
        this.shader(this.states.filterShader);
        this.states.filterShader.setUniform("tex0", target);
        this.states.filterShader.setUniform("texelSize", texelSize);
        this.states.filterShader.setUniform("canvasSize", [
          target.width,
          target.height,
        ]);
        // filterParameter uniform only used for POSTERIZE, and THRESHOLD
        // but shouldn't hurt to always set
        this.states.filterShader.setUniform("filterParameter", filterParameter);
        this.noLights();
        this.plane(target.width, target.height);
      });
    }
    // draw fbo contents onto main renderer.
    this.push();
    this.states.setValue("strokeColor", null);
    this.clear();
    this.push();
    this.states.setValue("imageMode", constants.CORNER);
    this.blendMode(constants.BLEND);
    target.filterCamera._resize();
    this.setCamera(target.filterCamera);
    this.resetMatrix();
    this._drawingFilter = true;
    this.image(
      fbo,
      0,
      0,
      this.width,
      this.height,
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
      this.states.setValue("curBlendMode", mode);
    else if (
      mode === constants.BURN ||
      mode === constants.OVERLAY ||
      mode === constants.HARD_LIGHT ||
      mode === constants.SOFT_LIGHT ||
      mode === constants.DODGE
    ) {
      console.warn(
        "BURN, OVERLAY, HARD_LIGHT, SOFT_LIGHT, and DODGE only work for blendMode in 2D mode."
      );
    }
  }

  erase(opacityFill, opacityStroke) {
    if (!this._isErasing) {
      this.preEraseBlend = this.states.curBlendMode;
      this._isErasing = true;
      this.blendMode(constants.REMOVE);
      this._cachedFillStyle = this.states.curFillColor.slice();
      this.states.setValue("curFillColor", [1, 1, 1, opacityFill / 255]);
      this._cachedStrokeStyle = this.states.curStrokeColor.slice();
      this.states.setValue("curStrokeColor", [1, 1, 1, opacityStroke / 255]);
    }
  }

  noErase() {
    if (this._isErasing) {
      // Restore colors
      this.states.setValue("curFillColor", this._cachedFillStyle.slice());
      this.states.setValue("curStrokeColor", this._cachedStrokeStyle.slice());
      // Restore blend mode
      this.states.setValue("curBlendMode", this.preEraseBlend);
      this.blendMode(this.preEraseBlend);
      // Ensure that _applyBlendMode() sets preEraseBlend back to the original blend mode
      this._isErasing = false;
      this._applyBlendMode();
    }
  }

  drawTarget() {
    return this.activeFramebuffers[this.activeFramebuffers.length - 1] || this;
  }

  beginClip(options = {}) {
    super.beginClip(options);

    this.drawTarget()._isClipApplied = true;

    const gl = this.GL;
    gl.clearStencil(0);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    this._internalEnable.call(gl, gl.STENCIL_TEST);
    this._stencilTestOn = true;
    gl.stencilFunc(
      gl.ALWAYS, // the test
      1, // reference value
      0xff // mask
    );
    gl.stencilOp(
      gl.KEEP, // what to do if the stencil test fails
      gl.KEEP, // what to do if the depth test fails
      gl.REPLACE // what to do if both tests pass
    );
    gl.disable(gl.DEPTH_TEST);

    this.push();
    this.resetShader();
    if (this.states.fillColor) this.fill(0, 0);
    if (this.states.strokeColor) this.stroke(0, 0);
  }

  endClip() {
    this.pop();

    const gl = this.GL;
    gl.stencilOp(
      gl.KEEP, // what to do if the stencil test fails
      gl.KEEP, // what to do if the depth test fails
      gl.KEEP // what to do if both tests pass
    );
    gl.stencilFunc(
      this._clipInvert ? gl.EQUAL : gl.NOTEQUAL, // the test
      0, // reference value
      0xff // mask
    );
    gl.enable(gl.DEPTH_TEST);

    // Mark the depth at which the clip has been applied so that we can clear it
    // when we pop past this depth
    this._clipDepths.push(this._pushPopDepth);

    super.endClip();
  }

  _clearClip() {
    this.GL.clearStencil(1);
    this.GL.clear(this.GL.STENCIL_BUFFER_BIT);
    if (this._clipDepths.length > 0) {
      this._clipDepths.pop();
    }
    this.drawTarget()._isClipApplied = false;
  }

  // x,y are canvas-relative (pre-scaled by _pixelDensity)
  _getPixel(x, y) {
    const gl = this.GL;
    return readPixelWebGL(
      gl,
      null,
      x,
      y,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this._pInst.height * this._pInst.pixelDensity()
    );
  }

  /**
   * Loads the pixels data for this canvas into the pixels[] attribute.
   * Note that updatePixels() and set() do not work.
   * Any pixel manipulation must be done directly to the pixels[] array.
   *
   * @private
   */
  loadPixels() {
    //@todo_FES
    if (this._pInst._glAttributes.preserveDrawingBuffer !== true) {
      console.log(
        "loadPixels only works in WebGL when preserveDrawingBuffer " +
          "is true."
      );
      return;
    }

    const pd = this._pixelDensity;
    const gl = this.GL;

    this.pixels = readPixelsWebGL(
      this.pixels,
      gl,
      null,
      0,
      0,
      this.width * pd,
      this.height * pd,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.height * pd
    );
  }

  updatePixels() {
    const fbo = this._getTempFramebuffer();
    fbo.pixels = this.pixels;
    fbo.updatePixels();
    this.push();
    this.resetMatrix();
    this.clear();
    this.states.setValue("imageMode", constants.CORNER);
    this.image(
      fbo,
      0,
      0,
      fbo.width,
      fbo.height,
      -fbo.width / 2,
      -fbo.height / 2,
      fbo.width,
      fbo.height
    );
    this.pop();
    this.GL.clearDepth(1);
    this.GL.clear(this.GL.DEPTH_BUFFER_BIT);
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

  viewport(w, h) {
    this._viewport = [0, 0, w, h];
    this.GL.viewport(0, 0, w, h);
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
    this._origViewport = {
      width: this.GL.drawingBufferWidth,
      height: this.GL.drawingBufferHeight,
    };
    this.viewport(this._origViewport.width, this._origViewport.height);

    this.states.curCamera._resize();

    //resize pixels buffer
    if (typeof this.pixels !== "undefined") {
      this.pixels = new Uint8Array(
        this.GL.drawingBufferWidth * this.GL.drawingBufferHeight * 4
      );
    }

    for (const framebuffer of this.framebuffers) {
      // Notify framebuffers of the resize so that any auto-sized framebuffers
      // can also update their size
      framebuffer._canvasSizeChanged();
    }

    // reset canvas properties
    for (const savedKey in props) {
      try {
        this.drawingContext[savedKey] = props[savedKey];
      } catch (err) {
        // ignore read-only property errors
      }
    }
  }

  /**
   * clears color and depth buffers
   * with r,g,b,a
   * @private
   * @param {Number} r normalized red val.
   * @param {Number} g normalized green val.
   * @param {Number} b normalized blue val.
   * @param {Number} a normalized alpha val.
   */
  clear(...args) {
    const _r = args[0] || 0;
    const _g = args[1] || 0;
    const _b = args[2] || 0;
    let _a = args[3] || 0;

    const activeFramebuffer = this.activeFramebuffer();
    if (
      activeFramebuffer &&
      activeFramebuffer.format === constants.UNSIGNED_BYTE &&
      !activeFramebuffer.antialias &&
      _a === 0
    ) {
      // Drivers on Intel Macs check for 0,0,0,0 exactly when drawing to a
      // framebuffer and ignore the command if it's the only drawing command to
      // the framebuffer. To work around it, we can set the alpha to a value so
      // low that it still rounds down to 0, but that circumvents the buggy
      // check in the driver.
      _a = 1e-10;
    }

    this.GL.clearColor(_r * _a, _g * _a, _b * _a, _a);
    this.GL.clearDepth(1);
    this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
  }

  /**
   * Resets all depth information so that nothing previously drawn will
   * occlude anything subsequently drawn.
   */
  clearDepth(depth = 1) {
    this.GL.clearDepth(depth);
    this.GL.clear(this.GL.DEPTH_BUFFER_BIT);
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
  _applyStencilTestIfClipping() {
    const drawTarget = this.drawTarget();
    if (drawTarget._isClipApplied !== this._stencilTestOn) {
      if (drawTarget._isClipApplied) {
        this._internalEnable.call(this.GL, this.GL.STENCIL_TEST);
        this._stencilTestOn = true;
      } else {
        if (!this._userEnabledStencil) {
          this._internalDisable.call(this.GL, this.GL.STENCIL_TEST);
        }
        this._stencilTestOn = false;
      }
    }
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

  /*
   * shaders are created and cached on a per-renderer basis,
   * on the grounds that each renderer will have its own gl context
   * and the shader must be valid in that context.
   */

  _getStrokeShader() {
    // select the stroke shader to use
    const stroke = this.states.userStrokeShader;
    if (stroke) {
      return stroke;
    }
    return this._getLineShader();
  }

  _getSphereMapping(img) {
    if (!this.sphereMapping) {
      this.sphereMapping = this._pInst.createFilterShader(sphereMapping);
    }
    this.scratchMat3.inverseTranspose4x4(this.states.uViewMatrix);
    this.scratchMat3.invert(this.scratchMat3); // uNMMatrix is 3x3
    this.sphereMapping.setUniform("uFovY", this.states.curCamera.cameraFOV);
    this.sphereMapping.setUniform("uAspect", this.states.curCamera.aspectRatio);
    this.sphereMapping.setUniform("uNewNormalMatrix", this.scratchMat3.mat3);
    this.sphereMapping.setUniform("uEnvMap", img);
    return this.sphereMapping;
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
    if (!this._pInst._glAttributes.perPixelLighting) {
      throw new Error(
        "The material shader does not support hooks without perPixelLighting. Try turning it back on."
      );
    }
    return this._getLightShader();
  }

  _getLightShader() {
    if (!this._defaultLightShader) {
      if (this._pInst._glAttributes.perPixelLighting) {
        this._defaultLightShader = new Shader(
          this,
          this._webGL2CompatibilityPrefix("vert", "highp") +
            defaultShaders.phongVert,
          this._webGL2CompatibilityPrefix("frag", "highp") +
            defaultShaders.phongFrag,
          {
            vertex: {
              "void beforeVertex": "() {}",
              "Vertex getObjectInputs": "(Vertex inputs) { return inputs; }",
              "Vertex getWorldInputs": "(Vertex inputs) { return inputs; }",
              "Vertex getCameraInputs": "(Vertex inputs) { return inputs; }",
              "void afterVertex": "() {}",
            },
            fragment: {
              "void beforeFragment": "() {}",
              "Inputs getPixelInputs": "(Inputs inputs) { return inputs; }",
              "vec4 combineColors": `(ColorComponents components) {
                vec4 color = vec4(0.);
                color.rgb += components.diffuse * components.baseColor;
                color.rgb += components.ambient * components.ambientColor;
                color.rgb += components.specular * components.specularColor;
                color.rgb += components.emissive;
                color.a = components.opacity;
                return color;
              }`,
              "vec4 getFinalColor": "(vec4 color) { return color; }",
              "void afterFragment": "() {}",
            },
          }
        );
      } else {
        this._defaultLightShader = new Shader(
          this,
          this._webGL2CompatibilityPrefix("vert", "highp") +
            defaultShaders.lightVert,
          this._webGL2CompatibilityPrefix("frag", "highp") +
            defaultShaders.lightTextureFrag
        );
      }
    }

    return this._defaultLightShader;
  }

  baseNormalShader() {
    return this._getNormalShader();
  }

  _getNormalShader() {
    if (!this._defaultNormalShader) {
      this._defaultNormalShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "mediump") +
          defaultShaders.normalVert,
        this._webGL2CompatibilityPrefix("frag", "mediump") +
          defaultShaders.normalFrag,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "Vertex getObjectInputs": "(Vertex inputs) { return inputs; }",
            "Vertex getWorldInputs": "(Vertex inputs) { return inputs; }",
            "Vertex getCameraInputs": "(Vertex inputs) { return inputs; }",
            "void afterVertex": "() {}",
          },
          fragment: {
            "void beforeFragment": "() {}",
            "vec4 getFinalColor": "(vec4 color) { return color; }",
            "void afterFragment": "() {}",
          },
        }
      );
    }

    return this._defaultNormalShader;
  }

  baseColorShader() {
    return this._getColorShader();
  }

  _getColorShader() {
    if (!this._defaultColorShader) {
      this._defaultColorShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "mediump") +
          defaultShaders.normalVert,
        this._webGL2CompatibilityPrefix("frag", "mediump") +
          defaultShaders.basicFrag,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "Vertex getObjectInputs": "(Vertex inputs) { return inputs; }",
            "Vertex getWorldInputs": "(Vertex inputs) { return inputs; }",
            "Vertex getCameraInputs": "(Vertex inputs) { return inputs; }",
            "void afterVertex": "() {}",
          },
          fragment: {
            "void beforeFragment": "() {}",
            "vec4 getFinalColor": "(vec4 color) { return color; }",
            "void afterFragment": "() {}",
          },
        }
      );
    }

    return this._defaultColorShader;
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

  _getPointShader() {
    if (!this._defaultPointShader) {
      this._defaultPointShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "mediump") +
          defaultShaders.pointVert,
        this._webGL2CompatibilityPrefix("frag", "mediump") +
          defaultShaders.pointFrag,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "vec3 getLocalPosition": "(vec3 position) { return position; }",
            "vec3 getWorldPosition": "(vec3 position) { return position; }",
            "float getPointSize": "(float size) { return size; }",
            "void afterVertex": "() {}",
          },
          fragment: {
            "void beforeFragment": "() {}",
            "vec4 getFinalColor": "(vec4 color) { return color; }",
            "bool shouldDiscard": "(bool outside) { return outside; }",
            "void afterFragment": "() {}",
          },
        }
      );
    }
    return this._defaultPointShader;
  }

  baseStrokeShader() {
    return this._getLineShader();
  }

  _getLineShader() {
    if (!this._defaultLineShader) {
      this._defaultLineShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "mediump") +
          defaultShaders.lineVert,
        this._webGL2CompatibilityPrefix("frag", "mediump") +
          defaultShaders.lineFrag,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "StrokeVertex getObjectInputs":
              "(StrokeVertex inputs) { return inputs; }",
            "StrokeVertex getWorldInputs":
              "(StrokeVertex inputs) { return inputs; }",
            "StrokeVertex getCameraInputs":
              "(StrokeVertex inputs) { return inputs; }",
            "void afterVertex": "() {}",
          },
          fragment: {
            "void beforeFragment": "() {}",
            "Inputs getPixelInputs": "(Inputs inputs) { return inputs; }",
            "vec4 getFinalColor": "(vec4 color) { return color; }",
            "bool shouldDiscard": "(bool outside) { return outside; }",
            "void afterFragment": "() {}",
          },
        }
      );
    }

    return this._defaultLineShader;
  }

  _getFontShader() {
    if (!this._defaultFontShader) {
      if (this.webglVersion === constants.WEBGL) {
        this.GL.getExtension("OES_standard_derivatives");
      }
      this._defaultFontShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "highp") +
          defaultShaders.fontVert,
        this._webGL2CompatibilityPrefix("frag", "highp") +
          defaultShaders.fontFrag
      );
    }
    return this._defaultFontShader;
  }

  baseFilterShader() {
    if (!this._baseFilterShader) {
      this._baseFilterShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "highp") +
          defaultShaders.filterBaseVert,
        this._webGL2CompatibilityPrefix("frag", "highp") +
          defaultShaders.filterBaseFrag,
        {
            vertex: {},
            fragment: {
              "vec4 getColor": `(FilterInputs inputs, in sampler2D canvasContent) {
                return getTexture(canvasContent, inputs.texCoord);
              }`,
            },
          }
      );
    }
    return this._baseFilterShader;
  }

  _webGL2CompatibilityPrefix(shaderType, floatPrecision) {
    let code = "";
    if (this.webglVersion === constants.WEBGL2) {
      code += "#version 300 es\n#define WEBGL2\n";
    }
    if (shaderType === "vert") {
      code += "#define VERTEX_SHADER\n";
    } else if (shaderType === "frag") {
      code += "#define FRAGMENT_SHADER\n";
    }
    if (floatPrecision) {
      code += `precision ${floatPrecision} float;\n`;
    }
    return code;
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
  /*
   *  used in imageLight,
   *  To create a blurry image from the input non blurry img, if it doesn't already exist
   *  Add it to the diffusedTexture map,
   *  Returns the blurry image
   *  maps a Image used by imageLight() to a p5.Framebuffer
   */
  getDiffusedTexture(input) {
    // if one already exists for a given input image
    if (this.diffusedTextures.get(input) != null) {
      return this.diffusedTextures.get(input);
    }
    // if not, only then create one
    let newFramebuffer;
    // hardcoded to 200px, because it's going to be blurry and smooth
    let smallWidth = 200;
    let width = smallWidth;
    let height = Math.floor(smallWidth * (input.height / input.width));
    newFramebuffer = new Framebuffer(this, {
      width,
      height,
      density: 1,
    });
    // create framebuffer is like making a new sketch, all functions on main
    // sketch it would be available on framebuffer
    if (!this.diffusedShader) {
      this.diffusedShader = this._pInst.createShader(
        defaultShaders.imageLightVert,
        defaultShaders.imageLightDiffusedFrag
      );
    }
    newFramebuffer.draw(() => {
      this.shader(this.diffusedShader);
      this.diffusedShader.setUniform("environmentMap", input);
      this.states.setValue("strokeColor", null);
      this.noLights();
      this.plane(width, height);
    });
    this.diffusedTextures.set(input, newFramebuffer);
    return newFramebuffer;
  }

  /*
   *  used in imageLight,
   *  To create a texture from the input non blurry image, if it doesn't already exist
   *  Creating 8 different levels of textures according to different
   *  sizes and atoring them in `levels` array
   *  Creating a new Mipmap texture with that `levels` array
   *  Storing the texture for input image in map called `specularTextures`
   *  maps the input Image to a p5.MipmapTexture
   */
  getSpecularTexture(input) {
    // check if already exits (there are tex of diff resolution so which one to check)
    // currently doing the whole array
    if (this.specularTextures.get(input) != null) {
      return this.specularTextures.get(input);
    }
    // Hardcoded size
    const size = 512;
    let tex;
    const levels = [];
    const framebuffer = new Framebuffer(this, {
      width: size,
      height: size,
      density: 1,
    });
    let count = Math.log(size) / Math.log(2);
    if (!this.specularShader) {
      this.specularShader = this._pInst.createShader(
        defaultShaders.imageLightVert,
        defaultShaders.imageLightSpecularFrag
      );
    }
    // currently only 8 levels
    // This loop calculates 8 framebuffers of varying size of canvas
    // and corresponding different roughness levels.
    // Roughness increases with the decrease in canvas size,
    // because rougher surfaces have less detailed/more blurry reflections.
    for (let w = size; w >= 1; w /= 2) {
      framebuffer.resize(w, w);
      let currCount = Math.log(w) / Math.log(2);
      let roughness = 1 - currCount / count;
      framebuffer.draw(() => {
        this.shader(this.specularShader);
        this.clear();
        this.specularShader.setUniform("environmentMap", input);
        this.specularShader.setUniform("roughness", roughness);
        this.states.setValue("strokeColor", null);
        this.noLights();
        this.plane(w, w);
      });
      levels.push(framebuffer.get().drawingContext.getImageData(0, 0, w, w));
    }
    // Free the Framebuffer
    framebuffer.remove();
    tex = new MipmapTexture(this, levels, {});
    this.specularTextures.set(input, tex);
    return tex;
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
    const ambientLightCount = this.states.ambientLightColors.length / 3;
    this.mixedAmbientLight = [...this.states.ambientLightColors];

    if (this.states._useMetalness > 0) {
      this.mixedAmbientLight = this.mixedAmbientLight.map((ambientColors) => {
        let mixing = ambientColors - this.states._useMetalness;
        return Math.max(0, mixing);
      });
    }
    fillShader.setUniform("uAmbientLightCount", ambientLightCount);
    fillShader.setUniform("uAmbientColor", this.mixedAmbientLight);

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

  _setPointUniforms(pointShader) {
    // set the uniform values
    pointShader.setUniform("uMaterialColor", this.states.curStrokeColor);
    // @todo is there an instance where this isn't stroke weight?
    // should be they be same var?
    pointShader.setUniform(
      "uPointSize",
      this.states.strokeWeight * this._pixelDensity
    );
  }

  /* Binds a buffer to the drawing context
   * when passed more than two arguments it also updates or initializes
   * the data associated with the buffer
   */
  _bindBuffer(buffer, target, values, type, usage) {
    if (!target) target = this.GL.ARRAY_BUFFER;
    this.GL.bindBuffer(target, buffer);
    if (values !== undefined) {
      let data = values;
      if (values instanceof DataArray) {
        data = values.dataArray();
      } else if (!(data instanceof (type || Float32Array))) {
        data = new (type || Float32Array)(data);
      }
      this.GL.bufferData(target, data, usage || this.GL.STATIC_DRAW);
    }
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
}

function rendererGL(p5, fn) {
  p5.RendererGL = RendererGL;

  /**
   * @module Rendering
   * @submodule Rendering
   * @for p5
   */
  /**
   * Set attributes for the WebGL Drawing context.
   * This is a way of adjusting how the WebGL
   * renderer works to fine-tune the display and performance.
   *
   * Note that this will reinitialize the drawing context
   * if called after the WebGL canvas is made.
   *
   * If an object is passed as the parameter, all attributes
   * not declared in the object will be set to defaults.
   *
   * The available attributes are:
   * <br>
   * alpha - indicates if the canvas contains an alpha buffer
   * default is true
   *
   * depth - indicates whether the drawing buffer has a depth buffer
   * of at least 16 bits - default is true
   *
   * stencil - indicates whether the drawing buffer has a stencil buffer
   * of at least 8 bits
   *
   * antialias - indicates whether or not to perform anti-aliasing
   * default is false (true in Safari)
   *
   * premultipliedAlpha - indicates that the page compositor will assume
   * the drawing buffer contains colors with pre-multiplied alpha
   * default is true
   *
   * preserveDrawingBuffer - if true the buffers will not be cleared and
   * and will preserve their values until cleared or overwritten by author
   * (note that p5 clears automatically on draw loop)
   * default is true
   *
   * perPixelLighting - if true, per-pixel lighting will be used in the
   * lighting shader otherwise per-vertex lighting is used.
   * default is true.
   *
   * version - either 1 or 2, to specify which WebGL version to ask for. By
   * default, WebGL 2 will be requested. If WebGL2 is not available, it will
   * fall back to WebGL 1. You can check what version is used with by looking at
   * the global `webglVersion` property.
   *
   * @method setAttributes
   * @for p5
   * @param  {String}  key Name of attribute
   * @param  {Boolean}        value New value of named attribute
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   * }
   *
   * function draw() {
   *   background(255);
   *   push();
   *   rotateZ(frameCount * 0.02);
   *   rotateX(frameCount * 0.02);
   *   rotateY(frameCount * 0.02);
   *   fill(0, 0, 0);
   *   box(50);
   *   pop();
   * }
   * </code>
   * </div>
   * <br>
   * Now with the antialias attribute set to true.
   * <br>
   * <div>
   * <code>
   * function setup() {
   *   setAttributes('antialias', true);
   *   createCanvas(100, 100, WEBGL);
   * }
   *
   * function draw() {
   *   background(255);
   *   push();
   *   rotateZ(frameCount * 0.02);
   *   rotateX(frameCount * 0.02);
   *   rotateY(frameCount * 0.02);
   *   fill(0, 0, 0);
   *   box(50);
   *   pop();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // press the mouse button to disable perPixelLighting
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   noStroke();
   *   fill(255);
   * }
   *
   * let lights = [
   *   { c: '#f00', t: 1.12, p: 1.91, r: 0.2 },
   *   { c: '#0f0', t: 1.21, p: 1.31, r: 0.2 },
   *   { c: '#00f', t: 1.37, p: 1.57, r: 0.2 },
   *   { c: '#ff0', t: 1.12, p: 1.91, r: 0.7 },
   *   { c: '#0ff', t: 1.21, p: 1.31, r: 0.7 },
   *   { c: '#f0f', t: 1.37, p: 1.57, r: 0.7 }
   * ];
   *
   * function draw() {
   *   let t = millis() / 1000 + 1000;
   *   background(0);
   *   directionalLight(color('#222'), 1, 1, 1);
   *
   *   for (let i = 0; i < lights.length; i++) {
   *     let light = lights[i];
   *     pointLight(
   *       color(light.c),
   *       p5.Vector.fromAngles(t * light.t, t * light.p, width * light.r)
   *     );
   *   }
   *
   *   specularMaterial(255);
   *   sphere(width * 0.1);
   *
   *   rotateX(t * 0.77);
   *   rotateY(t * 0.83);
   *   rotateZ(t * 0.91);
   *   torus(width * 0.3, width * 0.07, 24, 10);
   * }
   *
   * function mousePressed() {
   *   setAttributes('perPixelLighting', false);
   *   noStroke();
   *   fill(255);
   * }
   * function mouseReleased() {
   *   setAttributes('perPixelLighting', true);
   *   noStroke();
   *   fill(255);
   * }
   * </code>
   * </div>
   *
   * @alt a rotating cube with smoother edges
   */
  /**
   * @method setAttributes
   * @for p5
   * @param  {Object}  obj object with key-value pairs
   */
  fn.setAttributes = function (key, value) {
    if (typeof this._glAttributes === "undefined") {
      console.log(
        "You are trying to use setAttributes on a p5.Graphics object " +
          "that does not use a WEBGL renderer."
      );
      return;
    }
    let unchanged = true;
    if (typeof value !== "undefined") {
      //first time modifying the attributes
      if (this._glAttributes === null) {
        this._glAttributes = {};
      }
      if (this._glAttributes[key] !== value) {
        //changing value of previously altered attribute
        this._glAttributes[key] = value;
        unchanged = false;
      }
      //setting all attributes with some change
    } else if (key instanceof Object) {
      if (this._glAttributes !== key) {
        this._glAttributes = key;
        unchanged = false;
      }
    }
    //@todo_FES
    if (!this._renderer.isP3D || unchanged) {
      return;
    }

    if (!this._setupDone) {
      if (this._renderer.geometryBufferCache.numCached() > 0) {
        p5._friendlyError(
          "Sorry, Could not set the attributes, you need to call setAttributes() " +
            "before calling the other drawing methods in setup()"
        );
        return;
      }
    }

    this._renderer._resetContext();

    if (this._renderer.states.curCamera) {
      this._renderer.states.curCamera._renderer = this._renderer;
    }
  };

  /**
   * ensures that p5 is using a 3d renderer. throws an error if not.
   */
  fn._assert3d = function (name) {
    if (!this._renderer.isP3D)
      throw new Error(
        `${name}() is only supported in WEBGL mode. If you'd like to use 3D graphics and WebGL, see  https://p5js.org/examples/form-3d-primitives.html for more information.`
      );
  };

  p5.renderers[constants.WEBGL] = p5.RendererGL;
  p5.renderers[constants.WEBGL2] = p5.RendererGL;
}

/**
 * @private
 * @param {Uint8Array|Float32Array|undefined} pixels An existing pixels array to reuse if the size is the same
 * @param {WebGLRenderingContext} gl The WebGL context
 * @param {WebGLFramebuffer|null} framebuffer The Framebuffer to read
 * @param {Number} x The x coordiante to read, premultiplied by pixel density
 * @param {Number} y The y coordiante to read, premultiplied by pixel density
 * @param {Number} width The width in pixels to be read (factoring in pixel density)
 * @param {Number} height The height in pixels to be read (factoring in pixel density)
 * @param {GLEnum} format Either RGB or RGBA depending on how many channels to read
 * @param {GLEnum} type The datatype of each channel, e.g. UNSIGNED_BYTE or FLOAT
 * @param {Number|undefined} flipY If provided, the total height with which to flip the y axis about
 * @returns {Uint8Array|Float32Array} pixels A pixels array with the current state of the
 * WebGL context read into it
 */
export function readPixelsWebGL(
  pixels,
  gl,
  framebuffer,
  x,
  y,
  width,
  height,
  format,
  type,
  flipY
) {
  // Record the currently bound framebuffer so we can go back to it after, and
  // bind the framebuffer we want to read from
  const prevFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  const channels = format === gl.RGBA ? 4 : 3;

  // Make a pixels buffer if it doesn't already exist
  const len = width * height * channels;
  const TypedArrayClass = type === gl.UNSIGNED_BYTE ? Uint8Array : Float32Array;
  if (!(pixels instanceof TypedArrayClass) || pixels.length !== len) {
    pixels = new TypedArrayClass(len);
  }

  gl.readPixels(
    x,
    flipY ? flipY - y - height : y,
    width,
    height,
    format,
    type,
    pixels
  );

  // Re-bind whatever was previously bound
  gl.bindFramebuffer(gl.FRAMEBUFFER, prevFramebuffer);

  if (flipY) {
    // WebGL pixels are inverted compared to 2D pixels, so we have to flip
    // the resulting rows. Adapted from https://stackoverflow.com/a/41973289
    const halfHeight = Math.floor(height / 2);
    const tmpRow = new TypedArrayClass(width * channels);
    for (let y = 0; y < halfHeight; y++) {
      const topOffset = y * width * 4;
      const bottomOffset = (height - y - 1) * width * 4;
      tmpRow.set(pixels.subarray(topOffset, topOffset + width * 4));
      pixels.copyWithin(topOffset, bottomOffset, bottomOffset + width * 4);
      pixels.set(tmpRow, bottomOffset);
    }
  }

  return pixels;
}

/**
 * @private
 * @param {WebGLRenderingContext} gl The WebGL context
 * @param {WebGLFramebuffer|null} framebuffer The Framebuffer to read
 * @param {Number} x The x coordinate to read, premultiplied by pixel density
 * @param {Number} y The y coordinate to read, premultiplied by pixel density
 * @param {GLEnum} format Either RGB or RGBA depending on how many channels to read
 * @param {GLEnum} type The datatype of each channel, e.g. UNSIGNED_BYTE or FLOAT
 * @param {Number|undefined} flipY If provided, the total height with which to flip the y axis about
 * @returns {Number[]} pixels The channel data for the pixel at that location
 */
export function readPixelWebGL(gl, framebuffer, x, y, format, type, flipY) {
  // Record the currently bound framebuffer so we can go back to it after, and
  // bind the framebuffer we want to read from
  const prevFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  const channels = format === gl.RGBA ? 4 : 3;
  const TypedArrayClass = type === gl.UNSIGNED_BYTE ? Uint8Array : Float32Array;
  const pixels = new TypedArrayClass(channels);

  gl.readPixels(x, flipY ? flipY - y - 1 : y, 1, 1, format, type, pixels);

  // Re-bind whatever was previously bound
  gl.bindFramebuffer(gl.FRAMEBUFFER, prevFramebuffer);

  return Array.from(pixels);
}

export default rendererGL;
export { RendererGL };

if (typeof p5 !== "undefined") {
  rendererGL(p5, p5.prototype);
}
