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

const ORIG = 0;

function font(p5, fn) {

  const pathArgCounts = { M: 2, L: 2, C: 6, Q: 4 };
  const validFontTypes = ['ttf', 'otf', 'woff', 'woff2'];
  const validFontTypesRe = new RegExp(`\\.(${validFontTypes.join('|')})`, 'i');
  const extractFontNameRe = new RegExp(`([^/]+)(\\.(?:${validFontTypes.join('|')}))`, 'i');
  const invalidFontError = 'Sorry, only TTF, OTF, WOFF and WOFF2 files are supported.';

  p5.Font = class Font {

    constructor(p, font, name, path, data) {
      if (!(font instanceof FontFace)) {
        throw Error('FontFace is required');
      }
      this._pInst = p;
      this.font = font;
      this.name = name;
      this.path = path;
      this.fontData = data;
    }

    metadata() {
      return this.fontData?.name || {};
    }

    fontBounds(...args) { // alias for p5.fontBounds
      if (!this._pInst) throw Error('p5 instance required for fontBounds()'); // TODO:
      return this._pInst.fontBounds(...args);
    }

    textBounds(...args) { // alias for p5.textBounds
      if (!this._pInst) throw Error('p5 instance required for textBounds()'); // TODO:
      return this._pInst.textBounds(...args);
    }

    textToPaths(str, x, y, width, height, options) {

      // lineate and get paths for each line
      let renderer = options?.renderer || this._pInst._renderer;
      let paths = [...this._getPaths(renderer, str, x, y, width, height, options)];
      return paths;
    }

    /* uses: 
        renderer.states: textBaseline, textAlign, textLeading, textSize},
        renderer.fontWidthSingle(), 
        renderer.fontBoundsSingle()
        drawingContext.measureText(), 
     */
    textToPoints(str, x, y, width, height, options) {

      // lineate and get paths for each line
      let renderer = options?.renderer || this._pInst._renderer;
      let paths = this._getPaths(renderer, str, x, y, width, height, options);
      //console.log(paths[0].glyphs[1].path.commands);

      //  get the array of points for each line
      let fontSize = renderer.states.textSize;
      let scale = fontSize / this.fontData.head.unitsPerEm; // * dpr
      let pts = paths.map(p => this._pointify(p, scale, options));
      //console.log(paths[0].points);

      // TODO: resample points along the path
      return pts.flat();
    }


    /*
      Returns an array of paths, one for each line of text
    */
    _getPaths(renderer, str, x, y, width, height, options = {}) {

      // save the baseline
      let setBaseline = renderer.drawingContext.textBaseline;

      // combine states and options into props object
      ({ width, height, options } = this._parseArgs
        (renderer, width, height, options));

      // lineate and compute bounds for the text
      let { lines, bounds } = renderer._computeBounds
        (fn._FONT_BOUNDS, str, x, y, width, height,
          { ignoreRectMode: true, ...options });

      // compute positions for each of the lines
      lines = this._position(renderer, lines, bounds, width, height);

      // convert lines to paths
      let scale = renderer.states.textSize / this.fontData.head.unitsPerEm;
      let paths = lines.map(l => this._pathify(l, scale, options));      

      // restore the baseline
      renderer.drawingContext.textBaseline = setBaseline;

      return paths;
    }

    _parseArgs(renderer, width, height, options) {

      // requires args, renderer.states, textBaseline

      if (typeof renderer?.states !== 'object') {
        throw Error('Invalid renderer state');
      }

      if (typeof width === 'object') {
        options = width;
        width = height = undefined;
      }

      if (typeof height === 'object') {
        options = height;
        height = undefined;
      }

      options = options || {};

      if (0) { // not used
        // combine states and options into a props object
        let props = Object.entries(renderer.states).reduce((obj, [k, v]) => {
          obj[k] = (k in options) ? options[k] : v;
          return obj;
        }, {});
        return { width, height, options: props };
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

    _pathify(line, scale, opts) {

      if (!this.fontData) {
        throw Error('No font data available for "' + this.name
          + '"\nTry downloading a local copy of the font file');
      }

      let glyphShapes = Typr.U.shape(this.fontData, line.text);


      if (!ORIG) {
        line.glyphs = this._shapeToPaths(glyphShapes, line, scale);
      }
      else {
        line.paths = this._shapeToPathsOrig(glyphShapes);
      }

      return line;
    }

    _shapeToPaths(glyphShapes, line, scale) {
      let font = this.fontData;
      let tpath = { cmds: [], crds: [] };
      let x = 0, y = 0;

      if (glyphShapes.length !== line.text.length) {
        throw Error('Invalid shape data');
      }

      let dpath = [];
      let crdCount = 0;
      for (let i = 0; i < glyphShapes.length; i++) {
        let { g, ax, ay, dx, dy } = glyphShapes[i];
        let glyphPath = Typr.U.glyphToPath(font, g);
        let { crds, cmds } = glyphPath;
        //console.log(line.text[i], 'path:', glyphPath);

        for (let j = 0; j < crds.length; j += 2) {
          tpath.crds.push(crds[j] + x + dx);
          tpath.crds.push(crds[j + 1] + y + dy);
        }

        for (let j = 0; j < cmds.length; j++) {
          tpath.cmds.push(cmds[j]);
        }

        let glyph = { glyph: line.text[i], path: { commands: [] } };
        for (let j = 0; j < cmds.length; j++) {
          let type = cmds[j];
          let command = { type, data: [] };
          if (type in pathArgCounts) {
            let argCount = pathArgCounts[type];
            for (let k = 0; k < argCount; k+=2) {

              // WORKING HERE:
              
              let gx = crds[k+crdCount++] + x + dx;
              let gy = crds[k+crdCount++] + y + dy;
              command.data.push(line.x + gx * scale);
              command.data.push(line.y + gy * -scale);
            }
          }
          glyph.path.commands.push(command);
        }
        dpath.push(glyph);
        x += ax; y += ay;
      }

      return ORIG ? tpath : dpath;
    }


    _shapeToPathsOrig(shape, clr) {
      let font = this.fontData;
      let tpath = { cmds: [], crds: [] };
      let x = 0, y = 0;

      for (let i = 0; i < shape.length; i++) {
        let it = shape[i]
        let path = Typr["U"]["glyphToPath"](font, it["g"]), crds = path["crds"];
        for (let j = 0; j < crds.length; j += 2) {
          tpath.crds.push(crds[j] + x + it["dx"]);
          tpath.crds.push(crds[j + 1] + y + it["dy"]);
        }
        //if (clr) tpath.cmds.push(clr);
        for (let j = 0; j < path["cmds"].length; j++) {
          tpath.cmds.push(path["cmds"][j]);
        }
        //let clen = tpath.cmds.length;
        // SVG fonts might contain "X". Then, nothing would stroke non-SVG glyphs.
        //if (clr) if (clen != 0 && tpath.cmds[clen - 1] != "X") tpath.cmds.push("X");

        x += it["ax"]; y += it["ay"];
      }
      return { "cmds": tpath.cmds, "crds": tpath.crds };
    }

    _pointify(paths, scale, opts) {
      //this._pathify(path, scale, opts);
      let pts;
      if (ORIG) {
        pts = this._pathToPointsOrig(paths, scale, scale * 500);
      }
      else {
        pts = this._pathToPoints(paths, scale * 500);
      }
      paths.points = pts;
      return pts;
    }

    _pathToPoints(pathData, maxDist) {

      let pts = [];
      // iterate over the path, storing each non-control point
      for (let j = 0; j < pathData.glyphs.length; j++) {
        let glyph = pathData.glyphs[j];
        for (let k = 0; k < glyph.path.commands.length; k++) {
          let { type, data } = glyph.path.commands[k];
          if (type === 'M' || type === 'L') {
            let pt = { x: data[0], y: data[1] };
            if (type == "L" && maxDist && pts.length > 1) {
              subdivide(pts, pts[pts.length - 1], pt, maxDist);
            }
            pts.push(pt);
          }
          else if (type === 'C') {
            if (data.length !== 6) throw Error('Invalid data length');
            pts.push({ x: data[4], y: data[5] });
          }
          else if (type === 'Q') {
            if (data.length !== 4) throw Error('Invalid data length');
            pts.push({ x: data[2], y: data[3] });
            //console.log('Q', data, pts[pts.length - 1]);
            
          }
        }
      }
      return pts;
    }

    _pathToPointsOrig(pathData, scale, maxDist = scale * 500) {

      let { x, y, paths } = pathData;
      console.log(pathData);

      let c = 0, pts = [], { crds, cmds } = paths;

      // iterate over the path, storing each non-control point
      for (let j = 0; j < cmds.length; j++) {
        let cmd = cmds[j];
        if (cmd == "M" || cmd == "L") {
          let pt = { x: x + crds[c] * scale, y: y + crds[c + 1] * -scale }
          c += 2;
          /* TMP
          if (cmd == "L" && maxDist && pts.length > 1) {
            subdivide(pts, pts[pts.length - 1], pt, maxDist);
          }*/
          pts.push(pt);
        }
        else if (cmd == "C") {
          pts.push({ x: x + crds[c + 4] * scale, y: y + crds[c + 5] * -scale });
          c += 6;
        }
        else if (cmd == "Q") {
          pts.push({ x: x + crds[c + 2] * scale, y: y + crds[c + 3] * -scale });
          c += 4;
        }
      }

      return pts;
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
    
    strokePaths(ctx, paths, col) {
      ctx.strokeStyle = col || ctx.strokeStyle;
      ctx.beginPath();
      paths.forEach(({ type, data }) => {
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
      ctx.strokeStyle ??= 'red';
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

  /* 
   recursive function to subdivide lines by adding 
   new points until none are longer than maxDist
   */
  function subdivide(pts, pt1, pt2, maxDist) {
    if (fn.dist(pt1.x, pt1.y, pt2.x, pt2.y) > maxDist) {
      let middle = { x: (pt1.x + pt2.x) / 2, y: (pt1.y + pt2.y) / 2 };
      pts.push(middle);
      subdivide(pts, pt1, middle, maxDist);
      subdivide(pts, middle, pt2, maxDist);
    }
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

};

export default font;

if (typeof p5 !== 'undefined') {
  font(p5, p5.prototype);
}