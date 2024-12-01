/** 
 * API:
 *    loadFont("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap")
 *    loadFont("{ font-family: "Bricolage Grotesque", serif; font-optical-sizing: auto; font-weight: <weight> font-style: normal; font-variation-settings: "wdth" 100; });
 *    loadFont({ 
 *        fontFamily: '"Bricolage Grotesque", serif'; 
 *        fontOpticalSizing: 'auto';
 *        fontWeight: '<weight>';
 *        fontStyle: 'normal';
 *        fontVariationSettings: '"wdth" 100'; 
 *    });
 *    loadFont("https://fonts.gstatic.com/s/bricolagegrotesque/v1/pxiAZBhjZQIdd8jGnEotWQ.woff2");
 *    loadFont("./path/to/localFont.ttf");
 *    loadFont("system-font-name");
 * 
 *   
 *   NEXT:
 *     extract axes from font file
 * 
 *   TEST: 
 *    const font = new FontFace("Inter", "url(./fonts/inter-latin-variable-full-font.woff2)", {
        style: "oblique 0deg 10deg",
        weight: "100 900",
        display: 'fallback'
      });
*/

/**
 * This module defines the <a href="#/p5.Font">p5.Font</a> class and P5 methods for
 * loading fonts from files and urls, and extracting points from their paths.
 */
import Typr from './lib/Typr.js';

function font(p5, fn) {

  const pathArgCounts = { M: 2, L: 2, C: 6, Q: 4 };
  const validFontTypes = ['ttf', 'otf', 'woff', 'woff2'];
  const validFontTypesRe = new RegExp(`\\.(${validFontTypes.join('|')})`, 'i');
  const extractFontNameRe = new RegExp(`([^/]+)(\\.(?:${validFontTypes.join('|')}))`, 'i');
  const invalidFontError = 'Sorry, only TTF, OTF, WOFF and WOFF2 files are supported.';
  const fontFaceVariations = ['weight', 'stretch', 'style'];

  p5.Font = class Font {

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

    fontBounds(...args) { // alias for p5.fontBounds
      if (!this._pInst) throw Error('p5 required for fontBounds()');
      return this._pInst.fontBounds(...args);
    }

    textBounds(...args) { // alias for p5.textBounds
      if (!this._pInst) throw Error('p5 required for textBounds()'); // TODO:
      return this._pInst.textBounds(...args);
    }

    textToPaths(str, x, y, width, height, options) {

      ({ width, height, options } = this._parseArgs(width, height, options));

      // lineate and get glyphs/paths for each line
      let lines = this._lineateAndPathify(str, x, y, width, height, options);

      // flatten into a single array containing all the glyphs
      let glyphs = lines.map(o => o.glyphs).flat();

      // flatten into a single array with all the path commands
      return glyphs.map(g => g.path.commands).flat();
    }

    textToPoints(str, x, y, width, height, options) {
      ({ width, height, options } = this._parseArgs(width, height, options));

      // lineate and get the points for each line
      let glyphs = this.textToPaths(str, x, y, width, height, options);

      // create a 2d array with path elements: [type, data[0], data[1], ...]
      let cmds = glyphs.map(g => [g.type, ...g.data]); // TODO: rm

      // convert paths to points with {sampleFactor, simplifyThreshold}
      return pathToPoints(cmds, options);
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

    /*
      Returns an array of line objects, each containing { text, x, y, glyphs: [ {g, path} ] }
    */
    _lineateAndPathify(str, x, y, width, height, options = {}) {

      let renderer = options?.renderer || this._pInst._renderer;

      // save the baseline
      let setBaseline = renderer.drawingContext.textBaseline;

      // lineate and compute bounds for the text
      let { lines, bounds } = renderer._computeBounds
        (fn._FONT_BOUNDS, str, x, y, width, height,
          { ignoreRectMode: true, ...options });

      // compute positions for each of the lines
      lines = this._position(renderer, lines, bounds, width, height);

      // convert lines to paths
      let scale = renderer.states.textSize / this.data.head.unitsPerEm;
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
      const subdivide = (pts, pt1, pt2, maxDist) => {
        if (fn.dist(pt1.x, pt1.y, pt2.x, pt2.y) > maxDist) {
          let middle = { x: (pt1.x + pt2.x) / 2, y: (pt1.y + pt2.y) / 2 };
          pts.push(middle);
          subdivide(pts, pt1, middle, maxDist);
          subdivide(pts, middle, pt2, maxDist);
        }
      }

      // a point for each path-command plus line subdivisions
      let pts = [];
      let { textSize } = this._pInst._renderer.states;
      let maxDist = textSize / this.data.head.unitsPerEm * 500;
      for (let i = 0; i < cmds.length; i++) {
        let { type, data: d } = cmds[i];
        if (type !== 'Z') {
          let pt = { x: d[d.length - 2], y: d[d.length - 1] }
          if (type === 'L' && pts.length) {
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
        if (textAlign === fn.CENTER) {
          x += (bounds.w - lineWidth) / 2;
        }
        else if (textAlign === fn.RIGHT) {
          x += (bounds.w - lineWidth);
        }
        if (typeof width !== 'undefined') {
          switch (renderer.states.rectMode) {
            case fn.CENTER:
              x -= width / 2;
              y -= height / 2;
              break;
            case fn.RADIUS:
              x -= width;
              y -= height;
              break;
          }
        }
        return { text, x, y };
      }

      return lines.map(coordify);
    }

    _lineToGlyphs(line, scale) {

      if (!this.data) {
        throw Error('No font data available for "' + this.name
          + '"\nTry downloading a local copy of the font file');
      }
      let glyphShapes = Typr.U.shape(this.data, line.text);
      line.glyphs = this._shapeToPaths(glyphShapes, line, scale);

      return line;
    }

    _shapeToPaths(glyphs, line, scale) {
      let font = this.data;
      let x = 0, y = 0, paths = [];

      if (glyphs.length !== line.text.length) {
        throw Error('Invalid shape data');
      }

      // iterate over the glyphs, converting each to a glyph object
      // with a path property containing an array of commands
      for (let i = 0; i < glyphs.length; i++) {
        let crdIdx = 0;
        let { g, ax, ay, dx, dy } = glyphs[i];
        let { crds, cmds } = Typr.U.glyphToPath(font, g);

        // can get simple points for each glyph here, but we don't need them ?
        let glyph = { g: line.text[i], /*points: [],*/ path: { commands: [] } };

        for (let j = 0; j < cmds.length; j++) {
          let type = cmds[j], command = { type, data: [] };
          if (type in pathArgCounts) {
            let argCount = pathArgCounts[type];
            for (let k = 0; k < argCount; k += 2) {
              let gx = crds[k + crdIdx] + x + dx;
              let gy = crds[k + crdIdx + 1] + y + dy;
              let fx = line.x + gx * scale;
              let fy = line.y + gy * -scale;
              command.data.push(fx);
              command.data.push(fy);
              /*if (k === argCount - 2) {
                glyph.points.push({ x: fx, y: fy });
              }*/
            }
            crdIdx += argCount;
          }
          glyph.path.commands.push(command);
        }
        paths.push(glyph);
        x += ax; y += ay;
      }

      return paths;
    }

    _measureTextDefault(renderer, str) {
      let { textAlign, textBaseline } = renderer.states;
      let ctx = renderer.drawingContext;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      let metrics = ctx.measureText(str);
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;
      return metrics;
    }

    drawPaths(ctx, commands, opts) {
      ctx.strokeStyle = opts?.stroke || ctx.strokeStyle;
      ctx.fillStyle = opts?.fill || ctx.strokeStyle;
      ctx.beginPath();
      commands.forEach(({ type, data }) => {
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
      ctx.fill();
      ctx.stroke();
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
  }// end p5.Font

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



  /**
   * Load a font and returns a p5.Font instance. The font can be specified by its path or a url.
   * Optional arguments include the font name, descriptors for the FontFace object, 
   * and callbacks for success and error.
   * @param  {...any} args - path, name, onSuccess, onError, descriptors
   * @returns a Promise that resolves with a p5.Font instance
   */
  p5.prototype.loadFont = async function (...args/*path, name, onSuccess, onError, descriptors*/) {

    let { path, name, success, error, descriptors } = parseCreateArgs(...args);

    let pfont;
    try {
      // load the raw font bytes
      let result = await fn.loadBytes(path);

      // parse the font data
      let fonts = Typr.parse(result.bytes);
      if (fonts.length !== 1) throw Error('Invalid font data (1)');

      // make sure we have a valid name
      name = name || extractFontName(fonts[0], path);

      // create a FontFace object and pass it to the p5.Font constructor
      pfont = await create(this, name, path, descriptors, fonts[0]);

    } catch (err) {
      // failed to parse the font, load it as a simple FontFace
      console.warn('Failed to parse font data:', err);
      try {
        // create a FontFace object and pass it to p5.Font
        console.log(`Retrying '${name}' without font-data: '${path}'`);
        pfont = await create(this, name, path, descriptors);
      }
      catch (err) {
        if (error) {
          error(err);
        }
        throw err;
      }
    }
    if (success) {
      success(pfont);
    }

    return pfont;
  }

  async function create(pInst, name, path, descriptors, rawFont) {

    let face = createFontFace(name, path, descriptors, rawFont);

    // load if we need to
    if (face.status !== 'loaded') {
      await face.load();
    }

    // add it to the document
    document.fonts.add(face);

    // return a p5.Font instance
    return new p5.Font(pInst, face, name, path, rawFont);
  }

  function createFontFace(name, path, descriptors, rawFont) {
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
    return new FontFace(name, fontArg, descriptors);
  }

  function extractFontName(font, path) {
    let meta = font?.name;

    // use the metadata if we have it
    if (meta) {
      if (meta.fullName) {
        return meta.fullName;
      }
      if (meta.familyName) {
        return meta.familyName;
      }
    }

    // if not, extract the name from the path
    let matches = extractFontNameRe.exec(path);
    if (matches && matches.length >= 3) {
      return matches[1];
    }

    // give up and return the full path
    return path;
  };

  function pathToPoints(cmds, options) {
    //console.log('pathToPoints', cmds, options);

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

    const findDotsAtSegment = (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) => {
      const t1 = 1 - t;
      const t13 = Math.pow(t1, 3);
      const t12 = Math.pow(t1, 2);
      const t2 = t * t;
      const t3 = t2 * t;
      const x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x;
      const y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y;
      const mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x);
      const my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y);
      const nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x);
      const ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y);
      const ax = t1 * p1x + t * c1x;
      const ay = t1 * p1y + t * c1y;
      const cx = t1 * c2x + t * p2x;
      const cy = t1 * c2y + t * p2y;
      let alpha = 90 - Math.atan2(mx - nx, my - ny) * 180 / Math.PI;
      if (mx > nx || my < ny) {
        alpha += 180;
      }
      return {
        x, y, m: { x: mx, y: my }, n: { x: nx, y: ny },
        start: { x: ax, y: ay }, end: { x: cx, y: cy }, alpha
      };
    }

    const getPointAtSegmentLength = (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) => {
      return length == null ? bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) :
        findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y,
          getTatLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
    }

    const pointAtLength = (path, length, isTotal) => {
      path = path2curve(path);
      let x, y, p, l, point;
      let sp = '', len = 0, subpaths = {}
      for (let i = 0, ii = path.length; i < ii; i++) {
        p = path[i];
        if (p[0] === 'M') {
          x = +p[1];
          y = +p[2];
        } else {
          l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
          if (len + l > length) {
            if (!isTotal) {
              point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
              return { x: point.x, y: point.y, alpha: point.alpha };
            }
          }
          len += l;
          x = +p[5];
          y = +p[6];
        }
        sp += p.shift() + p;
      }
      subpaths.end = sp;

      point = isTotal ? len : findDotsAtSegment
        (x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);

      if (point.alpha) {
        point = { x: point.x, y: point.y, alpha: point.alpha };
      }

      return point;
    }

    const pathToAbsolute = (pathArray) => {
      let res = [], x = 0, y = 0, mx = 0, my = 0, start = 0;
      if (!pathArray) {
        // console.warn("Unexpected state: undefined pathArray"); // shouldn't happen
        return res;
      }
      if (pathArray[0][0] === 'M') {
        x = +pathArray[0][1];
        y = +pathArray[0][2];
        mx = x;
        my = y;
        start++;
        res[0] = ['M', x, y];
      }

      let dots, crz =
        pathArray.length === 3 &&
        pathArray[0][0] === 'M' &&
        pathArray[1][0].toUpperCase() === 'R' &&
        pathArray[2][0].toUpperCase() === 'Z';

      for (let r, pa, i = start, ii = pathArray.length; i < ii; i++) {
        res.push((r = []));
        pa = pathArray[i];
        if (pa[0] !== pa[0].toUpperCase()) {
          r[0] = pa[0].toUpperCase();
          switch (r[0]) {
            case 'A':
              r[1] = pa[1];
              r[2] = pa[2];
              r[3] = pa[3];
              r[4] = pa[4];
              r[5] = pa[5];
              r[6] = +(pa[6] + x);
              r[7] = +(pa[7] + y);
              break;
            case 'V':
              r[1] = +pa[1] + y;
              break;
            case 'H':
              r[1] = +pa[1] + x;
              break;
            case 'R':
              dots = [x, y].concat(pa.slice(1));
              for (let j = 2, jj = dots.length; j < jj; j++) {
                dots[j] = +dots[j] + x;
                dots[++j] = +dots[j] + y;
              }
              res.pop();
              res = res.concat(catmullRom2bezier(dots, crz));
              break;
            case 'M':
              mx = +pa[1] + x;
              my = +pa[2] + y;
              break;
            default:
              for (let j = 1, jj = pa.length; j < jj; j++) {
                r[j] = +pa[j] + (j % 2 ? x : y);
              }
          }
        } else if (pa[0] === 'R') {
          dots = [x, y].concat(pa.slice(1));
          res.pop();
          res = res.concat(catmullRom2bezier(dots, crz));
          r = ['R'].concat(pa.slice(-2));
        } else {
          for (let k = 0, kk = pa.length; k < kk; k++) {
            r[k] = pa[k];
          }
        }
        switch (r[0]) {
          case 'Z':
            x = mx;
            y = my;
            break;
          case 'H':
            x = r[1];
            break;
          case 'V':
            y = r[1];
            break;
          case 'M':
            mx = r[r.length - 2];
            my = r[r.length - 1];
            break;
          default:
            x = r[r.length - 2];
            y = r[r.length - 1];
        }
      }
      return res;
    }

    const path2curve = (path, path2) => {
      const p = pathToAbsolute(path), p2 = path2 && pathToAbsolute(path2);
      const attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };
      const attrs2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };
      const pcoms1 = []; // path commands of original path p
      const pcoms2 = []; // path commands of original path p2
      let ii;
      const processPath = (path, d, pcom) => {
        let nx, ny, tq = { T: 1, Q: 1 };
        if (!path) {
          return ['C', d.x, d.y, d.x, d.y, d.x, d.y];
        }
        if (!(path[0] in tq)) {
          d.qx = d.qy = null;
        }
        switch (path[0]) {
          case 'M':
            d.X = path[1];
            d.Y = path[2];
            break;
          case 'A':
            path = ['C'].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
            break;
          case 'S':
            if (pcom === 'C' || pcom === 'S') {
              nx = d.x * 2 - d.bx;
              ny = d.y * 2 - d.by;
            } else {
              nx = d.x;
              ny = d.y;
            }
            path = ['C', nx, ny].concat(path.slice(1));
            break;
          case 'T':
            if (pcom === 'Q' || pcom === 'T') {
              d.qx = d.x * 2 - d.qx;
              d.qy = d.y * 2 - d.qy;
            } else {
              d.qx = d.x;
              d.qy = d.y;
            }
            path = ['C'].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
            break;
          case 'Q':
            d.qx = path[1];
            d.qy = path[2];
            path = ['C'].concat(
              q2c(d.x, d.y, path[1], path[2], path[3], path[4])
            );
            break;
          case 'L':
            path = ['C'].concat(l2c(d.x, d.y, path[1], path[2]));
            break;
          case 'H':
            path = ['C'].concat(l2c(d.x, d.y, path[1], d.y));
            break;
          case 'V':
            path = ['C'].concat(l2c(d.x, d.y, d.x, path[1]));
            break;
          case 'Z':
            path = ['C'].concat(l2c(d.x, d.y, d.X, d.Y));
            break;
        }
        return path;
      },
        fixArc = (pp, i) => {
          if (pp[i].length > 7) {
            pp[i].shift();
            const pi = pp[i];
            while (pi.length) {
              pcoms1[i] = 'A';
              if (p2) {
                pcoms2[i] = 'A';
              }
              pp.splice(i++, 0, ['C'].concat(pi.splice(0, 6)));
            }
            pp.splice(i, 1);
            ii = Math.max(p.length, (p2 && p2.length) || 0);
          }
        },
        fixM = (path1, path2, a1, a2, i) => {
          if (path1 && path2 && path1[i][0] === 'M' && path2[i][0] !== 'M') {
            path2.splice(i, 0, ['M', a2.x, a2.y]);
            a1.bx = 0;
            a1.by = 0;
            a1.x = path1[i][1];
            a1.y = path1[i][2];
            ii = Math.max(p.length, (p2 && p2.length) || 0);
          }
        };

      let pfirst = ''; // temporary holder for original path command
      let pcom = ''; // holder for previous path command of original path

      ii = Math.max(p.length, (p2 && p2.length) || 0);
      for (let i = 0; i < ii; i++) {
        if (p[i]) {
          pfirst = p[i][0];
        } // save current path command
        if (pfirst !== 'C') {
          pcoms1[i] = pfirst; // Save current path command
          if (i) {
            pcom = pcoms1[i - 1];
          } // Get previous path command pcom
        }
        p[i] = processPath(p[i], attrs, pcom);
        if (pcoms1[i] !== 'A' && pfirst === 'C') {
          pcoms1[i] = 'C';
        }
        fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1
        if (p2) {
          // the same procedures is done to p2
          if (p2[i]) {
            pfirst = p2[i][0];
          }
          if (pfirst !== 'C') {
            pcoms2[i] = pfirst;
            if (i) {
              pcom = pcoms2[i - 1];
            }
          }
          p2[i] = processPath(p2[i], attrs2, pcom);
          if (pcoms2[i] !== 'A' && pfirst === 'C') {
            pcoms2[i] = 'C';
          }
          fixArc(p2, i);
        }
        fixM(p, p2, attrs, attrs2, i);
        fixM(p2, p, attrs2, attrs, i);
        const seg = p[i], seg2 = p2 && p2[i], seglen = seg.length, seg2len = p2 && seg2.length;
        attrs.x = seg[seglen - 2];
        attrs.y = seg[seglen - 1];
        attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
        attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
        attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
        attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
        attrs2.x = p2 && seg2[seg2len - 2];
        attrs2.y = p2 && seg2[seg2len - 1];
      }

      return p2 ? [p, p2] : p;
    }

    const a2c = (x1, y1, rx, ry, angle, lac, sweep_flag, x2, y2, recursive) => {
      // see: http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
      const PI = Math.PI, _120 = PI * 120 / 180;
      let f1, f2, cx, cy, xy;
      const rad = PI / 180 * (+angle || 0);
      let res = [];
      const rotate = (x, y, rad) => {
        const X = x * Math.cos(rad) - y * Math.sin(rad),
          Y = x * Math.sin(rad) + y * Math.cos(rad);
        return { x: X, y: Y };
      };

      if (!recursive) {
        xy = rotate(x1, y1, -rad);
        x1 = xy.x;
        y1 = xy.y;
        xy = rotate(x2, y2, -rad);
        x2 = xy.x;
        y2 = xy.y;
        const x = (x1 - x2) / 2;
        const y = (y1 - y2) / 2;
        let h = x * x / (rx * rx) + y * y / (ry * ry);
        if (h > 1) {
          h = Math.sqrt(h);
          rx = h * rx;
          ry = h * ry;
        }
        const rx2 = rx * rx, ry2 = ry * ry;
        const k = (lac === sweep_flag ? -1 : 1) * Math.sqrt(Math.abs(
          (rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x)));

        cx = k * rx * y / ry + (x1 + x2) / 2;
        cy = k * -ry * x / rx + (y1 + y2) / 2;
        f1 = Math.asin(((y1 - cy) / ry).toFixed(9));
        f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

        f1 = x1 < cx ? PI - f1 : f1;
        f2 = x2 < cx ? PI - f2 : f2;

        if (f1 < 0) {
          f1 = PI * 2 + f1;
        }
        if (f2 < 0) {
          f2 = PI * 2 + f2;
        }

        if (sweep_flag && f1 > f2) {
          f1 = f1 - PI * 2;
        }
        if (!sweep_flag && f2 > f1) {
          f2 = f2 - PI * 2;
        }
      } else {
        f1 = recursive[0];
        f2 = recursive[1];
        cx = recursive[2];
        cy = recursive[3];
      }
      let df = f2 - f1;
      if (Math.abs(df) > _120) {
        const f2old = f2, x2old = x2, y2old = y2;
        f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
        x2 = cx + rx * Math.cos(f2);
        y2 = cy + ry * Math.sin(f2);
        res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag,
          x2old, y2old, [f2, f2old, cx, cy]);
      }
      df = f2 - f1;
      const c1 = Math.cos(f1),
        s1 = Math.sin(f1),
        c2 = Math.cos(f2),
        s2 = Math.sin(f2),
        t = Math.tan(df / 4),
        hx = 4 / 3 * rx * t,
        hy = 4 / 3 * ry * t,
        m1 = [x1, y1],
        m2 = [x1 + hx * s1, y1 - hy * c1],
        m3 = [x2 + hx * s2, y2 - hy * c2],
        m4 = [x2, y2];
      m2[0] = 2 * m1[0] - m2[0];
      m2[1] = 2 * m1[1] - m2[1];
      if (recursive) {
        return [m2, m3, m4].concat(res);
      } else {
        res = [m2, m3, m4].concat(res).join().split(',');
        const newres = [];
        for (let i = 0, ii = res.length; i < ii; i++) {
          newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y
            : rotate(res[i], res[i + 1], rad).x;
        }
        return newres;
      }
    }

    // http://schepers.cc/getting-to-the-point
    function catmullRom2bezier(crp, z) {
      const d = [];
      for (let i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
        const p = [
          { x: +crp[i - 2], y: +crp[i - 1] },
          { x: +crp[i], y: +crp[i + 1] },
          { x: +crp[i + 2], y: +crp[i + 3] },
          { x: +crp[i + 4], y: +crp[i + 5] }
        ];
        if (z) {
          if (!i) {
            p[0] = { x: +crp[iLen - 2], y: +crp[iLen - 1] };
          } else if (iLen - 4 === i) {
            p[3] = { x: +crp[0], y: +crp[1] };
          } else if (iLen - 2 === i) {
            p[2] = { x: +crp[0], y: +crp[1] };
            p[3] = { x: +crp[2], y: +crp[3] };
          }
        } else {
          if (iLen - 4 === i) {
            p[3] = p[2];
          } else if (!i) {
            p[0] = { x: +crp[i], y: +crp[i + 1] };
          }
        }
        d.push(['C',
          (-p[0].x + 6 * p[1].x + p[2].x) / 6,
          (-p[0].y + 6 * p[1].y + p[2].y) / 6,
          (p[1].x + 6 * p[2].x - p[3].x) / 6,
          (p[1].y + 6 * p[2].y - p[3].y) / 6,
          p[2].x, p[2].y
        ]);
      }
      return d;
    }

    function l2c(x1, y1, x2, y2) {
      return [x1, y1, x2, y2, x2, y2];
    }

    function q2c(x1, y1, ax, ay, x2, y2) {
      const _13 = 1 / 3, _23 = 2 / 3;
      return [_13 * x1 + _23 * ax, _13 * y1 + _23 * ay,
      _13 * x2 + _23 * ax, _13 * y2 + _23 * ay, x2, y2];
    }

    const bezlen = (x1, y1, x2, y2, x3, y3, x4, y4, z) => {
      z = z ?? 1;
      z = z > 1 ? 1 : z < 0 ? 0 : z;
      const z2 = z / 2, n = 12;
      let sum = 0;
      const Tvalues = [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816];
      const Cvalues = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472];
      for (let i = 0; i < n; i++) {
        const ct = z2 * Tvalues[i] + z2, xbase = base3(ct, x1, x2, x3, x4),
          ybase = base3(ct, y1, y2, y3, y4), comb = xbase * xbase + ybase * ybase;
        sum += Cvalues[i] * Math.sqrt(comb);
      }
      return z2 * sum;
    }

    const getTatLen = (x1, y1, x2, y2, x3, y3, x4, y4, ll) => {
      if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) {
        return;
      }
      const t = 1, e = 0.01;
      let step = t / 2, t2 = t - step;
      let l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
      while (Math.abs(l - ll) > e) {
        step /= 2;
        t2 += (l < ll ? 1 : -1) * step;
        l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
      }
      return t2;
    }

    const base3 = (t, p1, p2, p3, p4) => {
      const t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
        t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
      return t * t2 - 3 * p1 + 3 * p2;
    }

    let opts = parseOpts(options, {
      sampleFactor: 0.05,
      simplifyThreshold: 0
    });

    let points = [];
    let len = pointAtLength(cmds, 0, 1);
    let t = len / (len * opts.sampleFactor);

    for (let i = 0; i < len; i += t) {
      points.push(pointAtLength(cmds, i));
    }

    if (opts.simplifyThreshold) {
      simplify(points, opts.simplifyThreshold);
    }

    return points;
  }
};

export default font;

if (typeof p5 !== 'undefined') {
  font(p5, p5.prototype);
}