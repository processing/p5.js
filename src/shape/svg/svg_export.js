import {
  ShapeNode,
  BackgroundNode,
  ClearNode,
  ImageNode,
  ShapeRecorder
} from "./svg_recorder.js";

// SVGExportAddon registers vector shape recording, SVG XML generation, and file download utilities
// on p5.prototype. It hooks into predraw and postdraw lifecycles to automatically capture drawing commands
// when saveSVG() is called without explicit shape parameters.
export function SVGExportAddon(p5, fn, lifecycles) {
  let pendingExport = null;

  if (lifecycles) {
    // Hook predraw lifecycle to begin recording when an automatic export is requested via saveSVG()
    lifecycles.predraw = function () {
      if (!pendingExport || pendingExport.shape) {
        return;
      }

      pendingExport.shape = this.createShape();
      pendingExport.shape.begin({ draw: true });
    };

    // Hook postdraw lifecycle to finish recording and trigger SVG export/download at frame end
    lifecycles.postdraw = function () {
      if (!pendingExport || !pendingExport.shape) {
        return;
      }

      pendingExport.shape.end();

      exportRecordedShape(
        this,
        pendingExport.shape,
        pendingExport.filename
      );

      pendingExport = null;
    };
  }

  // Defines renderer interceptor adapters that capture high-level p5 drawing operations
  // (drawShape, background, clear, image) while a ShapeRecorder is active.
  fn._svgCaptureAdapters = function () {
    return {

      drawShape: {
        intercept(renderer, recorder) {
          const original = renderer.drawShape;
          if (!original) return null;

          renderer.drawShape = function (shape) {
            if (recorder.active) {
              recorder.addNode(
                new ShapeNode(shape, recorder.p5._svgCaptureState(recorder))
              );
              if (p5.Shape) {
                renderer._currentShape = new p5.Shape(renderer.getCommonVertexProperties());
              }
              if (!recorder.draw) {
                return;
              }
            }
            return original.call(renderer, shape);
          };

          // Return restore function
          return () => {
            renderer.drawShape = original;
          };
        }
      },

      background: {
        intercept(renderer, recorder) {
          const original = renderer.background;

          renderer.background = (...args) => {
            if (recorder.active) {
              const c = recorder.p5.color(...args);
              recorder.addNode(new BackgroundNode(c));
              if (!recorder.draw) {
                return;
              }
            }
            return original.apply(renderer, args);
          };

          return () => {
            renderer.background = original;
          };
        }
      },

      clear: {
        intercept(renderer, recorder) {
          const original = renderer.clear;
          if (!original) return null;

          renderer.clear = (...args) => {
            if (recorder.active) {
              recorder.addNode(new ClearNode());
              if (!recorder.draw) {
                return;
              }
            }
            return original.apply(renderer, args);
          };

          return () => {
            renderer.clear = original;
          };
        }
      },

      image: {
        intercept(renderer, recorder) {
          const original = renderer.image;
          if (!original) return null;

          renderer.image = function (img, sx, sy, sw, sh, dx, dy, dw, dh) {
            if (img) {
              if (img instanceof HTMLImageElement && !img.elt) {
                img.elt = img;
              }
              if (img instanceof HTMLCanvasElement && !img.canvas) {
                img.canvas = img;
              }
            }

            if (recorder.active) {
              recorder.addNode(
                new ImageNode(
                  img,
                  [sx, sy, sw, sh, dx, dy, dw, dh],
                  recorder.p5._svgCaptureState(recorder)
                )
              );
              if (!recorder.draw) {
                return;
              }
            }
            return original.call(renderer, img, sx, sy, sw, sh, dx, dy, dw, dh);
          };

          return () => {
            renderer.image = original;
          };
        }
      },
    }
  }

  // Captures the current active drawing state (fill color, stroke color, stroke weight, stroke cap,
  // and cumulative transformation matrix) at the exact moment a shape node is recorded.
  fn._svgCaptureState = function (recorder) {
    const states = this._renderer.states;
    return {
      transform: recorder ? new DOMMatrix(
        recorder.tStack.current
      ) : new DOMMatrix(),

      fill: states.fillColor,
      stroke: states.strokeColor,
      strokeWeight: this._renderer.states.strokeWeight,
      strokeCap: this._renderer.strokeCap()
    };
  };

  // RecordedShape manages the lifecycle of a recorded vector shape session.
  // Calling begin() starts ShapeRecorder capture, and end() finalizes the AST data graph.
  class RecordedShape {
    constructor(pInst) {
      this.p5 = pInst;
      this.recorder = undefined;
      this.data = null;
    }

    begin(options = {}) {
      this.recorder = new ShapeRecorder(this.p5, {
        draw: options ? (options.draw ?? false) : false
      });
      this.p5.push();
      this.recorder.start();
    }

    end() {
      if (!this.recorder) {
        console.warn('end() called without a matching begin().');
        return;
      }
      this.recorder.stop();
      this.data = this.recorder.getRecord();
      delete this.recorder;
      this.p5.pop();
    }

    toSVGElement(visitor) {
      if (this.data) {
        this.data.toSVGElement(visitor);
      }
    }
  }

  // SVGVisitor implements the Visitor pattern over p5 geometry primitives and ShapeRecorder AST nodes.
  // It traverses RecordedShape data graphs to construct valid SVG 2.0 XML DOM elements.
  class SVGVisitor extends p5.PrimitiveVisitor {

    constructor(pInst) {
      super();

      this.p5 = pInst;
      this.width = pInst.width;
      this.height = pInst.height;

      // Initialize root SVG DOM element with the standard namespace
      this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.svgElement.setAttribute('width', this.width);
      this.svgElement.setAttribute('height', this.height);
      this.svgElement.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
      this.svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

      // For path tracking
      this.currentPathElement = null;
    }

    _createElement(tagName, attrs = {}) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', tagName);
      for (const [key, val] of Object.entries(attrs)) {
        el.setAttribute(key, val);
      }
      return el;
    }

    _getDefs() {
      if (!this.defsElement) {
        this.defsElement = this._createElement('defs');
        this.svgElement.insertBefore(this.defsElement, this.svgElement.firstChild);
      }
      return this.defsElement;
    }

    colorToSVG(color) {
      if (!color) {
        this._currentOpacity = 1;
        return 'none';
      }
      const [, , , alpha] = color._getRGBA([255, 255, 255, 255]);

      this._currentOpacity = alpha / 255;

          return color.toString('#rrggbb');
      }

    _applyStyle(el) {
      const state = this.currentState;

      if (!state) {
        return;
      }

      this._currentOpacity = 1;
      const fill = this.colorToSVG(state.fill);
      const fillOpacity = this._currentOpacity;

      this._currentOpacity = 1;
      const stroke = this.colorToSVG(state.stroke);
      const strokeOpacity = this._currentOpacity;

      el.setAttribute('fill', fill);
      el.setAttribute('stroke', stroke);

      if (fillOpacity < 1 && fill !== 'none') {
        el.setAttribute('fill-opacity', fillOpacity.toFixed(4));
      }

      if (strokeOpacity < 1 && stroke !== 'none') {
        el.setAttribute('stroke-opacity', strokeOpacity.toFixed(4));
      }

      if (state.stroke && state.strokeWeight != null) {
        el.setAttribute('stroke-width', state.strokeWeight);
      }

      if (state.strokeCap) {
        el.setAttribute("stroke-linecap", state.strokeCap);
      }
    }

    _appendShapeElement(el) {
      const m = this.currentState?.transform;

      if (
        m &&
        !(m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1 && m.e === 0 && m.f === 0)
      ) {
        const g = this._createElement('g');
        g.setAttribute('transform', `matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`);
        g.appendChild(el);
        this.svgElement.appendChild(g);
        return;
      }

      this.svgElement.appendChild(el);
    }

    visitScope(scope) {
      for (const child of scope.children) {
        child.toSVGElement(this);
      }
    }

    addBackground(item) {
      this._currentOpacity = 1;
      const fillStr = this.colorToSVG(item.color);
      const opacity = this._currentOpacity;

      const rect = this._createElement('rect', {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        fill: fillStr
      });

      if (opacity < 1 && fillStr !== 'none') {
        rect.setAttribute('fill-opacity', opacity.toFixed(4));
      }

      this.svgElement.appendChild(rect);
    }

    clear() {
      while (this.svgElement.firstChild) {
        this.svgElement.removeChild(this.svgElement.firstChild);
      }
    }

    // Next is primitive visitor methods for geometry paths, curves, and 2D primitives.
    // These methods handle visitor callbacks from p5.PrimitiveVisitor when traversing
    // shape geometry graphs (anchors, line segments, bezier curves, splines, arcs, rects, etc.).

    // Path anchor primitive (moves to initial vertex coordinate)
    visitAnchor(anchor) {
      const vertex = anchor.getEndVertex();

      if (!this.currentPathElement) {
        const pathEl = this._createElement("path", {
            d: `M ${vertex.position.x} ${vertex.position.y}`
        });
        this._applyStyle(pathEl);
        this._appendShapeElement(pathEl);
        this.currentPathElement = pathEl;
      } else {
          const d = this.currentPathElement.getAttribute("d");
          this.currentPathElement.setAttribute(
              "d",
              `${d} M ${vertex.position.x} ${vertex.position.y}`
          );
      }
    }

    // Line segment primitive (appends straight line path or closes path segment)
    visitLineSegment(lineSegment) {
      if (!this.currentPathElement) return;
      let d = this.currentPathElement.getAttribute('d') || '';
      if (lineSegment.isClosing) {
        d += ' Z';
      } else {
        const vertices = lineSegment.vertices;
        if (vertices && vertices.length > 0) {
          const len = vertices.length;
          for (let i = 0; i < len; i++) {
            const v = vertices[i];
            const pos = v.position || v;
            d += ` L ${pos.x} ${pos.y}`;
          }
        } else if (typeof lineSegment.getEndVertex === 'function') {
          const vertex = lineSegment.getEndVertex();
          if (vertex) {
            const pos = vertex.position || vertex;
            d += ` L ${pos.x} ${pos.y}`;
          }
        }
      }
      this.currentPathElement.setAttribute('d', d);
    }

    // Quadratic and cubic Bezier curve primitives (appends Q / C path commands)
    visitBezierSegment(bezierSegment) {
      if (!this.currentPathElement) return;
      let d = this.currentPathElement.getAttribute('d') || '';
      const [v1, v2, v3] = bezierSegment.vertices;
      if (bezierSegment.order === 2) {
        const p1 = v1?.position || { x: 0, y: 0 };
        const p2 = v2?.position || p1;
        d += ` Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`;
      } else if (bezierSegment.order === 3) {
        const p1 = v1?.position || { x: 0, y: 0 };
        const p2 = v2?.position || p1;
        const p3 = v3?.position || p2;
        d += ` C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
      }
      this.currentPathElement.setAttribute('d', d);
    }

    // Catmull-Rom spline curve primitives (converts spline control points to cubic Bezier commands)
    visitSplineSegment(splineSegment) {
      if (!this.currentPathElement) return;
      const shape = splineSegment._shape;
      let d = this.currentPathElement.getAttribute('d') || '';

      if (
        splineSegment._splineProperties.ends === this.p5.EXCLUDE &&
        !splineSegment._comesAfterSegment
      ) {
        const startVertex = splineSegment._firstInterpolatedVertex;
        const startPos = startVertex?.position || { x: 0, y: 0 };
        const sx = startPos.x !== undefined ? startPos.x : (startPos[0] !== undefined ? startPos[0] : (startPos.values ? startPos.values[0] : 0));
        const sy = startPos.y !== undefined ? startPos.y : (startPos[1] !== undefined ? startPos[1] : (startPos.values ? startPos.values[1] : 0));
        d += ` M ${sx} ${sy}`;
      }

      const arrayVertices = splineSegment.getControlPoints().map(
        v => shape.vertexToArray(v)
      );
      const bezierArrays = shape.catmullRomToBezier(
        arrayVertices,
        splineSegment._splineProperties.tightness
      );

      for (const array of bezierArrays) {
        const points = array.flatMap(pt => [pt[0], pt[1]]);
        d += ` C ${points[0]} ${points[1]} ${points[2]} ${points[3]} ${points[4]} ${points[5]}`;
      }
      this.currentPathElement.setAttribute('d', d);
    }

    // Arc primitive (renders full circle/ellipse or arc path with pie/chord modes)
    visitArcPrimitive(arc) {
      const centerX = arc.x + arc.w / 2;
      const centerY = arc.y + arc.h / 2;
      const radiusX = arc.w / 2;
      const radiusY = arc.h / 2;

      const delta = arc.stop - arc.start;
      const isFullCircle = Math.abs(delta % (2 * Math.PI)) < 0.00001 &&
        Math.abs(delta) > 0.00001;

      if (isFullCircle) {
        if (radiusX === radiusY) {
          const circle = this._createElement('circle', {
            cx: centerX,
            cy: centerY,
            r: radiusX,
          });
          this._applyStyle(circle);
          this._appendShapeElement(circle);
        } else {
          const ellipseEl = this._createElement('ellipse', {
            cx: centerX,
            cy: centerY,
            rx: radiusX,
            ry: radiusY,
          });
          this._applyStyle(ellipseEl);
          this._appendShapeElement(ellipseEl);
        }
        return;
      }

      const startX = centerX + radiusX * Math.cos(arc.start);
      const startY = centerY + radiusY * Math.sin(arc.start);
      const endX = centerX + radiusX * Math.cos(arc.stop);
      const endY = centerY + radiusY * Math.sin(arc.stop);

      const largeArcFlag = Math.abs(delta) % (2 * Math.PI) > Math.PI ? 1 : 0;
      const sweepFlag = delta > 0 ? 1 : 0;

      const openPath = `M ${startX} ${startY} A ${radiusX} ${radiusY} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;

      let dFill = openPath;
      let dStroke = openPath;

      const mode = arc.mode ? arc.mode.toLowerCase() : undefined;
      if (mode === 'pie') {
        dFill = dStroke = `${openPath} L ${centerX} ${centerY} Z`;
      } else if (mode === 'chord') {
        dFill = dStroke = `${openPath} Z`;
      } else if (mode === 'open') {
        dFill = dStroke = openPath;
      } else {
        // default / undefined: fill is pie, stroke is open
        dFill = `${openPath} L ${centerX} ${centerY} Z`;
        dStroke = openPath;
      }

      if (dFill === dStroke) {
        const pathEl = this._createElement('path', { d: dFill });
        this._applyStyle(pathEl);
        this._appendShapeElement(pathEl);
      } else {
        const state = this.currentState;
        const fillStr = this.colorToSVG(state?.fill);
        const strokeStr = this.colorToSVG(state?.stroke);
        const hasFill = fillStr !== 'none';
        const hasStroke = strokeStr !== 'none' && state?.strokeWeight != null;

        if (hasFill) {
          const fillEl = this._createElement('path', { d: dFill });
          this._applyStyle(fillEl);
          fillEl.setAttribute('stroke', 'none');
          this._appendShapeElement(fillEl);
        }
        if (hasStroke) {
          const strokeEl = this._createElement('path', { d: dStroke });
          this._applyStyle(strokeEl);
          strokeEl.setAttribute('fill', 'none');
          this._appendShapeElement(strokeEl);
        }
      }
    }

    // Ellipse primitive (renders circle or ellipse vector element)
    visitEllipsePrimitive(ellipse) {
      const cx = ellipse.x + ellipse.w / 2;
      const cy = ellipse.y + ellipse.h / 2;
      const rx = ellipse.w / 2;
      const ry = ellipse.h / 2;

      if (ellipse.w === ellipse.h) {
        const circle = this._createElement('circle', {
          cx: cx,
          cy: cy,
          r: rx,
        });
        this._applyStyle(circle);
        this._appendShapeElement(circle);
      } else {
        const ellipseEl = this._createElement('ellipse', {
          cx: cx,
          cy: cy,
          rx: rx,
          ry: ry,
        });
        this._applyStyle(ellipseEl);
        this._appendShapeElement(ellipseEl);
      }
    }

    // Rectangle primitive (supports uniform and individual corner radii)
    visitRectPrimitive(rect) {
      const x = rect.x;
      const y = rect.y;
      const w = rect.w;
      const h = rect.h;
      let tl = rect.tl;
      let tr = rect.tr;
      let br = rect.br;
      let bl = rect.bl;

      const attrs = {
        x: x,
        y: y,
        width: w,
        height: h
      };

      if (typeof tl !== 'undefined') {
        if (typeof tr === 'undefined') tr = tl;
        if (typeof br === 'undefined') br = tr;
        if (typeof bl === 'undefined') bl = br;

        if (tl === tr && tl === br && tl === bl) {
          attrs.rx = tl;
          attrs.ry = tl;
          const rectEl = this._createElement('rect', attrs);
          this._applyStyle(rectEl);
          this._appendShapeElement(rectEl);
        } else {
          const r_tl = Math.max(0, tl);
          const r_tr = Math.max(0, tr);
          const r_br = Math.max(0, br);
          const r_bl = Math.max(0, bl);

          let d = `M ${x + r_tl} ${y} ` +
                  `L ${x + w - r_tr} ${y} ` +
                  `A ${r_tr} ${r_tr} 0 0 1 ${x + w} ${y + r_tr} ` +
                  `L ${x + w} ${y + h - r_br} ` +
                  `A ${r_br} ${r_br} 0 0 1 ${x + w - r_br} ${y + h} ` +
                  `L ${x + r_bl} ${y + h} ` +
                  `A ${r_bl} ${r_bl} 0 0 1 ${x} ${y + h - r_bl} ` +
                  `L ${x} ${y + r_tl} ` +
                  `A ${r_tl} ${r_tl} 0 0 1 ${x + r_tl} ${y} Z`;

          const pathEl = this._createElement('path', { d });
          this._applyStyle(pathEl);
          this._appendShapeElement(pathEl);
        }
      } else {
        const rectEl = this._createElement('rect', attrs);
        this._applyStyle(rectEl);
        this._appendShapeElement(rectEl);
      }
    }

    // Point primitive (renders micro-line segment with round stroke-linecap)
    visitPoint(point) {
      const { x, y } = point.vertices[0].position;
      const line = this._createElement('line', {
        x1: x,
        y1: y,
        x2: x + 0.0001,
        y2: y
      });
      this._applyStyle(line);
      line.setAttribute('stroke-linecap', 'round');
      this._appendShapeElement(line);
    }

    // Line primitive (renders straight line element)
    visitLine(line) {
      const { x: x0, y: y0 } = line.vertices[0].position;
      const { x: x1, y: y1 } = line.vertices[1].position;
      const lineEl = this._createElement('line', {
        x1: x0,
        y1: y0,
        x2: x1,
        y2: y1
      });
      this._applyStyle(lineEl);
      this._appendShapeElement(lineEl);
    }

    // Triangle primitive (renders 3-point polygon element)
    visitTriangle(triangle) {
      const [v0, v1, v2] = triangle.vertices;
      const points = `${v0.position.x},${v0.position.y} ${v1.position.x},${v1.position.y} ${v2.position.x},${v2.position.y}`;
      const triangleEl = this._createElement('polygon', { points });
      this._applyStyle(triangleEl);
      this._appendShapeElement(triangleEl);
    }

    // Quad primitive (renders 4-point polygon element)
    visitQuad(quad) {
      const [v0, v1, v2, v3] = quad.vertices;
      const points = `${v0.position.x},${v0.position.y} ${v1.position.x},${v1.position.y} ${v2.position.x},${v2.position.y} ${v3.position.x},${v3.position.y}`;
      const quadEl = this._createElement('polygon', { points });
      this._applyStyle(quadEl);
      this._appendShapeElement(quadEl);
    }

    // Tessellation primitives
    visitTriangleFan(triangleFan) {
      if (triangleFan.vertices.length < 3) return;
      const [v0, ...rest] = triangleFan.vertices;
      let d = '';
      for (let i = 0; i < rest.length - 1; i++) {
        const v1 = rest[i];
        const v2 = rest[i + 1];
        d += `M ${v0.position.x} ${v0.position.y} L ${v1.position.x} ${v1.position.y} L ${v2.position.x} ${v2.position.y} Z `;
      }
      const pathEl = this._createElement('path', { d: d.trim() });
      this._applyStyle(pathEl);
      this._appendShapeElement(pathEl);
    }

    visitTriangleStrip(triangleStrip) {
      if (triangleStrip.vertices.length < 3) return;
      let d = '';
      for (let i = 0; i < triangleStrip.vertices.length - 2; i++) {
        const v0 = triangleStrip.vertices[i];
        const v1 = triangleStrip.vertices[i + 1];
        const v2 = triangleStrip.vertices[i + 2];
        d += `M ${v0.position.x} ${v0.position.y} L ${v1.position.x} ${v1.position.y} L ${v2.position.x} ${v2.position.y} Z `;
      }
      const pathEl = this._createElement('path', { d: d.trim() });
      this._applyStyle(pathEl);
      this._appendShapeElement(pathEl);
    }

    visitQuadStrip(quadStrip) {
      if (quadStrip.vertices.length < 4) return;
      let d = '';
      for (let i = 0; i < quadStrip.vertices.length - 3; i += 2) {
        const v0 = quadStrip.vertices[i];
        const v1 = quadStrip.vertices[i + 1];
        const v2 = quadStrip.vertices[i + 2];
        const v3 = quadStrip.vertices[i + 3];
        d += `M ${v0.position.x} ${v0.position.y} L ${v1.position.x} ${v1.position.y} L ${v3.position.x} ${v3.position.y} L ${v2.position.x} ${v2.position.y} Z `;
      }
      const pathEl = this._createElement('path', { d: d.trim() });
      this._applyStyle(pathEl);
      this._appendShapeElement(pathEl);
    }

    visitImage(imageNode) {
      const img = imageNode.img;
      const [sx, sy, sw, sh, dx, dy, dw, dh] = imageNode.args;

      let dataURL = '';
      if (img) {
        if (img.canvas && typeof img.canvas.toDataURL === 'function') {
          try {
            dataURL = img.canvas.toDataURL();
          } catch (e) {}
        }
        if (!dataURL && img.elt) {
          if (img.elt instanceof HTMLCanvasElement) {
            try {
              dataURL = img.elt.toDataURL();
            } catch (e) {}
          } else if (img.elt instanceof HTMLImageElement) {
            if (img.elt.src && img.elt.src.startsWith('data:')) {
              dataURL = img.elt.src;
            } else {
              try {
                const canvas = document.createElement('canvas');
                canvas.width = img.elt.naturalWidth || img.width || img.elt.width;
                canvas.height = img.elt.naturalHeight || img.height || img.elt.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img.elt, 0, 0);
                dataURL = canvas.toDataURL();
              } catch (e) {
                dataURL = img.elt.src;
              }
            }
          }
        }
        if (!dataURL && img instanceof HTMLCanvasElement) {
          try {
            dataURL = img.toDataURL();
          } catch (e) {}
        }
        if (!dataURL && img instanceof HTMLImageElement) {
          if (img.src && img.src.startsWith('data:')) {
            dataURL = img.src;
          } else {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || img.width;
              canvas.height = img.naturalHeight || img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              dataURL = canvas.toDataURL();
            } catch (e) {
              dataURL = img.src;
            }
          }
        }
        if (!dataURL && typeof img === 'string') {
          dataURL = img;
        }
      }

      if (!dataURL) return;

      const imgW = img.width || (img.elt && (img.elt.naturalWidth || img.elt.width)) || 0;
      const imgH = img.height || (img.elt && (img.elt.naturalHeight || img.elt.height)) || 0;

      const isCropped = imgW > 0 && imgH > 0 && (sx !== 0 || sy !== 0 || Math.abs(sw - imgW) > 0.1 || Math.abs(sh - imgH) > 0.1);

      let imgEl;
      if (isCropped) {
        this.clipPathCounter = (this.clipPathCounter || 0) + 1;
        const clipId = `clip-p5svg-${this.clipPathCounter}`;
        const clipPath = this._createElement('clipPath', { id: clipId });
        const clipRect = this._createElement('rect', {
          x: dx,
          y: dy,
          width: dw,
          height: dh
        });
        clipPath.appendChild(clipRect);
        this._getDefs().appendChild(clipPath);

        const scaleX = dw / sw;
        const scaleY = dh / sh;
        const fullW = imgW * scaleX;
        const fullH = imgH * scaleY;
        const imgX = dx - sx * scaleX;
        const imgY = dy - sy * scaleY;

        imgEl = this._createElement('image', {
          x: imgX,
          y: imgY,
          width: fullW,
          height: fullH,
          'clip-path': `url(#${clipId})`,
          preserveAspectRatio: 'none'
        });
      } else {
        imgEl = this._createElement('image', {
          x: dx,
          y: dy,
          width: dw,
          height: dh,
          preserveAspectRatio: 'none'
        });
      }

      imgEl.setAttribute('href', dataURL);
      imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataURL);

      this._appendShapeElement(imgEl);
    }

    // ============ END ADDED PRIMITIVES ============

    buildSVG() {
      const serializer = new XMLSerializer();
      return serializer.serializeToString(this.svgElement);
    }
  }

  // ---------------------------------------------------
  // Canvas Replayer
  // ---------------------------------------------------

  class CanvasReplay {
    constructor(pInst) {
      this.p5 = pInst;
    }

    replay(record) {
      if (!record) return;
      if (record instanceof RecordedShape) {
        this.replayScope(record.data);
      } else {
        this.replayScope(record);
      }
    }

    replayScope(scope) {
      for (const child of scope.children) {
        switch(child.type) {
          case 'scope':
            this.replayScope(child);
            break;

          case 'shape':
            this.replayShape(child);
            break;

          case 'background':
            this.replayBackground(child);
            break;

          case 'clear':
            this.replayClear(child);
            break;

          case 'image':
            this.replayImage(child);
            break;
          }
        }
    }

    replayImage(node) {
      const p = this.p5;
      p.push();
      this.applyState(node.state);
      const [sx, sy, sw, sh, dx, dy, dw, dh] = node.args;
      p.image(node.img, dx, dy, dw, dh, sx, sy, sw, sh);
      p.pop();
    }

    replayShape(shapeNode) {
      const p = this.p5;
      p.push();
      this.applyState(shapeNode.state);
      p._renderer.drawShape(shapeNode.shape);
      p.pop();
    }

    replayClear() {
      this.p5.clear();
    }

    replayBackground(node) {
      const p = this.p5;

      if (!node.color) {
        p.clear();
        return;
      }

      const [r, g, b, a] = node.color._getRGBA([255, 255, 255, 255]);
      p.background(r, g, b, a);
    }

    applyState(state) {
      const p = this.p5;
      if (!state) return;

      if (state.transform) {
        const m = state.transform;
        p.applyMatrix(m.a, m.b, m.c, m.d, m.e, m.f);
      }

      if (state.fill) {
        const [r, g, b, a] = state.fill._getRGBA([255, 255, 255, 255]);
        p.fill(r, g, b, a);
      } else {
        p.noFill();
      }

      if (state.stroke) {
        const [r, g, b, a] = state.stroke._getRGBA([255, 255, 255, 255]);
        p.stroke(r, g, b, a);
      } else {
        p.noStroke();
      }

      if (state.strokeWeight != null) {
        p.strokeWeight(state.strokeWeight);
      }
      if (state.strokeCap != null) {
        p.strokeCap(state.strokeCap);
      }
    }
  }



  // ---------------------------------------------------
  // API
  // ---------------------------------------------------

  function exportRecordedShape(pInst, record, filename = 'drawing.svg') {
    const svg = pInst.getSVG(record);

    const blob = new Blob([svg], {
      type: 'image/svg+xml'
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    // Must append to DOM for browser programmatic download capability
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  // Instantiates a new RecordedShape vector container.
  fn.createShape = function () {
    return new RecordedShape(this);
  };

  // Helper function that records drawing commands executed inside the provided callback
  // into a RecordedShape instance, automatically calling begin() and end().
  fn.buildShape = function (callback, options = {}) {
    const shape = this.createShape();
    shape.begin(options);
    try {
      if (typeof callback === 'function') {
        callback();
      }
    } finally {
      shape.end();
    }
    return shape;
  };

  // Generates a valid SVG 2.0 XML string from a RecordedShape instance.
  fn.getSVG = function (record) {
    const visitor = new SVGVisitor(this);
    record.toSVGElement(visitor);
    return visitor.buildSVG();
  };

  const CORNER = 'corner';
  const CENTER = 'center';
  const VIEWBOX = 'viewbox';

  fn.CORNER = fn.CORNER || CORNER;
  fn.CENTER = fn.CENTER || CENTER;
  fn.VIEWBOX = fn.VIEWBOX || VIEWBOX;
  if (p5) {
    p5.CORNER = p5.CORNER || CORNER;
    p5.CENTER = p5.CENTER || CENTER;
    p5.VIEWBOX = p5.VIEWBOX || VIEWBOX;
  }

  function getShapeData(record) {
    if (!record) return null;
    if (typeof RecordedShape !== 'undefined' && record instanceof RecordedShape) {
      return record.data;
    }
    return record;
  }

  function getShapeCoordinateBounds(record) {
    const data = getShapeData(record);
    if (!data) return null;

    if (data.coordinateBounds) {
      return data.coordinateBounds;
    }

    const vb = data.viewBox || record?.viewBox;
    if (
      vb &&
      typeof vb.width === 'number' &&
      typeof vb.height === 'number' &&
      !isNaN(vb.width) &&
      !isNaN(vb.height) &&
      vb.width > 0 &&
      vb.height > 0
    ) {
      return {
        x: typeof vb.x === 'number' && !isNaN(vb.x) ? vb.x : 0,
        y: typeof vb.y === 'number' && !isNaN(vb.y) ? vb.y : 0,
        width: vb.width,
        height: vb.height
      };
    }

    const w = data.width ?? record?.width;
    const h = data.height ?? record?.height;
    if (w != null && h != null && !isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      return {
        x: 0,
        y: 0,
        width: w,
        height: h
      };
    }

    return null;
  }

  const ALIGNMENT_REGISTRY = {
    corner: (record) => {
      const bounds = getShapeCoordinateBounds(record);
      if (bounds && typeof bounds.x === 'number' && typeof bounds.y === 'number') {
        return {
          offsetX: -bounds.x,
          offsetY: -bounds.y
        };
      }
      return { offsetX: 0, offsetY: 0 };
    },

    center: (record) => {
      const bounds = getShapeCoordinateBounds(record);
      if (bounds && typeof bounds.width === 'number' && typeof bounds.height === 'number') {
        const minX = typeof bounds.x === 'number' ? bounds.x : 0;
        const minY = typeof bounds.y === 'number' ? bounds.y : 0;
        return {
          offsetX: -(minX + bounds.width / 2),
          offsetY: -(minY + bounds.height / 2)
        };
      }
      console.warn(
        'shape(): CENTER alignment requested, but shape record has no valid coordinate bounds metadata.'
      );
      return { offsetX: 0, offsetY: 0 };
    },

    viewbox: () => ({ offsetX: 0, offsetY: 0 })
  };

  const PLACEMENT_PIPELINE = [
    {
      key: 'anchor',
      resolve(record, options, x, y) {
        if (x === 0 && y === 0) {
          return null;
        }
        return { x, y };
      },
      apply(pInst, params) {
        if (typeof pInst.translate === 'function') {
          pInst.translate(params.x, params.y);
        } else if (typeof pInst.applyMatrix === 'function') {
          pInst.applyMatrix(1, 0, 0, 1, params.x, params.y);
        }
      }
    },
    {
      key: 'scale',
      resolve(record, options, x, y) {
        if (!options || options.scale === undefined || options.scale === null) {
          return null;
        }
        const s = options.scale;
        let scaleX = 1;
        let scaleY = 1;

        if (typeof s === 'number') {
          if (!Number.isFinite(s)) {
            console.warn('shape(): Invalid scale option. Ignoring.');
            return null;
          }
          scaleX = s;
          scaleY = s;
        } else if (typeof s === 'object' && s !== null && !Array.isArray(s)) {
          if (
            typeof s.x !== 'number' ||
            !Number.isFinite(s.x) ||
            typeof s.y !== 'number' ||
            !Number.isFinite(s.y)
          ) {
            console.warn('shape(): Invalid scale option. Ignoring.');
            return null;
          }
          scaleX = s.x;
          scaleY = s.y;
        } else {
          console.warn('shape(): Invalid scale option. Ignoring.');
          return null;
        }

        if (scaleX === 1 && scaleY === 1) {
          return null;
        }

        return { x: scaleX, y: scaleY };
      },
      apply(pInst, params) {
        if (typeof pInst.scale === 'function') {
          pInst.scale(params.x, params.y);
        } else if (typeof pInst.applyMatrix === 'function') {
          pInst.applyMatrix(params.x, 0, 0, params.y, 0, 0);
        }
      }
    },
    {
      key: 'align',
      resolve(record, options, x, y) {
        const alignOption = options && options.align !== undefined ? options.align : CORNER;
        const mode = String(alignOption).trim().toLowerCase();

        const handler = ALIGNMENT_REGISTRY[mode];
        let offsets;

        if (handler) {
          offsets = handler(record, options);
        } else {
          console.warn(`shape(): Unknown alignment mode "${options.align}". Defaulting to CORNER.`);
          offsets = ALIGNMENT_REGISTRY.corner(record, options);
        }

        const offsetX = offsets?.offsetX || 0;
        const offsetY = offsets?.offsetY || 0;

        if (offsetX === 0 && offsetY === 0) {
          return null;
        }

        return { x: offsetX, y: offsetY };
      },
      apply(pInst, params) {
        if (typeof pInst.translate === 'function') {
          pInst.translate(params.x, params.y);
        } else if (typeof pInst.applyMatrix === 'function') {
          pInst.applyMatrix(1, 0, 0, 1, params.x, params.y);
        }
      }
    }
  ];

  function resolveShapePlacement(record, x, y, options = {}) {
    const resolved = [];
    for (const stage of PLACEMENT_PIPELINE) {
      const params = stage.resolve(record, options, x, y);
      if (params !== null) {
        resolved.push({ stage, params });
      }
    }

    return {
      resolved,
      hasTransform: resolved.length > 0
    };
  }

  function applyShapePlacement(pInst, placement) {
    if (!pInst || !placement || !placement.resolved) return;
    for (const { stage, params } of placement.resolved) {
      stage.apply(pInst, params);
    }
  }

  fn.shape = function (record, x = 0, y = 0, options = {}) {
    const replay = new CanvasReplay(this);
    const placement = resolveShapePlacement(record, x, y, options);

    if (placement.hasTransform) {
      if (typeof this.push === 'function') this.push();
      applyShapePlacement(this, placement);
      replay.replay(record);
      if (typeof this.pop === 'function') this.pop();
    } else {
      replay.replay(record);
    }
  };

  fn.saveSVG = function (arg1, arg2 = 'drawing.svg') {
    // Existing API: saveSVG(recordedShape, filename)
    if (arg1 instanceof RecordedShape || (arg1 && typeof arg1.toSVGElement === 'function')) {
      exportRecordedShape(this, arg1, arg2);
      return;
    }

    // New API: saveSVG(filename) or saveSVG()
    if (typeof arg1 === 'string') {
      pendingExport = {
        filename: arg1,
        p5: this
      };
    } else if (typeof arg1 === 'undefined') {
      pendingExport = {
        filename: arg2,
        p5: this
      };
    }
  };

};

if (typeof p5 !== 'undefined') {
  p5.registerAddon(SVGExportAddon);
}
