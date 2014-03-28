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
    this.context(c);
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
    this.context(c);
    return c;
  };

  p5.prototype.find = function(e) {
    var res = document.getElementById(e);
    if (res) {
      return [new PElement(res, this)];
    }
    else {
      res = document.getElementsByClassName(e);
      if (res) {
        var arr = [];
        for(var i = 0, resl = res.length; i !== resl; i++) {
          arr.push(new PElement(res[i], this));
        }
        return arr;
      }
    }
    return [];
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

      // TODO: This is a workaround for the global case where event handlers
      // have been attached to the window just by declaring them
      if (!this.isGlobal) {
        this.curElement.context.canvas.onmousemove = this.onmousemove.bind(this);
        this.curElement.context.canvas.onmousedown = this.onmousedown.bind(this);
        this.curElement.context.canvas.onmouseup = this.onmouseup.bind(this);
        this.curElement.context.canvas.onmouseclick = this.onmouseclick.bind(this);
        this.curElement.context.canvas.onmousewheel = this.onmousewheel.bind(this);
        this.curElement.context.canvas.onkeydown = this.onkeydown.bind(this);
        this.curElement.context.canvas.onkeyup = this.onkeyup.bind(this);
        this.curElement.context.canvas.onkeypress = this.onkeypress.bind(this);
        this.curElement.context.canvas.ontouchstart = this.ontouchstart.bind(this);
        this.curElement.context.canvas.ontouchmove = this.ontouchmove.bind(this);
        this.curElement.context.canvas.ontouchend = this.ontouchend.bind(this);
      }

      if (typeof this.curElement.context !== 'undefined') {
        this.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
      }

    }
  };

  return p5;

});
