/**
 * @module DOM
 * @submodule DOM
 * @for p5.Element
 */
define(function(require) {

  var p5 = require('core');

  /**
   * Base class for all elements added to a sketch, including canvas,
   * graphics buffers, and other HTML elements. Methods in blue are
   * included in the core functionality, methods in brown are added
   * with the <a href="http://p5js.org/libraries/">p5.dom library</a>. 
   * It is not called directly, but p5.Element
   * objects are created by calling createCanvas, createGraphics,
   * or in the p5.dom library, createDiv, createImg, createInput, etc.
   *
   * @class p5.Element
   * @constructor
   * @param {String} elt DOM node that is wrapped
   * @param {Object} [pInst] pointer to p5 instance
   */
  p5.Element = function(elt, pInst) {
    /**
     * Underlying HTML element. All normal HTML methods can be called on this.
     *
     * @property elt
     */
    this.elt = elt;
    this._pInst = pInst;
    this._events = {};
    this.width = this.elt.offsetWidth;
    this.height = this.elt.offsetHeight;
  };

  /**
   *
   * Attaches the element to the parent specified. A way of setting
   * the container for the element. Accepts either a string ID, DOM
   * node, or p5.Element.
   *
   * @method parent
   * @param  {String|Object} parent the ID, DOM node, or p5.Element
   *                         of desired parent element
   * @return {p5.Element}
   * @example
   * <div class="norender"><code>
   * // in the html file:
   * &lt;div id="myContainer">&lt;/div>
   * // in the js file:
   * var cnv = createCanvas(100, 100);
   * cnv.parent("myContainer");
   * </code></div>
   * <div class='norender'><code>
   * var div0 = createDiv('this is the parent');
   * var div1 = createDiv('this is the child');
   * div1.parent(div0); // use p5.Element
   * </code></div>
   * <div class='norender'><code>
   * var div0 = createDiv('this is the parent');
   * div0.id('apples');
   * var div1 = createDiv('this is the child');
   * div1.parent('apples'); // use id
   * </code></div>
   * <div class='norender'><code>
   * var elt = document.getElementById('myParentDiv');
   * var div1 = createDiv('this is the child');
   * div1.parent(elt); // use element from page
   * </code></div>
   */
  p5.Element.prototype.parent = function(p) {
    if (typeof p === 'string') {
      p = document.getElementById(p);
    } else if (p instanceof p5.Element) {
      p = p.elt;
    }
    p.appendChild(this.elt);
    return this;
  };

  /**
   *
   * Sets the ID of the element
   *
   * @method id
   * @param  {String} id ID of the element
   * @return {p5.Element}
   */
  p5.Element.prototype.id = function(id) {
    this.elt.id = id;
    return this;
  };

  /**
   *
   * Adds given class to the element
   *
   * @method class
   * @param  {String} class class to add
   * @return {p5.Element}
   */
  p5.Element.prototype.class = function(c) {
    this.elt.className += ' '+c;
    return this;
  };

  /**
   * The .mousePressed() function is called once after every time a
   * mouse button is pressed over the element. This can be used to
   * attach element specific event listeners.
   *
   * @method mousePressed
   * @param  {Function} fxn function to be fired when mouse is
   *                    pressed over the element. 
   * @return {p5.Element}  
   * @example
   * <div class='norender'><code>
   * var cnv;
   * var d;
   * var g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mousePressed(changeGray); // attach listener for
   *                                 // canvas click only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   ellipse(width/2, height/2, d, d);
   * }
   *
   * // this function fires with any click anywhere
   * function mousePressed() {
   *   d = d + 10;
   * }
   * 
   * // this function fires only when cnv is clicked
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code></div>
   *
   */
  p5.Element.prototype.mousePressed = function (fxn) {
    attachListener('mousedown', fxn, this);
    attachListener('touchstart', fxn, this);
    return this;
  };

  /**
   * The .mouseWheel() function is called once after every time a
   * mouse wheel is scrolled over the element. This can be used to
   * attach element specific event listeners.<br><br>
   * The event.wheelDelta or event.detail property returns negative values if
   * the mouse wheel if rotated up or away from the user and positive in the
   * other direction. On OS X with "natural" scrolling enabled, the values are
   * opposite.
   *
   * @method mouseWheel
   * @param  {Function} fxn function to be fired when mouse wheel is
   *                    scrolled over the element.
   * @return {p5.Element}
   */
  p5.Element.prototype.mouseWheel = function (fxn) {
    attachListener('mousewheel', fxn, this);
    return this;
  };

  /**
   * The .mouseReleased() function is called once after every time a
   * mouse button is released over the element. This can be used to
   * attach element specific event listeners.
   *
   * @method mouseReleased
   * @param  {Function} fxn function to be fired when mouse is
   *                    released over the element.
   * @return {p5.Element}
   */
  p5.Element.prototype.mouseReleased = function (fxn) {
    attachListener('mouseup', fxn, this);
    attachListener('touchend', fxn, this);
    return this;
  };


  /**
   * The .mouseClicked() function is called once after a mouse button is 
   * pressed and released over the element. This can be used to
   * attach element specific event listeners.
   *
   * @method mouseClicked
   * @param  {Function} fxn function to be fired when mouse is
   *                    clicked over the element.
   * @return {p5.Element}
   */
  p5.Element.prototype.mouseClicked = function (fxn) {
    attachListener('click', fxn, this);
    return this;
  };

  /**
   * The .mouseMoved() function is called once every time a
   * mouse moves over the element. This can be used to attach an
   * element specific event listener.
   *
   * @method mouseMoved
   * @param  {Function} fxn function to be fired when mouse is
   *                    moved over the element.
   * @return {p5.Element}
   */
  p5.Element.prototype.mouseMoved = function (fxn) {
    attachListener('mousemove', fxn, this);
    attachListener('touchmove', fxn, this);
    return this;
  };

  /**
   * The .mouseOver() function is called once after every time a
   * mouse moves onto the element. This can be used to attach an
   * element specific event listener.
   *
   * @method mouseOver
   * @param  {Function} fxn function to be fired when mouse is
   *                    moved over the element.
   * @return {p5.Element}
   */
  p5.Element.prototype.mouseOver = function (fxn) {
    attachListener('mouseover', fxn, this);
    return this;
  };

  /**
   * The .mouseOut() function is called once after every time a
   * mouse moves off the element. This can be used to attach an
   * element specific event listener.
   *
   * @method mouseOut
   * @param  {Function} fxn function to be fired when mouse is
   *                    moved off the element.
   * @return {p5.Element}
   */
  p5.Element.prototype.mouseOut = function (fxn) {
    attachListener('mouseout', fxn, this);
    return this;
  };

  /**
   * The .touchStarted() function is called once after every time a touch is
   * registered. This can be used to attach element specific event listeners.
   *
   * @method touchStarted
   * @param  {Function} fxn function to be fired when touch is
   *                    started over the element. 
   * @return {p5.Element}  
   * @example
   * <div class='norender'><code>
   * var cnv;
   * var d;
   * var g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.touchStarted(changeGray); // attach listener for
   *                                 // canvas click only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   ellipse(width/2, height/2, d, d);
   * }
   *
   * // this function fires with any touch anywhere
   * function touchStarted() {
   *   d = d + 10;
   * }
   * 
   * // this function fires only when cnv is clicked
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code></div>
   *
   */
  p5.Element.prototype.touchStarted = function (fxn) {
    attachListener('touchstart', fxn, this);
    attachListener('mousedown', fxn, this);
    return this;
  };

  /**
   * The .touchMoved() function is called once after every time a touch move is
   * registered. This can be used to attach element specific event listeners.
   *
   * @method touchMoved
   * @param  {Function} fxn function to be fired when touch is moved
   *                    over the element. 
   * @return {p5.Element}  
   * @example
   * <div class='norender'><code>
   * var cnv;
   * var g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.touchMoved(changeGray); // attach listener for
   *                               // canvas click only
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   * }
   *
   * // this function fires only when cnv is clicked
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code></div>
   *
   */
  p5.Element.prototype.touchMoved = function (fxn) {
    attachListener('touchmove', fxn, this);
    attachListener('mousemove', fxn, this);
    return this;
  };

  /**
   * The .touchEnded() function is called once after every time a touch is
   * registered. This can be used to attach element specific event listeners.
   *
   * @method touchEnded
   * @param  {Function} fxn function to be fired when touch is
   *                    ended over the element. 
   * @return {p5.Element}  
   * @example
   * <div class='norender'><code>
   * var cnv;
   * var d;
   * var g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.touchEnded(changeGray);   // attach listener for
   *                                 // canvas click only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   ellipse(width/2, height/2, d, d);
   * }
   *
   * // this function fires with any touch anywhere
   * function touchEnded() {
   *   d = d + 10;
   * }
   * 
   * // this function fires only when cnv is clicked
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code></div>
   *
   */
  p5.Element.prototype.touchEnded = function (fxn) {
    attachListener('touchend', fxn, this);
    attachListener('mouseup', fxn, this);
    return this;
  };



  /**
   * The .dragOver() function is called once after every time a
   * file is dragged over the element. This can be used to attach an
   * element specific event listener.
   *
   * @method dragOver
   * @param  {Function} fxn function to be fired when mouse is
   *                    dragged over the element.
   * @return {p5.Element}
   */
  p5.Element.prototype.dragOver = function (fxn) {
    attachListener('dragover', fxn, this);
    return this;
  };

  /**
   * The .dragLeave() function is called once after every time a
   * dragged file leaves the element area. This can be used to attach an
   * element specific event listener.
   *
   * @method dragLeave
   * @param  {Function} fxn function to be fired when mouse is
   *                    dragged over the element.
   * @return {p5.Element}
   */
  p5.Element.prototype.dragLeave = function (fxn) {
    attachListener('dragleave', fxn, this);
    return this;
  };

  /**
   * The .drop() function is called for each file dropped on the element.
   * It requires a callback that is passed a p5.File object.  You can 
   * optionally pass two callbacks, the first one (required) is triggered 
   * for each file dropped when the file is loaded.  The second (optional)
   * is triggered just once when a file (or files) are dropped.
   *
   * @method drop
   * @param  {Function} callback triggered when files are dropped.
   * @param  {Function} callback to receive loaded file.
   * @return {p5.Element}
   */
  p5.Element.prototype.drop = function (callback, fxn) {
    // Make a file loader callback and trigger user's callback
    function makeLoader(theFile) {
      // Making a p5.File object
      var p5file = new p5.File(theFile);
      return function(e) {
        p5file.data = e.target.result;
        callback(p5file);
      };
    }

    // Is the file stuff supported?
    if (window.File && window.FileReader && window.FileList && window.Blob) {

      // If you want to be able to drop you've got to turn off
      // a lot of default behavior
      attachListener('dragover',function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
      },this);

      // If this is a drag area we need to turn off the default behavior
      attachListener('dragleave',function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
      },this);

      // If just one argument it's the callback for the files
      if (arguments.length > 1) {
        attachListener('drop', fxn, this);
      }
      
      // Deal with the files
      attachListener('drop', function(evt) {

        evt.stopPropagation();
        evt.preventDefault();
        
        // A FileList
        var files = evt.dataTransfer.files;
        
        // Load each one and trigger the callback
        for (var i = 0; i < files.length; i++) {
          var f = files[i];
          var reader = new FileReader();
          reader.onload = makeLoader(f);

          
          // Text of data?
          // This should likely be improved
          if (f.type === 'text') {
            reader.readAsText(f);
          } else {
            reader.readAsDataURL(f);
          }
        }
      }, this);
    } else {
      console.log('The File APIs are not fully supported in this browser.');
    }

    return this;
  };




  function attachListener(ev, fxn, ctx) {
    // LM removing, not sure why we had this?
    // var _this = ctx;
    // var f = function (e) { fxn(e, _this); };
    var f = fxn.bind(ctx);
    ctx.elt.addEventListener(ev, f, false);
    ctx._events[ev] = f;
  }

  /**
   * Helper fxn for sharing pixel methods
   *
   */
  p5.Element.prototype._setProperty = function (prop, value) {
    this[prop] = value;
  };

  
  return p5.Element;
});
