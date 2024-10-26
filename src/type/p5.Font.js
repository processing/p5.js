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
      this.delegate = new FontFace(name, `url(${path})`, options);
    }
    async load() {
      return this.delegate.load();
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
  };
}

export default font;

if (typeof p5 !== 'undefined') {
  font(p5, p5.prototype);
}