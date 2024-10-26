function font(p5, fn) {

  const validFontTypes = ['ttf', 'otf', 'woff', 'woff2'];
  const validFontTypesRE = new RegExp(`\.(${validFontTypes.join('|')})$`, 'i');
  const invalidFontError = 'Sorry, only TTF, OTF, WOFF and WOFF2 files are supported.';

  /**
   * Options for creating a p5.Font object, with examples:
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
    constructor(p, name, path, options) {
      this.pInst = p;
      this.font = new FontFace(name, `url(${path})`, options);
      console.log('Font', this.font);
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
    textToPoints() { // stub
      throw Error('Not implemented in basic p5.Font');
    }

    static async create(...args/*path, name, onSuccess, onError*/) {

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

      let callback, errorCallback, options;

      // check for callbacks
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (typeof arg === 'function') {
          if (!callback) {
            callback = arg;
          } else {
            errorCallback = arg;
          }
        }
        else if (typeof arg === 'object') {
          options = arg;
        }
      }
      return await new Promise((resolve, reject) => {
        let pfont = new p5.Font(this, name, path, options);
        pfont.load().then(() => {
          if (document?.fonts) {
            document.fonts.add(pfont.font);
          }
          if (typeof callback === 'function') {
            callback(pfont);
          }
          else {
            resolve(pfont);
          }
        }, err => {
          p5._friendlyFileLoadError(4, path); // ?
          if (errorCallback) {
            errorCallback(err);
          } else {
            reject(err);
          }
        });
      });
    };
  }

  // attach as p5.loadFont
  fn.loadFont = p5.Font.create;
};

export default font;

if (typeof p5 !== 'undefined') {
  font(p5, p5.prototype);
}