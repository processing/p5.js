/**
 * @module DOM
 * @submodule DOM
 * @for p5
 */
define(function(require) {

  var p5 = require('core');
  require('input.mouse');
  require('input.touch');

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
    var c;
    if (isDefault) {
      c = document.createElement('canvas');
      c.id = 'defaultCanvas';
    } else { // resize the default canvas if new one is created
      c = document.getElementById('defaultCanvas');
      c.id = ''; // remove default id
      if (!c) { // probably user calling createCanvas more than once... uhoh
        c = document.createElement('canvas');
        var warn = 'Warning: createCanvas more than once not recommended.';
        warn += 'Unpredictable behavior may result.';
        console.log(warn);
      }
    }

    c.setAttribute('width', w*this._pixelDensity);
    c.setAttribute('height', h*this._pixelDensity);
    c.setAttribute('style',
      'width:'+w+'px !important; height:'+h+'px !important;');

    // set to invisible if still in setup (to prevent flashing with manipulate)
    if (!this._setupDone) {
      c.className += ' p5_hidden'; // tag to show later
      c.style.visibility='hidden';
    }

    if (this._userNode) { // user input node case
      this._userNode.appendChild(c);
    } else {
      document.body.appendChild(c);
    }

    var elt =  new p5.Element(c, this);
    this.context(elt);
    this._applyDefaults();
    this.scale(this._pixelDensity, this._pixelDensity);
    return elt;
  };



  p5.prototype.context = function(e) {
    var obj;
    if (typeof e === 'string' || e instanceof String) {
      var elt = document.getElementById(e);
      if (elt) {
        var pe = new p5.Element(elt, this);
        obj = pe;
      } else {
        obj = null;
      }
    } else {
      obj = e;
    }
    if (typeof obj !== 'undefined') {
      this._curElement = obj;
      this._setProperty('width', obj.elt.offsetWidth);
      this._setProperty('height', obj.elt.offsetHeight);

      var p = this;
      window.onfocus = function() {
        p._setProperty('focused', true);
      };

      window.onblur = function() {
        p._setProperty('focused', false);
      };

      if (typeof this._curElement.context !== 'undefined') {
        this._curElement.context.setTransform(1, 0, 0, 1, 0, 0);
      }

    }
  };


  return p5;

});
