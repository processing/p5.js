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

    textToPath(str, x, y, width, height, options) {
      let paths = this._getPaths(str, x, y, width, height, options);
      return [];
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

      //  get the array of points for each line
      let fontSize = renderer.states.textSize;
      let scale = fontSize / this.fontData.head.unitsPerEm; // * dpr
      let pts = paths.map(p => this._pointify(p, scale, options));

      // TODO: resample points along the path
      return pts.flat();
    }

    /*
      Returns an array of paths, one for each line of text
    */
    _getPaths(renderer, str, x, y, width, height, options) {

      // save the baseline
      let setBaseline = renderer.drawingContext.textBaseline;

      // combine states and options into props object
      ({ width, height, options } = this._parseArgs
        (renderer, width, height, options));

      // lineate and compute bounds for the text
      let { lines, bounds } = renderer._computeBounds
        (fn._FONT_BOUNDS, str, x, y, width, height, options);

      // compute positions for each of the lines
      lines = this._position(renderer, lines, bounds);

      // convert lines to paths
      let paths = lines.map(l => this._pathify(l, options));

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

    _position(renderer, lines, bounds) {

      let { textAlign, textLeading } = renderer.states;
      let metrics = this._measureTextDefault(renderer, 'X');
      let ascent = metrics.fontBoundingBoxAscent;

      let coordify = (text, i) => {
        let x = bounds.x;
        let y = bounds.y + (i * textLeading) + ascent;
        let width = renderer._fontWidthSingle(text);
        if (textAlign === fn.CENTER) {
          x += (bounds.w - width) / 2;
        }
        else if (textAlign === fn.RIGHT) {
          x += (bounds.w - width);
        }
        return { text, x, y };
      }

      return lines.map(coordify);
    }

    _pathify(line, opts) {

      if (!this.fontData) {
        throw Error('No font data available for "' + this.name
          + '"\nTry downloading a local copy of the font file');
      }

      let font = this.fontData;
      //let { text, x, y } = line;
      let shape = Typr.U.shape(font, line.text);
      line.path = Typr.U.shapeToPath(font, shape);

      return line;
    }

    _pointify(path, scale, opts) {
      this._pathify(path, opts);
      let pts = this._pathToPoints(path, scale, opts?.maxDistance);
      path.points = pts;
      return pts;
    }

    _pathToPoints(pathData, scale, maxDist = scale * 500) {

      let { x, y, path } = pathData;
      let c = 0, pts = [], { crds, cmds } = path;

      // iterate over the path, storing each non-control point
      for (let j = 0; j < cmds.length; j++) {
        let cmd = cmds[j];
        if (cmd == "M" || cmd == "L") {
          let pt = { x: x + crds[c] * scale, y: y + crds[c + 1] * -scale }
          c += 2;
          if (cmd == "L" && maxDist && pts.length > 1) {
            subdivide(pts, pts[pts.length - 1], pt, maxDist);
          }
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