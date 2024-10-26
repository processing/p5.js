function font(p5, fn) {
 
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
    constructor(name, path, options) {
      this.delegate = new FontFace(name, `url(${path})`, options);
    }

    async loadY() {
      try {
        // wait for font to be loaded
        await this.delegate.load();
        // add font to document
        if (document) document.fonts.add(this.delegate);
      } catch (e) {
        console.error(e);
      }
    }

    async loadX(callback, errorCallback) {
      return await new Promise(resolve => {
        try {
          this.delegate.load().then(() => {
            if (typeof callback !== 'undefined') {
              callback(this.delegate);
            }
            resolve(this.delegate)
          }, err => {
            console.log("[ERROR] loading: '" + this.path + "'\n" + err);
            p5._friendlyFileLoadError(4, this.path); // ?
            if (errorCallback) {
              errorCallback(err);
            } else {
              throw err;
            }
          }
          );
        }
        catch (err) {
          console.log("ERRRORRRR:" + err);

          p5._friendlyFileLoadError(4, this.path); // ?
          if (errorCallback) {
            errorCallback(err);
          } else {
            throw err;
          }
        }
      });
    }
  };
}
export default font;

if (typeof p5 !== 'undefined') {
  font(p5, p5.prototype);
}