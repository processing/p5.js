function font(p5, fn) {

  const validFontTypes = ['ttf', 'otf', 'woff', 'woff2'];
  const validFontTypesRE = new RegExp(`\.(${validFontTypes.join('|')})$`, 'i');
  const invalidFontError = 'Sorry, only TTF, OTF, WOFF and WOFF2 files are supported.';

  /**
   * p5.Font descriptors / examples:
   *   ascentOverride: "normal"
   *   descentOverride: "normal"
   *   display: "auto"
   *   family: "PlayfairDisplay"
   *   featureSettings: "normal"
   *   lineGapOverride: "normal"
   *   loaded: Promise { <state>: "fulfilled", <value>: FontFace }
   *   sizeAdjust: <percentage> default: "100%"
   *   status: "loaded"
   *   stretch: "normal"
   *   style: "normal"
   *   unicodeRange: "U+0-10FFFF"
   *   variant: "normal"
   *   variationSettings: "normal"
   *   weight: "normal"
   * 
   *  font-string { textFont=family, textSize=?, textStyle=style, textVariant=variant, textWeight=weight, textHeight=?, textStretch=stretch}
   */
  p5.Font = class Font {

    constructor(p, name, path, descriptors) {
      this.pInst = p;
      p._renderer._applyTextProperties(); // tmp
      this.font = new FontFace(name, `url(${path})`, descriptors);
    }

    async load() {
      return this.font.load();
    }

    fontBounds(...args) { // alias for p5.fontBounds
      return this.pInst.fontBounds(...args);
    }

    textBounds(...args) { // alias for p5.textBounds
      return this.pInst.textBounds(...args);

    }
    textToPoints(s, x, y, fsize, options) { // hack via rendering and checking pixels
      const ctx = document.createElement("canvas").getContext("2d"); // TODO: cache
      ctx.canvas.width = this.pInst._renderer.canvas.width; // match p5 canvas
      ctx.canvas.height = this.pInst._renderer.canvas.height; // match p5 canvas
      const fontSize = Math.min(canvas.width / 6, canvas.height / 6);
      ctx.font = `900 ${fontSize}px Arial`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const coordinates = [];
      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const index = (y * canvas.width + x) * 4;
          if (imageData[index + 3] > 128) {
            coordinates.push({ x, y });
            // TODO: scale to position/size
          }
        }
      }
      return coordinates;
    }

    static async create(...args/*path, name, onSuccess, onError*/) {

      let { path, name, success, error, descriptors } = p5.Font._parseArgs(...args);

      return await new Promise((resolve, reject) => {
        let pfont = new p5.Font(this/*p5 instance*/, name, path, descriptors);
        pfont.load().then(() => {
          if (document?.fonts) {
            document.fonts.add(pfont.font);
          }
          if (typeof success === 'function') {
            success(pfont);
          }
          else {
            resolve(pfont);
          }
        }, err => {
          p5._friendlyFileLoadError(4, path);
          if (error) {
            error(err);
          } else {
            reject(err);
          }
        });
      });
    };

    static _parseArgs(...args/*path, name, onSuccess, onError*/) {
      let name, path = args.shift();
      if (typeof path !== 'string' || path.length === 0) {
        p5._friendlyError(invalidFontError, 'p5.loadFont'); // ?
      }
      if (typeof args[1] === 'string') {
        name = args.shift();
      }
      else if (validFontTypesRE.test(path)) {
        name = path.split('/').pop().split('.').shift();
      }
      else {
        p5._friendlyError(invalidFontError, 'p5.loadFont'); // ?
      }
      // check for callbacks
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
  }// end p5.Font

  // attach as p5.loadFont
  fn.loadFont = p5.Font.create;
};

export default font;

if (typeof p5 !== 'undefined') {
  font(p5, p5.prototype);
}