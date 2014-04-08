define(function(require) {

  var p5 = require('core');
  require('input.mouse');
  require('input.touch');

  var PElement = require('dom.pelement');

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
    this.context(cnv);
    this._applyDefaults();

    return cnv;
  };

  p5.prototype.createHTML = function(html) {
    var elt = document.createElement('div');
    elt.innerHTML = html;
    document.body.appendChild(elt);
    var c =  new PElement(elt, this);
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
    //this.context(c);
    return c;
  };

  p5.prototype.getId = function(e) {
    var res = document.getElementById(e);
    if (res) {
      return new PElement(res, this);
    }
    else {
      return null;
    }
  };

  p5.prototype.getClass = function(e) {
    var arr = [];
    var res = document.getElementsByClassName(e);
    if (res) {
      for(var i = 0, resl = res.length; i !== resl; i++) {
        arr.push(new PElement(res[i], this));
      }
    }
    return arr;
  };

  p5.prototype.context = function(e) {
    var obj;
    if (typeof e === 'string' || e instanceof String) {
      var elt = document.getElementById(e);
      obj = elt ? new PElement(elt, this) : null;
    } else {
      obj = e;
    }
    if (typeof obj !== 'undefined') {
      this.curElement = obj;
      this._setProperty('width', obj.elt.offsetWidth);
      this._setProperty('height', obj.elt.offsetHeight);

      this.curElement.onfocus = function() {
        this.focused = true;
      };

      this.curElement.onblur = function() {
        this.focused = false;
      };

      if (typeof this.curElement.context !== 'undefined') {
        this.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
      }

    }
  };

  return p5;

});
