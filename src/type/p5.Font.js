function font(p5, fn) {

  p5.Font = class Font {
    constructor(path, name, options) {
      this.path = path;
      this.delegate = new FontFace(name, `url(${path})`, options);
      console.log(this.delegate);
    }
    async load(callback, errorCallback) {
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