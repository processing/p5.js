define(function(require) {

  var Processing = require('../core/core');
  require('../input/mouse');
  require('../input/touch');

  var PElement = require('./pelement');

  Processing.prototype.createGraphics = function(w, h, isDefault, targetID) {
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
      if (targetID) {
        target = document.getElementById(targetID);
        if (target) target.appendChild(c);
        else document.body.appendChild(c);
      } else {
        document.body.appendChild(c);
      }
    }

    var cnv =  new PElement(c, this);
    this.context(cnv);
    this._applyDefaults();

    return cnv;
  };

  Processing.prototype.createHTML = function(html) {
    var elt = document.createElement('div');
    elt.innerHTML = html;
    document.body.appendChild(elt);
    c =  new PElement(elt, this);
    context(c);
    return c;
  };

  Processing.prototype.createHTMLImage = function(src, alt) {
    var elt = document.createElement('img');
    elt.src = src;
    if (typeof alt !== 'undefined') {
      elt.alt = alt;
    }
    document.body.appendChild(elt);
    c =  new PElement(elt, this);
    context(c);
    return c;
  };

  Processing.prototype.find = function(e) {
    var res = document.getElementById(e);
    if (res) return [new PElement(res, this)];
    else {
      res = document.getElementsByClassName(e);
      if (res) {
        var arr = [];
        for(var i = 0, resl = res.length; i != resl; arr.push(new PElement(res[i++], this)));
        return arr;
      }
    }
    return [];
  };

  Processing.prototype.context = function(e) {
    var obj;
    if (typeof e == 'string' || e instanceof String) {
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

      this.curElement.onmousemove = this.onmousemove.bind(this);
      this.curElement.onmousedown = this.onmousedown.bind(this);
      this.curElement.onmouseup = this.onmouseup.bind(this);
      this.curElement.onmouseclick = this.onmouseclick.bind(this);
      this.curElement.onmousewheel = this.onmousewheel.bind(this);
      this.curElement.onkeydown = this.onkeydown.bind(this);
      this.curElement.onkeyup = this.onkeyup.bind(this);
      this.curElement.onkeypress = this.onkeypress.bind(this);
      this.curElement.ontouchstart = this.ontouchstart.bind(this);
      this.curElement.ontouchmove = this.ontouchmove.bind(this);
      this.curElement.ontouchend = this.ontouchend.bind(this);

      if (typeof this.curElement.context !== 'undefined') this.curElement.context.setTransform(1, 0, 0, 1, 0, 0);

      if (-1 < this.curSketchIndex && this.sketchCanvases.length <= this.curSketchIndex) {
        this.sketchCanvases[this.curSketchIndex] = this.curElement;
      }
    }
  };

  return Processing;

});
