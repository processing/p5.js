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
   * Searches the page for an element with given ID and returns it as
   * a PElement. The DOM node itself can be accessed with .elt.
   * Returns null if none found.
   * 
   * @for DOM:Manipulate
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
   * @for DOM:Manipulate
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