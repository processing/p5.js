/**
 * @module Shape
 * @submodule Custom Shapes
 * @for p5
 * @requires core
 * @requires constants
 */

// REMINDER: remove .js extension (currently using it to run file locally)
import { Color } from '../color/p5.Color';
import { Vector } from '../math/p5.Vector';
import * as constants from '../core/constants';

// ---- UTILITY FUNCTIONS ----
function polylineLength(vertices) {
  let length = 0
  for (let i = 1; i < vertices.length; i++) {
    length += vertices[i-1].position.dist(vertices[i].position);
  }
  return length;
}

function catmullRomToBezier(vertices, tightness) {
  let X0, Y0, X1, Y1, X2, Y2, X3, Y3;
  let s = 1 - tightness;
  let bezX1, bezY1, bezX2, bezY2, bezX3, bezY3;
  let bezArrays = [];

  for (let i = 0; i + 6 < vertices.length; i += 2) {
    [X0, Y0, X1, Y1, X2, Y2, X3, Y3] = vertices.slice(i, i + 8);

    bezX1 = X1 + s * (X2 - X0) / 6;
    bezY1 = Y1 + s * (Y2 - Y0) / 6;

    bezX2 = X2 + s * (X1 - X3) / 6;
    bezY2 = Y2 + s * (Y1 - Y3) / 6;

    bezX3 = X2;
    bezY3 = Y2;

    bezArrays.push([bezX1, bezY1, bezX2, bezY2, bezX3, bezY3]);
  }
  return bezArrays;
}

// ---- GENERAL BUILDING BLOCKS ----

class Vertex {
  constructor(properties) {
    for (const [key, value] of Object.entries(properties)) {
      this[key] = value;
    }
  }
  /*
  get array() {
    // convert to 1D array
    // call `toArray()` if value is an object with a toArray() method
    // handle primitive values separately
    // maybe handle object literals too, with Object.values()?
    // probably don’t need anything else for now?
  }
  */
  // TODO: make sure name of array conversion method is
  // consistent with any modifications to the names of corresponding
  // properties of p5.Vector and p5.Color
}

class ShapePrimitive {
  vertices;
  _shape = null;
  _primitivesIndex = null;
  _contoursIndex = null;
  isClosing = false;

  constructor(...vertices) {
    if (this.constructor === ShapePrimitive) {
      throw new Error('ShapePrimitive is an abstract class: it cannot be instantiated.');
    }
    if (vertices.length > 0) {
      this.vertices = vertices;
    }
    else {
      throw new Error('At least one vertex must be passed to the constructor.');
    }
  }

  get vertexCount() {
    return this.vertices.length;
  }

  get vertexCapacity() {
    throw new Error('Getter vertexCapacity must be implemented.');
  }

  get _firstInterpolatedVertex() {
    return this.startVertex();
  }

  get canOverrideAnchor() {
    return false;
  }

  accept(visitor) {
    throw new Error('Method accept() must be implemented.');
  }

  addToShape(shape) {
    /*
    TODO:
    Refactor?
    Test this method once more primitives are implemented.
    Test segments separately (Segment adds an extra step to this method).
    */
    let lastContour = shape.at(-1);

    if (lastContour.primitives.length === 0) {
      lastContour.primitives.push(this);
    } else {
      // last primitive in shape
      let lastPrimitive = shape.at(-1, -1);
      let hasSameType = lastPrimitive instanceof this.constructor;
      let spareCapacity = lastPrimitive.vertexCapacity -
                          lastPrimitive.vertexCount;

      // this primitive
      let pushableVertices;
      let remainingVertices;

      if (hasSameType && spareCapacity > 0) {

        pushableVertices = this.vertices.splice(0, spareCapacity);
        remainingVertices = this.vertices;
        lastPrimitive.vertices.push(...pushableVertices);

        if (remainingVertices.length > 0) {
          lastContour.primitives.push(this);
        }
      }
      else {
        lastContour.primitives.push(this);
      }
    }

    // if primitive itself was added
    // (i.e. its individual vertices weren't all added to an existing primitive)
    // give it a reference to the shape and store its location within the shape
    if (this.shouldAddToShape) {
      let lastContour = shape.at(-1);
      this._primitivesIndex = lastContour.primitives.length - 1;
      this._contoursIndex = shape.contours.length - 1;
      this._shape = shape;
    }

    return shape.at(-1, -1);
  }

  get shouldAddToShape() {
    return false;
  }

  get _nextPrimitive() {
    return this._belongsToShape ?
      this._shape.at(this._contoursIndex, this._primitivesIndex + 1) :
      null;
  }

  get _belongsToShape() {
    return this._shape !== null;
  }

  handlesClose() {
    return false;
  }

  close(vertex) {
    throw new Error('Unimplemented!');
  }
}

class Contour {
  #kind;
  primitives;

  constructor(kind = constants.PATH) {
    this.#kind = kind;
    this.primitives = [];
  }

  get kind() {
    const isEmpty = this.primitives.length === 0;
    const isPath = this.#kind === constants.PATH;
    return isEmpty && isPath ? constants.EMPTY_PATH : this.#kind;
  }

  accept(visitor) {
    for (const primitive of this.primitives) {
      primitive.accept(visitor);
    }
  }
}

// ---- PATH PRIMITIVES ----

class Anchor extends ShapePrimitive {
  #vertexCapacity = 1;

  constructor(...vertices) {
    super(...vertices);
  }

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  get shouldAddToShape() {
    return true;
  }

  accept(visitor) {
    visitor.visitAnchor(this);
  }

  getEndVertex() {
    return this.vertices[0];
  }
}

// abstract class
class Segment extends ShapePrimitive {
  constructor(...vertices) {
    super(...vertices);
    if (this.constructor === Segment) {
      throw new Error('Segment is an abstract class: it cannot be instantiated.');
    }
  }

  get shouldAddToShape() {
    return this.vertices.length > 0;
  }

  // segments in a shape always have a predecessor
  // (either an anchor or another segment)
  get _previousPrimitive() {
    return this._belongsToShape ?
      this._shape.at(this._contoursIndex, this._primitivesIndex - 1) :
      null;
  }

  getStartVertex() {
    return this._previousPrimitive.getEndVertex();
  }

  getEndVertex() {
    return this.vertices.at(-1);
  }
}

class LineSegment extends Segment {
  #vertexCapacity = 1;

  constructor(...vertices) {
    super(...vertices);
  }

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  accept(visitor) {
    visitor.visitLineSegment(this);
  }
}

class BezierSegment extends Segment {
  #order;
  #vertexCapacity;

  constructor(order, ...vertices) {
    super(...vertices);

    // Order m may sometimes be passed as an array [m], since arrays
    // may be used elsewhere to store order of
    // Bezier curves and surfaces in a common format

    let numericalOrder = Array.isArray(order) ? order[0] : order;
    this.#order = numericalOrder;
    this.#vertexCapacity = numericalOrder;
  }

  get order() {
    return this.#order;
  }

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  #_hullLength;
  hullLength() {
    if (this.#_hullLength === undefined) {
      this.#_hullLength = polylineLength([this.getStartVertex(), ...this.vertices]);
    }
    return this.#_hullLength;
  }

  accept(visitor) {
    visitor.visitBezierSegment(this);
  }
}

/*
To-do: Consider type and end modes -- see #6766
may want to use separate classes, but maybe not

For now, the implementation overrides
super.getEndVertex() in order to preserve current p5
endpoint behavior, but we're considering defaulting
to interpolated endpoints (a breaking change)
*/
class SplineSegment extends Segment {
  #vertexCapacity = Infinity;
  _splineEnds = constants.SHOW;
  _splineTightness = 0;

  constructor(...vertices) {
    super(...vertices);
  }

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  accept(visitor) {
    visitor.visitSplineSegment(this);
  }

  get _comesAfterSegment() {
    return this._previousPrimitive instanceof Segment;
  }

  get canOverrideAnchor() {
    return this._splineEnds === constants.HIDE;
  }

  // assuming for now that the first interpolated vertex is always
  // the second vertex passed to splineVertex()
  // if this spline segment doesn't follow another segment,
  // the first vertex is in an anchor
  get _firstInterpolatedVertex() {
    if (this._splineEnds === constants.HIDE) {
      return this._comesAfterSegment ?
        this.vertices[1] :
        this.vertices[0];
    } else {
      return this.vertices[0];
    }
  }

  get _chainedToSegment() {
    if (this._belongsToShape && this._comesAfterSegment) {
      let interpolatedStartPosition = this._firstInterpolatedVertex.position;
      let predecessorEndPosition = this.getStartVertex().position;
      return predecessorEndPosition.equals(interpolatedStartPosition);
    }
    else {
      return false;
    }
  }

  // extend addToShape() with a warning in case second vertex
  // doesn't line up with end of last segment
  addToShape(shape) {
    const added = super.addToShape(shape);
    this._splineEnds = shape._splineEnds;
    this._splineTightness = shape._splineTightness;

    if (this._splineEnds !== constants.HIDE) return added;

    let verticesPushed = !this._belongsToShape;
    let lastPrimitive = shape.at(-1, -1);

    let message = (array1, array2) =>
      `Spline does not start where previous path segment ends:
      second spline vertex at (${array1})
      expected to be at (${array2}).`;

    if (verticesPushed &&
      // Only check once the first interpolated vertex has been added
      lastPrimitive.vertices.length === 2 &&
      lastPrimitive._comesAfterSegment &&
      !lastPrimitive._chainedToSegment
    ) {
      let interpolatedStart = lastPrimitive._firstInterpolatedVertex.position;
      let predecessorEnd = lastPrimitive.getStartVertex().position;

      console.warn(
        message(interpolatedStart.array(), predecessorEnd.array())
      );
    }

    // Note: Could add a warning in an else-if case for when this spline segment
    // is added directly to the shape instead of pushing its vertices to
    // an existing spline segment. However, if we assume addToShape() is called by
    // splineVertex(), it'd add a new spline segment with only one vertex in that case,
    // and the check wouldn't be needed yet.

    // TODO: Consider case where positions match but other vertex properties don't.
    return added;
  }

  // override method on base class
  getEndVertex() {
    if (this._splineEnds === constants.SHOW) {
      return super.getEndVertex()
    } else if (this._splineEnds === constants.HIDE) {
      return this.vertices.at(-2);
    } else {
      return this.getStartVertex();
    }
  }

  getControlPoints() {
    let points = [];

    if (this._comesAfterSegment) {
      points.push(this.getStartVertex());
    }

    for (const vertex of this.vertices) {
      points.push(vertex);
    }

    const prevVertex = this.getStartVertex()
    if (this._splineEnds === constants.SHOW) {
      points.unshift(prevVertex);
      points.push(this.vertices.at(-1));
    } else if (this._splineEnds === constants.JOIN) {
      points.unshift(this.vertices.at(-1), prevVertex);
      points.push(prevVertex, this.vertices.at(0));
    }

    return points;
  }

  handlesClose() {
    if (!this._belongsToShape) return false;

    // Only handle closing if the spline is the only thing in its contour after
    // the anchor
    const contour = this._shape.at(this._contoursIndex);
    return contour.primitives.length === 2 && this._primitivesIndex === 1;
  }

  close() {
    this._splineEnds = constants.JOIN;
  }
}

// ---- ISOLATED PRIMITIVES ----

class Point extends ShapePrimitive {
  constructor(...vertices) {
    super(...vertices);
  }
}

class Line extends ShapePrimitive {
  constructor(...vertices) {
    super(...vertices);
  }
}

class Triangle extends ShapePrimitive {
  constructor(...vertices) {
    super(...vertices);
  }
}

class Quad extends ShapePrimitive {
  constructor(...vertices) {
    super(...vertices);
  }
}

// ---- TESSELLATION PRIMITIVES ----

class TriangleFan extends ShapePrimitive {
  constructor(...vertices) {
    super(...vertices);
  }
}

class TriangleStrip extends ShapePrimitive {
  constructor(...vertices) {
    super(...vertices);
  }
}

class QuadStrip extends ShapePrimitive {
  constructor(...vertices) {
    super(...vertices);
  }
}

// ---- PRIMITIVE SHAPE CREATORS ----

class PrimitiveShapeCreators {
  // TODO: make creators private?
  // That'd probably be better, but for now, it may be convenient to use
  // native Map properties like size, e.g. for testing, and it's simpler to
  // not have to wrap all the properties that might be useful
  creators;

  constructor() {
    let creators = new Map();

    /* TODO: REFACTOR BASED ON THE CODE BELOW,
       ONCE CONSTANTS ARE IMPLEMENTED AS SYMBOLS

    // Store Symbols as strings for use in Map keys
    const EMPTY_PATH = constants.EMPTY_PATH.description;
    const PATH = constants.PATH.description;
    //etc.

    creators.set(`vertex-${EMPTY_PATH}`, (...vertices) => new Anchor(...vertices));
    // etc.

    get(vertexKind, shapeKind) {
      const key = `${vertexKind}-${shapeKind.description}`;
      return this.creators.get(key);
    }
    // etc.
    */

    // vertex
    creators.set(`vertex-${constants.EMPTY_PATH}`, (...vertices) => new Anchor(...vertices));
    creators.set(`vertex-${constants.PATH}`, (...vertices) => new LineSegment(...vertices));
    creators.set(`vertex-${constants.POINTS}`, (...vertices) => new Point(...vertices));
    creators.set(`vertex-${constants.LINES}`, (...vertices) => new Line(...vertices));
    creators.set(`vertex-${constants.TRIANGLES}`, (...vertices) => new Triangle(...vertices));
    creators.set(`vertex-${constants.QUADS}`, (...vertices) => new Quad(...vertices));
    creators.set(`vertex-${constants.TRIANGLE_FAN}`, (...vertices) => new TriangleFan(...vertices));
    creators.set(`vertex-${constants.TRIANGLE_STRIP}`, (...vertices) => new TriangleStrip(...vertices));
    creators.set(`vertex-${constants.QUAD_STRIP}`, (...vertices) => new QuadStrip(...vertices));

    // bezierVertex (constructors all take order and vertices so they can be called in a uniform way)
    creators.set(`bezierVertex-${constants.EMPTY_PATH}`, (order, ...vertices) => new Anchor(...vertices));
    creators.set(`bezierVertex-${constants.PATH}`, (order, ...vertices) => new BezierSegment(order, ...vertices));

    // splineVertex
    creators.set(`splineVertex-${constants.EMPTY_PATH}`, (...vertices) => new Anchor(...vertices));
    creators.set(`splineVertex-${constants.PATH}`, (...vertices) => new SplineSegment(...vertices));

    this.creators = creators;
  }

  get(vertexKind, shapeKind) {
    const key = `${vertexKind}-${shapeKind}`;
    return this.creators.get(key);
  }

  set(vertexKind, shapeKind, creator) {
    const key = `${vertexKind}-${shapeKind}`;
    this.creators.set(key, creator);
  }

  clear() {
    this.creators.clear();
  }
}

// ---- SHAPE ----

/* Note: It's assumed that Shape instances are always built through
 * their beginShape()/endShape() methods. For example, this ensures
 * that a segment is never the first primitive in a contour (paths
 * always start with an anchor), which simplifies code elsewhere.
 */
class Shape {
  #vertexProperties;
  #initialVertexProperties;
  #primitiveShapeCreators;
  #bezierOrder = 3;
  _splineTightness = 0;
  kind = null;
  contours = [];
  _splineEnds = constants.SHOW;
  userVertexProperties = null;

  constructor(
    vertexProperties,
    primitiveShapeCreators = new PrimitiveShapeCreators()
  ) {
    this.#initialVertexProperties = vertexProperties;
    this.#vertexProperties = vertexProperties;
    this.#primitiveShapeCreators = primitiveShapeCreators;

    for (const key in this.#vertexProperties) {
      if (key !== 'position' && key !== 'textureCoordinates') {
        this[key] = function(value) {
          this.#vertexProperties[key] = value;
        };
      }
    }
  }

  serializeToArray(val) {
    if (val instanceof Number) {
      return [val];
    } else if (val instanceof Array) {
      return val;
    } else if (val.array instanceof Function) {
      return val.array();
    } else {
      throw new Error(`Can't convert ${val} to array!`);
    }
  }

  vertexToArray(vertex) {
    const array = [];
    for (const key in this.#vertexProperties) {
      if (this.userVertexProperties && key in this.userVertexProperties) continue;
      const val = vertex[key];
      array.push(...this.serializeToArray(val));
    }
    for (const key in this.userVertexProperties) {
      if (key in vertex) {
        array.push(...this.serializeToArray(vertex[key]));
      } else {
        array.push(...new Array(this.userVertexProperties[key]).fill(0));
      }
    }
    return array;
  }

  hydrateValue(queue, original) {
    if (original instanceof Number) {
      return queue.shift();
    } else if (original instanceof Array) {
      const array = [];
      for (let i = 0; i < original.length; i++) {
        array.push(queue.shift());
      }
      return array;
    } else if (original instanceof Vector) {
      return new Vector(queue.shift(), queue.shift(), queue.shift());
    } else if (original instanceof Color) {
      const array = [queue.shift(), queue.shift(), queue.shift(), queue.shift()];
      return new Color(
        array.map((v, i) => v * original.maxes[original.mode][i]),
        original.mode,
        original.maxes
      );
    }
  }

  arrayToVertex(array) {
    const vertex = {};
    const queue = [...array];

    for (const key in this.#vertexProperties) {
      if (this.userVertexProperties && key in this.userVertexProperties) continue;
      const original = this.#vertexProperties[key];
      vertex[key] = this.hydrateValue(queue, original);
    }
    for (const key in this.userVertexProperties) {
      const original = this.#vertexProperties[key];
      vertex[key] = this.hydrateValue(queue, original);
    }
    return vertex;
  }

  arrayScale(array, scale) {
    return array.map((v) => v * scale);
  }

  arraySum(first, ...rest) {
    return first.map((v, i) => {
      let result = v;
      for (let j = 0; j < rest.length; j++) {
        result += rest[j][i];
      }
      return result;
    });
  }

  arrayMinus(a, b) {
    return a.map((v, i) => v - b[i]);
  }

  evaluateCubicBezier([a, b, c, d], t) {
    return this.arraySum(
      this.arrayScale(a, Math.pow(1 - t, 3)),
      this.arrayScale(b, 3 * Math.pow(1 - t, 2) * t),
      this.arrayScale(c, 3 * (1 - t) * Math.pow(t, 2)),
      this.arrayScale(d, Math.pow(t, 3)),
    );
  }

  evaluateQuadraticBezier([a, b, c], t) {
    return this.arraySum(
      this.arrayScale(a, Math.pow(1 - t, 2)),
      this.arrayScale(b, 2 * (1 - t) * t),
      this.arrayScale(c, t * t),
    );
  }

  /*
  catmullRomToBezier(vertices, tightness)

  Abbreviated description:
  Converts a Catmull-Rom spline to a sequence of Bezier curveTo points.

  Parameters:
  vertices -> Array [v0, v1, v2, v3, ...] of at least four vertices
  tightness -> Number affecting shape of curve

  Returns:
  array of Bezier curveTo control points, each represented as [c1, c2, c3][]

  TODO:
  1. It seems p5 contains code for converting from Catmull-Rom to Bezier in at least two places:

  catmullRomToBezier() is based on code in the legacy endShape() function:
  https://github.com/processing/p5.js/blob/1b66f097761d3c2057c0cec4349247d6125f93ca/src/core/p5.Renderer2D.js#L859C1-L886C1

  A different conversion can be found elsewhere in p5:
  https://github.com/processing/p5.js/blob/17304ce9e9ef3f967bd828102a51b62a2d39d4f4/src/typography/p5.Font.js#L1179

  A more careful review and comparison of both implementations would be helpful. They're different. I put
  catmullRomToBezier() together quickly without checking the math/algorithm, when I made the proof of concept
  for the refactor.

  2. It may be possible to replace the code in p5.Font.js with the code here, to reduce duplication.
  */
  catmullRomToBezier(vertices, tightness) {
    let s = 1 - tightness;
    let bezArrays = [];

    for (let i = 0; i + 3 < vertices.length; i++) {
      const [a, b, c, d] = vertices.slice(i, i + 4);
      const bezB = this.arraySum(
        b,
        this.arrayScale(this.arrayMinus(c, a), s / 6)
      );
      const bezC = this.arraySum(
        c,
        this.arrayScale(this.arrayMinus(b, d), s / 6)
      );
      const bezD = c;

      bezArrays.push([bezB, bezC, bezD]);
    }
    return bezArrays;
  }

  // TODO for at() method:

  // RENAME?
  // -at() indicates it works like Array.prototype.at(), e.g. with negative indices
  // -get() may work better if we want to add a corresponding set() method
  // -a set() method could maybe check for problematic usage (e.g. inserting a Triangle into a PATH)
  // -renaming or removing would necessitate changes at call sites (it's already in use)

  // REFACTOR?

  // TEST
  at(contoursIndex, primitivesIndex, verticesIndex) {
    let contour;
    let primitive;

    contour = this.contours.at(contoursIndex);

    switch(arguments.length) {
      case 1:
        return contour;
      case 2:
        return contour.primitives.at(primitivesIndex);
      case 3:
        primitive = contour.primitives.at(primitivesIndex);
        return primitive.vertices.at(verticesIndex);
    }
  }

  // maybe call this clear() for consistency with PrimitiveShapeCreators.clear()?
  // note: p5.Geometry has a reset() method, but also clearColors()
  // looks like reset() isn't in the public reference, so maybe we can switch
  // everything to clear()? Not sure if reset/clear is used in other classes,
  // but it'd be good if geometries and shapes are consistent
  reset() {
    this.#vertexProperties = { ...this.#initialVertexProperties };
    this.kind = null;
    this.contours = [];
    this.userVertexProperties = null;
  }

  vertexProperty(name, data) {
    this.userVertexProperties = this.userVertexProperties || {};
    const key = this.vertexPropertyKey(name);
    if (!this.userVertexProperties[key]) {
      this.userVertexProperties[key] = data.length ? data.length : 1;
    }
    this.#vertexProperties[key] = data;
  }
  vertexPropertyName(key) {
    return key.replace(/Src$/, '');
  }
  vertexPropertyKey(name) {
    return name + 'Src';
  }

  /*
  Note: Internally, #bezierOrder is stored as an array, in order to accommodate
  primitives including Bezier segments, Bezier triangles, and Bezier quads. For example,
  a segment may have #bezierOrder [m], whereas a quad may have #bezierOrder [m, n].
   */

  bezierOrder(...order) {
    this.#bezierOrder = order;
  }

  splineEnds(mode) {
    this._splineEnds = mode;
  }

  splineTightness(tightness) {
    this._splineTightness = tightness;
  }

  #createVertex(position, textureCoordinates) {
    this.#vertexProperties.position = position;

    if (textureCoordinates !== undefined) {
      this.#vertexProperties.textureCoordinates = textureCoordinates;
    }

    return new Vertex(this.#vertexProperties);
  }

  #createPrimitiveShape(vertexKind, shapeKind, ...vertices) {
    let primitiveShapeCreator = this.#primitiveShapeCreators.get(
      vertexKind, shapeKind
    );

    return  vertexKind === 'bezierVertex' ?
      primitiveShapeCreator(this.#bezierOrder, ...vertices) :
      primitiveShapeCreator(...vertices);
  }

  /*
    #generalVertex() is reused by the special vertex functions,
    including vertex(), bezierVertex(), splineVertex(), and arcVertex():

    It creates a vertex, builds a primitive including that
    vertex, and has the primitive add itself to the shape.
  */
  #generalVertex(kind, position, textureCoordinates) {
    let vertexKind = kind;
    let lastContourKind = this.at(-1).kind;
    let vertex = this.#createVertex(position, textureCoordinates);

    let primitiveShape = this.#createPrimitiveShape(
      vertexKind,
      lastContourKind,
      vertex
    );

    return primitiveShape.addToShape(this);
  }

  vertex(position, textureCoordinates, { isClosing = false } = {}) {
    const added = this.#generalVertex('vertex', position, textureCoordinates);
    added.isClosing = isClosing;
  }

  bezierVertex(position, textureCoordinates) {
    this.#generalVertex('bezierVertex', position, textureCoordinates);
  }

  splineVertex(position, textureCoordinates) {
    this.#generalVertex('splineVertex', position, textureCoordinates);
  }

  arcVertex() {
    this.#generalVertex('arcVertex', position, textureCoordinates);
  }

  beginShape(shapeKind = constants.PATH) {
    this.kind = shapeKind;
    this.contours.push(new Contour(shapeKind));
  }
  /* TO-DO:
     Refactor?
     - Might not need anchorHasPosition.
     - Might combine conditions at top, and rely on shortcircuiting.
     Does nothing if shape is not a path or has multiple contours. Might discuss this.
  */
  endShape(closeMode = constants.OPEN) {
    if (closeMode === constants.CLOSE) {
      // shape characteristics
      const shapeIsPath = this.kind === constants.PATH;
      const shapeHasOneContour = this.contours.length === 1;

      // anchor characteristics
      const anchorVertex = this.at(0, 0, 0);
      const anchorHasPosition = Object.hasOwn(anchorVertex, 'position');
      const lastSegment = this.at(0, -1);

      // close path
      if (shapeIsPath && shapeHasOneContour && anchorHasPosition) {
        if (lastSegment.handlesClose()) {
          lastSegment.close(anchorVertex);
        } else {
          this.vertex(anchorVertex.position, anchorVertex.textureCoordinates, { isClosing: true });
        }
      }
    }
  }

  accept(visitor) {
    for (const contour of this.contours) {
      contour.accept(visitor);
    }
  }
}

// ---- PRIMITIVE VISITORS ----

// abstract class
class PrimitiveVisitor {
  constructor() {
    if (this.constructor === PrimitiveVisitor) {
      throw new Error('PrimitiveVisitor is an abstract class: it cannot be instantiated.');
    }
  }
  // path primitives
  visitAnchor(anchor) {
    throw new Error('Method visitAnchor() has not been implemented.');
  }
  visitLineSegment(lineSegment) {
    throw new Error('Method visitLineSegment() has not been implemented.');
  }
  visitBezierSegment(bezierSegment) {
    throw new Error('Method visitBezierSegment() has not been implemented.');
  }
  visitSplineSegment(curveSegment) {
    throw new Error('Method visitSplineSegment() has not been implemented.');
  }
  visitArcSegment(arcSegment) {
    throw new Error('Method visitArcSegment() has not been implemented.');
  }

  // isolated primitives
  visitPoint(point) {
    throw new Error('Method visitPoint() has not been implemented.');
  }
  visitLine(line) {
    throw new Error('Method visitLine() has not been implemented.');
  }
  visitTriangle(triangle) {
    throw new Error('Method visitTriangle() has not been implemented.');
  }
  visitQuad(quad) {
    throw new Error('Method visitQuad() has not been implemented.');
  }

  // tessellation primitives
  visitTriangleFan(triangleFan) {
    throw new Error('Method visitTriangleFan() has not been implemented.');
  }
  visitTriangleStrip(triangleStrip) {
    throw new Error('Method visitTriangleStrip() has not been implemented.');
  }
  visitQuadStrip(quadStrip) {
    throw new Error('Method visitQuadStrip() has not been implemented.');
  }
}

// requires testing
class PrimitiveToPath2DConverter extends PrimitiveVisitor {
  path = new Path2D();

  // path primitives
  visitAnchor(anchor) {
    let vertex = anchor.getEndVertex();
    this.path.moveTo(vertex.position.x, vertex.position.y);
  }
  visitLineSegment(lineSegment) {
    if (lineSegment.isClosing) {
      // The same as lineTo, but it adds a stroke join between this
      // and the starting vertex rather than having two caps
      this.path.closePath();
    } else {
      let vertex = lineSegment.getEndVertex();
      this.path.lineTo(vertex.position.x, vertex.position.y);
    }
  }
  visitBezierSegment(bezierSegment) {
    let [v1, v2, v3] = bezierSegment.vertices;

    switch (bezierSegment.order) {
      case 2:
        this.path.quadraticCurveTo(
          v1.position.x,
          v1.position.y,
          v2.position.x,
          v2.position.y
        );
        break;
      case 3:
        this.path.bezierCurveTo(
          v1.position.x,
          v1.position.y,
          v2.position.x,
          v2.position.y,
          v3.position.x,
          v3.position.y
        );
        break;
    }
  }
  visitSplineSegment(splineSegment) {
    const shape = splineSegment._shape;

    if (
      splineSegment._splineEnds === constants.HIDE &&
      !splineSegment._comesAfterSegment
    ) {
      let startVertex = splineSegment._firstInterpolatedVertex;
      this.path.moveTo(startVertex.position.x, startVertex.position.y);
    }

    const arrayVertices = splineSegment.getControlPoints().map((v) => shape.vertexToArray(v));
    let bezierArrays = shape.catmullRomToBezier(arrayVertices, splineSegment._splineTightness)
      .map((arr) => arr.map((vertArr) => shape.arrayToVertex(vertArr)));
    for (const array of bezierArrays) {
      const points = array.flatMap((vert) => [vert.position.x, vert.position.y]);
      this.path.bezierCurveTo(...points);
    }
  }
}

class PrimitiveToVerticesConverter extends PrimitiveVisitor {
  contours = [];
  curveDetail;

  constructor({ curveDetail = 1 } = {}) {
    super();
    this.curveDetail = curveDetail;
  }

  lastContour() {
    return this.contours[this.contours.length - 1];
  }

  visitAnchor(anchor) {
    this.contours.push([]);
    // Weird edge case: if the next segment is a spline, we might
    // need to jump to a different vertex.
    const next = anchor._nextPrimitive;
    if (next?.canOverrideAnchor) {
      this.lastContour().push(next._firstInterpolatedVertex);
    } else {
      this.lastContour().push(anchor.getEndVertex());
    }
  }
  visitLineSegment(lineSegment) {
    this.lastContour().push(lineSegment.getEndVertex());
  }
  visitBezierSegment(bezierSegment) {
    const contour = this.lastContour();
    const numPoints = Math.max(1, Math.ceil(bezierSegment.hullLength() * this.curveDetail));
    const vertexArrays = [
      bezierSegment.getStartVertex(),
      ...bezierSegment.vertices
    ].map((v) => bezierSegment._shape.vertexToArray(v));
    for (let i = 0; i < numPoints; i++) {
      const t = (i + 1) / numPoints;
      contour.push(
        bezierSegment._shape.arrayToVertex(
          bezierSegment.order === 3
            ? bezierSegment._shape.evaluateCubicBezier(vertexArrays, t)
            : bezierSegment._shape.evaluateQuadraticBezier(vertexArrays, t)
        )
      )
    }
  }
  visitSplineSegment(splineSegment) {
    const shape = splineSegment._shape;
    const contour = this.lastContour();

    const arrayVertices = splineSegment.getControlPoints().map((v) => shape.vertexToArray(v));
    let bezierArrays = shape.catmullRomToBezier(arrayVertices, splineSegment._splineTightness)
    let startVertex = shape.vertexToArray(splineSegment.getStartVertex());
    for (const array of bezierArrays) {
      const bezierControls = [startVertex, ...array];
      const numPoints = Math.max(1, Math.ceil(polylineLength(bezierControls.map(v => shape.arrayToVertex(v))) * this.curveDetail));
      for (let i = 0; i < numPoints; i++) {
        const t = (i + 1) / numPoints;
        contour.push(shape.arrayToVertex(shape.evaluateCubicBezier(bezierControls, t)));
      }
      startVertex = array[2];
    }
  }
}

class PointAtLengthGetter extends PrimitiveVisitor {
  constructor() {
    super();
  }
}

function customShapes(p5, fn) {
  // ---- GENERAL CLASSES ----

  /**
     * @private
     * A class to describe a custom shape made with `beginShape()`/`endShape()`.
     *
     * Every `Shape` has a `kind`. The kind takes any value that
     * can be passed to <a href="#/p5/beginShape">beginShape()</a>:
     *
     * - `PATH`
     * - `POINTS`
     * - `LINES`
     * - `TRIANGLES`
     * - `QUADS`
     * - `TRIANGLE_FAN`
     * - `TRIANGLE_STRIP`
     * - `QUAD_STRIP`
     *
     * A `Shape` of any kind consists of `contours`, which can be thought of as
     * subshapes (shapes inside another shape). Each `contour` is built from
     * basic shapes called primitives, and each primitive consists of one or more vertices.
     *
     * For example, a square can be made from a single path contour with four line-segment
     * primitives. Each line segment contains a vertex that indicates its endpoint. A square
     * with a circular hole in it contains the circle in a separate contour.
     *
     * By default, each vertex only has a position, but a shape's vertices may have other
     * properties such as texture coordinates, a normal vector, a fill color, and a stroke color.
     * The properties every vertex should have may be customized by passing `vertexProperties` to
     * `createShape()`.
     *
     * Once a shape is created and given a name like `myShape`, it can be built up with
     * methods such as `myShape.beginShape()`, `myShape.vertex()`, and `myShape.endShape()`.
     *
     * Vertex functions such as `vertex()` or `bezierVertex()` are used to set the `position`
     * property of vertices, as well as the `textureCoordinates` property if applicable. Those
     * properties only apply to a single vertex.
     *
     * If `vertexProperties` includes other properties, they are each set by a method of the
     * same name. For example, if vertices in `myShape` have a `fill`, then that is set with
     * `myShape.fill()`. In the same way that a <a href="#/p5/fill">fill()</a> may be applied
     * to one or more shapes, `myShape.fill()` may be applied to one or more vertices.
     *
     * @class p5.Shape
     * @param {Object} [vertexProperties={position: createVector(0, 0)}] vertex properties and their initial values.
     */

  p5.Shape = Shape;

  /**
     * @private
     * A class to describe a contour made with `beginContour()`/`endContour()`.
     *
     * Contours may be thought of as shapes inside of other shapes.
     * For example, a contour may be used to create a hole in a shape that is created
     * with <a href="#/p5/beginShape">beginShape()</a>/<a href="#/p5/endShape">endShape()</a>.
     * Multiple contours may be included inside a single shape.
     *
     * Contours can have any `kind` that a shape can have:
     *
     * - `PATH`
     * - `POINTS`
     * - `LINES`
     * - `TRIANGLES`
     * - `QUADS`
     * - `TRIANGLE_FAN`
     * - `TRIANGLE_STRIP`
     * - `QUAD_STRIP`
     *
     * By default, a contour has the same kind as the shape that contains it, but this
     * may be changed by passing a different `kind` to <a href="#/p5/beginContour">beginContour()</a>.
     *
     * A `Contour` of any kind consists of `primitives`, which are the most basic
     * shapes that can be drawn. For example, if a contour is a hexagon, then
     * it's made from six line-segment primitives.
     *
     * @class p5.Contour
     */

  p5.Contour = Contour;

  /**
     * @private
     * A base class to describe a shape primitive (a basic shape drawn with
     * `beginShape()`/`endShape()`).
     *
     * Shape primitives are the most basic shapes that can be drawn with
     * <a href="#/p5/beginShape">beginShape()</a>/<a href="#/p5/endShape">endShape()</a>:
     *
     * - segment primitives: line segments, bezier segments, spline segments, and arc segments
     * - isolated primitives: points, lines, triangles, and quads
     * - tessellation primitives: triangle fans, triangle strips, and quad strips
     *
     * More complex shapes may be created by combining many primitives, possibly of different kinds,
     * into a single shape.
     *
     * In a similar way, every shape primitive is built from one or more vertices.
     * For example, a point consists of a single vertex, while a triangle consists of three vertices.
     * Each type of shape primitive has a `vertexCapacity`, which may be `Infinity` (for example, a
     * spline may consist of any number of vertices). A primitive's `vertexCount` is the number of
     * vertices it currently contains.
     *
     * Each primitive can add itself to a shape with an `addToShape()` method.
     *
     * It can also accept visitor objects with an `accept()` method. When a primitive accepts a visitor,
     * it gives the visitor access to its vertex data. For example, one visitor to a segment might turn
     * the data into 2D drawing instructions. Another might find a point at a given distance
     * along the segment.
     *
     * @class p5.ShapePrimitive
     * @abstract
     */

  p5.ShapePrimitive = ShapePrimitive;

  /**
     * @private
     * A class to describe a vertex (a point on a shape), in 2D or 3D.
     *
     * Vertices are the basic building blocks of all `p5.Shape` objects, including
     * shapes made with <a href="#/p5/vertex">vertex()</a>, <a href="#/p5/arcVertex">arcVertex()</a>,
     * <a href="#/p5/bezierVertex">bezierVertex()</a>, and <a href="#/p5/splineVertex">splineVertex()</a>.
     *
     * Like a point on an object in the real world, a vertex may have different properties.
     * These may include coordinate properties such as `position`, `textureCoordinates`, and `normal`,
     * color properties such as `fill` and `stroke`, and more.
     *
     * A vertex called `myVertex` with position coordinates `(2, 3, 5)` and a green stroke may be created
     * like this:
     *
     * ```js
     * let myVertex = new p5.Vertex({
     *   position: createVector(2, 3, 5),
     *   stroke: color('green')
     * });
     * ```
     *
     * Any property names may be used. The `p5.Shape` class assumes that if a vertex has a
     * position or texture coordinates, they are stored in `position` and `textureCoordinates`
     * properties.
     *
     * Property values may be any
     * <a href="https://developer.mozilla.org/en-US/docs/Glossary/Primitive">JavaScript primitive</a>, any
     * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer">object literal</a>,
     * or any object with an `array` property.
     *
     * For example, if a position is stored as a `p5.Vector` object and a stroke is stored as a `p5.Color` object,
     * then the `array` properties of those objects will be used by the vertex's own `array` property, which provides
     * all the vertex data in a single array.
     *
     * @class p5.Vertex
     * @param {Object} [properties={position: createVector(0, 0)}] vertex properties.
     */

  p5.Vertex = Vertex;

  // ---- PATH PRIMITIVES ----

  /**
     * @private
     * A class responsible for...
     *
     * @class p5.Anchor
     * @extends p5.ShapePrimitive
     * @param {p5.Vertex} vertex the vertex to include in the anchor.
     */

  p5.Anchor = Anchor;

  /**
     * @private
     * A class responsible for...
     *
     * Note: When a segment is added to a shape, it's attached to an anchor or another segment.
     * Adding it to another shape may result in unexpected behavior.
     *
     * @class p5.Segment
     * @extends p5.ShapePrimitive
     * @param {...p5.Vertex} vertices the vertices to include in the segment.
     */

  p5.Segment = Segment;

  /**
     * @private
     * A class responsible for...
     *
     * @class p5.LineSegment
     * @param {p5.Vertex} vertex the vertex to include in the anchor.
     */

  p5.LineSegment = LineSegment;

  /**
     * @private
     * A class responsible for...
     */

  p5.BezierSegment = BezierSegment;

  /**
     * @private
     * A class responsible for...
     */

  p5.SplineSegment = SplineSegment;

  // ---- ISOLATED PRIMITIVES ----

  /**
     * @private
     * A class responsible for...
     */

  p5.Point = Point;

  /**
     * @private
     * A class responsible for...
     *
     * @class p5.Line
     * @param {...p5.Vertex} vertices the vertices to include in the line.
     */

  p5.Line = Line;

  /**
     * @private
     * A class responsible for...
     */

  p5.Triangle = Triangle;

  /**
     * @private
     * A class responsible for...
     */

  p5.Quad = Quad;

  // ---- TESSELLATION PRIMITIVES ----

  /**
     * @private
     * A class responsible for...
     */

  p5.TriangleFan = TriangleFan;

  /**
     * @private
     * A class responsible for...
     */

  p5.TriangleStrip = TriangleStrip;

  /**
     * @private
     * A class responsible for...
     */

  p5.QuadStrip = QuadStrip;

  // ---- PRIMITIVE VISITORS ----

  /**
     * @private
     * A class responsible for...
     */

  p5.PrimitiveVisitor = PrimitiveVisitor;

  /**
     * @private
     * A class responsible for...
     *
     * Notes:
     * 1. Assumes vertex positions are stored as p5.Vector instances.
     * 2. Currently only supports position properties of vectors.
     */

  p5.PrimitiveToPath2DConverter = PrimitiveToPath2DConverter;

  /**
     * @private
     * A class responsible for...
     */

  p5.PrimitiveToVerticesConverter = PrimitiveToVerticesConverter;

  /**
     * @private
     * A class responsible for...
     */

  p5.PointAtLengthGetter = PointAtLengthGetter;

  // ---- FUNCTIONS ----

  /**
   * TODO: documentation
   */
  fn.bezierOrder = function(order) {
    return this._renderer.bezierOrder(order);
  };

  /**
   * TODO: documentation
   */
  fn.splineVertex = function(...args) {
    let x = 0, y = 0, z = 0, u = 0, v = 0;
    if (args.length === 2) {
      [x, y] = args;
    } else if (args.length === 4) {
      [x, y, u, v] = args;
    } else if (args.length === 3) {
      [x, y, z] = args;
    } else if (args.length === 5) {
      [x, y, z, u, v] = args;
    }
    this._renderer.splineVertex(x, y, z, u, v);
  };

  /**
   * TODO: documentation
   * @param {SHOW|HIDE} mode
   */
  fn.splineEnds = function(mode) {
    return this._renderer.splineEnds(mode);
  };

  /**
   * Adds a vertex to a custom shape.
   *
   * `vertex()` sets the coordinates of vertices drawn between the
   * <a href="#/p5/beginShape">beginShape()</a> and
   * <a href="#/p5/endShape">endShape()</a> functions.
   *
   * The first two parameters, `x` and `y`, set the x- and y-coordinates of the
   * vertex.
   *
   * The third parameter, `z`, is optional. It sets the z-coordinate of the
   * vertex in WebGL mode. By default, `z` is 0.
   *
   * The fourth and fifth parameters, `u` and `v`, are also optional. They set
   * the u- and v-coordinates for the vertex’s texture when used with
   * <a href="#/p5/endShape">endShape()</a>. By default, `u` and `v` are both 0.
   *
   * @method vertex
   * @param  {Number} x x-coordinate of the vertex.
   * @param  {Number} y y-coordinate of the vertex.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the shape.
   *   strokeWeight(3);
   *
   *   // Start drawing the shape.
   *   // Only draw the vertices.
   *   beginShape(POINTS);
   *
   *   // Add the vertices.
   *   vertex(30, 20);
   *   vertex(85, 20);
   *   vertex(85, 75);
   *   vertex(30, 75);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   describe('Four black dots that form a square are drawn on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Add vertices.
   *   vertex(30, 20);
   *   vertex(85, 20);
   *   vertex(85, 75);
   *   vertex(30, 75);
   *
   *   // Stop drawing the shape.
   *   endShape(CLOSE);
   *
   *   describe('A white square on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Add vertices.
   *   vertex(-20, -30, 0);
   *   vertex(35, -30, 0);
   *   vertex(35, 25, 0);
   *   vertex(-20, 25, 0);
   *
   *   // Stop drawing the shape.
   *   endShape(CLOSE);
   *
   *   describe('A white square on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white square spins around slowly on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Add vertices.
   *   vertex(-20, -30, 0);
   *   vertex(35, -30, 0);
   *   vertex(35, 25, 0);
   *   vertex(-20, 25, 0);
   *
   *   // Stop drawing the shape.
   *   endShape(CLOSE);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let img;
   *
   * // Load an image to apply as a texture.
   * function preload() {
   *   img = loadImage('assets/laDefense.jpg');
   * }
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A photograph of a ceiling rotates slowly against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Style the shape.
   *   noStroke();
   *
   *   // Apply the texture.
   *   texture(img);
   *   textureMode(NORMAL);
   *
   *   // Start drawing the shape
   *   beginShape();
   *
   *   // Add vertices.
   *   vertex(-20, -30, 0, 0, 0);
   *   vertex(35, -30, 0, 1, 0);
   *   vertex(35, 25, 0, 1, 1);
   *   vertex(-20, 25, 0, 0, 1);
   *
   *   // Stop drawing the shape.
   *   endShape();
   * }
   * </code>
   * </div>
   */
  /**
   * @method vertex
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} [z]   z-coordinate of the vertex. Defaults to 0.
   * @chainable
   */
  /**
   * @method vertex
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} [z]
   * @param  {Number} [u]   u-coordinate of the vertex's texture. Defaults to 0.
   * @param  {Number} [v]   v-coordinate of the vertex's texture. Defaults to 0.
   * @chainable
   */
  fn.vertex = function(x, y) {
    let z, u, v;

    // default to (x, y) mode: all other arguments assumed to be 0.
    z = u = v = 0;

    if (arguments.length === 3) {
      // (x, y, z) mode: (u, v) assumed to be 0.
      z = arguments[2];
    } else if (arguments.length === 4) {
      // (x, y, u, v) mode: z assumed to be 0.
      u = arguments[2];
      v = arguments[3];
    } else if (arguments.length === 5) {
      // (x, y, z, u, v) mode
      z = arguments[2];
      u = arguments[3];
      v = arguments[4];
    }
    this._renderer.vertex(x, y, z, u, v);
    return;
  }

  // Note: Code is commented out for now, to avoid conflicts with the existing implementation.

  /**
     * Top-line description
     *
     * More details...
     */

  // fn.beginContour = function() {
  //     // example of how to call an existing p5 function:
  //     // this.background('yellow');
  // };

  /**
     * Top-line description
     *
     * More details...
     */

  // fn.beginShape = function() {

  // };

  /**
     * Top-line description
     *
     * More details...
     */

  // fn.bezierVertex = function() {

  // };

  /**
     * Top-line description
     *
     * More details...
     */

  // fn.curveVertex = function() {

  // };

  /**
     * Top-line description
     *
     * More details...
     */

  // fn.endContour = function() {

  // };

  /**
     * Top-line description
     *
     * More details...
     */

  // fn.endShape = function() {

  // };

  /**
     * Top-line description
     *
     * More details...
     */

  // fn.vertex = function() {

  // };

  /**
     * Top-line description
     *
     * More details...
     */

  // fn.normal = function() {

  // };

  /**
     * Top-line description
     *
     * More details...
     */

  // fn.vertexProperty = function() {

  // };
}

export default customShapes;
export {
  catmullRomToBezier,
  Shape,
  Contour,
  ShapePrimitive,
  Vertex,
  Anchor,
  Segment,
  LineSegment,
  BezierSegment,
  SplineSegment,
  Point,
  Line,
  Triangle,
  Quad,
  TriangleFan,
  TriangleStrip,
  QuadStrip,
  PrimitiveVisitor,
  PrimitiveToPath2DConverter,
  PrimitiveToVerticesConverter,
  PointAtLengthGetter
};

if (typeof p5 !== 'undefined') {
  customShapes(p5, p5.prototype);
}
