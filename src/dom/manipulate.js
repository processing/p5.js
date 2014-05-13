define(function(require) {

  var p5 = require('core');
  require('input.mouse');
  require('input.touch');

  var PElement = require('dom.pelement');

  /**
   * Creates a canvas element in the document.
   *
   * @method createCanvas
   * @param  {Number} w width of the canvas
   * @param  {Number} h height of the canvas
   * @param  {Boolean} isDefault whether the canvas is a default one
   * @return {undefined}
   */
  p5.prototype.createCanvas = function(w, h, isDefault) {
    var c = document.createElement('canvas');
    c.setAttribute('width', w);
    c.setAttribute('height', h);
    if (isDefault) {
      c.id = 'defaultCanvas';
      document.body.appendChild(c);
    } else { // remove the default canvas if new one is created
      var defaultCanvas = document.getElementById('defaultCanvas');
      if (defaultCanvas) {
        defaultCanvas.parentNode.removeChild(defaultCanvas);
      }
      if (this._userNode) { // user input node case
        if(this._userNode.tagName === 'CANVAS') {
          // if user input node exists and it's a canvas, use that
          c = this._userNode;
          c.setAttribute('width', w);
          c.setAttribute('height', h);
        } else {
          // if user input node exists and it's not a canvas, append one
          this._userNode.appendChild(c);
        }
      } else {
        document.body.appendChild(c);
      }
    }

    var cnv =  new PElement(c, this);
    this._elements.push(cnv);
    this.context(cnv);
    this._applyDefaults();

    return cnv;
  };

  p5.prototype.createHTML = function(html) {
    var elt = document.createElement('div');
    elt.innerHTML = html;
    document.body.appendChild(elt);
    var c =  new PElement(elt, this);
    this._elements.push(c);
    //this.context(c);
    return c;
  };

  p5.prototype.createHTMLImage = function(src, alt) {
    var elt = document.createElement('img');
    elt.src = src;
    if (typeof alt !== 'undefined') {
      elt.alt = alt;
    }
    document.body.appendChild(elt);
    var c =  new PElement(elt, this);
    this._elements.push(c);
    //this.context(c);
    return c;
  };

  p5.prototype.getId = function (e) {
    for (var i = 0; i < this._elements.length; i++) {
      if (this._elements[i].elt.id === e) {
        return this._elements[i];
      }
    }
    var res = document.getElementById(e);
    if (res) {
      var obj = new PElement(res, this);
      this._elements.push(obj);
      return obj;
    } else {
      return null;
    }
  };
  p5.prototype.getClass = function (e) {
    console.log(this._elements);
    var arr = [];
    for (var i = 0; i < this._elements.length; i++) {
      if (this._elements[i].elt.className.split(' ').indexOf(e) !== -1) {
        arr.push(this._elements[i]);
      }
    }

    if (arr.length === 0) {
      var res = document.getElementsByClassName(e);
      if (res) {
        for (var j = 0; j < res.length; j++) {
          var obj = new PElement(res[j], this);
          this._elements.push(obj);
          arr.push(obj);
        }
      }
    }
    return arr;
  };

  p5.prototype.context = function(e) {
    var obj;
    if (typeof e === 'string' || e instanceof String) {
      var elt = document.getElementById(e);
      if (elt) {
        var pe = new PElement(elt, this);
        this._elements.push(pe);
        obj = pe;
      } else {
        obj = null;
      }
    } else {
      obj = e;
    }
    if (typeof obj !== 'undefined') {
      this.curElement = obj;
      this._setProperty('width', obj.elt.offsetWidth);
      this._setProperty('height', obj.elt.offsetHeight);

      window.onfocus = function() {
        this._setProperty('focused', true);
      };

      window.onblur = function() {
        this._setProperty('focused', false);
      };

      if (typeof this.curElement.context !== 'undefined') {
        this.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
      }

    }
  };

  return p5;

});
