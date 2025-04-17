/**
 * @module Shape
 * @submodule Custom Shapes
 * @for p5
 * @requires core
 * @requires constants
 */

import { Color } from '../color/p5.Color';
import { Vector } from '../math/p5.Vector';
import * as constants from '../core/constants';

// ---- UTILITY FUNCTIONS ----
function polylineLength(vertices) {
  let length = 0;
  for (let i = 1; i < vertices.length; i++) {
    length += vertices[i-1].position.dist(vertices[i].position);
  }
  return length;
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
    let addedToShape = this.vertices.length > 0;
    if (addedToShape) {
      let lastContour = shape.at(-1);
      this._primitivesIndex = lastContour.primitives.length - 1;
      this._contoursIndex = shape.contours.length - 1;
      this._shape = shape;
    }

    return shape.at(-1, -1);
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

  get vertexCapacity() {
    return this.#vertexCapacity;
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
      this.#_hullLength = polylineLength([
        this.getStartVertex(),
        ...this.vertices
      ]);
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
  _splineProperties = {
    ends: constants.INCLUDE,
    tightness: 0
  };

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
    return this._splineProperties.ends === constants.EXCLUDE;
  }

  // assuming for now that the first interpolated vertex is always
  // the second vertex passed to splineVertex()
  // if this spline segment doesn't follow another segment,
  // the first vertex is in an anchor
  get _firstInterpolatedVertex() {
    if (this._splineProperties.ends === constants.EXCLUDE) {
      return this._comesAfterSegment ?
        this.vertices[1] :
        this.vertices[0];
    } else {
      return this.getStartVertex()
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
    this._splineProperties.ends = shape._splineProperties.ends;
    this._splineProperties.tightness = shape._splineProperties.tightness;

    if (this._splineProperties.ends !== constants.EXCLUDE) return added;

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
    if (this._splineProperties.ends === constants.INCLUDE) {
      return super.getEndVertex();
    } else if (this._splineProperties.ends === constants.EXCLUDE) {
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
    points.push(this.getStartVertex());

    for (const vertex of this.vertices) {
      points.push(vertex);
    }

    const prevVertex = this.getStartVertex();
    if (this._splineProperties.ends === constants.INCLUDE) {
      points.unshift(prevVertex);
      points.push(this.vertices.at(-1));
    } else if (this._splineProperties.ends === constants.JOIN) {
      points.unshift(this.vertices.at(-1));
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
    this._splineProperties.ends = constants.JOIN;
  }
}

// ---- ISOLATED PRIMITIVES ----

class Point extends ShapePrimitive {
  #vertexCapacity = 1;

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  accept(visitor) {
    visitor.visitPoint(this);
  }
}

class Line extends ShapePrimitive {
  #vertexCapacity = 2;

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  accept(visitor) {
    visitor.visitLine(this);
  }
}

class Triangle extends ShapePrimitive {
  #vertexCapacity = 3;

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  accept(visitor) {
    visitor.visitTriangle(this);
  }
}

class Quad extends ShapePrimitive {
  #vertexCapacity = 4;

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  accept(visitor) {
    visitor.visitQuad(this);
  }
}

// ---- TESSELLATION PRIMITIVES ----

class TriangleFan extends ShapePrimitive {
  #vertexCapacity = Infinity;

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  accept(visitor) {
    visitor.visitTriangleFan(this);
  }
}

class TriangleStrip extends ShapePrimitive {
  #vertexCapacity = Infinity;

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  accept(visitor) {
    visitor.visitTriangleStrip(this);
  }
}

class QuadStrip extends ShapePrimitive {
  #vertexCapacity = Infinity;

  get vertexCapacity() {
    return this.#vertexCapacity;
  }

  accept(visitor) {
    visitor.visitQuadStrip(this);
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
  kind = null;
  contours = [];
  _splineProperties = {
    tightness: 0,
    ends: constants.INCLUDE
  };
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
    if (val === null || val === undefined) {
      return [];
    } if (val instanceof Number) {
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
      if (this.userVertexProperties && key in this.userVertexProperties)
        continue;
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
    if (original === null) {
      return null;
    } else if (original instanceof Number) {
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
      // NOTE: Not sure what intention here is, `Color` constructor signature
      // has changed so needed to be reviewed
      const array = [
        queue.shift(),
        queue.shift(),
        queue.shift(),
        queue.shift()
      ];
      return new Color(array);
    }
  }

  arrayToVertex(array) {
    const vertex = {};
    const queue = [...array];

    for (const key in this.#vertexProperties) {
      if (this.userVertexProperties && key in this.userVertexProperties)
        continue;
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
    return array.map(v => v * scale);
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
      this.arrayScale(d, Math.pow(t, 3))
    );
  }

  evaluateQuadraticBezier([a, b, c], t) {
    return this.arraySum(
      this.arrayScale(a, Math.pow(1 - t, 2)),
      this.arrayScale(b, 2 * (1 - t) * t),
      this.arrayScale(c, t * t)
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

    const dataArray = Array.isArray(data) ? data : [data];

    if (!this.userVertexProperties[key]) {
      this.userVertexProperties[key] = dataArray.length;
    }
    this.#vertexProperties[key] = dataArray;
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

  splineProperty(key, value) {
    this._splineProperties[key] = value;
  }

  splineProperties(values) {
    if (values) {
      for (const key in values) {
        this.splineProperty(key, values[key]);
      }
    } else {
      return this._splineProperties;
    }
  }

  /*
  To-do: Maybe refactor #createVertex() since this has side effects that aren't advertised
  in the method name?
  */
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

  arcVertex(position, textureCoordinates) {
    this.#generalVertex('arcVertex', position, textureCoordinates);
  }

  beginContour(shapeKind = constants.PATH) {
    if (this.at(-1)?.kind === constants.EMPTY_PATH) {
      this.contours.pop();
    }
    this.contours.push(new Contour(shapeKind));
  }

  endContour(closeMode = constants.OPEN, _index = this.contours.length - 1) {
    const contour = this.at(_index);
    if (closeMode === constants.CLOSE) {
      // shape characteristics
      const isPath = contour.kind === constants.PATH;

      // anchor characteristics
      const anchorVertex = this.at(_index, 0, 0);
      const anchorHasPosition = Object.hasOwn(anchorVertex, 'position');
      const lastSegment = this.at(_index, -1);

      // close path
      if (isPath && anchorHasPosition) {
        if (lastSegment.handlesClose()) {
          lastSegment.close(anchorVertex);
        } else {
          // Temporarily remove contours after the current one so that we add to the original
          // contour again
          const rest = this.contours.splice(
            _index + 1,
            this.contours.length - _index - 1
          );
          const prevVertexProperties = this.#vertexProperties;
          this.#vertexProperties = { ...prevVertexProperties };
          for (const key in anchorVertex) {
            if (['position', 'textureCoordinates'].includes(key)) continue;
            this.#vertexProperties[key] = anchorVertex[key];
          }
          this.vertex(
            anchorVertex.position,
            anchorVertex.textureCoordinates,
            { isClosing: true }
          );
          this.#vertexProperties = prevVertexProperties;
          this.contours.push(...rest);
        }
      }
    }
  }

  beginShape(shapeKind = constants.PATH) {
    this.kind = shapeKind;
    // Implicitly start a contour
    this.beginContour(shapeKind);
  }
  /* TO-DO:
     Refactor?
     - Might not need anchorHasPosition.
     - Might combine conditions at top, and rely on shortcircuiting.
     Does nothing if shape is not a path or has multiple contours. Might discuss this.
  */
  endShape(closeMode = constants.OPEN) {
    if (closeMode === constants.CLOSE) {
      // Close the first contour, the one implicitly used for shape data
      // added without an explicit contour
      this.endContour(closeMode, 0);
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
  strokeWeight;

  constructor({ strokeWeight }) {
    super();
    this.strokeWeight = strokeWeight;
  }

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
      splineSegment._splineProperties.ends === constants.EXCLUDE &&
      !splineSegment._comesAfterSegment
    ) {
      let startVertex = splineSegment._firstInterpolatedVertex;
      this.path.moveTo(startVertex.position.x, startVertex.position.y);
    }

    const arrayVertices = splineSegment.getControlPoints().map(
      v => shape.vertexToArray(v)
    );
    let bezierArrays = shape.catmullRomToBezier(
      arrayVertices,
      splineSegment._splineProperties.tightness
    ).map(arr => arr.map(vertArr => shape.arrayToVertex(vertArr)));
    for (const array of bezierArrays) {
      const points = array.flatMap(vert => [vert.position.x, vert.position.y]);
      this.path.bezierCurveTo(...points);
    }
  }
  visitPoint(point) {
    const { x, y } = point.vertices[0].position;
    this.path.moveTo(x, y);
    // Hack: to draw just strokes and not fills, draw a very very tiny line
    this.path.lineTo(x + 0.00001, y);
  }
  visitLine(line) {
    const { x: x0, y: y0 } = line.vertices[0].position;
    const { x: x1, y: y1 } = line.vertices[1].position;
    this.path.moveTo(x0, y0);
    this.path.lineTo(x1, y1);
  }
  visitTriangle(triangle) {
    const [v0, v1, v2] = triangle.vertices;
    this.path.moveTo(v0.position.x, v0.position.y);
    this.path.lineTo(v1.position.x, v1.position.y);
    this.path.lineTo(v2.position.x, v2.position.y);
    this.path.closePath();
  }
  visitQuad(quad) {
    const [v0, v1, v2, v3] = quad.vertices;
    this.path.moveTo(v0.position.x, v0.position.y);
    this.path.lineTo(v1.position.x, v1.position.y);
    this.path.lineTo(v2.position.x, v2.position.y);
    this.path.lineTo(v3.position.x, v3.position.y);
    this.path.closePath();
  }
  visitTriangleFan(triangleFan) {
    const [v0, ...rest] = triangleFan.vertices;
    for (let i = 0; i < rest.length - 1; i++) {
      const v1 = rest[i];
      const v2 = rest[i + 1];
      this.path.moveTo(v0.position.x, v0.position.y);
      this.path.lineTo(v1.position.x, v1.position.y);
      this.path.lineTo(v2.position.x, v2.position.y);
      this.path.closePath();
    }
  }
  visitTriangleStrip(triangleStrip) {
    for (let i = 0; i < triangleStrip.vertices.length - 2; i++) {
      const v0 = triangleStrip.vertices[i];
      const v1 = triangleStrip.vertices[i + 1];
      const v2 = triangleStrip.vertices[i + 2];
      this.path.moveTo(v0.position.x, v0.position.y);
      this.path.lineTo(v1.position.x, v1.position.y);
      this.path.lineTo(v2.position.x, v2.position.y);
      this.path.closePath();
    }
  }
  visitQuadStrip(quadStrip) {
    for (let i = 0; i < quadStrip.vertices.length - 3; i += 2) {
      const v0 = quadStrip.vertices[i];
      const v1 = quadStrip.vertices[i + 1];
      const v2 = quadStrip.vertices[i + 2];
      const v3 = quadStrip.vertices[i + 3];
      this.path.moveTo(v0.position.x, v0.position.y);
      this.path.lineTo(v1.position.x, v1.position.y);
      // These are intentionally out of order to go around the quad
      this.path.lineTo(v3.position.x, v3.position.y);
      this.path.lineTo(v2.position.x, v2.position.y);
      this.path.closePath();
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
    const numPoints = Math.max(
      1,
      Math.ceil(bezierSegment.hullLength() * this.curveDetail)
    );
    const vertexArrays = [
      bezierSegment.getStartVertex(),
      ...bezierSegment.vertices
    ].map(v => bezierSegment._shape.vertexToArray(v));
    for (let i = 0; i < numPoints; i++) {
      const t = (i + 1) / numPoints;
      contour.push(
        bezierSegment._shape.arrayToVertex(
          bezierSegment.order === 3
            ? bezierSegment._shape.evaluateCubicBezier(vertexArrays, t)
            : bezierSegment._shape.evaluateQuadraticBezier(vertexArrays, t)
        )
      );
    }
  }
  visitSplineSegment(splineSegment) {
    const shape = splineSegment._shape;
    const contour = this.lastContour();

    const arrayVertices = splineSegment.getControlPoints().map(
      v => shape.vertexToArray(v)
    );
    let bezierArrays = shape.catmullRomToBezier(
      arrayVertices,
      splineSegment._splineProperties.tightness
    );
    let startVertex = shape.vertexToArray(splineSegment._firstInterpolatedVertex);
    for (const array of bezierArrays) {
      const bezierControls = [startVertex, ...array];
      const numPoints = Math.max(
        1,
        Math.ceil(
          polylineLength(bezierControls.map(v => shape.arrayToVertex(v))) *
          this.curveDetail
        )
      );
      for (let i = 0; i < numPoints; i++) {
        const t = (i + 1) / numPoints;
        contour.push(
          shape.arrayToVertex(shape.evaluateCubicBezier(bezierControls, t))
        );
      }
      startVertex = array[2];
    }
  }
  visitPoint(point) {
    this.contours.push(point.vertices.slice());
  }
  visitLine(line) {
    this.contours.push(line.vertices.slice());
  }
  visitTriangle(triangle) {
    this.contours.push(triangle.vertices.slice());
  }
  visitQuad(quad) {
    this.contours.push(quad.vertices.slice());
  }
  visitTriangleFan(triangleFan) {
    // WebGL itself interprets the vertices as a fan, no reformatting needed
    this.contours.push(triangleFan.vertices.slice());
  }
  visitTriangleStrip(triangleStrip) {
    // WebGL itself interprets the vertices as a strip, no reformatting needed
    this.contours.push(triangleStrip.vertices.slice());
  }
  visitQuadStrip(quadStrip) {
    // WebGL itself interprets the vertices as a strip, no reformatting needed
    this.contours.push(quadStrip.vertices.slice());
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
   * Begins creating a hole within a flat shape.
   *
   * The `beginContour()` and <a href="#/p5/endContour">endContour()</a>
   * functions allow for creating negative space within custom shapes that are
   * flat. `beginContour()` begins adding vertices to a negative space and
   * <a href="#/p5/endContour">endContour()</a> stops adding them.
   * `beginContour()` and <a href="#/p5/endContour">endContour()</a> must be
   * called between <a href="#/p5/beginShape">beginShape()</a> and
   * <a href="#/p5/endShape">endShape()</a>.
   *
   * Transformations such as <a href="#/p5/translate">translate()</a>,
   * <a href="#/p5/rotate">rotate()</a>, and <a href="#/p5/scale">scale()</a>
   * don't work between `beginContour()` and
   * <a href="#/p5/endContour">endContour()</a>. It's also not possible to use
   * other shapes, such as <a href="#/p5/ellipse">ellipse()</a> or
   * <a href="#/p5/rect">rect()</a>, between `beginContour()` and
   * <a href="#/p5/endContour">endContour()</a>.
   *
   * Note: The vertices that define a negative space must "wind" in the opposite
   * direction from the outer shape. First, draw vertices for the outer shape
   * clockwise order. Then, draw vertices for the negative space in
   * counter-clockwise order.
   *
   * @method beginContour
   *
   * @example
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
   *   // Exterior vertices, clockwise winding.
   *   vertex(10, 10);
   *   vertex(90, 10);
   *   vertex(90, 90);
   *   vertex(10, 90);
   *
   *   // Interior vertices, counter-clockwise winding.
   *   beginContour();
   *   vertex(30, 30);
   *   vertex(30, 70);
   *   vertex(70, 70);
   *   vertex(70, 30);
   *   endContour();
   *
   *   // Stop drawing the shape.
   *   endShape(CLOSE);
   *
   *   describe('A white square with a square hole in its center drawn on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white square with a square hole in its center drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Exterior vertices, clockwise winding.
   *   vertex(-40, -40);
   *   vertex(40, -40);
   *   vertex(40, 40);
   *   vertex(-40, 40);
   *
   *   // Interior vertices, counter-clockwise winding.
   *   beginContour();
   *   vertex(-20, -20);
   *   vertex(-20, 20);
   *   vertex(20, 20);
   *   vertex(20, -20);
   *   endContour();
   *
   *   // Stop drawing the shape.
   *   endShape(CLOSE);
   * }
   * </code>
   * </div>
   */
    fn.beginContour = function(kind) {
      this._renderer.beginContour(kind);
    };

  /**
   * Begins adding vertices to a custom shape.
   *
   * The `beginShape()` and <a href="#/p5/endShape">endShape()</a> functions
   * allow for creating custom shapes in 2D or 3D. `beginShape()` begins adding
   * vertices to a custom shape and <a href="#/p5/endShape">endShape()</a> stops
   * adding them.
   *
   * The parameter, `kind`, sets the kind of shape to make. The available kinds are:
   *
   * - `PATH` (the default) to draw shapes by tracing out the path along their edges.
   * - `POINTS` to draw a series of points.
   * - `LINES` to draw a series of unconnected line segments.
   * - `TRIANGLES` to draw a series of separate triangles.
   * - `TRIANGLE_FAN` to draw a series of connected triangles sharing the first vertex in a fan-like fashion.
   * - `TRIANGLE_STRIP` to draw a series of connected triangles in strip fashion.
   * - `QUADS` to draw a series of separate quadrilaterals (quads).
   * - `QUAD_STRIP` to draw quad strip using adjacent edges to form the next quad.
   *
   * After calling `beginShape()`, shapes can be built by calling
   * <a href="#/p5/vertex">vertex()</a>,
   * <a href="#/p5/bezierVertex">bezierVertex()</a>,
   * <a href="#/p5/bezierVertex">bezierVertex()</a>, and/or
   * <a href="#/p5/splineVertex">splineVertex()</a>. Calling
   * <a href="#/p5/endShape">endShape()</a> will stop adding vertices to the
   * shape. Each shape will be outlined with the current stroke color and filled
   * with the current fill color.
   *
   * Transformations such as <a href="#/p5/translate">translate()</a>,
   * <a href="#/p5/rotate">rotate()</a>, and
   * <a href="#/p5/scale">scale()</a> don't work between `beginShape()` and
   * <a href="#/p5/endShape">endShape()</a>. It's also not possible to use
   * other shapes, such as <a href="#/p5/ellipse">ellipse()</a> or
   * <a href="#/p5/rect">rect()</a>, between `beginShape()` and
   * <a href="#/p5/endShape">endShape()</a>.
   *
   * @method beginShape
   * @param  {(POINTS|LINES|TRIANGLES|TRIANGLE_FAN|TRIANGLE_STRIP|QUADS|QUAD_STRIP|PATH)} [kind=PATH] either POINTS, LINES, TRIANGLES, TRIANGLE_FAN
   *                                TRIANGLE_STRIP, QUADS, QUAD_STRIP or PATH. Defaults to PATH.
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
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Start drawing the shape.
   *   // Only draw the vertices (points).
   *   beginShape(POINTS);
   *
   *   // Add vertices.
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
   *   // Only draw lines between alternating pairs of vertices.
   *   beginShape(LINES);
   *
   *   // Add vertices.
   *   vertex(30, 20);
   *   vertex(85, 20);
   *   vertex(85, 75);
   *   vertex(30, 75);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   describe('Two horizontal black lines on a gray background.');
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
   *   // Style the shape.
   *   noFill();
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
   *   endShape();
   *
   *   describe('Three black lines form a sideways U shape on a gray background.');
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
   *   // Style the shape.
   *   noFill();
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
   *   // Connect the first and last vertices.
   *   endShape(CLOSE);
   *
   *   describe('A black outline of a square drawn on a gray background.');
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
   *   // Draw a series of triangles.
   *   beginShape(TRIANGLES);
   *
   *   // Left triangle.
   *   vertex(30, 75);
   *   vertex(40, 20);
   *   vertex(50, 75);
   *
   *   // Right triangle.
   *   vertex(60, 20);
   *   vertex(70, 75);
   *   vertex(80, 20);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   describe('Two white triangles drawn on a gray background.');
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
   *   // Draw a series of triangles.
   *   beginShape(TRIANGLE_STRIP);
   *
   *   // Add vertices.
   *   vertex(30, 75);
   *   vertex(40, 20);
   *   vertex(50, 75);
   *   vertex(60, 20);
   *   vertex(70, 75);
   *   vertex(80, 20);
   *   vertex(90, 75);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   describe('Five white triangles that are interleaved drawn on a gray background.');
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
   *   // Draw a series of triangles that share their first vertex.
   *   beginShape(TRIANGLE_FAN);
   *
   *   // Add vertices.
   *   vertex(57.5, 50);
   *   vertex(57.5, 15);
   *   vertex(92, 50);
   *   vertex(57.5, 85);
   *   vertex(22, 50);
   *   vertex(57.5, 15);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   describe('Four white triangles form a square are drawn on a gray background.');
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
   *   // Draw a series of quadrilaterals.
   *   beginShape(QUADS);
   *
   *   // Left rectangle.
   *   vertex(30, 20);
   *   vertex(30, 75);
   *   vertex(50, 75);
   *   vertex(50, 20);
   *
   *   // Right rectangle.
   *   vertex(65, 20);
   *   vertex(65, 75);
   *   vertex(85, 75);
   *   vertex(85, 20);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   describe('Two white rectangles drawn on a gray background.');
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
   *   // Draw a series of quadrilaterals.
   *   beginShape(QUAD_STRIP);
   *
   *   // Add vertices.
   *   vertex(30, 20);
   *   vertex(30, 75);
   *   vertex(50, 20);
   *   vertex(50, 75);
   *   vertex(65, 20);
   *   vertex(65, 75);
   *   vertex(85, 20);
   *   vertex(85, 75);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   describe('Three white rectangles that share edges are drawn on a gray background.');
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
   *   // Draw a series of quadrilaterals.
   *   beginShape(PATH);
   *
   *   // Add the vertices.
   *   vertex(-30, -30, 0);
   *   vertex(30, -30, 0);
   *   vertex(30, -10, 0);
   *   vertex(-10, -10, 0);
   *   vertex(-10, 10, 0);
   *   vertex(30, 10, 0);
   *   vertex(30, 30, 0);
   *   vertex(-30, 30, 0);
   *
   *   // Stop drawing the shape.
   *   // Connect the first and last vertices.
   *   endShape(CLOSE);
   *
   *   describe('A blocky C shape drawn in white on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag with the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A blocky C shape drawn in red, blue, and green on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Start drawing the shape.
   *   // Draw a series of quadrilaterals.
   *   beginShape(PATH);
   *
   *   // Add the vertices.
   *   fill('red');
   *   stroke('red');
   *   vertex(-30, -30, 0);
   *   vertex(30, -30, 0);
   *   vertex(30, -10, 0);
   *   fill('green');
   *   stroke('green');
   *   vertex(-10, -10, 0);
   *   vertex(-10, 10, 0);
   *   vertex(30, 10, 0);
   *   fill('blue');
   *   stroke('blue');
   *   vertex(30, 30, 0);
   *   vertex(-30, 30, 0);
   *
   *   // Stop drawing the shape.
   *   // Connect the first and last vertices.
   *   endShape(CLOSE);
   * }
   * </code>
   * </div>
   */
    fn.beginShape = function(kind) {
      // p5._validateParameters('beginShape', arguments);
      this._renderer.beginShape(...arguments);
    };

  /**
   * @method bezierOrder
   * @returns {Number} The current bezier order.
   */
  /**
   * @method bezierOrder
   * @param {Number} order The new order to set.
   */
  fn.bezierOrder = function(order) {
    return this._renderer.bezierOrder(order);
  };

  /**
   * Adds a Bézier curve segment to a custom shape.
   *
   * `bezierVertex()` adds a curved segment to custom shapes. The Bézier curves
   * it creates are defined like those made by the
   * <a href="#/p5/bezier">bezier()</a> function. `bezierVertex()` must be
   * called between the
   * <a href="#/p5/beginShape">beginShape()</a> and
   * <a href="#/p5/endShape">endShape()</a> functions. The curved segment uses
   * the previous vertex as the first anchor point, so there must be at least
   * one call to <a href="#/p5/vertex">vertex()</a> before `bezierVertex()` can
   * be used.
   *
   * The first four parameters, `x2`, `y2`, `x3`, and `y3`, set the curve’s two
   * control points. The control points "pull" the curve towards them.
   *
   * The fifth and sixth parameters, `x4`, and `y4`, set the last anchor point.
   * The last anchor point is where the curve ends.
   *
   * Bézier curves can also be drawn in 3D using WebGL mode. The 3D version of
   * `bezierVertex()` has eight arguments because each point has x-, y-, and
   * z-coordinates.
   *
   * Note: `bezierVertex()` won’t work when an argument is passed to
   * <a href="#/p5/beginShape">beginShape()</a>.
   *
   * @method bezierVertex
   * @param  {Number} x x-coordinate of the first control point.
   * @param  {Number} y y-coordinate of the first control point.
   * @param  {Number} [u]
   * @param  {Number} [v]
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
   *   noFill();
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Add the first anchor point.
   *   vertex(30, 20);
   *
   *   // Add the Bézier vertex.
   *   bezierVertex(80, 0, 80, 75, 30, 75);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   describe('A black C curve on a gray background.');
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
   *   // Draw the anchor points in black.
   *   stroke(0);
   *   strokeWeight(5);
   *   point(30, 20);
   *   point(30, 75);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(80, 0);
   *   point(80, 75);
   *
   *   // Style the shape.
   *   noFill();
   *   stroke(0);
   *   strokeWeight(1);
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Add the first anchor point.
   *   vertex(30, 20);
   *
   *   // Add the Bézier vertex.
   *   bezierVertex(80, 0, 80, 75, 30, 75);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   // Draw red lines from the anchor points to the control points.
   *   stroke(255, 0, 0);
   *   line(30, 20, 80, 0);
   *   line(30, 75, 80, 75);
   *
   *   describe(
   *     'A gray square with three curves. A black curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click the mouse near the red dot in the top-right corner
   * // and drag to change the curve's shape.
   *
   * let x2 = 80;
   * let y2 = 0;
   * let isChanging = false;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with three curves. A black curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the anchor points in black.
   *   stroke(0);
   *   strokeWeight(5);
   *   point(30, 20);
   *   point(30, 75);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(x2, y2);
   *   point(80, 75);
   *
   *   // Style the shape.
   *   noFill();
   *   stroke(0);
   *   strokeWeight(1);
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Add the first anchor point.
   *   vertex(30, 20);
   *
   *   // Add the Bézier vertex.
   *   bezierVertex(x2, y2, 80, 75, 30, 75);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   // Draw red lines from the anchor points to the control points.
   *   stroke(255, 0, 0);
   *   line(30, 20, x2, y2);
   *   line(30, 75, 80, 75);
   * }
   *
   * // Start changing the first control point if the user clicks near it.
   * function mousePressed() {
   *   if (dist(mouseX, mouseY, x2, y2) < 20) {
   *     isChanging = true;
   *   }
   * }
   *
   * // Stop changing the first control point when the user releases the mouse.
   * function mouseReleased() {
   *   isChanging = false;
   * }
   *
   * // Update the first control point while the user drags the mouse.
   * function mouseDragged() {
   *   if (isChanging === true) {
   *     x2 = mouseX;
   *     y2 = mouseY;
   *   }
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
   *   // Add the first anchor point.
   *   vertex(30, 20);
   *
   *   // Add the Bézier vertices.
   *   bezierVertex(80, 0, 80, 75, 30, 75);
   *   bezierVertex(50, 80, 60, 25, 30, 20);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   describe('A crescent moon shape drawn in white on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A crescent moon shape drawn in white on a blue background. When the user drags the mouse, the scene rotates and a second moon is revealed.');
   * }
   *
   * function draw() {
   *   background('midnightblue');
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the moons.
   *   noStroke();
   *   fill('lemonchiffon');
   *
   *   // Draw the first moon.
   *   beginShape();
   *   vertex(-20, -30, 0);
   *   bezierVertex(30, -50, 0, 30, 25, 0, -20, 25, 0);
   *   bezierVertex(0, 30, 0, 10, -25, 0, -20, -30, 0);
   *   endShape();
   *
   *   // Draw the second moon.
   *   beginShape();
   *   vertex(-20, -30, -20);
   *   bezierVertex(30, -50, -20, 30, 25, -20, -20, 25, -20);
   *   bezierVertex(0, 30, -20, 10, -25, -20, -20, -30, -20);
   *   endShape();
   * }
   * </code>
   * </div>
   */

  /**
   * @method bezierVertex
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} z
   * @param  {Number} [u]
   * @param  {Number} [v]
   */
  fn.bezierVertex = function(...args) {
    this._renderer.bezierVertex(...args);
  };

  /**
   * Stops creating a hole within a flat shape.
   *
   * The <a href="#/p5/beginContour">beginContour()</a> and `endContour()`
   * functions allow for creating negative space within custom shapes that are
   * flat. <a href="#/p5/beginContour">beginContour()</a> begins adding vertices
   * to a negative space and `endContour()` stops adding them.
   * <a href="#/p5/beginContour">beginContour()</a> and `endContour()` must be
   * called between <a href="#/p5/beginShape">beginShape()</a> and
   * <a href="#/p5/endShape">endShape()</a>.
   *
   * Transformations such as <a href="#/p5/translate">translate()</a>,
   * <a href="#/p5/rotate">rotate()</a>, and <a href="#/p5/scale">scale()</a>
   * don't work between <a href="#/p5/beginContour">beginContour()</a> and
   * `endContour()`. It's also not possible to use other shapes, such as
   * <a href="#/p5/ellipse">ellipse()</a> or <a href="#/p5/rect">rect()</a>,
   * between <a href="#/p5/beginContour">beginContour()</a> and `endContour()`.
   *
   * Note: The vertices that define a negative space must "wind" in the opposite
   * direction from the outer shape. First, draw vertices for the outer shape
   * clockwise order. Then, draw vertices for the negative space in
   * counter-clockwise order.
   *
   * @method endContour
   * @param {OPEN|CLOSE} [mode=OPEN]
   *
   * @example
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
   *   // Exterior vertices, clockwise winding.
   *   vertex(10, 10);
   *   vertex(90, 10);
   *   vertex(90, 90);
   *   vertex(10, 90);
   *
   *   // Interior vertices, counter-clockwise winding.
   *   beginContour();
   *   vertex(30, 30);
   *   vertex(30, 70);
   *   vertex(70, 70);
   *   vertex(70, 30);
   *   endContour();
   *
   *   // Stop drawing the shape.
   *   endShape(CLOSE);
   *
   *   describe('A white square with a square hole in its center drawn on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white square with a square hole in its center drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Exterior vertices, clockwise winding.
   *   vertex(-40, -40);
   *   vertex(40, -40);
   *   vertex(40, 40);
   *   vertex(-40, 40);
   *
   *   // Interior vertices, counter-clockwise winding.
   *   beginContour();
   *   vertex(-20, -20);
   *   vertex(-20, 20);
   *   vertex(20, 20);
   *   vertex(20, -20);
   *   endContour();
   *
   *   // Stop drawing the shape.
   *   endShape(CLOSE);
   * }
   * </code>
   * </div>
   */
  fn.endContour = function(mode = constants.OPEN) {
    this._renderer.endContour(mode);
  };

  /**
   * Begins adding vertices to a custom shape.
   *
   * The <a href="#/p5/beginShape">beginShape()</a> and `endShape()` functions
   * allow for creating custom shapes in 2D or 3D.
   * <a href="#/p5/beginShape">beginShape()</a> begins adding vertices to a
   * custom shape and `endShape()` stops adding them.
   *
   * The first parameter, `mode`, is optional. By default, the first and last
   * vertices of a shape aren't connected. If the constant `CLOSE` is passed, as
   * in `endShape(CLOSE)`, then the first and last vertices will be connected.
   *
   * The second parameter, `count`, is also optional. In WebGL mode, it’s more
   * efficient to draw many copies of the same shape using a technique called
   * <a href="https://webglfundamentals.org/webgl/lessons/webgl-instanced-drawing.html" target="_blank">instancing</a>.
   * The `count` parameter tells WebGL mode how many copies to draw. For
   * example, calling `endShape(CLOSE, 400)` after drawing a custom shape will
   * make it efficient to draw 400 copies. This feature requires
   * <a href="https://p5js.org/tutorials/intro-to-shaders/" target="_blank">writing a custom shader</a>.
   *
   * After calling <a href="#/p5/beginShape">beginShape()</a>, shapes can be
   * built by calling <a href="#/p5/vertex">vertex()</a>,
   * <a href="#/p5/bezierVertex">bezierVertex()</a>,
   * <a href="#/p5/quadraticVertex">quadraticVertex()</a>, and/or
   * <a href="#/p5/curveVertex">splineVertex()</a>. Calling
   * `endShape()` will stop adding vertices to the
   * shape. Each shape will be outlined with the current stroke color and filled
   * with the current fill color.
   *
   * Transformations such as <a href="#/p5/translate">translate()</a>,
   * <a href="#/p5/rotate">rotate()</a>, and
   * <a href="#/p5/scale">scale()</a> don't work between
   * <a href="#/p5/beginShape">beginShape()</a> and `endShape()`. It's also not
   * possible to use other shapes, such as <a href="#/p5/ellipse">ellipse()</a> or
   * <a href="#/p5/rect">rect()</a>, between
   * <a href="#/p5/beginShape">beginShape()</a> and `endShape()`.
   *
   * @method endShape
   * @param  {CLOSE} [mode] use CLOSE to close the shape
   * @param  {Integer} [count] number of times you want to draw/instance the shape (for WebGL mode).
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
   *   // Style the shapes.
   *   noFill();
   *
   *   // Left triangle.
   *   beginShape();
   *   vertex(20, 20);
   *   vertex(45, 20);
   *   vertex(45, 80);
   *   endShape(CLOSE);
   *
   *   // Right triangle.
   *   beginShape();
   *   vertex(50, 20);
   *   vertex(75, 20);
   *   vertex(75, 80);
   *   endShape();
   *
   *   describe(
   *     'Two sets of black lines drawn on a gray background. The three lines on the left form a right triangle. The two lines on the right form a right angle.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Note: A "uniform" is a global variable within a shader program.
   *
   * // Create a string with the vertex shader program.
   * // The vertex shader is called for each vertex.
   * let vertSrc = `#version 300 es
   *
   * precision mediump float;
   *
   * in vec3 aPosition;
   * flat out int instanceID;
   *
   * uniform mat4 uModelViewMatrix;
   * uniform mat4 uProjectionMatrix;
   *
   * void main() {
   *
   *   // Copy the instance ID to the fragment shader.
   *   instanceID = gl_InstanceID;
   *   vec4 positionVec4 = vec4(aPosition, 1.0);
   *
   *   // gl_InstanceID represents a numeric value for each instance.
   *   // Using gl_InstanceID allows us to move each instance separately.
   *   // Here we move each instance horizontally by ID * 23.
   *   float xOffset = float(gl_InstanceID) * 23.0;
   *
   *   // Apply the offset to the final position.
   *   gl_Position = uProjectionMatrix * uModelViewMatrix * (positionVec4 -
   *     vec4(xOffset, 0.0, 0.0, 0.0));
   * }
   * `;
   *
   * // Create a string with the fragment shader program.
   * // The fragment shader is called for each pixel.
   * let fragSrc = `#version 300 es
   *
   * precision mediump float;
   *
   * out vec4 outColor;
   * flat in int instanceID;
   * uniform float numInstances;
   *
   * void main() {
   *   vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
   *   vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);
   *
   *   // Normalize the instance ID.
   *   float normId = float(instanceID) / numInstances;
   *
   *   // Mix between two colors using the normalized instance ID.
   *   outColor = mix(red, blue, normId);
   * }
   * `;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Shader object.
   *   let myShader = createShader(vertSrc, fragSrc);
   *
   *   background(220);
   *
   *   // Compile and apply the p5.Shader.
   *   shader(myShader);
   *
   *   // Set the numInstances uniform.
   *   myShader.setUniform('numInstances', 4);
   *
   *   // Translate the origin to help align the drawing.
   *   translate(25, -10);
   *
   *   // Style the shapes.
   *   noStroke();
   *
   *   // Draw the shapes.
   *   beginShape();
   *   vertex(0, 0);
   *   vertex(0, 20);
   *   vertex(20, 20);
   *   vertex(20, 0);
   *   vertex(0, 0);
   *   endShape(CLOSE, 4);
   *
   *   describe('A row of four squares. Their colors transition from purple on the left to red on the right');
   * }
   * </code>
   * </div>
   */
    fn.endShape = function(mode, count = 1) {
      // p5._validateParameters('endShape', arguments);
      if (count < 1) {
        console.log('🌸 p5.js says: You can not have less than one instance');
        count = 1;
      }
  
      this._renderer.endShape(mode, count);
    };

    /**
   * Sets the normal vector for vertices in a custom 3D shape.
   *
   * 3D shapes created with <a href="#/p5/beginShape">beginShape()</a> and
   * <a href="#/p5/endShape">endShape()</a> are made by connecting sets of
   * points called vertices. Each vertex added with
   * <a href="#/p5/vertex">vertex()</a> has a normal vector that points away
   * from it. The normal vector controls how light reflects off the shape.
   *
   * `normal()` can be called two ways with different parameters to define the
   * normal vector's components.
   *
   * The first way to call `normal()` has three parameters, `x`, `y`, and `z`.
   * If `Number`s are passed, as in `normal(1, 2, 3)`, they set the x-, y-, and
   * z-components of the normal vector.
   *
   * The second way to call `normal()` has one parameter, `vector`. If a
   * <a href="#/p5.Vector">p5.Vector</a> object is passed, as in
   * `normal(myVector)`, its components will be used to set the normal vector.
   *
   * `normal()` changes the normal vector of vertices added to a custom shape
   * with <a href="#/p5/vertex">vertex()</a>. `normal()` must be called between
   * the <a href="#/p5/beginShape">beginShape()</a> and
   * <a href="#/p5/endShape">endShape()</a> functions, just like
   * <a href="#/p5/vertex">vertex()</a>. The normal vector set by calling
   * `normal()` will affect all following vertices until `normal()` is called
   * again:
   *
   * ```js
   * beginShape();
   *
   * // Set the vertex normal.
   * normal(-0.4, -0.4, 0.8);
   *
   * // Add a vertex.
   * vertex(-30, -30, 0);
   *
   * // Set the vertex normal.
   * normal(0, 0, 1);
   *
   * // Add vertices.
   * vertex(30, -30, 0);
   * vertex(30, 30, 0);
   *
   * // Set the vertex normal.
   * normal(0.4, -0.4, 0.8);
   *
   * // Add a vertex.
   * vertex(-30, 30, 0);
   *
   * endShape();
   * ```
   *
   * @method normal
   * @param  {p5.Vector} vector vertex normal as a <a href="#/p5.Vector">p5.Vector</a> object.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Click the and drag the mouse to view the scene from a different angle.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe(
   *     'A colorful square on a black background. The square changes color and rotates when the user drags the mouse. Parts of its surface reflect light in different directions.'
   *   );
   * }
   *
   * function draw() {
   *   background(0);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the shape.
   *   normalMaterial();
   *   noStroke();
   *
   *   // Draw the shape.
   *   beginShape();
   *   vertex(-30, -30, 0);
   *   vertex(30, -30, 0);
   *   vertex(30, 30, 0);
   *   vertex(-30, 30, 0);
   *   endShape();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click the and drag the mouse to view the scene from a different angle.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe(
   *     'A colorful square on a black background. The square changes color and rotates when the user drags the mouse. Parts of its surface reflect light in different directions.'
   *   );
   * }
   *
   * function draw() {
   *   background(0);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the shape.
   *   normalMaterial();
   *   noStroke();
   *
   *   // Draw the shape.
   *   // Use normal() to set vertex normals.
   *   beginShape();
   *   normal(-0.4, -0.4, 0.8);
   *   vertex(-30, -30, 0);
   *
   *   normal(0, 0, 1);
   *   vertex(30, -30, 0);
   *   vertex(30, 30, 0);
   *
   *   normal(0.4, -0.4, 0.8);
   *   vertex(-30, 30, 0);
   *   endShape();
   * }
   * </code>
   * </div>
   *
   * <div class='notest'>
   * <code>
   * // Click the and drag the mouse to view the scene from a different angle.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe(
   *     'A colorful square on a black background. The square changes color and rotates when the user drags the mouse. Parts of its surface reflect light in different directions.'
   *   );
   * }
   *
   * function draw() {
   *   background(0);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the shape.
   *   normalMaterial();
   *   noStroke();
   *
   *   // Create p5.Vector objects.
   *   let n1 = createVector(-0.4, -0.4, 0.8);
   *   let n2 = createVector(0, 0, 1);
   *   let n3 = createVector(0.4, -0.4, 0.8);
   *
   *   // Draw the shape.
   *   // Use normal() to set vertex normals.
   *   beginShape();
   *   normal(n1);
   *   vertex(-30, -30, 0);
   *
   *   normal(n2);
   *   vertex(30, -30, 0);
   *   vertex(30, 30, 0);
   *
   *   normal(n3);
   *   vertex(-30, 30, 0);
   *   endShape();
   * }
   * </code>
   * </div>
   */

  /**
   * @method normal
   * @param  {Number} x x-component of the vertex normal.
   * @param  {Number} y y-component of the vertex normal.
   * @param  {Number} z z-component of the vertex normal.
   * @chainable
   */
  fn.normal = function(x, y, z) {
    this._assert3d('normal');
    // p5._validateParameters('normal', arguments);
    this._renderer.normal(...arguments);

    return this;
  };

  /**
   * @method splineProperties
   * @returns {Object} The current spline properties.
   */
  /**
   * @method splineProperties
   * @param {Object} An object containing key-value pairs to set.
   */
  fn.splineProperties = function(values) {
    return this._renderer.splineProperties(values);
  };

  /**
   * @method splineProperty
   * @param {String} property
   * @returns value The current value for the given property.
   */
  /**
   * @method splineProperty
   * @param {String} property
   * @param value Value to set the given property to.
   */
  fn.splineProperty = function(property, value) {
    return this._renderer.splineProperty(property, value);
  };

    /**
   * Adds a spline segment to a custom shape.
   * 
   * NOTE: THESE DOCS ARE BASED ON THE OLD `curveVertex()` DOCS; UPDATES MAY STILL
   * BE REQUIRED.
   *
   * `splineVertex()` adds a curved segment to custom shapes. The spline curves
   * it creates are defined like those made by the
   * <a href="#/p5/curve">curve()</a> function. `splineVertex()` must be called
   * between the <a href="#/p5/beginShape">beginShape()</a> and
   * <a href="#/p5/endShape">endShape()</a> functions.
   *
   * Spline curves can form shapes and curves that slope gently. They’re like
   * cables that are attached to a set of points. Splines are defined by two
   * anchor points and two control points. `splineVertex()` must be called at
   * least four times between
   * <a href="#/p5/beginShape">beginShape()</a> and
   * <a href="#/p5/endShape">endShape()</a> in order to draw a curve:
   *
   * ```js
   * beginShape();
   *
   * // Add the first control point.
   * splineVertex(84, 91);
   *
   * // Add the anchor points to draw between.
   * splineVertex(68, 19);
   * splineVertex(21, 17);
   *
   * // Add the second control point.
   * splineVertex(32, 91);
   *
   * endShape();
   * ```
   *
   * The code snippet above would only draw the curve between the anchor points,
   * similar to the <a href="#/p5/curve">curve()</a> function. The segments
   * between the control and anchor points can be drawn by calling
   * `splineVertex()` with the coordinates of the control points:
   *
   * ```js
   * beginShape();
   *
   * // Add the first control point and draw a segment to it.
   * splineVertex(84, 91);
   * splineVertex(84, 91);
   *
   * // Add the anchor points to draw between.
   * splineVertex(68, 19);
   * splineVertex(21, 17);
   *
   * // Add the second control point.
   * splineVertex(32, 91);
   *
   * // Uncomment the next line to draw the segment to the second control point.
   * // splineVertex(32, 91);
   *
   * endShape();
   * ```
   *
   * The first two parameters, `x` and `y`, set the vertex’s location. For
   * example, calling `splineVertex(10, 10)` adds a point to the curve at
   * `(10, 10)`.
   *
   * Spline curves can also be drawn in 3D using WebGL mode. The 3D version of
   * `splineVertex()` has three arguments because each point has x-, y-, and
   * z-coordinates. By default, the vertex’s z-coordinate is set to 0.
   *
   * Note: `splineVertex()` won’t work when an argument is passed to
   * <a href="#/p5/beginShape">beginShape()</a>.
   *
   * @method splineVertex
   * @param {Number} x
   * @param {Number} y
   * @param {Number} [u=0]
   * @param {Number} [v=0]
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
   *   noFill();
   *   strokeWeight(1);
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Add the first control point.
   *   splineVertex(32, 91);
   *
   *   // Add the anchor points.
   *   splineVertex(21, 17);
   *   splineVertex(68, 19);
   *
   *   // Add the second control point.
   *   splineVertex(84, 91);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   // Style the anchor and control points.
   *   strokeWeight(5);
   *
   *   // Draw the anchor points in black.
   *   stroke(0);
   *   point(21, 17);
   *   point(68, 19);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(32, 91);
   *   point(84, 91);
   *
   *   describe(
   *     'A black curve drawn on a gray background. The curve has black dots at its ends. Two red dots appear near the bottom of the canvas.'
   *   );
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
   *   // Style the shape.
   *   noFill();
   *   strokeWeight(1);
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Add the first control point and draw a segment to it.
   *   splineVertex(32, 91);
   *   splineVertex(32, 91);
   *
   *   // Add the anchor points.
   *   splineVertex(21, 17);
   *   splineVertex(68, 19);
   *
   *   // Add the second control point.
   *   splineVertex(84, 91);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   // Style the anchor and control points.
   *   strokeWeight(5);
   *
   *   // Draw the anchor points in black.
   *   stroke(0);
   *   point(21, 17);
   *   point(68, 19);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(32, 91);
   *   point(84, 91);
   *
   *   describe(
   *     'A black curve drawn on a gray background. The curve passes through one red dot and two black dots. Another red dot appears near the bottom of the canvas.'
   *   );
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
   *   // Style the shape.
   *   noFill();
   *   strokeWeight(1);
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Add the first control point and draw a segment to it.
   *   splineVertex(32, 91);
   *   splineVertex(32, 91);
   *
   *   // Add the anchor points.
   *   splineVertex(21, 17);
   *   splineVertex(68, 19);
   *
   *   // Add the second control point and draw a segment to it.
   *   splineVertex(84, 91);
   *   splineVertex(84, 91);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   // Style the anchor and control points.
   *   strokeWeight(5);
   *
   *   // Draw the anchor points in black.
   *   stroke(0);
   *   point(21, 17);
   *   point(68, 19);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(32, 91);
   *   point(84, 91);
   *
   *   describe(
   *     'A black U curve drawn upside down on a gray background. The curve passes from one red dot through two black dots and ends at another red dot.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click the mouse near the red dot in the bottom-left corner
   * // and drag to change the curve's shape.
   *
   * let x1 = 32;
   * let y1 = 91;
   * let isChanging = false;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A black U curve drawn upside down on a gray background. The curve passes from one red dot through two black dots and ends at another red dot.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the shape.
   *   noFill();
   *   stroke(0);
   *   strokeWeight(1);
   *
   *   // Start drawing the shape.
   *   beginShape();
   *
   *   // Add the first control point and draw a segment to it.
   *   splineVertex(x1, y1);
   *   splineVertex(x1, y1);
   *
   *   // Add the anchor points.
   *   splineVertex(21, 17);
   *   splineVertex(68, 19);
   *
   *   // Add the second control point and draw a segment to it.
   *   splineVertex(84, 91);
   *   splineVertex(84, 91);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   // Style the anchor and control points.
   *   strokeWeight(5);
   *
   *   // Draw the anchor points in black.
   *   stroke(0);
   *   point(21, 17);
   *   point(68, 19);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(x1, y1);
   *   point(84, 91);
   * }
   *
   * // Start changing the first control point if the user clicks near it.
   * function mousePressed() {
   *   if (dist(mouseX, mouseY, x1, y1) < 20) {
   *     isChanging = true;
   *   }
   * }
   *
   * // Stop changing the first control point when the user releases the mouse.
   * function mouseReleased() {
   *   isChanging = false;
   * }
   *
   * // Update the first control point while the user drags the mouse.
   * function mouseDragged() {
   *   if (isChanging === true) {
   *     x1 = mouseX;
   *     y1 = mouseY;
   *   }
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
   *   // Add the first control point and draw a segment to it.
   *   splineVertex(32, 91);
   *   splineVertex(32, 91);
   *
   *   // Add the anchor points.
   *   splineVertex(21, 17);
   *   splineVertex(68, 19);
   *
   *   // Add the second control point.
   *   splineVertex(84, 91);
   *   splineVertex(84, 91);
   *
   *   // Stop drawing the shape.
   *   endShape();
   *
   *   describe('A ghost shape drawn in white on a gray background.');
   * }
   * </code>
   * </div>
   */

  /**
   * @method splineVertex
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @param {Number} [u=0]
   * @param {Number} [v=0]
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A ghost shape drawn in white on a blue background. When the user drags the mouse, the scene rotates to reveal the outline of a second ghost.');
   * }
   *
   * function draw() {
   *   background('midnightblue');
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the first ghost.
   *   noStroke();
   *   fill('ghostwhite');
   *
   *   beginShape();
   *   splineVertex(-28, 41, 0);
   *   splineVertex(-28, 41, 0);
   *   splineVertex(-29, -33, 0);
   *   splineVertex(18, -31, 0);
   *   splineVertex(34, 41, 0);
   *   splineVertex(34, 41, 0);
   *   endShape();
   *
   *   // Draw the second ghost.
   *   noFill();
   *   stroke('ghostwhite');
   *
   *   beginShape();
   *   splineVertex(-28, 41, -20);
   *   splineVertex(-28, 41, -20);
   *   splineVertex(-29, -33, -20);
   *   splineVertex(18, -31, -20);
   *   splineVertex(34, 41, -20);
   *   splineVertex(34, 41, -20);
   *   endShape();
   * }
   * </code>
   * </div>
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
   * async function setup() {
   *   // Load an image to apply as a texture.
   *   img = await loadImage('assets/laDefense.jpg');
   *
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
   * @param  {Number} [u=0]   u-coordinate of the vertex's texture.
   * @param  {Number} [v=0]   v-coordinate of the vertex's texture.
   */
  /**
   * @method vertex
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} z
   * @param  {Number} [u=0]   u-coordinate of the vertex's texture.
   * @param  {Number} [v=0]   v-coordinate of the vertex's texture.
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
  };

  /**
   * Sets the shader's vertex property or attribute variables.
   *
   * A vertex property, or vertex attribute, is a variable belonging to a vertex in a shader. p5.js provides some
   * default properties, such as `aPosition`, `aNormal`, `aVertexColor`, etc. These are
   * set using <a href="#/p5/vertex">vertex()</a>, <a href="#/p5/normal">normal()</a>
   * and <a href="#/p5/fill">fill()</a> respectively. Custom properties can also
   * be defined within <a href="#/p5/beginShape">beginShape()</a> and
   * <a href="#/p5/endShape">endShape()</a>.
   *
   * The first parameter, `propertyName`, is a string with the property's name.
   * This is the same variable name which should be declared in the shader, such as
   * `in vec3 aProperty`, similar to .`setUniform()`.
   *
   * The second parameter, `data`, is the value assigned to the shader variable. This
   * value will be applied to subsequent vertices created with
   * <a href="#/p5/vertex">vertex()</a>. It can be a Number or an array of numbers,
   * and in the shader program the type can be declared according to the WebGL
   * specification. Common types include `float`, `vec2`, `vec3`, `vec4` or matrices.
   *
   * See also the <a href="#/p5/vertexProperty">vertexProperty()</a> method on
   * <a href="#/p5/Geometry">Geometry</a> objects.
   *
   * @method vertexProperty
   * @for p5
   * @param {String} attributeName the name of the vertex attribute.
   * @param {Number|Number[]} data the data tied to the vertex attribute.
   *
   * @example
   * <div>
   * <code>
   * const vertSrc = `#version 300 es
   *  precision mediump float;
   *  uniform mat4 uModelViewMatrix;
   *  uniform mat4 uProjectionMatrix;
   *
   *  in vec3 aPosition;
   *  in vec2 aOffset;
   *
   *  void main(){
   *    vec4 positionVec4 = vec4(aPosition.xyz, 1.0);
   *    positionVec4.xy += aOffset;
   *    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
   *  }
   * `;
   *
   * const fragSrc = `#version 300 es
   *  precision mediump float;
   *  out vec4 outColor;
   *  void main(){
   *    outColor = vec4(0.0, 1.0, 1.0, 1.0);
   *  }
   * `;
   *
   * function setup(){
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create and use the custom shader.
   *   const myShader = createShader(vertSrc, fragSrc);
   *   shader(myShader);
   *
   *   describe('A wobbly, cyan circle on a gray background.');
   * }
   *
   * function draw(){
   *   // Set the styles
   *   background(125);
   *   noStroke();
   *
   *   // Draw the circle.
   *   beginShape();
   *   for (let i = 0; i < 30; i++){
   *     const x = 40 * cos(i/30 * TWO_PI);
   *     const y = 40 * sin(i/30 * TWO_PI);
   *
   *     // Apply some noise to the coordinates.
   *     const xOff = 10 * noise(x + millis()/1000) - 5;
   *     const yOff = 10 * noise(y + millis()/1000) - 5;
   *
   *     // Apply these noise values to the following vertex.
   *     vertexProperty('aOffset', [xOff, yOff]);
   *     vertex(x, y);
   *   }
   *   endShape(CLOSE);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let myShader;
   * const cols = 10;
   * const rows = 10;
   * const cellSize = 6;
   *
   * const vertSrc = `#version 300 es
   *   precision mediump float;
   *   uniform mat4 uProjectionMatrix;
   *   uniform mat4 uModelViewMatrix;
   *
   *   in vec3 aPosition;
   *   in vec3 aNormal;
   *   in vec3 aVertexColor;
   *   in float aDistance;
   *
   *   out vec3 vVertexColor;
   *
   *   void main(){
   *     vec4 positionVec4 = vec4(aPosition, 1.0);
   *     positionVec4.xyz += aDistance * aNormal * 2.0;;
   *     vVertexColor = aVertexColor;
   *     gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
   *   }
   * `;
   *
   * const fragSrc = `#version 300 es
   *   precision mediump float;
   *
   *   in vec3 vVertexColor;
   *   out vec4 outColor;
   *
   *   void main(){
   *     outColor = vec4(vVertexColor, 1.0);
   *   }
   * `;
   *
   * function setup(){
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create and apply the custom shader.
   *   myShader = createShader(vertSrc, fragSrc);
   *   shader(myShader);
   *   noStroke();
   *   describe('A blue grid, which moves away from the mouse position, on a gray background.');
   * }
   *
   * function draw(){
   *   background(200);
   *
   *   // Draw the grid in the middle of the screen.
   *   translate(-cols*cellSize/2, -rows*cellSize/2);
   *   beginShape(QUADS);
   *   for (let i = 0; i < cols; i++) {
   *     for (let j = 0; j < rows; j++) {
   *
   *       // Calculate the cell position.
   *       let x = i * cellSize;
   *       let y = j * cellSize;
   *
   *       fill(j/rows*255, j/cols*255, 255);
   *
   *       // Calculate the distance from the corner of each cell to the mouse.
   *       let distance = dist(x, y, mouseX, mouseY);
   *
   *       // Send the distance to the shader.
   *       vertexProperty('aDistance', min(distance, 100));
   *
   *       vertex(x, y);
   *       vertex(x + cellSize, y);
   *       vertex(x + cellSize, y + cellSize);
   *       vertex(x, y + cellSize);
   *     }
   *   }
   *   endShape();
   * }
   * </code>
   * </div>
   */
  fn.vertexProperty = function(attributeName, data){
    // this._assert3d('vertexProperty');
    // p5._validateParameters('vertexProperty', arguments);
    this._renderer.vertexProperty(attributeName, data);
  };
}

export default customShapes;
export {
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
