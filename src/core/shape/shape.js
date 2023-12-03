export class Shape {
  constructor() {
    this.contours = [];
  }

  addContour(c) {
    this.contours.push(c);
  }

  get contourss() {
    return this.contours;
  }
}

export class Contour {
  constructor(firstVertex = null) {
    this.firstVertex = firstVertex;
    //contourVertices/Segments
    this.segments = [];
  }

  get segmentss() {
    return this.segments;
  }

  get firstSegment() {
    return this.segments[0];
  }

  addSegment(segment) {
    this.segments.push(segment);
  }
}

export class ContourSegment {
  constructor() {
    // this.index = index;
  }

  getStartVertex() {
    // logic to retrieve start vertex
  }

  getEndVertex() {
    // logic to retrieve end vertex
  }

  accept(visitor) {
    // logic to accept a visitor
  }
}

export class ContourSegment2D extends ContourSegment {
  constructor() {
    super();
    this.vertices = [];
  }
  addVertex(vertex) {
    this.vertices.push(vertex);
  }
  get verticess() {
    return this.vertices;
  }
}

export class Vertex {
  constructor(vert) {
    this.data = vert;
  }

  get coordinates() {
    return [this.data[0], this.data[1]];
  }

  addToCanvasPath(drawingContext) {
    drawingContext.lineTo(this.data[0], this.data[1]);
  }
}


export class BezierVertex {
  constructor(vert) {
    this.data = vert;
  }

  get coordinates() {
    return this.data.slice(-2);
  }

  addToCanvasPath(drawingContext) {
    drawingContext.bezierCurveTo(...this.data);
  }
}

export class QuadraticVertex {
  constructor(vert) {
    this.data = vert;
  }

  get coordinates() {
    return this.data.slice(-2);
  }

  addToCanvasPath(drawingContext) {
    drawingContext.quadraticCurveTo(...this.data);
  }
}


export class CurveVertex {
  constructor(x, y) {
    this.data = [x, y];
    this.type = 'curveVertex';
  }

  get coordinates() {
    let isComplete = this.data.length >= 8;
    let secondToLastPoint = this.data.slice(-4, -2);

    if(isComplete) {
      return secondToLastPoint;
    }
    else {
      return null;
    }
  }

  addToCanvasPath(drawingContext) {
    let bezierArrays = catmullRomToBezier(this.data, 0);
    for (const arr of bezierArrays) {
      drawingContext.bezierCurveTo(...arr);
    }
  }
}

function catmullRomToBezier(vertices, tightness) {
  let X0, Y0, X1, Y1, X2, Y2, X3, Y3;
  let s = 1 - tightness;
  let bezX1, bezY1, bezX2, bezY2, bezX3, bezY3;
  let bezArrays = [];

  for (let i = 2; i + 4 < vertices.length; i+= 2) {
    [X0, Y0, X1, Y1, X2, Y2, X3, Y3] = vertices.slice(i - 2, i + 6);

    bezX1 = X1 + (s * X2 - s * X0) / 6;
    bezY1 = Y1 + (s * Y2 - s * Y0) / 6;

    bezX2 = X2 + (s * X1 - s * X3) / 6;
    bezY2 = Y2 + (s * Y1 - s * Y3) / 6;

    bezX3 = X2;
    bezY3 = Y2;

    bezArrays.push([bezX1, bezY1, bezX2, bezY2, bezX3, bezY3]);
  }
  return bezArrays;
}

