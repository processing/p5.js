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

// pf.Font = {font, fontData, name, path}: font is either a string or a FontFace object, fontData is the optional 
//  Typr raw font data, name is the font name, and path is the font path or url. ???

/**
 * This module defines the <a href="#/p5.Font">p5.Font</a> class and P5 methods for
 * loading fonts from files and urls, and extracting points from their paths.
 */
import { parse } from 'opentype.js';
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

    _measureTextDefault(str) {
      let ctx = this._pInst._renderer.drawingContext;
      let { textAlign, textBaseline } = ctx;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      let metrics = ctx.measureText(str);
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;
      return metrics;
    }

    _parseArgs(options, width, height) {

      let states = this?._pInst?._renderer?.states || {};

      if (typeof width === 'object') {
        options = width;
        width = height = undefined;
      }
      if (typeof height === 'object') {
        options = height;
        height = undefined;
      }
      options = options || {};

      // combine states and options into a props object
      let props = Object.entries(states).reduce((obj, [k, v]) => {
        obj[k] = (k in options) ? options[k] : v;
        return obj;
      }, {});

      if (props.textBaseline === fn.BASELINE) {
        props.textBaseline = fn.TOP;
      }

      return props;
    }

    textToPoints(str, x, y, width, height, opts) {

      let renderer = this._pInst._renderer;

      // save the baseline
      let setBaseline = renderer.drawingContext.textBaseline;

      // combine states and options into props object
      let props = this._parseArgs(opts, width, height);
      let textSize = props.textSize;

      // lineate and get the bounds for the text
      let measurer = renderer._fontBoundsSingle.bind(renderer);
      let { lines, bounds } = renderer._computeBounds
        (measurer, str, x, y, width, height, props);

      // compute positions for each of the lines
      lines = this._position(lines, bounds, props);

      // convert lines to points at specified size
      let pts = lines.map(l => this._lineToPoints(l, textSize, opts));

      // restore the baseline
      renderer.drawingContext.textBaseline = setBaseline;

      return pts.flat();
    }

    _position(lines, bounds, props) {

      let renderer = this._pInst._renderer;
      let { textAlign, textLeading } = props;
      let { fontBoundingBoxAscent: ascent } = this._measureTextDefault('X');

      let coordify = (text, i) => {
        let lx = bounds.x;
        let ly = bounds.y + (i * textLeading) + ascent;
        let lw = renderer._fontWidthSingle(text);
        if (textAlign === fn.CENTER) {
          lx += (bounds.w - lw) / 2;
        }
        else if (textAlign === fn.RIGHT) {
          lx += (bounds.w - lw);
        }
        return { text, x: lx, y: ly };
      }

      return lines.map(coordify);
    }

    _lineToPoints(line, fontSize, opts) {

      if (!this.fontData) {
        throw Error('No font data available for "' + this.name
          + '"\nTry downloading a local copy of the font file');
      }

      let font = this.fontData;
      let { text, x, y } = line;
      let shape = Typr.U.shape(font, text);
      let path = Typr.U.shapeToPath(font, shape);

      // do we need to deal with devicePixelRatio here?
      let scale = fontSize / font.head.unitsPerEm; // * dpr

      return this._pathToPoints(path, x, y, scale, opts?.maxDistance);
    }

    _pathToPoints(path, x, y, scale, maxDistance = scale * 500) {

      let c = 0, pts = [], crds = path["crds"];

      // iterate over the path, storing each non-control point
      for (let j = 0; j < path.cmds.length; j++) {
        let cmd = path.cmds[j];
        if (cmd == "M" || cmd == "L") {
          let pt = { x: x + crds[c] * scale, y: y + crds[c + 1] * -scale }
          c += 2;
          if (cmd == "L" && maxDistance && pts.length > 1) {
            subdivide(pts, pts[pts.length - 1], pt, maxDistance);
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