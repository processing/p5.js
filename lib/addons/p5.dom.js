/**
 * @module *
 */
var p5DOM = (function(){

  /**
   * Either returns the value of the element if no arguments
   * given, or sets the value of the element.
   * 
   * @for DOM:PElement
   * @method value
   * @param  {String|Number} [value]
   * @return {String|Number}
   */
  p5.PElement.prototype.value = function() { 
    if (arguments.length > 0) {
      this.elt.value = arguments[0];
    } else {
      if (this.elt.type === 'range') {
        return parseFloat(this.elt.value);
      }
      else return this.elt.value;
    }
  };

  /**
   * 
   * Shows the current element. Essentially, setting display:block for the style.
   * 
   * @for DOM:PElement
   * @method show
   */
  p5.PElement.prototype.show = function() {
    this.elt.style.display = 'block';
  };

  /**
   * Hides the current element. Essentially, setting display:none for the style.
   * 
   * @for DOM:PElement
   * @method hide
   */
  p5.PElement.prototype.hide = function() {
    this.elt.style.display = 'none';
  };

  /**
   * 
   * Sets the width and height of the element. AUTO can be used to
   * only adjust one dimension.
   * 
   * @for    DOM:PElement
   * @method size
   * @param  {Number} w width of the element
   * @param  {Number} h height of the element
   */
  p5.PElement.prototype.size = function(w, h) {
    var aW = w;
    var aH = h;
    var AUTO = p5.prototype.AUTO;

    if (aW !== AUTO || aH !== AUTO) {
      if (aW === AUTO) {
        aW = h * this.elt.width / this.elt.height;
      } else if (aH === AUTO) {
        aH = w * this.elt.height / this.elt.width;
      }
      // set diff for cnv vs normal div
      if (this.elt instanceof HTMLCanvasElement) {
        this.elt.setAttribute('width', aW);
        this.elt.setAttribute('height', aH);
      } else {
        this.elt.style.width = aW;
        this.elt.style.height = aH;
      }
      this.width = this.elt.offsetWidth;
      this.height = this.elt.offsetHeight;
      if (this.pInst) { // main canvas associated with p5 instance
        if (this.pInst.curElement.elt === this.elt) {
          this.pInst._setProperty('width', this.elt.offsetWidth);
          this.pInst._setProperty('height', this.elt.offsetHeight);
        }
      }
    }
  };

  /**
   * Searches the page for an element with given ID and returns it as
   * a PElement. The DOM node itself can be accessed with .elt.
   * Returns null if none found.
   * 
   * @for    DOM:Manipulate
   * @method getElement
   * @param  {String} id id of element to search for
   * @return {Object/PElement|Null} PElement containing node found
   */
  p5.prototype.getElement = function (e) {
    var res = document.getElementById(e);
    if (res) {
      return new p5.PElement(res);
    } else {
      return null;
    }
  };

  /**
   * Searches the page for elements with given class and returns an
   * array of PElements. The DOM nodes themselves can be accessed
   * with .elt. Returns an empty array if none found.
   * 
   * @for    DOM:Manipulate
   * @method getElements
   * @param  {String} class class name of elements to search for
   * @return {Array} array of PElement wrapped nodes found
   */
  p5.prototype.getElements = function (e) {
    var arr = [];
    var res = document.getElementsByClassName(e);
    if (res) {
      for (var j = 0; j < res.length; j++) {
        var obj = new p5.PElement(res[j]);
        arr.push(obj);
      }
    }
    return arr;
  };


  /**
   * Creates a <div></div> element in the DOM with given inner HTML.
   * 
   * @for    DOM:Manipulate
   * @method createDiv
   * @param  {String} html inner HTML for element created
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */

  /**
   * Creates a <p></p> element in the DOM with given inner HTML. Used
   * for paragraph length text.
   * 
   * @for    DOM:Manipulate
   * @method createP
   * @param  {String} html inner HTML for element created
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */

  /**
   * Creates a <span></span> element in the DOM with given inner HTML.
   * 
   * @for    DOM:Manipulate
   * @method createSpan
   * @param  {String} html inner HTML for element created
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */

  /**
   * Creates a <h1></h1> element in the DOM with given inner HTML.
   * Used for headings.
   * 
   * @for    DOM:Manipulate
   * @method createH1
   * @param  {String} html inner HTML for element created
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */

  /**
   * Creates a <h2></h2> element in the DOM with given inner HTML.
   * Used for headings.
   * 
   * @for    DOM:Manipulate
   * @method createH2
   * @param  {String} html inner HTML for element created
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */

  /**
   * Creates a <h3></h3> element in the DOM with given inner HTML.
   * Used for headings.
   * 
   * @for    DOM:Manipulate
   * @method createH3
   * @param  {String} html inner HTML for element created
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */

  /**
   * Creates a <h4></h4> element in the DOM with given inner HTML.
   * Used for headings.
   * 
   * @for    DOM:Manipulate
   * @method createH4
   * @param  {String} html inner HTML for element created
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */

  /**
   * Creates a <h5></h5> element in the DOM with given inner HTML.
   * Used for headings.
   * 
   * @for    DOM:Manipulate
   * @method createH5
   * @param  {String} html inner HTML for element created
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */

  /**
   * Creates a <h6></h6> element in the DOM with given inner HTML.
   * Used for headings.
   * 
   * @for    DOM:Manipulate
   * @method createH6
   * @param  {String} html inner HTML for element created
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */
  var tags = ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  tags.forEach(function(tag) {
    var method = 'create' + tag.charAt(0).toUpperCase() + tag.slice(1);
    p5.prototype[method] = function(html) {
      var elt = document.createElement(tag);
      elt.innerHTML = html;
      var node = this._userNode ? this._userNode : document.body;
      node.appendChild(elt);
      var c = new p5.PElement(elt);
      return c;
    }
  });

  /**
   * Creates an <img /> element in the DOM with given src and
   * alternate text
   * 
   * @for    DOM:Manipulate
   * @method createImg
   * @param  {String} src src path or url for image
   * @param  {String} alt alternate text to be used if image does not
   *                  load
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */
  p5.prototype.createImg = function(src, alt) {
    var elt = document.createElement('img');
    elt.src = src;
    if (typeof alt !== 'undefined') {
      elt.alt = alt;
    }
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };


  /**
   * Creates an <a></a> element in the DOM for including a hyperlink.
   * 
   * @for    DOM:Manipulate
   * @method createA
   * @param  {String} href url of page to link to
   * @param  {String} html inner html of link element to display
   * @param  {String} [target] target where new link should open,
   *                           could be _blank, _self, _parent, _top.
   * @return {Object/PElement} pointer to PElement holding created
   *                           node
   */
  p5.prototype.createA = function(href, html, target) {
    var elt = document.createElement('a');
    elt.href = href;
    elt.innerHTML = html;
    if (target) elt.target = target;
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  /** INPUT **/
  p5.prototype.createSlider = function(min, max, value) {
    var elt = document.createElement('input');
    elt.type = 'range';
    elt.min = min;
    elt.max = max;
    if (value) elt.value = value;
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  p5.prototype.createButton = function(label, value) {
    var elt = document.createElement('button');
    elt.innerHTML = label;
    elt.value = value;
    if (value) elt.value = value;
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  p5.prototype.createInput = function(value) {
    var elt = document.createElement('input');
    elt.type = 'text';
    if (value) elt.value = value;
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

  /** VIDEO STUFF **/
  p5.prototype.createVideo = function(src) {
    var elt = document.createElement('video');
    elt.src = src;
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.PElement(elt);
    c.play = function() {
      c.elt.play();
    };
    c.pause = function() {
      c.elt.pause();
    };
    c.loop = function(val) {
      c.elt.setAttribute('loop', val);
    };
    return c;  
  };

  p5.prototype.video = function(v, x, y, w, h) {
    this._curElement.context.drawImage(v.elt, x, y, w, h);
  };



  /** CAMERA STUFF **/
  
  p5.prototype.VIDEO = 'video';
  p5.prototype.AUDIO = 'audio';

  navigator.getUserMedia  = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;

  /**
   * 
   *
   * @method createCapture
   * @for p5.dom:p5.dom
   * @param  {String/Constant} type type of capture, either VIDEO or 
   *                           AUDIO if none specified, default both
   * @return {Object/PElement} capture video PElement
   */
  p5.prototype.createCapture = function(type) {
    console.log(type)
    var useVideo, useAudio;
    if (!type) {
      useVideo = true;
      useAudio = true;
    } else if (type === p5.prototype.VIDEO) {
      useVideo = true;
    } else if (type === p5.prototype.AUDIO) {
      useAudio = true;
    }

    if (navigator.getUserMedia) {
      var elt = document.createElement('video');
      navigator.getUserMedia({video: useVideo, audio: useAudio}, function(stream) {
        elt.src = window.URL.createObjectURL(stream);
        elt.play();
      }, function(e) { console.log(e); });
    } else {
      throw 'getUserMedia not supported in this browser';
    }
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.PElement(elt);
    return c;  
  };

})();