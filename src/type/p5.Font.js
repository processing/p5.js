/**
 * @module Typography
 */

import { textCoreConstants } from './textCore';
import * as constants from '../core/constants';

/*
  API:
     loadFont("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap")
     loadFont("@font-face { font-family: "Bricolage Grotesque", serif; font-optical-sizing: auto; font-weight: <weight> font-style: normal; font-variation-settings: "wdth" 100; });
     loadFont({
         fontFamily: '"Bricolage Grotesque", serif';
         fontOpticalSizing: 'auto';
         fontWeight: '<weight>';
         fontStyle: 'normal';
         fontVariationSettings: '"wdth" 100';
     });
     loadFont("https://fonts.gstatic.com/s/bricolagegrotesque/v1/pxiAZBhjZQIdd8jGnEotWQ.woff2");
     loadFont("./path/to/localFont.ttf");
     loadFont("system-font-name");


    NEXT:
      extract axes from font file

    TEST:
     const font = new FontFace("Inter", "url(./fonts/inter-latin-variable-full-font.woff2)", {
        style: "oblique 0deg 10deg",
        weight: "100 900",
        display: 'fallback'
      });
*/

/*
  This module defines the <a href="#/p5.Font">p5.Font</a> class and p5 methods for
  loading fonts from files and urls, and extracting points from their paths.
 */

import Typr from './lib/Typr.js';

import { createFromCommands } from '@davepagurek/bezier-path';

const pathArgCounts = { M: 2, L: 2, C: 6, Q: 4 };
const validFontTypes = ['ttf', 'otf', 'woff'];//, 'woff2'];
const validFontTypesRe = new RegExp(`\\.(${validFontTypes.join('|')})`, 'i');
const extractFontNameRe = new RegExp(`([^/]+)(\\.(?:${validFontTypes.join('|')}))`, 'i');
const invalidFontError = 'Sorry, only TTF, OTF and WOFF files are supported.'; // and WOFF2
const fontFaceVariations = ['weight', 'stretch', 'style'];



class Font {
  constructor(p, fontFace, name, path, data) {
    if (!(fontFace instanceof FontFace)) {
      throw Error('FontFace is required');
    }
    this._pInst = p;
    this.name = name;
    this.path = path;
    this.data = data;
    this.face = fontFace;
  }

  /**
   * Checks whether a font has glyph point data and
   * can thus be used for textToPoints(), WEBGL mode, etc.
   */
  static hasGlyphData(textFont) {
    let { font } = textFont;
    return typeof font === 'object' && typeof font.data !== 'undefined';
  }

  fontBounds(str, x, y, width, height, options) {
    ({ width, height, options } = this._parseArgs(width, height, options));
    let renderer = options?.graphics?._renderer || this._pInst._renderer;
    if (!renderer) throw Error('p5 or graphics required for fontBounds()');
    return renderer.fontBounds(str, x, y, width, height);
  }

  textBounds(str, x, y, width, height, options) {
    ({ width, height, options } = this._parseArgs(width, height, options));
    let renderer = options?.graphics?._renderer || this._pInst._renderer;
    if (!renderer) throw Error('p5 or graphics required for fontBounds()');
    return renderer.textBounds(str, x, y, width, height);
  }

  textToPaths(str, x, y, width, height, options) {

    ({ width, height, options } = this._parseArgs(width, height, options));

    if (!this.data) {
      throw Error('No font data available for "' + this.name
        + '"\nTry downloading a local copy of the font file');
    }

    // lineate and get glyphs/paths for each line
    let lines = this._lineateAndPathify(str, x, y, width, height, options);

    // flatten into a single array containing all the glyphs
    let glyphs = lines.map(o => o.glyphs).flat();

    // flatten into a single array with all the path commands
    return glyphs.map(g => g.path.commands).flat();
  }

  textToPoints(str, x, y, width, height, options) {
    // By segmenting per contour, pointAtLength becomes much faster
    const contourPoints = this.textToContours(str, x, y, width, height, options);
    return contourPoints.reduce((acc, next) => {
      acc.push(...next);
      return acc;
    }, []);
  }

  textToContours(str, x = 0, y = 0, width, height, options) {
    ({ width, height, options } = this._parseArgs(width, height, options));

    const cmds = this.textToPaths(str, x, y, width, height, options);
    const cmdContours = [];
    for (const cmd of cmds) {
      if (cmd[0] === 'M') {
        cmdContours.push([]);
      }
      cmdContours[cmdContours.length - 1].push(cmd);
    }

    return cmdContours.map((commands) => pathToPoints(commands, options, this));
  }

  /**
      * 
      * Converts text into a 3D model that can be rendered in WebGL mode.
      * 
      * This method transforms flat text into extruded 3D geometry, allowing 
      * for dynamic effects like depth, warping, and custom shading.
      * 
      * It works by taking the outlines (contours) of each character in the 
      * provided text string and constructing a 3D shape from them.
      * 
      *
      * @method textToModel
      * @param {String} str The text string to convert into a 3D model.
      * @param {Number} x The x-coordinate for the starting position of the text.
      * @param {Number} y The y-coordinate for the starting position of the text.
      * @param {Number} width Maximum width of the text block (wraps text if exceeded).
      * @param {Number} height Maximum height of the text block.
      * @param {Object} [options] Configuration options for the 3D text:
      * @param {Number} [options.extrude=0] The depth to extrude the text. A value of 0 produces 
      * flat text; higher values create thicker, 3D models.
      * @param {Number} [options.sampleFactor=1] A factor controlling the level of detail for the text contours.
      *  Higher values result in smoother curves.
      * @return {p5.Geometry} A geometry object representing the 3D model of the text.
      *
      * @example
      * <div modernizr='webgl'>
      * <code>
      * let font;
      * let geom;
      *
      * async function setup() {
      * createCanvas(200, 200, WEBGL);
      * fonts = {
      *   Anton: await loadFont('https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0K08i4gS7lu.ttf')
      *  }
      * geom = fonts['Anton'].textToModel("Hello World!", 50, 0, { sampleFactor: 2 });
      * geom.clearColors();
      * geom.normalize();
      * }
      *
      * function draw() {
      * background(255);
      * fill("red");
      * strokeWeight(4);
      * scale(min(width, height) / 300);
      * model(geom);
      * }
      * </code>
      * </div>
      * 
      * Once your 3D text is ready, you can rotate it in 3D space using orbitControl() 
      * — just click and drag with your mouse to see it from all angles!
      * 
      * Use the extrude slider to give your letters depth: slide it up, and your 
      * flat text turns into a solid, multi-dimensional object.
      * 
      * You can also choose from various fonts such as "Anton", "Montserrat", or "Source Serif", 
      * much like selecting fancy fonts in a word processor,
      * 
      * @example
      * <div modernizr='webgl'>
      * <code>
      * let font;
      * let geom;
      *
      * async function setup() {
      * createCanvas(200, 200, WEBGL);
      * fonts = {
      *   Anton: await loadFont('https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0K08i4gS7lu.ttf'),
      *   Montserrat: await loadFont('https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf'),
      *   'Source Serif': await loadFont('https://fonts.gstatic.com/s/sourceserif4/v8/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjihdqrhxXD-wGvjU.ttf'),
      *  }
      * geom = fonts['Anton'].textToModel("Hello World!", 50, 0, { sampleFactor: 2, extrude: 5 });
      * geom.clearColors();
      * geom.normalize();
      * }
      *
      * function draw() {
      * background(255);
      * orbitControl();
      * fill("red");
      * strokeWeight(4);
      * scale(min(width, height) / 300);
      * model(geom);
      * }
      * </code>
      * </div>
      * 
      * The generated model (a Geometry object) can be manipulated further—rotated, scaled, 
      * or styled with shaders—to create engaging, interactive visual art.
      * 
      * @example
      * <div modernizr='webgl'>
      * <code>
      * let geom;
      * let fonts;
      * let artShader;
      * let lineShader;
      *
      * // Define parameters as simple variables
      * let words = 'Word Art!';
      * let font = 'Anton';
      * let warp = 1;
      * let extrude = 5;
      * let palette = ["#ffe03d", "#fe4830", "#d33033", "#6d358a", "#1c509e", "#00953c"];
      *
      * async function setup() {
      * createCanvas(windowWidth, windowHeight, WEBGL);
      * fonts = {
      * Anton: await loadFont('https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0K08i4gS7lu.ttf'),
      * Montserrat: await loadFont('https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf'),
      * 'Source Serif': await loadFont('https://fonts.gstatic.com/s/sourceserif4/v8/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjihdqrhxXD-wGvjU.ttf'),
      * };
      *
      * artShader = baseMaterialShader().modify({
      * uniforms: {
      * 'float time': () => millis(),
      * 'float warp': () => warp,
      * 'float numColors': () => palette.length,
      * 'vec3[6] colors': () => palette.flatMap((c) => [red(c)/255, green(c)/255, blue(c)/255]),
      * },
      * vertexDeclarations: 'out vec3 vPos;',
      * fragmentDeclarations: 'in vec3 vPos;',
      * 'Vertex getObjectInputs': `(Vertex inputs) {
      * vPos = inputs.position;
      * inputs.position.x += 5. * warp * sin(inputs.position.y * 0.1 + time * 0.001) / (1. + warp);
      * inputs.position.y += 5. * warp * sin(inputs.position.x * 0.1 + time * 0.0009) / (1. + warp);
      * return inputs;
      * }`,
      * 'vec4 getFinalColor': `(vec4 _c) {
      * float x = vPos.x * 0.005;
      * float a = floor(fract(x) * numColors);
      * float b = a == numColors - 1. ? 0. : a + 1.;
      * float t = fract(x * numColors);
      * vec3 c = mix(colors[int(a)], colors[int(b)], t);
      * return vec4(c, 1.);
      * }`
      * });
      *
      * lineShader = baseStrokeShader().modify({
      * uniforms: {
      * 'float time': () => millis(),
      * 'float warp': () => warp,
      * },
      * 'StrokeVertex getObjectInputs': `(StrokeVertex inputs) {
      * inputs.position.x += 5. * warp * sin(inputs.position.y * 0.1 + time * 0.001) / (1. + warp);
      * inputs.position.y += 5. * warp * sin(inputs.position.x * 0.1 + time * 0.0009) / (1. + warp);
      * return inputs;
      * }`,
      * });
      * }
      *
      * let prevWords = '';
      * let prevFont = '';
      * let prevExtrude = -1;
      *
      * function draw() {
      * if (words !== prevWords || prevFont !== font || prevExtrude !== extrude) {
      * if (geom) freeGeometry(geom);
      *
      * geom = fonts[font].textToModel(words, 0, 50, { sampleFactor: 2, extrude });
      * geom.clearColors();
      * geom.normalize();
      *
      * prevWords = words;
      * prevFont = font;
      * prevExtrude = extrude;
      * }
      *
      * background(255);
      * orbitControl();
      * shader(artShader);
      * strokeShader(lineShader);
      * strokeWeight(4);
      * scale(min(width, height) / 300);
      * model(geom);
      * }
      * </code>
      * </div>
      */
  textToModel(str, x, y, width, height, options) {
    ({ width, height, options } = this._parseArgs(width, height, options));
    const extrude = options?.extrude || 0;
    const contours = this.textToContours(str, x, y, width, height, options);
    const geom = this._pInst.buildGeometry(() => {
      if (extrude === 0) {
        this._pInst.beginShape();
        this._pInst.normal(0, 0, 1);
        for (const contour of contours) {
          this._pInst.beginContour();
          for (const { x, y } of contour) {
            this._pInst.vertex(x, y);
          }
          this._pInst.endContour(this._pInst.CLOSE);
        }
        this._pInst.endShape();
      } else {
        // Draw front faces
        for (const side of [1, -1]) {
          this._pInst.beginShape();
          for (const contour of contours) {
            this._pInst.beginContour();
            for (const { x, y } of contour) {
              this._pInst.vertex(x, y, side * extrude * 0.5);
            }
            this._pInst.endContour(this._pInst.CLOSE);
          }
          this._pInst.endShape();
          this._pInst.beginShape();
        }
        // Draw sides
        for (const contour of contours) {
          this._pInst.beginShape(this._pInst.QUAD_STRIP);
          for (const v of contour) {
            for (const side of [-1, 1]) {
              this._pInst.vertex(v.x, v.y, side * extrude * 0.5);
            }
          }
          this._pInst.endShape();
        }
      }
    });
    if (extrude !== 0) {
      geom.computeNormals();
      for (const face of geom.faces) {
        if (face.every((idx) => geom.vertices[idx].z <= -extrude * 0.5 + 0.1)) {
          for (const idx of face) geom.vertexNormals[idx].set(0, 0, -1);
          face.reverse();
        }
      }
    }
    return geom;
  }

  variations() {
    let vars = {};
    if (this.data) {
      let axes = this.face?.axes;
      if (axes) {
        axes.forEach(ax => {
          vars[ax.tag] = ax.value;
        });
      }
    }
    fontFaceVariations.forEach(v => {
      let val = this.face[v];
      if (val !== 'normal') {
        vars[v] = vars[v] || val;
      }
    });
    return vars;
  }

  metadata() {
    let meta = this.data?.name || {};
    for (let p in this.face) {
      if (!/^load/.test(p)) {
        meta[p] = meta[p] || this.face[p];
      }
    }
    return meta;
  }

  static async list(log = false) { // tmp
    if (log) {
      console.log('There are', document.fonts.size, 'font-faces\n');
      let loaded = 0;
      for (let fontFace of document.fonts.values()) {
        console.log('FontFace: {');
        for (let property in fontFace) {
          console.log('  ' + property + ': ' + fontFace[property]);
        }
        console.log('}\n');
        if (fontFace.status === 'loaded') {
          loaded++;
        }
      }
      console.log(loaded + ' loaded');
    }
    return await Array.from(document.fonts);
  }

  /////////////////////////////// HELPERS ////////////////////////////////

  _verticalAlign(size) {
    const { sCapHeight } = this.data?.['OS/2'] || {};
    const { unitsPerEm = 1000 } = this.data?.head || {};
    const { ascender = 0, descender = 0 } = this.data?.hhea || {};
    const current = ascender / 2;
    const target = (sCapHeight || (ascender + descender)) / 2;
    const offset = target - current;
    return offset * size / unitsPerEm;
  }

  /*
    Returns an array of line objects, each containing { text, x, y, glyphs: [ {g, path} ] }
  */
  _lineateAndPathify(str, x, y, width, height, options = {}) {

    let renderer = options?.graphics?._renderer || this._pInst._renderer;

    // save the baseline
    let setBaseline = renderer.drawingContext.textBaseline;

    // lineate and compute bounds for the text
    let { lines, bounds } = renderer._computeBounds
      (textCoreConstants._FONT_BOUNDS, str, x, y, width, height,
        { ignoreRectMode: true, ...options });

    // compute positions for each of the lines
    lines = this._position(renderer, lines, bounds, width, height);

    // convert lines to paths
    let uPE = this.data?.head?.unitsPerEm || 1000;
    let scale = renderer.states.textSize / uPE;
    let pathsForLine = lines.map(l => this._lineToGlyphs(l, scale));

    // restore the baseline
    renderer.drawingContext.textBaseline = setBaseline;

    return pathsForLine;
  }

  _textToPathPoints(str, x, y, width, height, options) {

    ({ width, height, options } = this._parseArgs(width, height, options));

    // lineate and get the points for each line
    let cmds = this.textToPaths(str, x, y, width, height, options);

    // divide line-segments with intermediate points
    const subdivide = (pts, pt1, pt2, md) => {
      if (fn.dist(pt1.x, pt1.y, pt2.x, pt2.y) > md) {
        let middle = { x: (pt1.x + pt2.x) / 2, y: (pt1.y + pt2.y) / 2 };
        pts.push(middle);
        subdivide(pts, pt1, middle, md);
        subdivide(pts, middle, pt2, md);
      }
    }

    // a point for each path-command plus line subdivisions
    let pts = [];
    let { textSize } = this._pInst._renderer.states;
    let maxDist = (textSize / this.data.head.unitsPerEm) * 500;

    for (let i = 0; i < cmds.length; i++) {
      let { type, data: d } = cmds[i];
      if (type !== 'Z') {
        let pt = { x: d[d.length - 2], y: d[d.length - 1] }
        if (type === 'L' && pts.length && !options?.nodivide > 0) {
          subdivide(pts, pts[pts.length - 1], pt, maxDist);
        }
        pts.push(pt);
      }
    }

    return pts;
  }

  _parseArgs(width, height, options = {}) {

    if (typeof width === 'object') {
      options = width;
      width = height = undefined;
    }
    else if (typeof height === 'object') {
      options = height;
      height = undefined;
    }
    return { width, height, options };
  }

  _position(renderer, lines, bounds, width, height) {

    let { textAlign, textLeading } = renderer.states;
    let metrics = this._measureTextDefault(renderer, 'X');
    let ascent = metrics.fontBoundingBoxAscent;

    let coordify = (text, i) => {
      let x = bounds.x;
      let y = bounds.y + (i * textLeading) + ascent;
      let lineWidth = renderer._fontWidthSingle(text);
      if (textAlign === constants.CENTER) {
        x += (bounds.w - lineWidth) / 2;
      }
      else if (textAlign === constants.RIGHT) {
        x += (bounds.w - lineWidth);
      }
      if (typeof width !== 'undefined') {
        switch (renderer.states.rectMode) {
          case constants.CENTER:
            x -= width / 2;
            y -= height / 2;
            break;
          case constants.RADIUS:
            x -= width;
            y -= height;
            break;
        }
      }
      return { text, x, y };
    }

    return lines.map(coordify);
  }

  _lineToGlyphs(line, scale = 1) {

    if (!this.data) {
      throw Error('No font data available for "' + this.name
        + '"\nTry downloading a local copy of the font file');
    }
    let glyphShapes = Typr.U.shape(this.data, line.text);
    line.glyphShapes = glyphShapes;
    line.glyphs = this._shapeToPaths(glyphShapes, line, scale);

    return line;
  }

  _positionGlyphs(text) {
    const glyphShapes = Typr.U.shape(this.data, text);
    const positionedGlyphs = [];
    let x = 0;
    for (const glyph of glyphShapes) {
      positionedGlyphs.push({ x, index: glyph.g, shape: glyph });
      x += glyph.ax;
    }
    return positionedGlyphs;
  }

  _singleShapeToPath(shape, { scale = 1, x = 0, y = 0, lineX = 0, lineY = 0 } = {}) {
    let font = this.data;
    let crdIdx = 0;
    let { g, ax, ay, dx, dy } = shape;
    let { crds, cmds } = Typr.U.glyphToPath(font, g);

    // can get simple points for each glyph here, but we don't need them ?
    let glyph = { /*g: line.text[i], points: [],*/ path: { commands: [] } };

    for (let j = 0; j < cmds.length; j++) {
      let type = cmds[j], command = [type];
      if (type in pathArgCounts) {
        let argCount = pathArgCounts[type];
        for (let k = 0; k < argCount; k += 2) {
          let gx = crds[k + crdIdx] + x + dx;
          let gy = crds[k + crdIdx + 1] + y + dy;
          let fx = lineX + gx * scale;
          let fy = lineY + gy * -scale;
          command.push(fx);
          command.push(fy);
          /*if (k === argCount - 2) {
            glyph.points.push({ x: fx, y: fy });
          }*/
        }
        crdIdx += argCount;
      }
      glyph.path.commands.push(command);
    }

    return { glyph, ax, ay };
  }

  _shapeToPaths(glyphs, line, scale = 1) {
    let x = 0, y = 0, paths = [];

    if (glyphs.length !== line.text.length) {
      throw Error('Invalid shape data');
    }

    // iterate over the glyphs, converting each to a glyph object
    // with a path property containing an array of commands
    for (let i = 0; i < glyphs.length; i++) {
      const { glyph, ax, ay } = this._singleShapeToPath(glyphs[i], {
        scale,
        x,
        y,
        lineX: line.x,
        lineY: line.y,
      });

      paths.push(glyph);
      x += ax; y += ay;
    }

    return paths;
  }

  _measureTextDefault(renderer, str) {
    let { textAlign, textBaseline } = renderer.states;
    let ctx = renderer.textDrawingContext();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    let metrics = ctx.measureText(str);
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    return metrics;
  }

  drawPaths(ctx, commands, opts) { // for debugging
    ctx.strokeStyle = opts?.stroke || ctx.strokeStyle;
    ctx.fillStyle = opts?.fill || ctx.fillStyle;
    ctx.beginPath();
    commands.forEach(([type, ...data]) => {
      if (type === 'M') {
        ctx.moveTo(...data);
      } else if (type === 'L') {
        ctx.lineTo(...data);
      } else if (type === 'C') {
        ctx.bezierCurveTo(...data);
      } else if (type === 'Q') {
        ctx.quadraticCurveTo(...data);
      } else if (type === 'Z') {
        ctx.closePath();
      }
    });
    if (opts?.fill) ctx.fill();
    if (opts?.stroke) ctx.stroke();
  }

  _pathsToCommands(paths, scale) {
    let commands = [];
    for (let i = 0; i < paths.length; i++) {
      let pathData = paths[i];
      let { x, y, path } = pathData;
      let { crds, cmds } = path;

      // iterate over the path, storing each non-control point
      for (let c = 0, j = 0; j < cmds.length; j++) {
        let cmd = cmds[j], obj = { type: cmd, data: [] };
        if (cmd == "M" || cmd == "L") {
          obj.data.push(x + crds[c] * scale, y + crds[c + 1] * -scale);
          c += 2;
        }
        else if (cmd == "C") {
          for (let i = 0; i < 6; i += 2) {
            obj.data.push(x + crds[c + i] * scale, y + crds[c + i + 1] * -scale);
          }
          c += 6;
        }
        else if (cmd == "Q") {
          for (let i = 0; i < 4; i += 2) {
            obj.data.push(x + crds[c + i] * scale, y + crds[c + i + 1] * -scale);
          }
          c += 4;
        }
        commands.push(obj);
      }
    }

    return commands;
  }
}

async function create(pInst, name, path, descriptors, rawFont) {

  let face = createFontFace(name, path, descriptors, rawFont);

  // load if we need to
  if (face.status !== 'loaded') await face.load();

  // add it to the document
  document.fonts.add(face);

  // return a new p5.Font
  return new Font(pInst, face, name, path, rawFont);
}

function createFontFace(name, path, descriptors, rawFont) {

  if (name.includes(' ')) name = "'" + name + "'"; // NOTE: must be single-quotes

  let fontArg = rawFont?._data;
  if (!fontArg) {
    if (!validFontTypesRe.test(path)) {
      throw Error(invalidFontError);
    }
    if (!path.startsWith('url(')) {
      path = 'url(' + path + ')';
    }
    fontArg = path;
  }

  // create/return the FontFace object
  let face = new FontFace(name, fontArg, descriptors);
  if (face.status === 'error') {
    throw Error('Failed to create FontFace for "' + name + '"');
  }
  return face;
}

function extractFontName(font, path) {
  let result, meta = font?.name;

  // use the metadata if we have it
  if (meta) {
    if (meta.fullName) {
      return meta.fullName;
    }
    if (meta.familyName) {
      result = meta.familyName;
    }
  }

  if (!result) {

    // if not, try to extract the name from the path
    let matches = extractFontNameRe.exec(path);
    if (matches && matches.length >= 3) {
      result = matches[1];
    }
    else {
      // give up and return the full path
      result = path;
    }
  }

  // replace spaces with underscores
  if (result.includes(' ')) {
    result = result.replace(/ /g, '_');
  }

  return result;
};

function pathToPoints(cmds, options, font) {

  const parseOpts = (options, defaults) => {
    if (typeof options !== 'object') {
      options = defaults;
    } else {
      for (const key in defaults) {
        if (typeof options[key] === 'undefined') {
          options[key] = defaults[key];
        }
      }
    }
    return options;
  }

  const at = (v, i) => {
    const s = v.length;
    return v[i < 0 ? i % s + s : i % s];
  }

  const simplify = (pts, angle) => {
    angle = angle || 0;
    let num = 0;
    for (let i = pts.length - 1; pts.length > 3 && i >= 0; --i) {
      if (collinear(at(pts, i - 1), at(pts, i), at(pts, i + 1), angle)) {
        pts.splice(i % pts.length, 1); // Remove middle point
        num++;
      }
    }
    return num;
  }

  const path = createFromCommands(arrayCommandsToObjects(cmds));
  let opts = parseOpts(options, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });

  const totalPoints = Math.ceil(path.getTotalLength() * opts.sampleFactor);
  let points = [];

  const mode = font._pInst.angleMode();
  const DEGREES = font._pInst.DEGREES;
  for (let i = 0; i < totalPoints; i++) {
    const length = path.getTotalLength() * (i / (totalPoints - 1));
    points.push({
      ...path.getPointAtLength(length),
      get angle() {
        const angle = path.getAngleAtLength(length);
        if (mode === DEGREES) {
          return angle * 180 / Math.PI;
        } else {
          return angle;
        }
      },
      // For backwards compatibility
      get alpha() {
        return this.angle;
      }
    });
  }

  if (opts.simplifyThreshold) {
    simplify(points, opts.simplifyThreshold);
  }

  return points;
}

function unquote(name) {
  // Unquote name from CSS
  if ((name.startsWith('"') || name.startsWith("'")) && name.at(0) === name.at(-1)) {
    return name.slice(1, -1).replace(/\/(['"])/g, '$1');
  }
  return name;
}

function parseCreateArgs(...args/*path, name, onSuccess, onError*/) {

  // parse the path
  let path = args.shift();
  if (typeof path !== 'string' || path.length === 0) {
    p5._friendlyError(invalidFontError, 'p5.loadFont'); // ?
  }

  // parse the name
  let name;
  if (typeof args[0] === 'string') {
    name = args.shift();
  }

  // get the callbacks/descriptors if any
  let success, error, descriptors;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === 'function') {
      if (!success) {
        success = arg;
      } else {
        error = arg;
      }
    }
    else if (typeof arg === 'object') {
      descriptors = arg;
    }
  }

  return { path, name, success, error, descriptors };
}

function font(p5, fn) {

  /**
   * TODO
   *
   * @class p5.Font
   */
  p5.Font = Font;

  /**
   * Load a font and returns a p5.Font instance. The font can be specified by its path or a url.
   * Optional arguments include the font name, descriptors for the FontFace object,
   * and callbacks for success and error.
   * @method loadFont
   * @param  {...any} args - path, name, onSuccess, onError, descriptors
   * @returns a Promise that resolves with a p5.Font instance
   */
  fn.loadFont = async function (...args/*path, name, onSuccess, onError, descriptors*/) {

    let { path, name, success, error, descriptors } = parseCreateArgs(...args);

    let isCSS = path.includes('@font-face');

    if (!isCSS) {
      const info = await fetch(path, { method: 'HEAD' });
      const isCSSFile = info.headers.get('content-type')?.startsWith('text/css');
      if (isCSSFile) {
        isCSS = true;
        path = await fetch(path).then((res) => res.text());
      }
    }

    if (isCSS) {
      const stylesheet = new CSSStyleSheet();
      await stylesheet.replace(path);
      const fontPromises = [];
      for (const rule of stylesheet.cssRules) {
        if (rule instanceof CSSFontFaceRule) {
          const style = rule.style;
          let name = unquote(style.getPropertyValue('font-family'));
          const src = style.getPropertyValue('src');
          const fontDescriptors = { ...(descriptors || {}) };
          for (const key of style) {
            if (key === 'font-family' || key === 'src') continue;
            const camelCaseKey = key
              .replace(/^font-/, '')
              .split('-')
              .map((v, i) => i === 0 ? v : `${v[0].toUpperCase()}${v.slice(1)}`)
              .join('');
            fontDescriptors[camelCaseKey] = style.getPropertyValue(key);
          }
          fontPromises.push(create(this, name, src, fontDescriptors));
        }
      }
      const fonts = await Promise.all(fontPromises);
      return fonts[0]; // TODO: handle multiple faces?
    }

    let pfont;
    try {
      // load the raw font bytes
      let result = await fn.loadBytes(path);
      //console.log('result:', result);

      if (!result) {
        throw Error('Failed to load font data');
      }

      // parse the font data
      let fonts = Typr.parse(result);

      // TODO: generate descriptors from font in the future

      if (fonts.length === 0 || fonts[0].cmap === undefined) {
        throw Error('parsing font data');
      }

      // make sure we have a valid name
      name = name || extractFontName(fonts[0], path);

      // create a FontFace object and pass it to the p5.Font constructor
      pfont = await create(this, name, path, descriptors, fonts[0]);

    } catch (err) {
      // failed to parse the font, load it as a simple FontFace
      let ident = name || path
        .substring(path.lastIndexOf('/') + 1)
        .replace(/\.[^/.]+$/, "");

      console.warn(`WARN: No glyph data for '${ident}', retrying as FontFace`);

      try {
        // create a FontFace object and pass it to p5.Font
        pfont = await create(this, ident, path, descriptors);
      }
      catch (err) {
        if (error) return error(err);
        throw err;
      }
    }
    if (success) return success(pfont);

    return pfont;
  }
};

// Convert arrays to named objects
export const arrayCommandsToObjects = (commands) => commands.map((command) => {
  const type = command[0];
  switch (type) {
    case 'Z': {
      return { type };
    }
    case 'M':
    case 'L': {
      const [, x, y] = command;
      return { type, x, y };
    }
    case 'Q': {
      const [, x1, y1, x, y] = command;
      return { type, x1, y1, x, y };
    }
    case 'C': {
      const [, x1, y1, x2, y2, x, y] = command;
      return { type, x1, y1, x2, y2, x, y };
    }
    default: {
      throw new Error(`Unexpected path command: ${type}`);
    }
  }
});

export default font;

if (typeof p5 !== 'undefined') {
  font(p5, p5.prototype);
}
