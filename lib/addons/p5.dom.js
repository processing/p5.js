/**
 * @module *
 */
var p5DOM = (function(){

  /**
   * Either returns the value of the element if no arguments
   * given, or sets the value of the element.
   * 
   * @for DOM:p5.Element
   * @method value
   * @param  {String|Number} [value]
   * @return {String|Number}
   */
  p5.Element.prototype.value = function() { 
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
   * @for DOM:p5.Element
   * @method show
   */
  p5.Element.prototype.show = function() {
    this.elt.style.display = 'block';
  };

  /**
   * Hides the current element. Essentially, setting display:none for the style.
   * 
   * @for DOM:p5.Element
   * @method hide
   */
  p5.Element.prototype.hide = function() {
    this.elt.style.display = 'none';
  };

  /**
   * 
   * Sets the width and height of the element. AUTO can be used to
   * only adjust one dimension.
   * 
   * @for    DOM:p5.Element
   * @method size
   * @param  {Number} w width of the element
   * @param  {Number} h height of the element
   */
  p5.Element.prototype.size = function(w, h) {
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
   * a p5.Element. The DOM node itself can be accessed with .elt.
   * Returns null if none found.
   * 
   * @for    DOM:Manipulate
   * @method getElement
   * @param  {String} id id of element to search for
   * @return {Object/p5.Element|Null} p5.Element containing node found
   */
  p5.prototype.getElement = function (e) {
    var res = document.getElementById(e);
    if (res) {
      return new p5.Element(res);
    } else {
      return null;
    }
  };

  /**
   * Searches the page for elements with given class and returns an
   * array of p5.Elements. The DOM nodes themselves can be accessed
   * with .elt. Returns an empty array if none found.
   * 
   * @for    DOM:Manipulate
   * @method getElements
   * @param  {String} class class name of elements to search for
   * @return {Array} array of p5.Element wrapped nodes found
   */
  p5.prototype.getElements = function (e) {
    var arr = [];
    var res = document.getElementsByClassName(e);
    if (res) {
      for (var j = 0; j < res.length; j++) {
        var obj = new p5.Element(res[j]);
        arr.push(obj);
      }
    }
    return arr;
  };


  /**
   * Creates a &lt;div&gt;&lt;/div&gt; element in the DOM with given inner HTML.
   * Appends to the container node if one is specified, otherwise 
   * appends to body.
   * 
   * @for    DOM:Manipulate
   * @method createDiv
   * @param  {String} html inner HTML for element created
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */

  /**
   * Creates a &lt;p&gt;&lt;/p&gt; element in the DOM with given inner HTML. Used
   * for paragraph length text.
   * Appends to the container node if one is specified, otherwise 
   * appends to body.
   * 
   * @for    DOM:Manipulate
   * @method createP
   * @param  {String} html inner HTML for element created
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */

  /**
   * Creates a &lt;span&gt;&lt;/span&gt; element in the DOM with given inner HTML.
   * Appends to the container node if one is specified, otherwise 
   * appends to body.
   * 
   * @for    DOM:Manipulate
   * @method createSpan
   * @param  {String} html inner HTML for element created
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */
  var tags = ['div', 'p', 'span'];
  tags.forEach(function(tag) {
    var method = 'create' + tag.charAt(0).toUpperCase() + tag.slice(1);
    p5.prototype[method] = function(html) {
      var elt = document.createElement(tag);
      elt.innerHTML = html;
      var node = this._userNode ? this._userNode : document.body;
      node.appendChild(elt);
      var c = new p5.Element(elt);
      return c;
    }
  });

  /**
   * Creates an &lt;img /&gt; element in the DOM with given src and
   * alternate text. 
   * Appends to the container node if one is specified, otherwise 
   * appends to body.
   * 
   * @for    DOM:Manipulate
   * @method createImg
   * @param  {String} src src path or url for image
   * @param  {String} alt alternate text to be used if image does not
   *                  load
   * @return {Object/p5.Element} pointer to p5.Element holding created
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
    var c = new p5.Element(elt);
    return c;  
  };


  /**
   * Creates an &lt;a&gt;&lt;/a&gt; element in the DOM for including a hyperlink.
   * Appends to the container node if one is specified, otherwise 
   * appends to body.
   * 
   * @for    DOM:Manipulate
   * @method createA
   * @param  {String} href       url of page to link to
   * @param  {String} html       inner html of link element to display
   * @param  {String} [target]   target where new link should open,
   *                             could be _blank, _self, _parent, _top.
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */
  p5.prototype.createA = function(href, html, target) {
    var elt = document.createElement('a');
    elt.href = href;
    elt.innerHTML = html;
    if (target) elt.target = target;
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.Element(elt);
    return c;  
  };

  /** INPUT **/


  /**
   * Creates a slider &lt;input&gt;&lt;/input&gt; element in the DOM.
   * Use .size() to set the display length of the slider.
   * Appends to the container node if one is specified, otherwise 
   * appends to body.
   * 
   * @for    DOM:Manipulate
   * @method createSlider
   * @param  {Number} min minimum value of the slider
   * @param  {Number} max maximum value of the slider
   * @param  {Number} [value] default value of the slider
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */
  p5.prototype.createSlider = function(min, max, value) {
    var elt = document.createElement('input');
    elt.type = 'range';
    elt.min = min;
    elt.max = max;
    if (value) elt.value = value;
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.Element(elt);
    return c;  
  };

  /**
   * Creates a &lt;button&gt;&lt;/button&gt; element in the DOM.
   * Use .size() to set the display size of the button.
   * Use .mousePressed() to specify behavior on press.
   * Appends to the container node if one is specified, otherwise 
   * appends to body.
   * 
   * @for    DOM:Manipulate
   * @method createButton
   * @param  {String} label label displayed on the button
   * @param  {String} [value] value of the button
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */
  p5.prototype.createButton = function(label, value) {
    var elt = document.createElement('button');
    elt.innerHTML = label;
    elt.value = value;
    if (value) elt.value = value;
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.Element(elt);
    return c;  
  };

  /**
   * Creates an &lt;input&gt;&lt;/input&gt; element in the DOM for text input.
   * Use .size() to set the display length of the box.
   * Appends to the container node if one is specified, otherwise 
   * appends to body.
   * 
   * @for    DOM:Manipulate
   * @method createInput
   * @param  {Number} [value] default value of the input box
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */
  p5.prototype.createInput = function(value) {
    var elt = document.createElement('input');
    elt.type = 'text';
    if (value) elt.value = value;
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.Element(elt);
    return c;  
  };

  /** VIDEO STUFF **/

  /**
   * Creates an HTML5 &lt;video&gt; element in the DOM for simple playback
   * of audio/video. Shown by default, can be hidden with .hide()
   * and drawn into canvas using video(). Appends to the container
   * node if one is specified, otherwise appends to body.
   * 
   * @for    DOM:Media
   * @method createVideo
   * @param  {String} src        path to a video file
   * @param  {String} [src]      path to another format of same file 
   *                             (optional, to ensure compatability)
   * @return {Object/p5.Element} pointer to video p5.Element
   */

  p5.prototype.createVideo = function(src1, src2) {
    var elt = document.createElement('video');
    var source= document.createElement('source');
    source.src= src1;
    elt.appendChild(source);
    if (src2) {
      var source2 = document.createElement('source');
      source2.src = src2;
      elt.appendChild(source2);
    }
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.Element(elt);
    c.pixels = [];
    c.play = function() {
      c.elt.play();
    };
    c.pause = function() {
      c.elt.pause();
    };
    c.loop = function(val) {
      c.elt.setAttribute('loop', val);
    };
    c.volume = function(val) {
      c.elt.volume = val;
    };
    c.currentTime = function() {
      return c.elt.currentTime;
    };
    c.setCurrentTime = function(val) {
      c.elt.currentTime = val;
    };
    c.duration = function() {
      return c.elt.duration;
    };
    c.stop = function() {
      c.elt.pause();
      c.elt.currentTime = 0;
    };
    // c.loadPixels = function() {
    //   c.canvas = document.createElement('canvas');
    //   c.canvas.width = c.width;
    //   c.canvas.height = c.height;
    //   p5.prototype.loadPixels.call(c);
    // }
    return c;  
  };

  p5.prototype.video = function(v, x, y, w, h) {
    this._curElement.context.drawImage(v.elt, x, y, w, h);
  };


  /** AUDIO STUFF **/

  /**
   * Creates a hidden HTML5 &lt;audio&gt; element in the DOM for simple audio 
   * playback. Appends to the container node if one is specified, 
   * otherwise appends to body.
   * 
   * @for    DOM:Media
   * @method createAudio
   * @param  {String} src        path to an audio file
   * @param  {String} [src]      path to another format of same file 
   *                             (optional, to ensure compatability)
   * @return {Object/p5.Element} pointer to audio p5.Element
   */

  /**
   * Play an HTML5 media element.
   * 
   * @for    DOM:Media
   * @method play
   */

  /**
   * Pause an HTML5 media element.
   * 
   * @for    DOM:Media
   * @method pause
   */

  /**
   * Stop an HTML5 media element (sets current time to zero).
   * 
   * @for    DOM:Media
   * @method stop
   */

  /**
   * Returns the current time of an HTML5 media element.
   * 
   * @for    DOM:Media
   * @method currentTime
   * @return {Number} current time (in seconds)
   */

  /**
   * Set the current time of an HTML5 media element.
   * 
   * @for    DOM:Media
   * @method setCurrentTime
   * @param {Number} time to jump to (in seconds)
   */

  /**
   * Set 'loop' to true for an HTML5 media element.
   * 
   * @for    DOM:Media
   * @method loop
   */

  /**
   * Returns the duration of the HTML5 media element.
   * 
   * @for    DOM:Media
   * @method duration
   */


  /**
   * Set volume for this HTML5 media element.
   * 
   * @for    DOM:Media
   * @param {Number} val volume between 0.0 and 1.0
   * @method volume
   */

  p5.prototype.createAudio = function(src1, src2) {
    var elt = document.createElement('audio');
    var source= document.createElement('source');
    source.src= src1;
    elt.appendChild(source);
    if (src2) {
      var source2 = document.createElement('source');
      source2.src = src2;
      elt.appendChild(source2);
    }
    var node = this._userNode ? this._userNode : document.body;
    node.appendChild(elt);
    var c = new p5.Element(elt);
    c.play = function() {
      if (c.elt.currentTime == c.elt.duration) {
        c.elt.currentTime = 0;
      }
      c.elt.play();
    };
    c.pause = function() {
      c.elt.pause();
    };
    c.currentTime = function() {
      return c.elt.currentTime;
    };
    c.setCurrentTime = function(val) {
      c.elt.currentTime = val;
    };
    c.duration = function() {
      return c.elt.duration;
    };
    c.stop = function() {
      c.elt.pause();
      c.elt.currentTime = 0;
    };
    c.loop = function(val) {
      c.elt.loop = !c.elt.loop;
    };
    c.autoplay = function(val) {
      c.elt.setAttribute('autoplay','');
    };
    c.element = function() {
      return c.elt;
    };
    c.volume = function(val) {
      c.elt.volume = val;
    };
    c.elt.onended = function() {
      if (c.elt.loop == true) {
        c.elt.currentTime = 0;
        c.play();
      }
    }
    return c;  
  };


  /** CAMERA STUFF **/
  
  p5.prototype.VIDEO = 'video';
  p5.prototype.AUDIO = 'audio';

  navigator.getUserMedia  = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;

  /**
   * Creates a new &lt;video&gt; element that contains the audio/video feed
   * from a webcam. This can be drawn onto the canvas using video().
   *
   * @method createCapture
   * @for    DOM:Media
   * @param  {String/Constant}   type type of capture, either VIDEO or 
   *                             AUDIO if none specified, default both
   * @return {Object/p5.Element} capture video p5.Element
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
    var c = new p5.Element(elt);
    return c;  
  };

})();
