define(function(require) {

  var constants = require('constants');

  function PElement(elt, pInst) {
    this.elt = elt;
    this.pInst = pInst;
    this.width = this.elt.offsetWidth;
    this.height = this.elt.offsetHeight;
    this.elt.style.position = 'absolute';
    this.x = 0;
    this.y = 0;
    this.elt.style.left = this.x+ 'px';
    this.elt.style.top = this.y+ 'px';
    if (elt instanceof HTMLCanvasElement) {
      this.context = elt.getContext('2d');
    }
  }
  PElement.prototype.html = function(html) {
    this.elt.innerHTML = html;
  };
  PElement.prototype.position = function(x, y) {
    this.x = x;
    this.y = y;
    this.elt.style.left = x+'px';
    this.elt.style.top = y+'px';
  };
  PElement.prototype.size = function(w, h) {
    var aW = w;
    var aH = h;
    var AUTO = constants.AUTO;

    if (aW !== AUTO || aH !== AUTO) {
      if (aW === AUTO) {
        aW = h * this.elt.width / this.elt.height;
      } else if (aH === AUTO) {
        aH = w * this.elt.height / this.elt.width;
      }

      if (this.elt instanceof HTMLCanvasElement) { // set diff for cnv vs normal div
        this.elt.setAttribute('width', aW);
        this.elt.setAttribute('height', aH);
      } else {
        this.elt.style.width = aW;
        this.elt.style.height = aH;
      }
      this.width = this.elt.offsetWidth;
      this.height = this.elt.offsetHeight;
      if (this.pInst.curElement.elt === this.elt) {
        this.pInst.width = this.elt.offsetWidth;
        this.pInst.height = this.elt.offsetHeight;
      }
    }
  };
  PElement.prototype.style = function(s) {
    this.elt.style.cssText += s;
  };
  PElement.prototype.id = function(id) {
    this.elt.id = id;
  };
  PElement.prototype.class = function(c) {
    this.elt.className = c;
  };
  PElement.prototype.show = function() {
    this.elt.style.display = 'block';
  };
  PElement.prototype.hide = function() {
    this.elt.style.display = 'none';
  };
  PElement.prototype.mousePressed = function(fxn) {
    var _this = this;
    this.elt.addEventListener('click', function(e){fxn(e, _this);}, false);
  }; // pend false?
  PElement.prototype.mouseOver = function(fxn) {
    var _this = this;
    this.elt.addEventListener('mouseover', function(e){fxn(e, _this);}, false);
  };
  PElement.prototype.mouseOut = function(fxn) {
    var _this = this;
    this.elt.addEventListener('mouseout', function(e){fxn(e, _this);}, false);
  };

  return PElement;
});
