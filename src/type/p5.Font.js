function font(p5, fn) {

  const validFontTypes = ['ttf', 'otf', 'woff', 'woff2'];
  const validFontTypesRe = new RegExp(`\\.(${validFontTypes.join('|')})`, 'i');
  const extractFontNameRe = new RegExp(`([^/]+)(\\.(?:${validFontTypes.join('|')}))`, 'i');
  const invalidFontError = 'Sorry, only TTF, OTF, WOFF and WOFF2 files are supported.';

  p5.Font = class Font {
    static list() {
      console.log('There are', document.fonts.size, 'FontFaces loaded.\n');

      // document.fonts has a Set-like interface.
      // Here, we iterate over its values.
      for (var fontFace of document.fonts.values()) {
        console.log('FontFace:');
        for (var property in fontFace) {
          console.log('  ' + property + ': ' + fontFace[property]);
        }
        console.log('\n');
      }

      return Array.from(document.fonts);
    }
    constructor(p, name, path, descriptors) {
      console.log('p5.Font', 'constructor', name, path, descriptors);
      if (!(p instanceof p5)) {
        throw Error('p5 instance is required');
      }
      if (!path.startsWith('url(')) {
        path = `url(${path})`; // hmm
      }
      this.pInst = p;
      this.name = name;
      this.path = path;
      this.font = new FontFace(name, path, descriptors);
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

    textToPoints(...args) { // alias for p5.textToPoints
      return this.pInst.textToPoints(...args);
    }

    static async create(...args/*path, name, onSuccess, onError, descriptors*/) {

      let { path, name, success, error, descriptors } = parseCreateArgs(...args);

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
    else if (validFontTypesRe.test(path)) {
      // try to extract the name from the path
      let matches = extractFontNameRe.exec(path);
      if (matches && matches.length >= 3) {
        name = matches[1];
      }
    }

    // validate the name
    if (typeof name !== 'string' || name.length === 0) {
      p5._friendlyError(invalidFontError, 'p5.loadFont'); // ?
    }

    // get the callbacks if any
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

  // attach as p5.loadFont
  fn.loadFont = p5.Font.create;
};

export default font;

if (typeof p5 !== 'undefined') {
  font(p5, p5.prototype);
}