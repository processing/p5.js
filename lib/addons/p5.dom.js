/*! p5.dom.js v0.2.2 May 30, 2015 */
/**
 * <p>The web is much more than just canvas and p5.dom makes it easy to interact
 * with other HTML5 objects, including text, hyperlink, image, input, video,
 * audio, and webcam.</p>
 * <p>There is a set of creation methods, DOM manipulation methods, and
 * an extended p5.Element that supports a range of HTML elements. See the
 * <a href="https://github.com/processing/p5.js/wiki/Beyond-the-canvas">
 * beyond the canvas tutorial</a> for a full overview of how this addon works.
 *
 * <p>Methods and properties shown in black are part of the p5.js core, items in
 * blue are part of the p5.dom library. You will need to include an extra file
 * in order to access the blue functions. See the
 * <a href="http://p5js.org/libraries/#using-a-library">using a library</a>
 * section for information on how to include this library. p5.dom comes with
 * <a href="http://p5js.org/download">p5 complete</a> or you can download the single file
 * <a href="https://raw.githubusercontent.com/lmccart/p5.js/master/lib/addons/p5.dom.js">
 * here</a>.</p>
 * <p>See <a href="https://github.com/processing/p5.js/wiki/Beyond-the-canvas">tutorial: beyond the canvas]</a>
 * for more info on how to use this libary.</a>
 *
 * @module p5.dom
 * @submodule p5.dom
 * @for p5.dom
 * @main
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5.dom', ['p5'], function (p5) { (factory(p5));});
  else if (typeof exports === 'object')
    factory(require('../p5'));
  else
    factory(root['p5']);
}(this, function (p5) {
// =============================================================================
//                         p5 additions
// =============================================================================

  /**
   * Searches the page for an element with the given ID, class, or tag name (using the '#' or '.' 
   * prefixes to specify an ID or class respectively, and none for a tag) and returns it as
   * a p5.Element. If a class or tag name is given with more than 1 element, 
   * only the first element will be returned.
   * The DOM node itself can be accessed with .elt. 
   * Returns null if none found.
   *
   * @method select
   * @param  {String} name id, class, or tag name of element to search for
   * @return {Object/p5.Element|Null} p5.Element containing node found
   */
  p5.prototype.select = function (e) {
    var res;
    var str;
    if (e[0] === '.'){
      str = e.slice(1);
      res = document.getElementsByClassName(str);
      if (res) {
        return wrapElement(res[0]);
      }else {
        return null;
      }
    }else if (e[0] === '#'){
      str = e.slice(1);
      res = document.getElementById(str);
      if (res) {
        return wrapElement(res);
      }else {
        return null;
      }
    }else{
      res = document.getElementsByTagName(e);
      if (res) {
        return wrapElement(res[0]);
      }else {
        return null;
      }
    } 
  };

  /**
   * Searches the page for elements with the given class or tag name (using the '.' prefix 
   * to specify a class and no prefix for a tag) and returns them as p5.Elements 
   * in an array. 
   * The DOM node itself can be accessed with .elt. 
   * Returns null if none found.
   *
   * @method selectAll
   * @param  {String} name class or tag name of elements to search for
   * @return {Object/p5.Element|Null} p5.Element containing node found
   */
  p5.prototype.selectAll = function (e) {
    var arr = [];
    var res;
    var str;
    if (e[0] === '.'){
      str = e.slice(1);
      res = document.getElementsByClassName(str);
    }else {
      res = document.getElementsByTagName(e);
    }
    if (res) {
      for (var j = 0; j < res.length; j++) {
        var obj = wrapElement(res[j]);
        arr.push(obj);
      }
    }
    return arr;
  };

  /**
   * Helper function for getElement and getElements.
   */
  function wrapElement(elt) {
    if (elt.tagName === "VIDEO" || elt.tagName === "AUDIO") {
      return new p5.MediaElement(elt);
    } else {
      return new p5.Element(elt);
    }
  }

  /**
   * Removes all elements created by p5, except any canvas / graphics
   * elements created by createCanvas or createGraphics.
   * Event handlers are removed, and element is removed from the DOM.
   * @method removeElements
   * @example
   * <div class='norender'><code>
   * function setup() {
   *   createCanvas(100, 100);
   *   createDiv('this is some text');
   *   createP('this is a paragraph');
   * }
   * function mousePressed() {
   *   removeElements(); // this will remove the div and p, not canvas
   * }
   * </code></div>
   *
   */
  p5.prototype.removeElements = function (e) {
    for (var i=0; i<this._elements.length; i++) {
      if (!(this._elements[i].elt instanceof HTMLCanvasElement)) {
        this._elements[i].remove();
      }
    }
  };

  /**
   * Helpers for create methods.
   */
  function addElement(elt, pInst, media) {
    var node = pInst._userNode ? pInst._userNode : document.body;
    node.appendChild(elt);
    var c = media ? new p5.MediaElement(elt) : new p5.Element(elt);
    pInst._elements.push(c);
    return c;
  }

  /**
   * Creates a &lt;div&gt;&lt;/div&gt; element in the DOM with given inner HTML.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
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
      elt.innerHTML = typeof html === undefined ? "" : html;
      return addElement(elt, this);
    }
  });

  /**
   * Creates an &lt;img /&gt; element in the DOM with given src and
   * alternate text.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createImg
   * @param  {String} src src path or url for image
   * @param  {String} [alt] alternate text to be used if image does not load
   * @param  {Function} [successCallback] callback to be called once image data is loaded
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */
  p5.prototype.createImg = function() {
    var elt = document.createElement('img');
    var args = arguments;
    var self = {};
    var setAttrs = function(){
      self.width = elt.width;
      self.height = elt.height;
      if (args.length === 3 && typeof args[2] === 'function'){
        self.fn = args[2];
        self.fn();
      }
    };
    elt.src = args[0];
    if (args.length > 1 && typeof args[1] === 'string'){
      elt.alt = args[1];
    }
    if (elt.complete){
      setAttrs();
    }else{
      elt.onload = function(){
        setAttrs();
      }
    }
    self = addElement(elt, this);
    return self;
  };

  /**
   * Creates an &lt;a&gt;&lt;/a&gt; element in the DOM for including a hyperlink.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
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
    return addElement(elt, this);
  };

  /** INPUT **/


  /**
   * Creates a slider &lt;input&gt;&lt;/input&gt; element in the DOM.
   * Use .size() to set the display length of the slider.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createSlider
   * @param  {Number} min minimum value of the slider
   * @param  {Number} max maximum value of the slider
   * @param  {Number} [value] default value of the slider
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */
  p5.prototype.createSlider = function(min, max, value, step) {
    var elt = document.createElement('input');
    elt.type = 'range';
    elt.min = min;
    elt.max = max;
    if (step) elt.step = step;
    if (value) elt.value = value;
    return addElement(elt, this);
  };

  /**
   * Creates a &lt;button&gt;&lt;/button&gt; element in the DOM.
   * Use .size() to set the display size of the button.
   * Use .mousePressed() to specify behavior on press.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
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
    return addElement(elt, this);
  };

  /**
   * Creates an &lt;input&gt;&lt;/input&gt; element in the DOM for text input.
   * Use .size() to set the display length of the box.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createInput
   * @param  {Number} [value] default value of the input box
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */
  p5.prototype.createInput = function(value) {
    var elt = document.createElement('input');
    elt.type = 'text';
    if (value) elt.value = value;
    return addElement(elt, this);
  };

  /**
   * Creates an &lt;input&gt;&lt;/input&gt; element in the DOM of type 'file'.  
   * This allows users to select local files for use in a sketch.
   * 
   * @method createFileInput
   * @param  {Function} [callback] callback function for when a file loaded
   * @param  {String} [multiple] optional to allow multiple files selected
   * @return {Object/p5.Element} pointer to p5.Element holding created DOM element
   *                           
   */
  p5.prototype.createFileInput = function(callback, multiple) {

    // Is the file stuff supported?
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Yup, we're ok and make an input file selector
      var elt = document.createElement('input');
      elt.type = 'file';

      // If we get a second argument that evaluates to true
      // then we are looking for multiple files
      if (multiple) {
        // Anything gets the job done
        elt.multiple = 'multiple';
      }
     
      // Now let's handle when a file was selected
      elt.addEventListener('change', handleFileSelect, false);

      // Function to handle when a file is selected
      // We're simplifying life and assuming that we always
      // want to load every selected file
      function handleFileSelect(evt) {
        // These are the files
        var files = evt.target.files;
        // Load each one and trigger a callback
        for (var i = 0; i < files.length; i++) {
          var f = files[i];
          var reader = new FileReader();
          reader.onload = makeLoader(f);
          function makeLoader(theFile) {
            // Making a p5.File object
            var p5file = new p5.File(theFile);
            return function(e) {
              p5file.data = e.target.result;
              callback(p5file);
            };
          };
          
          // Text of data?
          // This should likely be improved
          if (f.type === 'text') {
            reader.readAsText(f);
          } else {
            reader.readAsDataURL(f);
          }
        }
      }
      return addElement(elt, this);
    } else {
      console.log('The File APIs are not fully supported in this browser. Cannot create element.');
    }
  };


  /** VIDEO STUFF **/

  function createMedia(pInst, type, src, callback) {
    var elt = document.createElement(type);
    if (typeof src === 'string') {
      src = [src];
    }
    for (var i=0; i<src.length; i++) {
      var source = document.createElement('source');
      source.src = src[i];
      elt.appendChild(source);
    }
    if (typeof callback !== 'undefined') {
      elt.addEventListener('canplaythrough', function() {
        callback();
      });
    }

    var c = addElement(elt, pInst, true);
    c.loadedmetadata = false;
    // set width and height onload metadata
    elt.addEventListener('loadedmetadata', function() {
      c.width = elt.videoWidth;
      c.height = elt.videoHeight;
      c.loadedmetadata = true;
    });

    return c;
  }
  /**
   * Creates an HTML5 &lt;video&gt; element in the DOM for simple playback
   * of audio/video. Shown by default, can be hidden with .hide()
   * and drawn into canvas using video(). Appends to the container
   * node if one is specified, otherwise appends to body. The first parameter
   * can be either a single string path to a video file, or an array of string
   * paths to different formats of the same video. This is useful for ensuring
   * that your video can play across different browsers, as each supports
   * different formats. See <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats">this
   * page for further information about supported formats.
   *
   * @method createVideo
   * @param  {String|Array} src  path to a video file, or array of paths for
   *                             supporting different browsers
   * @param  {Object} [callback] callback function to be called upon
   *                             'canplaythrough' event fire, that is, when the
   *                             browser can play the media, and estimates that
   *                             enough data has been loaded to play the media
   *                             up to its end without having to stop for
   *                             further buffering of content
   * @return {Object/p5.Element} pointer to video p5.Element
   */
  p5.prototype.createVideo = function(src, callback) {
    return createMedia(this, 'video', src, callback);
  };

  /** AUDIO STUFF **/

  /**
   * Creates a hidden HTML5 &lt;audio&gt; element in the DOM for simple audio
   * playback. Appends to the container node if one is specified,
   * otherwise appends to body. The first parameter
   * can be either a single string path to a audio file, or an array of string
   * paths to different formats of the same audio. This is useful for ensuring
   * that your audio can play across different browsers, as each supports
   * different formats. See <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats">this
   * page for further information about supported formats.
   *
   * @method createAudio
   * @param  {String|Array} src  path to an audio file, or array of paths for
   *                             supporting different browsers
   * @param  {Object} [callback] callback function to be called upon
   *                             'canplaythrough' event fire, that is, when the
   *                             browser can play the media, and estimates that
   *                             enough data has been loaded to play the media
   *                             up to its end without having to stop for
   *                             further buffering of content
   * @return {Object/p5.Element} pointer to audio p5.Element
   */
  p5.prototype.createAudio = function(src, callback) {
    return createMedia(this, 'audio', src, callback);
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
   * from a webcam. This can be drawn onto the canvas using video(). More
   * specific properties of the stream can be passing in a Constraints object.
   * See the 
   * <a href="http://w3c.github.io/mediacapture-main/getusermedia.html">W3C 
   * spec</a> for possible properties. Note that not all of these are supported
   * by all browsers.
   *
   * @method createCapture
   * @param  {String/Constant|Object}   type type of capture, either VIDEO or
   *                                    AUDIO if none specified, default both,
   *                                    or a Constraints boject
   * @param  {Function}                 callback function to be called once
   *                                    stream has loaded
   * @return {Object/p5.Element} capture video p5.Element
   * @example
   * <div><class='norender'><code>
   * var capture;
   *
   * function setup() {
   *   createCanvas(480, 120);
   *   capture = createCapture(VIDEO);
   * }
   *
   * function draw() {
   *   image(capture, 0, 0, width, width*capture.height/capture.width);
   *   filter(INVERT);
   * }
   * </code></div>
   * <div><class='norender'><code>
   * function setup() {
   *   createCanvas(480, 120);
   *   var constraints = {
   *     video: {
   *       mandatory: {
   *         minWidth: 1280,
   *         minHeight: 720
   *       },
   *       optional: [
   *         { maxFrameRate: 10 }
   *       ]
   *     },
   *     audio: true
   *   };
   *   createCapture(constraints, function(stream) {
   *     console.log(stream);
   *   });
   * }
   * </code></div>
   */
  p5.prototype.createCapture = function() {
    var useVideo = true;
    var useAudio = true;
    var constraints;
    var cb;
    for (var i=0; i<arguments.length; i++) {
      if (arguments[i] === p5.prototype.VIDEO) {
        useAudio = false;
      } else if (arguments[i] === p5.prototype.AUDIO) {
        useVideo = false;
      } else if (typeof arguments[i] === 'object') {
        constraints = arguments[i];
      } else if (typeof arguments[i] === 'function') {
        cb = arguments[i];
      }
    }

    if (navigator.getUserMedia) {
      var elt = document.createElement('video');

      if (!constraints) {
        constraints = {video: useVideo, audio: useAudio};
      }

      navigator.getUserMedia(constraints, function(stream) {
        elt.src = window.URL.createObjectURL(stream);
        elt.play();
        if (cb) {
          cb(stream);
        }
      }, function(e) { console.log(e); });
    } else {
      throw 'getUserMedia not supported in this browser';
    }
    var c = addElement(elt, this, true);
    c.loadedmetadata = false;
    // set width and height onload metadata
    elt.addEventListener('loadedmetadata', function() {
      c.width = elt.videoWidth;
      c.height = elt.videoHeight;
      c.loadedmetadata = true;
    });
    return c;
  };

  /**
   * Creates element with given tag in the DOM with given content.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createElement
   * @param  {String} tag tag for the new element
   * @param  {String} [content] html content to be inserted into the element
   * @return {Object/p5.Element} pointer to p5.Element holding created
   *                           node
   */
  p5.prototype.createElement = function(tag, content) {
    var elt = document.createElement(tag);
    if (typeof content !== 'undefined') {
      elt.innerHTML = content;
    }
    return addElement(elt, this);
  };


// =============================================================================
//                         p5.Element additions
// =============================================================================
  /**
   *
   * Adds specified class to the element.
   *
   * @for p5.Element
   * @method addClass
   * @param  {String} class name of class to add
   * @return {p5.Element}
   */
  p5.Element.prototype.addClass = function(c) {
    if (this.elt.className) {
      // PEND don't add class more than once
      //var regex = new RegExp('[^a-zA-Z\d:]?'+c+'[^a-zA-Z\d:]?');
      //if (this.elt.className.search(/[^a-zA-Z\d:]?hi[^a-zA-Z\d:]?/) === -1) {
      this.elt.className = this.elt.className+' '+c;
      //}
    } else {
      this.elt.className = c;
    }
    return this;
  }

  /**
   *
   * Removes specified class from the element.
   *
   * @method removeClass
   * @param  {String} class name of class to remove
   * @return {p5.Element}
   */
  p5.Element.prototype.removeClass = function(c) {
    var regex = new RegExp('(?:^|\\s)'+c+'(?!\\S)');
    this.elt.className = this.elt.className.replace(regex, '');
    this.elt.className = this.elt.className.replace(/^\s+|\s+$/g, ""); //prettify (optional)
    return this;
  }

  /**
   *
   * Attaches the element  as a child to the parent specified.
   * Accepts either a string ID, DOM node, or p5.Element
   *
   * @method child
   * @param  {String|Object} child the ID, DOM node, or p5.Element
   *                         to add to the current element
   * @return {p5.Element}
   * @example
   * <div class='norender'><code>
   * var div0 = createDiv('this is the parent');
   * var div1 = createDiv('this is the child');
   * div0.child(div1); // use p5.Element
   * </code></div>
   * <div class='norender'><code>
   * var div0 = createDiv('this is the parent');
   * var div1 = createDiv('this is the child');
   * div1.id('apples');
   * div0.child('apples'); // use id
   * </code></div>
   * <div class='norender'><code>
   * var div0 = createDiv('this is the parent');
   * var elt = document.getElementById('myChildDiv');
   * div0.child(elt); // use element from page
   * </code></div>
   */
  p5.Element.prototype.child = function(c) {
    if (typeof c === 'string') {
      c = document.getElementById(c);
    } else if (c instanceof p5.Element) {
      c = c.elt;
    }
    this.elt.appendChild(c);
    return this;
  };


  /**
   *
   * If an argument is given, sets the inner HTML of the element,
   * replacing any existing html. If no arguments are given, returns
   * the inner HTML of the element.
   *
   * @for p5.Element
   * @method html
   * @param  {String} [html] the HTML to be placed inside the element
   * @return {p5.Element|String}
   */
  p5.Element.prototype.html = function(html) {
    if (typeof html !== 'undefined') {
      this.elt.innerHTML = html;
      return this;
    } else {
      return this.elt.innerHTML;
    }
  };

  /**
   *
   * Sets the position of the element relative to (0, 0) of the
   * window. Essentially, sets position:absolute and left and top
   * properties of style. If no arguments given returns the x and y position
   * of the element in an object.
   *
   * @method position
   * @param  {Number} [x] x-position relative to upper left of window
   * @param  {Number} [y] y-position relative to upper left of window
   * @return {p5.Element}
   * @example
   * <div><code class='norender'>
   * function setup() {
   *   var cnv = createCanvas(100, 100);
   *   // positions canvas 50px to the right and 100px
   *   // below upper left corner of the window
   *   cnv.position(50, 100);
   * }
   * </code></div>
   */
  p5.Element.prototype.position = function() {
    if (arguments.length === 0){
      return { 'x' : this.elt.offsetLeft , 'y' : this.elt.offsetTop };
    }else{
      this.elt.style.position = 'absolute';
      this.elt.style.left = arguments[0]+'px';
      this.elt.style.top = arguments[1]+'px';
      this.x = arguments[0];
      this.y = arguments[1];
      return this;
    }
  };

  /**
   * Translates an element with css transforms in either 2d (if 2 arguments given)
   * or 3d (if 3 arguments given) space.
   * @method  translate
   * @param  {Number} x x-position in px
   * @param  {Number} y y-position in px
   * @param  {Number} [z] z-position in px
   * @param  {Number} [perspective] sets the perspective of the parent element in px,
   * default value set to 1000px
   * @return {p5.Element}
   * @example
   * <div><code class='norender'>
   * function setup() {
   *   var cnv = createCanvas(100,100);
   *   //translates canvas 50px to the right and 100px down
   *   cnv.translate(50,100);
   * }
   * </code></div>
   */
  p5.Element.prototype.translate = function(){
    this.elt.style.position = 'absolute';
    if (arguments.length === 2){
      var style = this.elt.style.transform.replace(/translate3d\(.*\)/g, '');
      style = style.replace(/translate[X-Z]?\(.*\)/g, '');
      this.elt.style.transform = 'translate('+arguments[0]+'px, '+arguments[1]+'px)';
      this.elt.style.transform += style;
    }else if (arguments.length === 3){
      var style = this.elt.style.transform.replace(/translate3d\(.*\)/g, '');
      style = style.replace(/translate[X-Z]?\(.*\)/g, '');
      this.elt.style.transform = 'translate3d('+arguments[0]+'px,'+arguments[1]+'px,'+arguments[2]+'px)';
      this.elt.style.transform += style;
      this.elt.parentElement.style.perspective = '1000px';
    }else if (arguments.length === 4){
      var style = this.elt.style.transform.replace(/translate3d\(.*\)/g, '');
      style = style.replace(/translate[X-Z]?\(.*\)/g, '');
      this.elt.style.transform = 'translate3d('+arguments[0]+'px,'+arguments[1]+'px,'+arguments[2]+'px)';
      this.elt.style.transform += style;
      this.elt.parentElement.style.perspective = arguments[3]+'px';
    }
      return this;
  };

  /**
   * Rotates an element with css transforms in either 2d (if 2 arguments given)
   * or 3d (if 3 arguments given) space.
   * @method  rotate
   * @param  {Number} x amount of degrees to rotate the element along the x-axis in deg
   * @param  {Number} y amount of degrees to rotate the element along the y-axis in deg
   * @param  {Number} [z] amount of degrees to rotate the element along the z-axis in deg
   * @return {p5.Element}
   * @example
   * <div><code class='norender'>
   * var cnv,
   *     x = 0,
   *     y = 0,
   *     z = 0;
   * function setup(){
   *   cnv = createCanvas(100,100);
   * }
   * function draw(){
   *   x+=.5 % 360;
   *   y+=.5 % 360;
   *   z+=.5 % 360;
   *   //rotates the canvas .5deg (degrees) on every axis each frame.
   *   cnv.rotate(x,y,z);
   * }
   * </code></div>
   */
  p5.Element.prototype.rotate = function(){
    if (arguments.length === 1){
      var style = this.elt.style.transform.replace(/rotate3d\(.*\)/g, '');
      style = style.replace(/rotate[X-Z]?\(.*\)/g, '');
      this.elt.style.transform = 'rotate('+arguments[0]+'deg)';
      this.elt.style.transform += style;
    }else if (arguments.length === 2){
      var style = this.elt.style.transform.replace(/rotate3d\(.*\)/g, '');
      style = style.replace(/rotate[X-Z]?\(.*\)/g, '');
      this.elt.style.transform = 'rotate('+arguments[0]+'deg, '+arguments[1]+'deg)';
      this.elt.style.transform += style;
    }else if (arguments.length === 3){
      var style = this.elt.style.transform.replace(/rotate3d\(.*\)/g, '');
      style = style.replace(/rotate[X-Z]?\(.*\)/g, '');
      this.elt.style.transform = 'rotateX('+arguments[0]+'deg)';
      this.elt.style.transform += 'rotateY('+arguments[1]+'deg)';
      this.elt.style.transform += 'rotateZ('+arguments[2]+'deg)';
      this.elt.style.transform += style;
    }
      return this;
  };

  /**
   * Sets the given style (css) property of the element with the given value.
   * If no value is specified, returns the value of the given property,
   * or undefined if the property is not.
   *
   * @method style
   * @param  {String} property   property to be set
   * @param  {String} [value]    value to assign to property
   * @return {String|p5.Element} value of property, if no value is specified
   *                             or p5.Element
   * @example
   * <div><code class="norender">
   * var myDiv = createDiv("I like pandas.");
   * myDiv.style("color", "#ff0000");
   * myDiv.style("font-size", "18px");
   * </code></div>
   */
  p5.Element.prototype.style = function(prop, val) {
    if (typeof val === 'undefined') {
      var attrs = prop.split(';');
      for (var i=0; i<attrs.length; i++) {
        var parts = attrs[i].split(':');
        if (parts[0] && parts[1]) {
          this.elt.style[parts[0].trim()] = parts[1].trim();
        }
      }
    } else {
      this.elt.style[prop] = val;
      if (prop === 'width' || prop === 'height' || prop === 'left' || prop === 'top'){
        var numVal = val.replace(/\D+/g,'');
        this[prop] = parseInt(numVal);
      }
    }
    return this;
  };


  /**
   *
   * Adds a new attribute or changes the value of an existing attribute
   * on the specified element. If no value is specified, returns the
   * value of the given attribute, or null if attribute is not set.
   *
   * @method attribute
   * @param  {String} attr       attribute to set
   * @param  {String} [value]    value to assign to attribute
   * @return {String|p5.Element} value of attribute, if no value is
   *                             specified or p5.Element
   * @example
   * <div class="norender"><code>
   * var myDiv = createDiv("I like pandas.");
   *myDiv.attribute("align", "center");
   * </code></div>
   */
  p5.Element.prototype.attribute = function(attr, value) {
    if (typeof value === 'undefined') {
      return this.elt.getAttribute(attr);
    } else {
      this.elt.setAttribute(attr, value);
      return this;
    }
  };


  /**
   * Either returns the value of the element if no arguments
   * given, or sets the value of the element.
   *
   * @method value
   * @param  {String|Number}     [value]
   * @return {String|p5.Element} value of element, if no value is
   *                             specified or p5.Element
   */
  p5.Element.prototype.value = function() {
    if (arguments.length > 0) {
      this.elt.value = arguments[0];
      return this;
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
   * @method show
   * @return {p5.Element}
   */
  p5.Element.prototype.show = function() {
    this.elt.style.display = 'block';
    return this;
  };

  /**
   * Hides the current element. Essentially, setting display:none for the style.
   *
   * @method hide
   * @return {p5.Element}
   */
  p5.Element.prototype.hide = function() {
    this.elt.style.display = 'none';
    return this;
  };

  /**
   *
   * Sets the width and height of the element. AUTO can be used to
   * only adjust one dimension. If no arguments given returns the width and height
   * of the element in an object.
   *
   * @method size
   * @param  {Number} [w] width of the element
   * @param  {Number} [h] height of the element
   * @return {p5.Element}
   */
  p5.Element.prototype.size = function(w, h) {
    if (arguments.length === 0){
      return { 'width' : this.elt.offsetWidth , 'height' : this.elt.offsetHeight };
    }else{
      var aW = w;
      var aH = h;
      var AUTO = p5.prototype.AUTO;
      if (aW !== AUTO || aH !== AUTO) {
        if (aW === AUTO) {
          aW = h * this.width / this.height;
        } else if (aH === AUTO) {
          aH = w * this.height / this.width;
        }
        // set diff for cnv vs normal div
        if (this.elt instanceof HTMLCanvasElement) {
          var j = {};
          var k  = this.elt.getContext('2d');
          for (var prop in k) {
            j[prop] = k[prop];
          }
          this.elt.setAttribute('width', aW * this._pInst._pixelDensity);
          this.elt.setAttribute('height', aH * this._pInst._pixelDensity);
          this.elt.setAttribute('style', 'width:' + aW + 'px; height:' + aH + 'px');
          this._pInst.scale(this._pInst._pixelDensity, this._pInst._pixelDensity);
          for (var prop in j) {
            this.elt.getContext('2d')[prop] = j[prop];
          }
        } else {
          this.elt.style.width = aW+'px';
          this.elt.style.height = aH+'px';
          this.elt.width = aW;
          this.elt.height = aH;
          this.width = aW;
          this.height = aH;
        }
        this.elt.style.overflow = 'hidden';
        this.width = this.elt.offsetWidth;
        this.height = this.elt.offsetHeight;

        if (this._pInst) { // main canvas associated with p5 instance
          if (this._pInst._curElement.elt === this.elt) {
            this._pInst._setProperty('width', this.elt.offsetWidth);
            this._pInst._setProperty('height', this.elt.offsetHeight);
          }
        }
      }
      return this;
    }
  };

  /**
   * Removes the element and deregisters all listeners.
   * @method remove
   * @example
   * <div class='norender'><code>
   * var myDiv = createDiv('this is some text');
   * myDiv.remove();
   * </code></div>
   */
  p5.Element.prototype.remove = function() {
    // deregister events
    for (var ev in this._events) {
      this.elt.removeEventListener(ev, this._events[ev]);
    }
    if (this.elt.parentNode) {
      this.elt.parentNode.removeChild(this.elt);
    }
    delete(this);
  };



// =============================================================================
//                         p5.MediaElement additions
// =============================================================================


  /**
   * Extends p5.Element to handle audio and video. In addition to the methods
   * of p5.Element, it also contains methods for controlling media. It is not
   * called directly, but p5.MediaElements are created by calling createVideo,
   * createAudio, and createCapture.
   *
   * @class p5.MediaElement
   * @constructor
   * @param {String} elt DOM node that is wrapped
   * @param {Object} [pInst] pointer to p5 instance
   */
  p5.MediaElement = function(elt, pInst) {
    p5.Element.call(this, elt, pInst);


    this._prevTime = 0;
    this._cueIDCounter = 0;
    this._cues = [];
    this.pixelDensity = 1;

  };
  p5.MediaElement.prototype = Object.create(p5.Element.prototype);




  /**
   * Play an HTML5 media element.
   *
   * @method play
   * @return {p5.Element}
   */
  p5.MediaElement.prototype.play = function() {
    if (this.elt.currentTime === this.elt.duration) {
      this.elt.currentTime = 0;
    }

    if (this.elt.readyState > 1) {
      this.elt.play();
    } else {
      // in Chrome, playback cannot resume after being stopped and must reload
      this.elt.load();
      this.elt.play();
    }
    return this;
  };

  /**
   * Stops an HTML5 media element (sets current time to zero).
   *
   * @method stop
   * @return {p5.Element}
   */
  p5.MediaElement.prototype.stop = function() {
    this.elt.pause();
    this.elt.currentTime = 0;
    return this;
  };

  /**
   * Pauses an HTML5 media element.
   *
   * @method pause
   * @return {p5.Element}
   */
  p5.MediaElement.prototype.pause = function() {
    this.elt.pause();
    return this;
  };

  /**
   * Set 'loop' to true for an HTML5 media element, and starts playing.
   *
   * @method loop
   * @return {p5.Element}
   */
  p5.MediaElement.prototype.loop = function() {
    this.elt.setAttribute('loop', true);
    this.play();
    return this;
  };
  /**
   * Set 'loop' to false for an HTML5 media element. Element will stop
   * when it reaches the end.
   *
   * @method noLoop
   * @return {p5.Element}
   */
  p5.MediaElement.prototype.noLoop = function() {
    this.elt.setAttribute('loop', false);
    return this;
  };


  /**
   * Set HTML5 media element to autoplay or not.
   *
   * @method autoplay
   * @param {Boolean} autoplay whether the element should autoplay
   * @return {p5.Element}
   */
  p5.MediaElement.prototype.autoplay = function(val) {
    this.elt.setAttribute('autoplay', val);
    return this;
  };

  /**
   * Sets volume for this HTML5 media element. If no argument is given,
   * returns the current volume.
   *
   * @param {Number}            [val] volume between 0.0 and 1.0
   * @return {Number|p5.MediaElement} current volume or p5.MediaElement
   * @method volume
   */
  p5.MediaElement.prototype.volume = function(val) {
    if (typeof val === 'undefined') {
      return this.elt.volume;
    } else {
      this.elt.volume = val;
    }
  };

  /**
   * If no arguments are given, returns the current time of the elmeent.
   * If an argument is given the current time of the element is set to it.
   *
   * @method time
   * @param {Number} [time] time to jump to (in seconds)
   * @return {Number|p5.MediaElement} current time (in seconds)
   *                                  or p5.MediaElement
   */
  p5.MediaElement.prototype.time = function(val) {
    if (typeof val === 'undefined') {
      return this.elt.currentTime;
    } else {
      this.elt.currentTime = val;
    }
  };

  /**
   * Returns the duration of the HTML5 media element.
   *
   * @method duration
   * @return {Number} duration
   */
  p5.MediaElement.prototype.duration = function() {
    return this.elt.duration;
  };
  p5.MediaElement.prototype.pixels = [];
  p5.MediaElement.prototype.loadPixels = function() {
    if (this.loadedmetadata) { // wait for metadata for w/h
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.drawingContext = this.canvas.getContext('2d');
      }
      this.drawingContext.drawImage(this.elt, 0, 0, this.width, this.height);
      p5.Renderer2D.prototype.loadPixels.call(this);
    }
    return this;
  }
  p5.MediaElement.prototype.updatePixels =  function(x, y, w, h){
    if (this.loadedmetadata) { // wait for metadata
      p5.Renderer2D.prototype.updatePixels.call(this, x, y, w, h);
    }
    return this;
  }
  p5.MediaElement.prototype.get = function(x, y, w, h){
    if (this.loadedmetadata) { // wait for metadata
      return p5.Renderer2D.prototype.get.call(this, x, y, w, h);
    } else return [0, 0, 0, 255];
  };
  p5.MediaElement.prototype.set = function(x, y, imgOrCol){
    if (this.loadedmetadata) { // wait for metadata
      p5.Renderer2D.prototype.set.call(this, x, y, imgOrCol);
    }
  };

  /*** CONNECT TO WEB AUDIO API / p5.sound.js ***/

  /**
   *  Send the audio output of this element to a specified audioNode or
   *  p5.sound object. If no element is provided, connects to p5's master
   *  output. That connection is established when this method is first called.
   *  All connections are removed by the .disconnect() method.
   *  
   *  This method is meant to be used with the p5.sound.js addon library.
   *
   *  @method  connect
   *  @param  {AudioNode|p5.sound object} audioNode AudioNode from the Web
   *                                      Audio API, or an object from the
   *                                      p5.sound library
   */
  p5.MediaElement.prototype.connect = function(obj) {
    var audioContext, masterOutput;

    // if p5.sound exists, same audio context
    if (typeof p5.prototype.getAudioContext === 'function') {
      audioContext = p5.prototype.getAudioContext(); 
      masterOutput = p5.soundOut.input;
    } else {
      try {
        audioContext = obj.context;
        masterOutput = audioContext.destination
      } catch(e) {
        throw 'connect() is meant to be used with Web Audio API or p5.sound.js'
      }
    }

    // create a Web Audio MediaElementAudioSourceNode if none already exists
    if (!this.audioSourceNode) {
      this.audioSourceNode = audioContext.createMediaElementSource(this.elt);

      // connect to master output when this method is first called
      this.audioSourceNode.connect(masterOutput);
    }

    // connect to object if provided
    if (obj) {
      if (obj.input) {
        this.audioSourceNode.connect(obj.input);
      } else {
        this.audioSourceNode.connect(obj);
      }
    }

    // otherwise connect to master output of p5.sound / AudioContext
    else {
      this.audioSourceNode.connect(masterOutput);
    }

  };

  /**
   *  Disconnect all Web Audio routing, including to master output.
   *  This is useful if you want to re-route the output through
   *  audio effects, for example.
   *  
   *  @method  disconnect
   */
  p5.MediaElement.prototype.disconnect = function() {
    if (this.audioSourceNode) {
      this.audioSourceNode.disconnect();
    } else {
      throw 'nothing to disconnect';
    }
  };


  /*** SHOW / HIDE CONTROLS ***/

  /**
   *  Show the default MediaElement controls, as determined by the web browser.
   *
   *  @method  showControls
   */
  p5.MediaElement.prototype.showControls = function() {
    // must set style for the element to show on the page
    this.elt.style['text-align'] = 'inherit';
    this.elt.controls = true;
  };

  /**
   *  Hide the default mediaElement controls.
   *  
   *  @method hideControls
   */
  p5.MediaElement.prototype.hideControls = function() {
    this.elt.controls = false;
  };


  /*** SCHEDULE EVENTS ***/

  /**
   *  Schedule events to trigger every time a MediaElement
   *  (audio/video) reaches a playback cue point.
   *
   *  Accepts a callback function, a time (in seconds) at which to trigger
   *  the callback, and an optional parameter for the callback.
   *
   *  Time will be passed as the first parameter to the callback function,
   *  and param will be the second parameter.
   *
   *
   *  @method  addCue
   *  @param {Number}   time     Time in seconds, relative to this media
   *                             element's playback. For example, to trigger
   *                             an event every time playback reaches two
   *                             seconds, pass in the number 2. This will be
   *                             passed as the first parameter to
   *                             the callback function.
   *  @param {Function} callback Name of a function that will be
   *                             called at the given time. The callback will
   *                             receive time and (optionally) param as its
   *                             two parameters.
   *  @param {Object} [value]    An object to be passed as the
   *                             second parameter to the
   *                             callback function.
   *  @return {Number} id ID of this cue,
   *                      useful for removeCue(id)
   *  @example
   *  <div><code>
   *  function setup() {
   *    background(255,255,255);
   *    
   *    audioEl = createAudio('assets/beat.mp3');
   *    audioEl.showControls();
   *
   *    // schedule three calls to changeBackground
   *    audioEl.addCue(0.5, changeBackground, color(255,0,0) );
   *    audioEl.addCue(1.0, changeBackground, color(0,255,0) );
   *    audioEl.addCue(2.5, changeBackground, color(0,0,255) );
   *    audioEl.addCue(3.0, changeBackground, color(0,255,255) );
   *    audioEl.addCue(4.2, changeBackground, color(255,255,0) );
   *    audioEl.addCue(5.0, changeBackground, color(255,255,0) );
   *  }
   *
   *  function changeBackground(val) {
   *    background(val);
   *  }
   *  </code></div>
   */
  p5.MediaElement.prototype.addCue = function(time, callback, val) {
    var id = this._cueIDCounter++;

    var cue = new Cue(callback, time, id, val);
    this._cues.push(cue);

    if (!this.elt.ontimeupdate) {
      this.elt.ontimeupdate = this._onTimeUpdate.bind(this);
    }

    return id;
  };

  /**
   *  Remove a callback based on its ID. The ID is returned by the
   *  addCue method.
   *
   *  @method removeCue
   *  @param  {Number} id ID of the cue, as returned by addCue
   */
  p5.MediaElement.prototype.removeCue = function(id) {
    for (var i = 0; i < this._cues.length; i++) {
      var cue = this._cues[i];
      if (cue.id === id) {
        this.cues.splice(i, 1);
      }
    }

    if (this._cues.length === 0) {
      this.elt.ontimeupdate = null
    }
  };

  /**
   *  Remove all of the callbacks that had originally been scheduled
   *  via the addCue method.
   *
   *  @method  clearCues
   */
  p5.MediaElement.prototype.clearCues = function() {
    this._cues = [];
    this.elt.ontimeupdate = null;
  };

  // private method that checks for cues to be fired if events
  // have been scheduled using addCue(callback, time).
  p5.MediaElement.prototype._onTimeUpdate = function() {
    var playbackTime = this.time();

    for (var i = 0 ; i < this._cues.length; i++) {
      var callbackTime = this._cues[i].time;
      var val = this._cues[i].val;


      if (this._prevTime < callbackTime && callbackTime <= playbackTime) {

        // pass the scheduled callbackTime as parameter to the callback
        this._cues[i].callback(val);
      }

    }

    this._prevTime = playbackTime;
  };


  // Cue inspired by JavaScript setTimeout, and the
  // Tone.js Transport Timeline Event, MIT License Yotam Mann 2015 tonejs.org
  var Cue = function(callback, time, id, val) {
    this.callback = callback;
    this.time = time;
    this.id = id;
    this.val = val;
  };

// =============================================================================
//                         p5.File
// =============================================================================


  /**
   * Base class for a file
   * Using this for createFileInput
   *
   * @class p5.File
   * @constructor
   * @param {File} file File that is wrapped
   * @param {Object} [pInst] pointer to p5 instance
   */
  p5.File = function(file, pInst) {
    /**
     * Underlying File object. All normal File methods can be called on this.
     *
     * @property file
     */
    this.file = file;

    this._pInst = pInst;

    // Splitting out the file type into two components
    // This makes determining if image or text etc simpler
    var typeList = file.type.split('/');
    /**
     * File type (image, text, etc.)
     *
     * @property type
     */
    this.type = typeList[0];
    /**
     * File subtype (usually the file extension jpg, png, xml, etc.)
     *
     * @property subtype
     */
    this.subtype = typeList[1];
    /**
     * File name
     *
     * @property name
     */
    this.name = file.name;
    /**
     * File size
     *
     * @property size
     */
    this.size = file.size;
    
    // Data not loaded yet
    this.data = undefined;
  };

}));