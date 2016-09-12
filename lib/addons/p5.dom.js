/*! p5.dom.js v0.2.12 August 17, 2016 */
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
 * <p>See <a href="https://github.com/processing/p5.js/wiki/Beyond-the-canvas">tutorial: beyond the canvas</a>
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
   * Returns null if none found. You can also specify a container to search within.
   *
   * @method select
   * @param  {String} name id, class, or tag name of element to search for
   * @param  {String} [container] id, p5.Element, or HTML element to search within
   * @return {Object/p5.Element|Null} p5.Element containing node found
   * @example
   * <div ><code class='norender'>
   * function setup() {
   *   createCanvas(100,100);
   *   //translates canvas 50px down
   *   select('canvas').position(100, 100);
   * }
   * </code></div>
   * <div ><code class='norender'>
   * // these are all valid calls to select()
   * var a = select('#moo');
   * var b = select('#blah', '#myContainer');
   * var c = select('#foo', b);
   * var d = document.getElementById('beep');
   * var e = select('p', d);
   * </code></div>
   *
   */
  p5.prototype.select = function (e, p) {
    var res = null;
    var container = getContainer(p);
    if (e[0] === '.'){
      e = e.slice(1);
      res = container.getElementsByClassName(e);
      if (res.length) {
        res = res[0];
      } else {
        res = null;
      }
    }else if (e[0] === '#'){
      e = e.slice(1);
      res = container.getElementById(e);
    }else {
      res = container.getElementsByTagName(e);
      if (res.length) {
        res = res[0];
      } else {
        res = null;
      }
    }
    if (res) {
      return wrapElement(res);
    } else {
      return null;
    }
  };

  /**
   * Searches the page for elements with the given class or tag name (using the '.' prefix
   * to specify a class and no prefix for a tag) and returns them as p5.Elements
   * in an array.
   * The DOM node itself can be accessed with .elt.
   * Returns an empty array if none found.
   * You can also specify a container to search within.
   *
   * @method selectAll
   * @param  {String} name class or tag name of elements to search for
   * @param  {String} [container] id, p5.Element, or HTML element to search within
   * @return {Array} Array of p5.Elements containing nodes found
   * @example
   * <div class='norender'><code>
   * function setup() {
   *   createButton('btn');
   *   createButton('2nd btn');
   *   createButton('3rd btn');
   *   var buttons = selectAll('button');
   *
   *   for (var i = 0; i < buttons.length; i++){
   *     buttons[i].size(100,100);
   *   }
   * }
   * </code></div>
   * <div class='norender'><code>
   * // these are all valid calls to selectAll()
   * var a = selectAll('.moo');
   * var b = selectAll('div');
   * var c = selectAll('button', '#myContainer');
   * var d = select('#container');
   * var e = selectAll('p', d);
   * var f = document.getElementById('beep');
   * var g = select('.blah', f);
   * </code></div>
   *
   */
  p5.prototype.selectAll = function (e, p) {
    var arr = [];
    var res;
    var container = getContainer(p);
    if (e[0] === '.'){
      e = e.slice(1);
      res = container.getElementsByClassName(e);
    } else {
      res = container.getElementsByTagName(e);
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
   * Helper function for select and selectAll
   */
  function getContainer(p) {
    var container = document;
    if (typeof p === 'string' && p[0] === '#'){
      p = p.slice(1);
      container = document.getElementById(p) || document;
    } else if (p instanceof p5.Element){
      container = p.elt;
    } else if (p instanceof HTMLElement){
      container = p;
    }
    return container;
  }

  /**
   * Helper function for getElement and getElements.
   */
  function wrapElement(elt) {
    if(elt.tagName === "INPUT" && elt.type === "checkbox") {
      var converted = new p5.Element(elt);
      converted.checked = function(){
      if (arguments.length === 0){
        return this.elt.checked;
      } else if(arguments[0]) {
        this.elt.checked = true;
      } else {
        this.elt.checked = false;
      }
      return this;
      };
      return converted;
    } else if (elt.tagName === "VIDEO" || elt.tagName === "AUDIO") {
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
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div class='norender'><code>
   * var myDiv;
   * function setup() {
   *   myDiv = createDiv('this is some text');
   * }
   * </code></div>
   */

  /**
   * Creates a &lt;p&gt;&lt;/p&gt; element in the DOM with given inner HTML. Used
   * for paragraph length text.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createP
   * @param  {String} html inner HTML for element created
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div class='norender'><code>
   * var myP;
   * function setup() {
   *   myP = createP('this is some text');
   * }
   * </code></div>
   */

  /**
   * Creates a &lt;span&gt;&lt;/span&gt; element in the DOM with given inner HTML.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createSpan
   * @param  {String} html inner HTML for element created
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div class='norender'><code>
   * var mySpan;
   * function setup() {
   *   mySpan = createSpan('this is some text');
   * }
   * </code></div>
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
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div class='norender'><code>
   * var img;
   * function setup() {
   *   img = createImg('http://p5js.org/img/asterisk-01.png');
   * }
   * </code></div>
   */
  p5.prototype.createImg = function() {
    var elt = document.createElement('img');
    var args = arguments;
    var self;
    var setAttrs = function(){
      self.width = elt.offsetWidth;
      self.height = elt.offsetHeight;
      if (args.length > 1 && typeof args[1] === 'function'){
        self.fn = args[1];
        self.fn();
      }else if (args.length > 1 && typeof args[2] === 'function'){
        self.fn = args[2];
        self.fn();
      }
    };
    elt.src = args[0];
    if (args.length > 1 && typeof args[1] === 'string'){
      elt.alt = args[1];
    }
    elt.onload = function(){
      setAttrs();
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
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div class='norender'><code>
   * var myLink;
   * function setup() {
   *   myLink = createA('http://p5js.org/', 'this is a link');
   * }
   * </code></div>
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
   * @param  {Number} [step] step size for each tick of the slider
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div><code>
   * var slider;
   * function setup() {
   *   slider = createSlider(0, 255, 100);
   *   slider.position(10, 10);
   *   slider.style('width', '80px');
   * }
   *
   * function draw() {
   *   var val = slider.value();
   *   background(val);
   * }
   * </code></div>
   *
   * <div><code>
   * var slider;
   * function setup() {
   *   colorMode(HSB);
   *   slider = createSlider(0, 360, 60, 40);
   *   slider.position(10, 10);
   *   slider.style('width', '80px');
   * }
   *
   * function draw() {
   *   var val = slider.value();
   *   background(val, 100, 100, 1);
   * }
   * </code></div>
   */
  p5.prototype.createSlider = function(min, max, value, step) {
    var elt = document.createElement('input');
    elt.type = 'range';
    elt.min = min;
    elt.max = max;
    if (step) elt.step = step;
    if (typeof(value) === "number") elt.value = value;
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
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div class='norender'><code>
   * var button;
   * function setup() {
   *   createCanvas(100, 100);
   *   background(0);
   *   button = createButton('click me');
   *   button.position(19, 19);
   *   button.mousePressed(changeBG);
   * }
   *
   * function changeBG() {
   *   var val = random(255);
   *   background(val);
   * }
   * </code></div>
   */
  p5.prototype.createButton = function(label, value) {
    var elt = document.createElement('button');
    elt.innerHTML = label;
    elt.value = value;
    if (value) elt.value = value;
    return addElement(elt, this);
  };

  /**
   * Creates a checkbox &lt;input&gt;&lt;/input&gt; element in the DOM.
   * Calling .checked() on a checkbox returns if it is checked or not
   *
   * @method createCheckbox
   * @param  {String} [label] label displayed after checkbox
   * @param  {boolean} [value] value of the checkbox; checked is true, unchecked is false.Unchecked if no value given
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div class='norender'><code>
   * var checkbox;
   *
   * function setup() {
   *   checkbox = createCheckbox('label', false);
   *   checkbox.changed(myCheckedEvent);
   * }
   *
   * function myCheckedEvent() {
   *   if (this.checked()) {
   *     console.log("Checking!");
   *   } else {
   *     console.log("Unchecking!");
   *   }
   * }
   * </code></div>
   */
  p5.prototype.createCheckbox = function() {
    var elt = document.createElement('div');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    elt.appendChild(checkbox);
    //checkbox must be wrapped in p5.Element before label so that label appears after
    var self = addElement(elt, this);
    self.checked = function(){
      var cb = self.elt.getElementsByTagName('input')[0];
      if (cb) {
        if (arguments.length === 0){
          return cb.checked;
        }else if(arguments[0]){
          cb.checked = true;
        }else{
          cb.checked = false;
        }
      }
      return self;
    };
    this.value = function(val){
      self.value = val;
      return this;
    };
    if (arguments[0]){
      var ran = Math.random().toString(36).slice(2);
      var label = document.createElement('label');
      checkbox.setAttribute('id', ran);
      label.htmlFor = ran;
      self.value(arguments[0]);
      label.appendChild(document.createTextNode(arguments[0]));
      elt.appendChild(label);
    }
    if (arguments[1]){
      checkbox.checked = true;
    }
    return self;
  };

  /**
   * Creates a dropdown menu &lt;select&gt;&lt;/select&gt; element in the DOM.
   * @method createSelect
   * @param {boolean} [multiple] [true if dropdown should support multiple selections]
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div><code>
   * var sel;
   *
   * function setup() {
   *   textAlign(CENTER);
   *   background(200);
   *   sel = createSelect();
   *   sel.position(10, 10);
   *   sel.option('pear');
   *   sel.option('kiwi');
   *   sel.option('grape');
   *   sel.changed(mySelectEvent);
   * }
   *
   * function mySelectEvent() {
   *   var item = sel.value();
   *   background(200);
   *   text("it's a "+item+"!", 50, 50);
   * }
   * </code></div>
   */
  p5.prototype.createSelect = function(mult) {
    var elt = document.createElement('select');
    if (mult){
      elt.setAttribute('multiple', 'true');
    }
    var self = addElement(elt, this);
    self.option = function(name, value){
      var opt = document.createElement('option');
      opt.innerHTML = name;
      if (arguments.length > 1)
        opt.value = value;
      else
        opt.value = name;
      elt.appendChild(opt);
    };
    self.selected = function(value){
      var arr = [];
      if (arguments.length > 0){
        for (var i = 0; i < this.elt.length; i++){
          if (value.toString() === this.elt[i].value){
            this.elt.selectedIndex = i;
          }
        }
        return this;
      }else{
        if (mult){
          for (var i = 0; i < this.elt.selectedOptions.length; i++){
            arr.push(this.elt.selectedOptions[i].value);
          }
          return arr;
        }else{
          return this.elt.value;
        }
      }
    };
    return self;
  };

  /**
   * Creates a radio button &lt;input&gt;&lt;/input&gt; element in the DOM.
   * The .option() method can be used to set options for the radio after it is
   * created. The .value() method will return the currently selected option.
   *
   * @method createRadio
   * @param  {String} [divId] the id and name of the created div and input field respectively
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div><code>
   * var radio;
   *
   * function setup() {
   *   radio = createRadio();
   *   radio.option("black");
   *   radio.option("white");
   *   radio.option("gray");
   *   radio.style('width', '60px');
   *   textAlign(CENTER);
   *   fill(255, 0, 0);
   * }
   *
   * function draw() {
   *   var val = radio.value();
   *   background(val);
   *   text(val, width/2, height/2);
   * }
   * </code></div>
   * <div><code>
   * var radio;
   *
   * function setup() {
   *   radio = createRadio();
   *   radio.option('apple', 1);
   *   radio.option('bread', 2);
   *   radio.option('juice', 3);
   *   radio.style('width', '60px');
   *   textAlign(CENTER);
   * }
   *
   * function draw() {
   *   background(200);
   *   var val = radio.value();
   *   if (val) {
   *     text('item cost is $'+val, width/2, height/2);
   *   }
   * }
   * </code></div>
   */
  p5.prototype.createRadio = function() {
    var radios = document.querySelectorAll("input[type=radio]");
    var count = 0;
    if(radios.length > 1){
      var length = radios.length;
      var prev=radios[0].name;
      var current = radios[1].name;
      count = 1;
      for(var i = 1; i < length; i++) {
        current = radios[i].name;
        if(prev != current){
          count++;
        }
        prev = current;
      }
    }
    else if (radios.length == 1){
      count = 1;
    }
    var elt = document.createElement('div');
    var self = addElement(elt, this);
    var times = -1;
    self.option = function(name, value){
      var opt = document.createElement('input');
      opt.type = 'radio';
      opt.innerHTML = name;
      if (arguments.length > 1)
        opt.value = value;
      else
        opt.value = name;
      opt.setAttribute('name',"defaultradio"+count);
      elt.appendChild(opt);
      if (name){
        times++;
        var ran = Math.random().toString(36).slice(2);
        var label = document.createElement('label');
        opt.setAttribute('id', "defaultradio"+count+"-"+times);
        label.htmlFor = "defaultradio"+count+"-"+times;
        label.appendChild(document.createTextNode(name));
        elt.appendChild(label);
      }
      return opt;
    };
    self.selected = function(){
      var length = this.elt.childNodes.length;
      if(arguments.length == 1) {
        for (var i = 0; i < length; i+=2){
          if(this.elt.childNodes[i].value == arguments[0])
            this.elt.childNodes[i].checked = true;
        }
        return this;
      } else {
        for (var i = 0; i < length; i+=2){
          if(this.elt.childNodes[i].checked == true)
            return this.elt.childNodes[i].value;
        }
      }
    };
    self.value = function(){
      var length = this.elt.childNodes.length;
      if(arguments.length == 1) {
        for (var i = 0; i < length; i+=2){
          if(this.elt.childNodes[i].value == arguments[0])
            this.elt.childNodes[i].checked = true;
        }
        return this;
      } else {
        for (var i = 0; i < length; i+=2){
          if(this.elt.childNodes[i].checked == true)
            return this.elt.childNodes[i].value;
        }
        return "";
      }
    };
    return self
  };

  /**
   * Creates an &lt;input&gt;&lt;/input&gt; element in the DOM for text input.
   * Use .size() to set the display length of the box.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createInput
   * @param  {Number} [value] default value of the input box
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div class='norender'><code>
   * function setup(){
   *   var inp = createInput('');
   *   inp.input(myInputEvent);
   * }
   *
   * function myInputEvent(){
   *   console.log('you are typing: ', this.value());
   * }
   *
   * </code></div>
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
          function makeLoader(theFile) {
            // Making a p5.File object
            var p5file = new p5.File(theFile);
            return function(e) {
              p5file.data = e.target.result;
              callback(p5file);
            };
          };
          reader.onload = makeLoader(f);

          // Text or data?
          // This should likely be improved
          if (f.type.indexOf('text') > -1) {
            reader.readAsText(f);
          } else {
            reader.readAsDataURL(f);
          }
        }
      }

      // Now let's handle when a file was selected
      elt.addEventListener('change', handleFileSelect, false);
      return addElement(elt, this);
    } else {
      console.log('The File APIs are not fully supported in this browser. Cannot create element.');
    }
  };


  /** VIDEO STUFF **/

  function createMedia(pInst, type, src, callback) {
    var elt = document.createElement(type);

    // allow src to be empty
    var src = src || '';
    if (typeof src === 'string') {
      src = [src];
    }
    for (var i=0; i<src.length; i++) {
      var source = document.createElement('source');
      source.src = src[i];
      elt.appendChild(source);
    }
    if (typeof callback !== 'undefined') {
      var callbackHandler = function() {
        callback();
        elt.removeEventListener('canplaythrough', callbackHandler);
      }
      elt.addEventListener('canplaythrough', callbackHandler);
    }

    var c = addElement(elt, pInst, true);
    c.loadedmetadata = false;
    // set width and height onload metadata
    elt.addEventListener('loadedmetadata', function() {
      c.width = elt.videoWidth;
      c.height = elt.videoHeight;
      // set elt width and height if not set
      if (c.elt.width === 0) c.elt.width = elt.videoWidth;
      if (c.elt.height === 0) c.elt.height = elt.videoHeight;
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
   * page</a> for further information about supported formats.
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
   * page for further information about supported formats</a>.
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
   * <p>Creates a new &lt;video&gt; element that contains the audio/video feed
   * from a webcam. This can be drawn onto the canvas using video().</p>
   * <p>More specific properties of the feed can be passing in a Constraints object.
   * See the
   * <a href="http://w3c.github.io/mediacapture-main/getusermedia.html#media-track-constraints"> W3C
   * spec</a> for possible properties. Note that not all of these are supported
   * by all browsers.</p>
   * <p>Security note: A new browser security specification requires that getUserMedia,
   * which is behind createCapture(), only works when you're running the code locally,
   * or on HTTPS. Learn more <a href="http://stackoverflow.com/questions/34197653/getusermedia-in-chrome-47-without-using-https">here</a>
   * and <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia">here</a>.</p>
   *
   * @method createCapture
   * @param  {String|Constant|Object}   type type of capture, either VIDEO or
   *                                    AUDIO if none specified, default both,
   *                                    or a Constraints object
   * @param  {Function}                 callback function to be called once
   *                                    stream has loaded
   * @return {Object/p5.Element} capture video p5.Element
   * @example
   * <div class='norender'><code>
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
   * <div class='norender'><code>
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
      elt.play();
      c.width = c.elt.width = elt.videoWidth;
      c.height = c.elt.height = elt.videoHeight;
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
   * @return {Object/p5.Element} pointer to p5.Element holding created node
   * @example
   * <div class='norender'><code>
   * var h2 = createElement('h2','im an h2 p5.element!');
   * </code></div>
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
   * @return {Object/p5.Element}
   * @example
   * <div class='norender'><code>
   * var div = createDiv('div');
   * div.addClass('myClass');
   * </code></div>
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
   * @return {Object/p5.Element}
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
   * Accepts either a string ID, DOM node, or p5.Element.
   * If no argument is specified, an array of children DOM nodes is returned.
   *
   * @method child
   * @param  {String|Object|p5.Element} [child] the ID, DOM node, or p5.Element
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
    if (c === null){
      return this.elt.childNodes
    }
    if (typeof c === 'string') {
      if (c[0] === '#') {
        c = c.substring(1);
      }
      c = document.getElementById(c);
    } else if (c instanceof p5.Element) {
      c = c.elt;
    }
    this.elt.appendChild(c);
    return this;
  };

  /**
   * Centers a p5 Element either vertically, horizontally,
   * or both, relative to its parent or according to
   * the body if the Element has no parent. If no argument is passed
   * the Element is aligned both vertically and horizontally.
   *
   * @param  {String} align       passing 'vertical', 'horizontal' aligns element accordingly
   * @return {Object/p5.Element} pointer to p5.Element
   * @example
   * <div><code>
   * function setup() {
   *   var div = createDiv('').size(10,10);
   *   div.style('background-color','orange');
   *   div.center();
   *
   * }
   * </code></div>
   */
  p5.Element.prototype.center = function(align) {
    var style = this.elt.style.display;
    var hidden = this.elt.style.display === 'none';
    var parentHidden = this.parent().style.display === 'none';
    var pos = { x : this.elt.offsetLeft, y : this.elt.offsetTop };

    if (hidden) this.show();

    this.elt.style.display = 'block';
    this.position(0,0);

    if (parentHidden) this.parent().style.display = 'block';

    var wOffset = Math.abs(this.parent().offsetWidth - this.elt.offsetWidth);
    var hOffset = Math.abs(this.parent().offsetHeight - this.elt.offsetHeight);
    var y = pos.y;
    var x = pos.x;

    if (align === 'both' || align === undefined){
      this.position(wOffset/2, hOffset/2);
    }else if (align === 'horizontal'){
      this.position(wOffset/2, y);
    }else if (align === 'vertical'){
      this.position(x, hOffset/2);
    }

    this.style('display', style);

    if (hidden) this.hide();

    if (parentHidden) this.parent().style.display = 'none';

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
   * @return {Object/p5.Element|String}
   * @example
   * <div class='norender'><code>
   * var div = createDiv('').size(100,100);
   * div.style('background-color','orange');
   * div.html('hi');
   * </code></div>
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
   * @return {Object/p5.Element}
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

  /* Helper method called by p5.Element.style() */
  p5.Element.prototype._translate = function(){
    this.elt.style.position = 'absolute';
    // save out initial non-translate transform styling
    var transform = '';
    if (this.elt.style.transform) {
      transform = this.elt.style.transform.replace(/translate3d\(.*\)/g, '');
      transform = transform.replace(/translate[X-Z]?\(.*\)/g, '');
    }
    if (arguments.length === 2) {
      this.elt.style.transform = 'translate('+arguments[0]+'px, '+arguments[1]+'px)';
    } else if (arguments.length > 2) {
      this.elt.style.transform = 'translate3d('+arguments[0]+'px,'+arguments[1]+'px,'+arguments[2]+'px)';
      if (arguments.length === 3) {
        this.elt.parentElement.style.perspective = '1000px';
      } else {
        this.elt.parentElement.style.perspective = arguments[3]+'px';
      }
    }
    // add any extra transform styling back on end
    this.elt.style.transform += transform;
    return this;
  };

  /* Helper method called by p5.Element.style() */
  p5.Element.prototype._rotate = function(){
    // save out initial non-rotate transform styling
    var transform = '';
    if (this.elt.style.transform) {
      var transform = this.elt.style.transform.replace(/rotate3d\(.*\)/g, '');
      transform = transform.replace(/rotate[X-Z]?\(.*\)/g, '');
    }

    if (arguments.length === 1){
      this.elt.style.transform = 'rotate('+arguments[0]+'deg)';
    }else if (arguments.length === 2){
      this.elt.style.transform = 'rotate('+arguments[0]+'deg, '+arguments[1]+'deg)';
    }else if (arguments.length === 3){
      this.elt.style.transform = 'rotateX('+arguments[0]+'deg)';
      this.elt.style.transform += 'rotateY('+arguments[1]+'deg)';
      this.elt.style.transform += 'rotateZ('+arguments[2]+'deg)';
    }
    // add remaining transform back on
    this.elt.style.transform += transform;
    return this;
  };

  /**
   * Sets the given style (css) property (1st arg) of the element with the
   * given value (2nd arg). If a single argument is given, .style()
   * returns the value of the given property; however, if the single argument
   * is given in css syntax ('text-align:center'), .style() sets the css
   * appropriatly. .style() also handles 2d and 3d css transforms. If
   * the 1st arg is 'rotate', 'translate', or 'position', the following arguments
   * accept Numbers as values. ('translate', 10, 100, 50);
   *
   * @method style
   * @param  {String} property   property to be set
   * @param  {String|Number|p5.Color} [value]   value to assign to property
   * @param  {String|Number} [value]   value to assign to property (rotate/translate)
   * @param  {String|Number} [value]   value to assign to property (rotate/translate)
   * @param  {String|Number} [value]   value to assign to property (translate)
   * @return {String|Object/p5.Element} value of property, if no value is specified
   * or p5.Element
   * @example
   * <div><code class="norender">
   * var myDiv = createDiv("I like pandas.");
   * myDiv.style("font-size", "18px");
   * myDiv.style("color", "#ff0000");
   * </code></div>
   * <div><code class="norender">
   * var col = color(25,23,200,50);
   * var button = createButton("button");
   * button.style("background-color", col);
   * button.position(10, 10);
   * </code></div>
   * <div><code class="norender">
   * var myDiv = createDiv("I like lizards.");
   * myDiv.style("position", 20, 20);
   * myDiv.style("rotate", 45);
   * </code></div>
   * <div><code class="norender">
   * var myDiv;
   * function setup() {
   *   background(200);
   *   myDiv = createDiv("I like gray.");
   *   myDiv.position(20, 20);
   * }
   *
   * function draw() {
   *   myDiv.style("font-size", mouseX+"px");
   * }
   * </code></div>
   */
  p5.Element.prototype.style = function(prop, val) {
    var self = this;

    if (val instanceof p5.Color) {
      val = 'rgba(' + val.levels[0] + ',' + val.levels[1] + ',' + val.levels[2] + ',' + val.levels[3]/255 + ')'
    }

    if (typeof val === 'undefined') {
      if (prop.indexOf(':') === -1) {
        var styles = window.getComputedStyle(self.elt);
        var style = styles.getPropertyValue(prop);
        return style;
      } else {
        var attrs = prop.split(';');
        for (var i = 0; i < attrs.length; i++) {
          var parts = attrs[i].split(':');
          if (parts[0] && parts[1]) {
            this.elt.style[parts[0].trim()] = parts[1].trim();
          }
        }
      }
    } else {
      if (prop === 'rotate' || prop === 'translate' || prop === 'position'){
        var trans = Array.prototype.shift.apply(arguments);
        var f = this[trans] || this['_'+trans];
        f.apply(this, arguments);
      } else {
        this.elt.style[prop] = val;
        if (prop === 'width' || prop === 'height' || prop === 'left' || prop === 'top') {
          var numVal = val.replace(/\D+/g, '');
          this[prop] = parseInt(numVal, 10); // pend: is this necessary?
        }
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
   * @return {String|Object/p5.Element} value of attribute, if no value is
   *                             specified or p5.Element
   * @example
   * <div class="norender"><code>
   * var myDiv = createDiv("I like pandas.");
   * myDiv.attribute("align", "center");
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
   *
   * Removes an attribute on the specified element.
   *
   * @method removeAttribute
   * @param  {String} attr       attribute to remove
   * @return {Object/p5.Element}
   *
   * @example
   * <div><code>
   * var button;
   * var checkbox;
   *
   * function setup() {
   *   checkbox = createCheckbox('enable', true);
   *   checkbox.changed(enableButton);
   *   button = createButton('button');
   *   button.position(10, 10);
   * }
   *
   * function enableButton() {
   *   if( this.checked() ) {
   *     // Re-enable the button
   *     button.removeAttribute('disabled');
   *   } else {
   *     // Disable the button
   *     button.attribute('disabled','');
   *   }
   * }
   * </code></div>
   */
  p5.Element.prototype.removeAttribute = function(attr) {
    this.elt.removeAttribute(attr);
    return this;
  };


  /**
   * Either returns the value of the element if no arguments
   * given, or sets the value of the element.
   *
   * @method value
   * @param  {String|Number}     [value]
   * @return {String|Object/p5.Element} value of element if no value is specified or p5.Element
   * @example
   * <div class='norender'><code>
   * // gets the value
   * var inp;
   * function setup() {
   *   inp = createInput('');
   * }
   *
   * function mousePressed() {
   *   print(inp.value());
   * }
   * </code></div>
   * <div class='norender'><code>
   * // sets the value
   * var inp;
   * function setup() {
   *   inp = createInput('myValue');
   * }
   *
   * function mousePressed() {
   *   inp.value("myValue");
   * }
   * </code></div>
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
   * @return {Object/p5.Element}
   * @example
   * <div class='norender'><code>
   * var div = createDiv('div');
   * div.style("display", "none");
   * div.show(); // turns display to block
   * </code></div>
   */
  p5.Element.prototype.show = function() {
    this.elt.style.display = 'block';
    return this;
  };

  /**
   * Hides the current element. Essentially, setting display:none for the style.
   *
   * @method hide
   * @return {Object/p5.Element}
   * @example
   * <div class='norender'><code>
   * var div = createDiv('this is a div');
   * div.hide();
   * </code></div>
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
   * @return {Object/p5.Element}
   * @example
   * <div class='norender'><code>
   * var div = createDiv('this is a div');
   * div.size(100, 100);
   * </code></div>
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

    var self = this;
    this.elt.crossOrigin = 'anonymous';

    this._prevTime = 0;
    this._cueIDCounter = 0;
    this._cues = [];
    this._pixelDensity = 1;

    /**
     *  Path to the media element source.
     *
     *  @property src
     *  @return {String} src
     */
    Object.defineProperty(self, 'src', {
      get: function() {
        var firstChildSrc = self.elt.children[0].src;
        var srcVal = self.elt.src === window.location.href ? '' : self.elt.src;
        var ret = firstChildSrc === window.location.href ? srcVal : firstChildSrc;
        return ret;
      },
      set: function(newValue) {
        for (var i = 0; i < self.elt.children.length; i++) {
          self.elt.removeChild(self.elt.children[i]);
        }
        var source = document.createElement('source');
        source.src = newValue;
        elt.appendChild(source);
        self.elt.src = newValue;
      },
    });

    // private _onended callback, set by the method: onended(callback)
    self._onended = function() {};
    self.elt.onended = function() {
      self._onended(self);
    }
  };
  p5.MediaElement.prototype = Object.create(p5.Element.prototype);




  /**
   * Play an HTML5 media element.
   *
   * @method play
   * @return {Object/p5.Element}
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
   * @return {Object/p5.Element}
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
   * @return {Object/p5.Element}
   */
  p5.MediaElement.prototype.pause = function() {
    this.elt.pause();
    return this;
  };

  /**
   * Set 'loop' to true for an HTML5 media element, and starts playing.
   *
   * @method loop
   * @return {Object/p5.Element}
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
   * @return {Object/p5.Element}
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
   * @return {Object/p5.Element}
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
   * If no arguments are given, returns the current playback speed of the
   * element. The speed parameter sets the speed where 2.0 will play the
   * element twice as fast, 0.5 will play at half the speed, and -1 will play
   * the element in normal speed in reverse.(Note that not all browsers support
   * backward playback and even if they do, playback might not be smooth.)
   *
   * @method speed
   * @param {Number} [speed]  speed multiplier for element playback
   * @return {Number|Object/p5.MediaElement} current playback speed or p5.MediaElement
   */
  p5.MediaElement.prototype.speed = function(val) {
    if (typeof val === 'undefined') {
      return this.elt.playbackRate;
    } else {
      this.elt.playbackRate = val;
    }
  };

  /**
   * If no arguments are given, returns the current time of the element.
   * If an argument is given the current time of the element is set to it.
   *
   * @method time
   * @param {Number} [time] time to jump to (in seconds)
   * @return {Number|Object/p5.MediaElement} current time (in seconds)
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
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.drawingContext = this.canvas.getContext('2d');
    }
    if (this.loadedmetadata) { // wait for metadata for w/h
      if (this.canvas.width !== this.elt.width) {
        this.canvas.width = this.elt.width;
        this.canvas.height = this.elt.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
      }
      this.drawingContext.drawImage(this.elt, 0, 0, this.canvas.width, this.canvas.height);
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
    } else if (!x) {
      return new p5.Image(1, 1);
    } else {
      return [0, 0, 0, 255];
    }
  };
  p5.MediaElement.prototype.set = function(x, y, imgOrCol){
    if (this.loadedmetadata) { // wait for metadata
      p5.Renderer2D.prototype.set.call(this, x, y, imgOrCol);
    }
  };
  p5.MediaElement.prototype.copy = function(){
    p5.Renderer2D.prototype.copy.apply(this, arguments);
  };
  p5.MediaElement.prototype.mask = function(){
    this.loadPixels();
    p5.Image.prototype.mask.apply(this, arguments);
  };
  /**
   *  Schedule an event to be called when the audio or video
   *  element reaches the end. If the element is looping,
   *  this will not be called. The element is passed in
   *  as the argument to the onended callback.
   *
   *  @method  onended
   *  @param  {Function} callback function to call when the
   *                              soundfile has ended. The
   *                              media element will be passed
   *                              in as the argument to the
   *                              callback.
   *  @return {Object/p5.MediaElement}
   *  @example
   *  <div><code>
   *  function setup() {
   *    audioEl = createAudio('assets/beat.mp3');
   *    audioEl.showControls(true);
   *    audioEl.onended(sayDone);
   *  }
   *
   *  function sayDone(elt) {
   *    alert('done playing ' + elt.src );
   *  }
   *  </code></div>
   */
  p5.MediaElement.prototype.onended = function(callback) {
    this._onended = callback;
    return this;
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
   *  @param  {AudioNode|p5.sound object} audioNode AudioNode from the Web Audio API,
   *  or an object from the p5.sound library
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

    /**
     * URL string containing image data.
     *
     * @property data
     */
    this.data = undefined;
  };

}));
