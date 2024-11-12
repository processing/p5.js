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
     * A class to describe a custom shape made with 
     * <a href="#/p5/beginShape">beginShape()</a>/<a href="#/p5/endShape">endShape()</a>.
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
     * All `Shapes` consist of `contours`, which can be thought of as
     * subshapes (shapes inside another shape).
     * 
     * @class p5.Shape
     * @constructor
     * @param {Constant} [kind] either PATH, POINTS, LINES, TRIANGLES, QUADS, TRIANGLE_FAN, 
     * TRIANGLE_STRIP, or QUAD_STRIP.
     */

    p5.Shape = Shape;

    /**
     * @private
     * A class responsible for... 
     */

    p5.Contour = Contour;

    /**
     * @private
     * A class responsible for... 
     */

    p5.ShapePrimitive = ShapePrimitive;

    /**
     * @private
     * A class responsible for... 
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