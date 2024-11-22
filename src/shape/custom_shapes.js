/**
 * @module Shape
 * @submodule Custom Shapes
 * @for p5
 * @requires core
 * @requires constants
 */

// uncomment the following once you need it (otherwise VS Code complains):
// import * as constants from '../core/constants';

// ---- GENERAL CLASSES ----

class Shape {    
    constructor() {
        
    }
}

class Contour {
    constructor() {
    
    }
}

// abstract class
class ShapePrimitive {
    constructor() {
    
    }
}

class Vertex {
    constructor() {
    
    }

    // TODO: make sure name of array conversion method is
    // consistent with any modifications to the names of corresponding
    // properties of p5.Vector and p5.Color
}

// ---- PATH PRIMITIVES ----

class Anchor {
    constructor() {
    
    }
}

// abstract class
class Segment extends ShapePrimitive {
    constructor() {
    
    }
}

class LineSegment extends Segment {
    constructor() {
    
    }
}

class BezierSegment extends Segment {
    constructor() {
    
    }
}

// consider type and end modes -- see #6766)
// may want to use separate classes, but maybe not
class SplineSegment extends Segment {
    constructor() {
    
    }
}

// ---- ISOLATED PRIMITIVES ----

class Point extends ShapePrimitive {
    constructor() {
    
    }
}

class Line extends ShapePrimitive {
    constructor() {
    
    }
}

class Triangle extends ShapePrimitive {
    constructor() {
    
    }
}

class Quad extends ShapePrimitive {
    constructor() {
    
    }
}

// ---- TESSELLATION PRIMITIVES ----

class TriangleFan extends ShapePrimitive {
    constructor() {
    
    }
}

class TriangleStrip extends ShapePrimitive {
    constructor() {
    
    }
}

class QuadStrip extends ShapePrimitive {
    constructor() {
    
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
    
    }
}

class PrimitiveToVerticesConverter extends PrimitiveVisitor {
    constructor() {
    
    }
}

class PointAtLengthGetter extends PrimitiveVisitor {
    constructor() {
    
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
     * @param {...p5.Vertex} vertices the vertices to include in the primitive.
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
     * Any property names may be used. Property values may be any 
     * <a href="https://developer.mozilla.org/en-US/docs/Glossary/Primitive">JavaScript primitive</a>, any 
     * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer">object literal</a>, 
     * or any object with an `array` property. 
     * 
     * For example, if a position is stored as a `p5.Vector` object and a stroke is stored as a `p5.Color` object,
     * then the `array` properties of those objects will be used by the vertex's own `array` property, which provides
     * all the vertex data in a single array.
     * 
     * @class p5.Vertex
     * @param {Object} [properties] vertex properties.
     */

    p5.Vertex = Vertex;

    // ---- PATH PRIMITIVES ----

    /**
     * @private
     * A class responsible for... 
     */

    p5.Anchor = Anchor;

    /**
     * @private
     * A class responsible for...
     */

    p5.Segment = Segment;

    /**
     * @private
     * A class responsible for... 
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