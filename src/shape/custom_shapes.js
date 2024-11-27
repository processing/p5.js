/**
 * @module Shape
 * @submodule Custom Shapes
 * @for p5
 * @requires core
 * @requires constants
 */

// REMINDER: remove .js extension (currently using it to run file locally)
import * as constants from '../core/constants.js';

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
      return;
    }

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

  accept(visitor) {
    visitor.visitAnchor(this);
  }

  getEndVertex() {
    return this.vertices[0];
  }
}

// abstract class
class Segment extends ShapePrimitive {
  _primitivesIndex = null;
  _contoursIndex = null;
  _shape = null;

  constructor(...vertices) {
    super(...vertices);
    if (this.constructor === Segment) {
      throw new Error('Segment is an abstract class: it cannot be instantiated.');
    }
  }

  addToShape(shape) {
    super.addToShape(shape);

    // if primitive itself was added
    // (i.e. its individual vertices weren't all added to an existing primitive)
    // give it a reference to the shape and store its location within the shape
    if (this.vertices.length > 0) {
      let lastContour = shape.at(-1);
      this._primitivesIndex = lastContour.primitives.length - 1;
      this._contoursIndex = shape.contours.length - 1;
      this._shape = shape;
    }
  }

  getStartVertex() {
    let previousPrimitive = this._shape.at(
      this._contoursIndex,
      this._primitivesIndex - 1
    );
    return previousPrimitive.getEndVertex();
  }

  getEndVertex() {
    throw new Error('Method getEndVertex() must be implemented.');
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

  getEndVertex() {
    return this.vertices[0];
  }
}

// TOOO: Finish implementing remaining primitive classes

class BezierSegment extends Segment {
  constructor(...vertices) {
    super(...vertices);
  }
}

// consider type and end modes -- see #6766)
// may want to use separate classes, but maybe not
class SplineSegment extends Segment {
  constructor(...vertices) {
    super(...vertices);
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

    // bezierVertex
    creators.set(`bezierVertex-${constants.EMPTY_PATH}`, (...vertices) => new Anchor(...vertices));
    creators.set(`bezierVertex-${constants.PATH}`, (...vertices) => new BezierSegment(...vertices));

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
class Shape {
  #vertexProperties;
  #primitiveShapeCreators;
  kind = null;
  contours = [];

  constructor(
    vertexProperties,
    primitiveShapeCreators = new PrimitiveShapeCreators()
  ) {
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
  reset() {
    // TODO: remove existing vertices
  }

  vertex(position, textureCoordinates) {
    this.#vertexProperties.position = position;

    if (textureCoordinates !== undefined) {
      this.#vertexProperties.textureCoordinates = textureCoordinates;
    }

    let vertex = new Vertex(this.#vertexProperties);
    let lastContour = this.at(-1);
    let primitiveShapeCreator = this.#primitiveShapeCreators.get('vertex', lastContour.kind);
    let primitiveShape = primitiveShapeCreator(vertex);
    primitiveShape.addToShape(this);
  }

  beginShape(shapeKind = constants.PATH) {
    this.kind = shapeKind;
    this.contours.push(new Contour(shapeKind));
  }

  endShape(closeMode = constants.OPEN) {
    if (closeMode === constants.CLOSE) {
      // shape characteristics
      const shapeIsPath = this.kind === constants.PATH;
      const shapeHasOneContour = this.contours.length === 1;

      // anchor characteristics
      const anchorVertex = this.at(0, 0, 0);
      const anchorHasPosition = Object.hasOwn(anchorVertex, 'position');
      const anchorHasTextureCoordinates = Object.hasOwn(anchorVertex, 'textureCoordinates');

      // close path
      if (shapeIsPath && shapeHasOneContour && anchorHasPosition) {
        if (anchorHasTextureCoordinates) {
          this.vertex(anchorVertex.position, anchorVertex.textureCoordinates);
        }
        else {
          this.vertex(anchorVertex.position);
        }
      }
    }
  }
}

// ---- PRIMITIVE VISITORS ----

// abstract class
class PrimitiveVisitor {
  constructor() {

  }
}

// using this instead of PrimitiveToContext2DConverter for now
class PrimitiveToPath2DConverter extends PrimitiveVisitor {
  constructor() {
    super();
  }
}

class PrimitiveToVerticesConverter extends PrimitiveVisitor {
  constructor() {
    super();
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
