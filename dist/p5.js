(function(exports) {

	// TRIGONOMETRY
	exports.HALF_PI = Math.PI*0.5;
	exports.PI = Math.PI;
	exports.QUARTER_PI = Math.PI*0.25;
	exports.TAU = Math.PI*2.0;
	exports.TWO_PI = Math.PI*2.0;

	// SHAPE
	exports.CORNER = 'corner'; 
	exports.CORNERS = 'corners';
	exports.RADIUS = 'radius';
	exports.RIGHT = 'right';
	exports.LEFT = 'left';
	exports.CENTER = 'center';
	exports.POINTS = 'points';
	exports.LINES = 'lines';
	exports.TRIANGLES = 'triangles';
	exports.TRIANGLE_FAN = 'triangles_fan';
	exports.TRIANGLE_STRIP = 'triangles_strip';
	exports.QUADS = 'quads';
	exports.QUAD_STRIP = 'quad_strip';
	exports.CLOSE = 'close';
	exports.OPEN = 'open';
	exports.CHORD = 'chord';
	exports.PIE = 'pie';
	exports.PROJECT = 'square'; // PEND: careful this is counterintuitive
	exports.SQUARE = 'butt';
	exports.ROUND = 'round';
	exports.BEVEL = 'bevel';
	exports.MITER = 'miter';

	// COLOR
	exports.RGB = 'rgb';
	exports.HSB = 'hsb';

	// DOM EXTENSION
	exports.AUTO = 'auto';

	// ENVIRONMENT
	exports.CROSS = 'crosshair';
	exports.HAND = 'pointer';
	exports.MOVE = 'move';
	exports.TEXT = 'text';
	exports.WAIT = 'wait';

	// TYPOGRAPHY
  exports.NORMAL = 'normal';
  exports.ITALIC = 'italic';
  exports.BOLD = 'bold';

}(window));
;(function(exports) {
	PVariables = {
		loop: true,
		curElement: null,
		shapeKind: null,
		shapeInited: false,
		fill: false,
		startTime: 0,
		updateInterval: 0,
		rectMode: exports.CORNER,
		imageMode: exports.CORNER,
		ellipseMode: exports.CENTER,
		matrices: [[1,0,0,1,0,0]],
		textLeading: 15,
		textFont: 'sans-serif',
		textSize: 12,
		textStyle: exports.NORMAL,
		colorMode: exports.RGB,
		styles: [],

		sketches: [],
		sketchCanvases: [],
		curSketchIndex: -1,

		mousePressed: false,
    preload_count: 0

	};

	PHelper = {};

  
  // THIS IS THE MAIN FUNCTION, CALLED ON PAGE LOAD
  exports.onload = function() {
    PHelper.create();
  };

  PHelper.create = function() {
    exports.createGraphics(800, 600, true); // default canvas
    PVariables.startTime = new Date().getTime();
    
    if (typeof preload == 'function') {
      exports.loadJSON = function(path) { return PHelper.preloadFunc("loadJSON", path); };
      exports.loadStrings = function(path) { return PHelper.preloadFunc("loadStrings", path); };
      exports.loadXML = function(path) { return PHelper.preloadFunc("loadXML", path); };
      exports.loadImage = function(path) { return PHelper.preloadFunc("loadImage", path); };
      preload();
      exports.loadJSON = PHelper.loadJSON;
      exports.loadStrings = PHelper.loadStrings;
      exports.loadXML = PHelper.loadXML;
      exports.loadImage = PHelper.loadImage;
    } else {
      exports.loadJSON = PHelper.loadJSON;
      exports.loadStrings = PHelper.loadStrings;
      exports.loadXML = PHelper.loadXML;
      exports.loadImage = PHelper.loadImage;
      PHelper.setup();
    }
  };

  PHelper.preloadFunc = function(func, path) {
    PVariables.preload_count++;
    return PHelper[func](path, function (resp) {
      if (--PVariables.preload_count === 0) PHelper.setup();
    });    
  };

  PHelper.setup = function() {
    if (typeof setup === 'function' || PVariables.sketches.length > 0) { // pend whats happening here?
      if (typeof setup === 'function') setup();    
      PVariables.updateInterval = setInterval(PHelper.update, 1000/frameRate);
      PHelper.draw();
    } else console.log("sketch must include a setup function");
  };

  PHelper.applyDefaults = function() {
    PVariables.curElement.context.fillStyle = '#FFFFFF';
    PVariables.curElement.context.strokeStyle = '#000000';
    PVariables.curElement.context.lineCap=exports.ROUND;
  };
  PHelper.update = function() {
    frameCount++;
  };
  PHelper.draw = function() {
    if (PVariables.loop) {
      setTimeout(function() {
        requestDraw(PHelper.draw);
      }, 1000 / frameRate);
    }
    // call draw
    if (typeof draw === 'function') draw();
    for (var i = 0; i < PVariables.sketches.length; i++) {
      var s = PVariables.sketches[i];
      if (typeof s.draw === 'function') {
        PVariables.curSketchIndex = i;
        pushStyle();
        s.draw();
        popStyle();    
        PVariables.curSketchIndex = -1;    
      }      
    }
    PVariables.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
  };

  PHelper.modeAdjust = function(a, b, c, d, mode) {
    if (mode == exports.CORNER) {
      return { x: a, y: b, w: c, h: d };
    } else if (mode == exports.CORNERS) {
      return { x: a, y: b, w: c-a, h: d-b };
    } else if (mode == exports.RADIUS) {
      return { x: a-c, y: b-d, w: 2*c, h: 2*d };
    } else if (mode == exports.CENTER) {
      return { x: a-c*0.5, y: b-d*0.5, w: c, h: d };
    }
  };

  PHelper.multiplyMatrix = function(m1, m2) {
    var result = [];
    for(var j = 0; j < m2.length; j++) {
      result[j] = [];
      for(var k = 0; k < m1[0].length; k++) {
        var sum = 0;
        for(var i = 0; i < m1.length; i++) {
          sum += m1[i][k] * m2[j][i];
        }
        result[j].push(sum);
      }
    }
    return result;
  };


  exports.sketch = function(s) {
    PVariables.sketches[PVariables.sketches.length] = s;
    s.mouseX = 0;
    s.mouseY = 0;
    s.pmouseX = 0;
    s.pmouseY = 0;
    s.mouseButton = 0;
    s.touchX = 0;
    s.touchY = 0;
    if (typeof s.setup === 'function') {
      PVariables.curSketchIndex = PVariables.sketches.length - 1;
      s.setup();
      PVariables.curSketchIndex = -1;
    } else console.log("sketch must include a setup function");
  };


}(window));
;(function(exports) {
  exports.alpha = function(rgb) {
    if (rgb.length > 3) return rgb[3];
    else return 255;
  };
  exports.blue = function(rgb) { 
    if (rgb.length > 2) return rgb[2];
    else return 0;
  };
  exports.brightness = function(hsv) {
    if (rgb.length > 2) return rgb[2];
    else return 0;
  };
  exports.color = function() {
    return PHelper.getNormalizedColor(arguments);
  };
  exports.green = function(rgb) { 
    if (rgb.length > 2) return rgb[1];
    else return 0;
  };
  exports.hue = function(hsv) { 
    if (rgb.length > 2) return rgb[0];
    else return 0;
  };
  exports.lerpColor = function(c1, c2, amt) {
    var c = [];
    for (var i=0; i<c1.length; i++) {
      c.push(lerp(c1[i], c2[i], amt));
    }
    return c;
  };
  exports.red = function(rgb) { 
    if (rgb.length > 2) return rgb[0];
    else return 0;
  };
  exports.saturation = function(hsv) { 
    if (hsv.length > 2) return hsv[1];
    else return 0;
  };
}(window));
;(function(exports) {
 exports.background = function() { 
    var c = PHelper.getNormalizedColor(arguments);
    // save out the fill
    var curFill = PVariables.curElement.context.fillStyle;
    // create background rect
    PVariables.curElement.context.fillStyle = PHelper.getCSSRGBAColor(c);
    PVariables.curElement.context.fillRect(0, 0, width, height);
    // reset fill
    PVariables.curElement.context.fillStyle = curFill;
  };
  exports.clear = function() {
    PVariables.curElement.context.clearRect(0, 0, width, height);
  };
  exports.colorMode = function(mode) {
    if (mode == exports.RGB || mode == exports.HSB)
      PVariables.colorMode = mode; 
  };
  exports.fill = function() {
    var c = PHelper.getNormalizedColor(arguments);
    PVariables.curElement.context.fillStyle = PHelper.getCSSRGBAColor(c);
  };
  exports.noFill = function() {
    PVariables.curElement.context.fillStyle = 'rgba(0,0,0,0)';
  };
  exports.noStroke = function() {
    PVariables.curElement.context.strokeStyle = 'rgba(0,0,0,0)';
  };
  exports.stroke = function() {
    var c = PHelper.getNormalizedColor(arguments);
    PVariables.curElement.context.strokeStyle = PHelper.getCSSRGBAColor(c);
  };


  /**
  * getNormalizedColor For a number of different inputs,
  *                    returns a color formatted as [r, g, b, a]
  *
  * @param {'array-like' object} args An 'array-like' object that
  *                                   represents a list of arguments
  *                                  
  * @return {Array} returns a color formatted as [r, g, b, a]
  *                 input        ==> output
  *                 g            ==> [g, g, g, 255]
  *                 g,a          ==> [g, g, g, a]
  *                 r, g, b      ==> [r, g, b, 255]
  *                 r, g, b, a   ==> [r, g, b, a]
  *                 [g]          ==> [g, g, g, 255]
  *                 [g, a]       ==> [g, g, g, a]
  *                 [r, g, b]    ==> [r, g, b, 255]
  *                 [r, g, b, a] ==> [r, g, b, a]
  */
  PHelper.getNormalizedColor = function(args) {
    var r, g, b, a, rgba;
    var _args = typeof args[0].length === 'number' ? args[0] : args;
    if (_args.length >= 3) {
      r = _args[0];
      g = _args[1];
      b = _args[2];
      a = typeof _args[3] === 'number' ? _args[3] : 255;
    } else {
      r = g = b = _args[0];
      a = typeof _args[1] === 'number' ? _args[1] : 255;
    }
    if (PVariables.colorMode == exports.HSB) {
      rgba = hsv2rgb(r, g, b).concat(a);
    } else {
      rgba = [r, g, b, a];
    }

    return rgba;
  };

  PHelper.getCSSRGBAColor = function(arr) {
    var a = arr.map(function(val) {
      return Math.floor(val);
    });
    var alpha = a[3] ? (a[3]/255.0) : 1;
    return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
  };


}(window));
;(function(exports) {
  exports.append = function(array, value) {
    array.push(value);
    return array;
  };
  exports.arrayCopy = function(src, a, b, c, d) { //src, srcPosition, dst, dstPosition, length
    if (typeof d !== 'undefined') { 
      for (var i=a; i<min(a+d, src.length); i++) {
        b[dstPosition+i] = src[i];
      }
    } 
    else if (typeof b !== 'undefined') { //src, dst, length
      a = src.slice(0, min(b, src.length)); 
    }
    else { //src, dst
      a = src.slice(0);  
    }
  };
  exports.concat = function(list0, list1) {
    return list0.concat(list1);
  };
  exports.reverse = function(list) {
    return list.reverse();
  };
  exports.shorten = function(list) { 
    list.pop();
    return list;
  };
  exports.sort = function(list, count) {
    var arr = count ? list.slice(0, min(count, list.length)) : list;
    var rest = count ? list.slice(min(count, list.length)) : [];
    if (typeof arr[0] === 'string') {
      arr = arr.sort();
    } else {
      arr = arr.sort(function(a,b){return a-b;});
    }
    return arr.concat(rest);
  };
  exports.splice = function(list, value, index) {
    return list.splice(index,0,value);
  };
  exports.subset = function(list, start, count) {
    if (typeof count !== 'undefined') return list.slice(start, start+count);
    else return list.slice(start, list.length-1);
  };

}(window));
;(function(exports) {
  exports.join = function(list, separator) {
    return list.join(separator);
  };
  exports.match =  function(str, reg) {
    return str.match(reg);
  };
  exports.matchAll = function(str, reg) {
    var re = new RegExp(reg, "g");
    match = re.exec(str);
    var matches = [];
    while (match !== null) {
      matches.push(match);
      // matched text: match[0]
      // match start: match.index
      // capturing group n: match[n]
      match = re.exec(str);
    }
    return matches;
  };
  exports.nf = function() { 
    if (arguments[0] instanceof Array) {
      var a = arguments[1];
      var b = arguments[2];
      return arguments[0].map(function(x) { return doNf(x, a, b);});
    } else {
      return doNf.apply(this, arguments);
    }
  };
  function doNf() {
    var num = arguments[0];
    var neg = (num < 0);
    var n = neg ? num.toString().substring(1) : num.toString();
    var decimalInd = n.indexOf('.');
    var intPart =  decimalInd != -1 ? n.substring(0, decimalInd) : n;
    var decPart = decimalInd != -1 ? n.substring(decimalInd+1) : '';

    var str = neg ? '-' : '';
    if (arguments.length == 3) {
      for (var i=0; i<arguments[1]-intPart.length; i++) { str += '0'; }
      str += intPart;
      str += '.';
      str += decPart;
      for (var j=0; j<arguments[2]-decPart.length; j++) { str += '0'; }
      return str;
    } else {
      for (var k=0; k<max(arguments[1]-intPart.length, 0); k++) { str += '0'; }
      str += n;
      return str;
    }
  }
  exports.nfc = function() {     
    if (arguments[0] instanceof Array) {
      var a = arguments[1];
      return arguments[0].map(function(x) { return doNfc(x, a);});
    } else {
      return doNfc.apply(this, arguments);
    }
  };
  function doNfc() {
    var num = arguments[0].toString();
    var dec = num.indexOf('.');
    var rem = dec != -1 ? num.substring(dec) : '';
    var n = dec != -1 ? num.substring(0, dec) : num;
    n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (arguments.length > 1) rem = rem.substring(0, arguments[1]+1);
    return n+rem;
  }
  exports.nfp = function() {
    var nfRes = nf.apply(this, arguments);
    if (nfRes instanceof Array) {
      return nfRes.map(addNfp);
    } else {
      return addNfp(nfRes);
    }
  };
  function addNfp() {   
    return (parseFloat(arguments[0]) > 0) ? '+'+arguments[0].toString() : arguments[0].toString();
  }
  exports.nfs = function() {
    var nfRes = nf.apply(this, arguments);
    if (nfRes instanceof Array) {
      return nfRes.map(addNfs);
    } else {
      return addNfs(nfRes);
    }
  };
  function addNfs() {   
    return (parseFloat(arguments[0]) > 0) ? ' '+arguments[0].toString() : arguments[0].toString();
  }
  exports.split = function(str, delim) {
    return str.split(delim);
  };
  exports.splitTokens = function() {
    var d = (arguments.length > 0) ? arguments[1] : /\s/g;
    return arguments[0].split(d).filter(function(n){return n;});
  };
  exports.trim = function(str) {
    if (str instanceof Array) {
      return str.map(trim);
    } else return str.trim();
  };

}(window));
;(function(exports) {
  exports.createGraphics = function(w, h, isDefault, targetID) {
    //console.log('create canvas');
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

    var cnv =  new PElement(c);
    context(cnv);
    PHelper.applyDefaults();
    PHelper.setupInput();

    return cnv;
  };
  exports.createHTML = function(html) {
    var elt = document.createElement('div');
    elt.innerHTML = html;
    document.body.appendChild(elt);
    c =  new PElement(elt);
    context(c);
    return c;
  };
  exports.createHTMLImage = function(src, alt) {
    var elt = document.createElement('img');
    elt.src = src;
    if (typeof alt !== 'undefined') {
      elt.alt = alt;
    }
    document.body.appendChild(elt);
    c =  new PElement(elt);
    context(c);
    return c;
  };

  exports.find = function(e) {
    var res = document.getElementById(e);
    if (res) return [new PElement(res)];
    else {
      res = document.getElementsByClassName(e);
      if (res) {
        var arr = [];
        for(var i = 0, resl = res.length; i != resl; arr.push(new PElement(res[i++])));
        return arr;
      }  
    }
    return [];
  };
  
  exports.context = function(e) {
    var obj;
    if (typeof e == 'string' || e instanceof String) {
      var elt = document.getElementById(e);
      obj = elt ? new PElement(elt) : null;
    } else obj = e;
    //console.log(obj)
    if (typeof obj !== 'undefined') {
      PVariables.curElement = obj;
      width = obj.elt.offsetWidth;
      height = obj.elt.offsetHeight;
      //console.log(width, height)
      if (typeof PVariables.curElement.context !== 'undefined') PVariables.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
      
      if (-1 < PVariables.curSketchIndex && PVariables.sketchCanvases.length <= PVariables.curSketchIndex) {
        PVariables.sketchCanvases[PVariables.curSketchIndex] = PVariables.curElement;
      }
    }
  };

}(window));
;(function(exports) {
  function PElement(elt) {
    this.elt = elt;
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
    var aW = w, aH = h;
    if (aW != AUTO || aH != AUTO) {
      if (aW == AUTO) aW = h * this.elt.width / this.elt.height;
      else if (aH == AUTO) aH = w * this.elt.height / this.elt.width;
      if (this.elt instanceof HTMLCanvasElement) { // set diff for cnv vs normal div
        this.elt.setAttribute('width', aW);
        this.elt.setAttribute('height', aH);
      } else {
        this.elt.style.width = aW;
        this.elt.style.height = aH;
      }
      this.width = this.elt.offsetWidth;
      this.height = this.elt.offsetHeight;
      if (PVariables.curElement.elt == this.elt) {
        width = this.elt.offsetWidth;
        height = this.elt.offsetHeight;
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
    var _this = this; this.elt.addEventListener('click', function(e){fxn(e, _this);}, false);
  }; // pend false?
  PElement.prototype.mouseOver = function(fxn) {
    var _this = this; this.elt.addEventListener('mouseover', function(e){fxn(e, _this);}, false);
  };
  PElement.prototype.mouseOut = function(fxn) {
    var _this = this; this.elt.addEventListener('mouseout', function(e){fxn(e, _this);}, false);
  };
  exports.PElement = PElement;
}(window));
;(function(exports) {
  exports.frameCount = 0;
  exports.frameRate = 30;
  exports.height = 100;
  exports.width = 100;
  exports.focused = true;

  window.onfocus = function() {
    exports.focused = true;
  };
  window.onblur = function() {
    exports.focused = false;
  };
  // requestAnim shim layer by Paul Irish
  window.requestDraw = (function(){
    return window.requestAnimationFrame       || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame    || 
           window.oRequestAnimationFrame      || 
           window.msRequestAnimationFrame     || 
           function(callback, element){
             window.setTimeout(callback, 1000 / 60);
           };
  })();  
  // exports.focused
  exports.cursor = function(type) {
    var cursor = 'auto';
    if (type == CROSS || type == HAND || type == MOVE || type == TEXT || type == WAIT) {
      cursor = type;
    }
    document.getElementsByTagName('body')[0].style.cursor = cursor; 
  };
  exports.displayHeight = screen.height;
  exports.displayWidth = screen.width;
  exports.getFrameRate = function() {
    return frameRate;
  };
  exports.setFrameRate = function(fps) { 
    frameRate = fps; 
    clearInterval(PVariables.updateInterval);
    PVariables.updateInterval = setInterval(PHelper.update, 1000/frameRate);
  };
  exports.noCursor = function() {
    document.getElementsByTagName('body')[0].style.cursor = 'none';
  };
}(window));
;(function(exports) {

  exports.createImage = function(w, h, format) {
    return new PImage(w, h);
  }; //pend format?

  PHelper.loadImage = function(path, callback) {
    var pimg = new PImage();
    pimg.sourceImage = new Image();

    pimg.sourceImage.onload = function() {
      pimg.width = pimg.sourceImage.width;
      pimg.height = pimg.sourceImage.height;

      // draw to canvas to get image data
      var canvas = document.createElement('canvas');
      var ctx=canvas.getContext("2d");
      canvas.width=pimg.width;
      canvas.height=pimg.height;
      ctx.drawImage(pimg.sourceImage, 0, 0);
      // note: this only works with local files!
      // pimg.imageData = ctx.getImageData(0, 0, pimg.width, pimg.height); //PEND: taking it out for now to allow url loading
      if (typeof callback !== 'undefined') callback();

    };

    pimg.sourceImage.src = path; 
    return pimg;
  };
 
  PHelper.preloadImage = function(path) {
    PVariables.preload_count++;
    return PHelper.loadImage(path, function () {
      if (--PVariables.preload_count === 0) setup();
    });
  };

  function PImage(w, h) {
    this.width = w || 1;
    this.height = h || 1;
    this.imageData = PVariables.curElement.context.createImageData(this.width, this.height); 
    for (var i = 3, len = this.imageData.length; i < len; i += 4) {
      this.imageData[i] = 255;
    }
    this.pixels = [];
  }
  PImage.prototype.loadPixels = function() { 
    this.pixels = [];
    var data = this.imageData.data;
    for (var i=0; i<data.length; i+=4) {
      this.pixels.push([data[i], data[i+1], data[i+2], data[i+3]]);
    }
  };
  /*PImage.prototype.updatePixels = function() {
    this.sourceImage.getContext('2d').putImageData(this.imageData, 0, 0);
  };*/
  PImage.prototype.resize = function() {
    // TODO
  };
  PImage.prototype.get = function(x, y, w, h) {
    var wp = w ? w : 1;
    var hp = h ? h : 1;
    var vals = [];
    for (var j=y; j<y+hp; j++) {
      for (var i=x; i<x+wp; i++) {
        vals.push(this.pixels[j*this.width+i]);
      }
    }
  };
  PImage.prototype.set = function(x, y, val) {
    var ind = y*this.width+x;
    if (typeof val.image == 'undefined') {
      if (ind < this.pixels.length) {
        this.pixels[ind] = val;
      }
    } else {
      // TODO: copy image pixels
    }
  };
  /*PImage.prototype.mask = function(m) {
    // Masks part of an image with another image as an alpha channel
    var op = PVariables.curElement.context.globalCompositeOperation;
    PVariables.curElement.context.drawImage(m.image, 0, 0);
    PVariables.curElement.context.globalCompositeOperation = 'source-atop';
    PVariables.curElement.context.drawImage(this.image, 0, 0);
    PVariables.curElement.context.globalCompositeOperation = op;
  };*/
  PImage.prototype.filter = function() {
    // TODO
    // Converts the image to grayscale or black and white
  };
  PImage.prototype.copy = function() {
    // TODO
    // Copies the entire image
  };
  PImage.prototype.blend = function() {
    // TODO
    // Copies a pixel or rectangle of pixels using different blending modes
  };
  PImage.prototype.save = function() {
    // TODO
    // Saves the image to a TIFF, TARGA, PNG, or JPEG file*/
  };
  exports.PImage = PImage;
}(window));
;(function(exports) {
  exports.image = function() { 
    var vals;
    if (arguments.length < 5) {
      vals = PHelper.modeAdjust(arguments[1], arguments[2], arguments[0].width, arguments[0].height, PVariables.imageMode);
    } else {
      vals = PHelper.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], PVariables.imageMode);
    }
    PVariables.curElement.context.drawImage(arguments[0].sourceImage, vals.x, vals.y, vals.w, vals.h);
  };

  exports.imageMode = function(m) {
    if (m == exports.CORNER || m == exports.CORNERS || m == exports.CENTER) PVariables.imageMode = m;
  };

  function getPixels(img) {
    var c = document.createElement('canvas');
    c.width = img.width; 
    c.height = img.height;
    var ctx = c.getContext('2d');
    ctx.drawImage(img);
    return ctx.getImageData(0,0,c.width,c.height);
  }
  //// PIXELS ////////////////////////////////

  exports.pixels = [];
  exports.blend = function() {
    // TODO
  };
  exports.copy = function() {
    // TODO
  };
  exports.filter = function() {
    // TODO
  };
  exports.get = function(x, y) {
    var pix = PVariables.curElement.context.getImageData(0, 0, width, height).data;
    /*if (typeof w !== 'undefined' && typeof h !== 'undefined') {
      var region = [];
      for (var j=0; j<h; j++) {
        for (var i=0; i<w; i++) {
          region[i*w+j] = pix[(y+j)*width+(x+i)]; 
        }
      }
      return region;
    }*/
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        var offset = 4*y*width+4*x;
        var c = [pix[offset], pix[offset+1], pix[offset+2], pix[offset+3]];
        return c;
      } else {
        return [0, 0, 0, 255];
      }
    } else {
      return [0, 0, 0, 255];
    }
  };
  exports.loadPixels = function() { 
    var a = PVariables.curElement.context.getImageData(0, 0, width, height).data;
    pixels = [];
    for (var i=0; i < a.length; i+=4) {
      pixels.push([a[i], a[i+1], a[i+2], a[i+3]]); // each pixels entry: [r, g, b, a]
    }
  };
  exports.set = function() {
    // TODO
  };
  exports.updatePixels = function() {
    /*if (typeof pixels !== 'undefined') {
      var imgd = PVariables.curElement.context.getImageData(x, y, width, height);
      imgd = pixels;
      context.putImageData(imgd, 0, 0);
    }*/
  };

}(window));
;(function(exports) {
  //BufferedReader
  exports.createInput = function() {
    // TODO
  };
  exports.createReader = function() {
    // TODO
  };
  exports.loadBytes = function() {
    // TODO
  };

  PHelper.loadJSON = function(path, callback) {
    var self = [];
    var t = path.indexOf('http') == -1 ? 'json' : 'jsonp';
    reqwest({url: path, type: t, success: function (resp) {
      for (var k in resp) self[k] = resp[k];
      if (typeof callback !== 'undefined') callback(resp);
    }});
    return self;
  };
  PHelper.loadStrings = function(path, callback) {
    var self = [];
    var req = new XMLHttpRequest();
    req.open('GET', path, true);
    req.onreadystatechange = function () {
      if((req.readyState === 4) && (req.status === 200 || req.status === 0)) {
        var arr = req.responseText.match(/[^\r\n]+/g);
        for (var k in arr) self[k] = arr[k];
        if (typeof callback !== 'undefined') callback();
      }
    };
    req.send(null);
    return self;
  };

  exports.loadTable = function () {
    // TODO
  };

  PHelper.temp = [];
  PHelper.loadXML = function(path, callback) {
    var self = [];
    reqwest(path, function (resp) {
      console.log(resp);
      PHelper.temp = resp;
      self[0] = resp;
      if (typeof callback !== 'undefined') callback(resp);
    });
    return self;
  };

  exports.open = function() {
    // TODO
  };
  exports.parseXML = function() {
    // TODO
  };
  exports.saveTable = function() {
    // TODO
  };
  exports.selectFolder = function() {
    // TODO
  };
  exports.selectInput = function() {
    // TODO
  };

}(window));
;(function(exports) {
  PHelper.setupInput = function() {
    document.body.onmousemove = function(e){
      PHelper.updateMouseCoords(e);
      if (!PVariables.mousePressed && typeof mouseMoved === 'function') {
        mouseMoved(e);
      }
      if (PVariables.mousePressed && typeof mouseDragged === 'function') {
        mouseDragged(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (!PVariables.mousePressed && typeof s.mouseMoved === 'function') {
          s.mouseMoved(e);
        }
        if (PVariables.mousePressed && typeof s.mouseDragged === 'function') {
          s.mouseDragged(e);          
        }
      }        
    };
    document.body.onmousedown = function(e) {
      PVariables.mousePressed = true;
      PHelper.setMouseButton(e);
      if (typeof mousePressed === 'function') {
        mousePressed(e);        
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mousePressed === 'function') {
          s.mousePressed(e);
        }
      } 
    };
    document.body.onmouseup = function(e) {
      PVariables.mousePressed = false;
      if (typeof mouseReleased === 'function') {
        mouseReleased(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mouseReleased === 'function') {
          s.mouseReleased(e);
        }
      }        
    };
    document.body.onmouseclick = function(e) {
      if (typeof mouseClicked === 'function') {
        mouseClicked(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mouseClicked === 'function') {
          s.mouseClicked(e);
        }
      }
    };
    document.body.onmousewheel = function(e) {
      if (typeof mouseWheel === 'function') {
        mouseWheel(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mouseWheel === 'function') {
          s.mouseWheel(e);
        }
      }     
    };
    document.body.onkeydown = function(e) {
      PHelper.keyPressed = true;
      exports.keyCode = e.keyCode;
      exports.key = String.fromCharCode(e.keyCode);
      if (typeof keyPressed === 'function') {
        keyPressed(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.keyPressed === 'function') {
          s.keyPressed(e);
        }
      }
    };
    document.body.onkeyup = function(e) {
      PHelper.keyPressed = false;
      if (typeof keyReleased === 'function') {
        keyReleased(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.keyReleased === 'function') {
          s.keyReleased(e);
        }
      }  
    };
    document.body.onkeypress = function(e) {
      if (typeof keyTyped === 'function') {
        keyTyped(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.keyTyped === 'function') {
          s.keyTyped(e);
        }
      }        
    };
    document.body.ontouchstart = function(e) {
      PHelper.setTouchPoints(e);
      if(typeof touchStarted === 'function') {
        touchStarted(e);
      }
      var m = typeof touchMoved === 'function';         
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.touchStarted === 'function') {
          s.touchStarted(e);
        }
        m |= typeof s.touchMoved === 'function';         
      }        
      if(m) {
        e.preventDefault();
      }
    };
    document.body.ontouchmove = function(e) {
      PHelper.setTouchPoints(e);
      if(typeof touchMoved === 'function') {
        touchMoved(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.touchMoved === 'function') {
          s.touchMoved(e);
        }
      }        
    };
    document.body.ontouchend = function(e) {
      PHelper.setTouchPoints(e);
      if(typeof touchEnded === 'function') {
        touchEnded(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.touchEnded === 'function') {
          s.touchEnded(e);
        }
      }            
    };
  };

}(window));;(function(exports) {
  exports.key = '';
  exports.keyCode = 0; 
  PHelper.keyPressed = false;

  exports.isKeyPressed = function() {
    return pKeyPressed;
  };

}(window));
;(function(exports) {
  exports.mouseX = 0;
  exports.mouseY = 0;
  exports.pmouseX = 0;
  exports.pmouseY = 0;
  exports.mouseButton = 0;

  /*
  // Another possibility: mouseX, mouseY, etc. are properties with a getter
  // that returns the relative coordinates depending on the current element.
  // I think is overkill and might screw up things in unexpected ways in other
  // parts of pjs.
  Object.defineProperty(exports, "mouseX", {
    get: function() {
      var bounds = PVariables.curElement.elt.getBoundingClientRect();
      return absMouseX - bounds.left;
    },
    set: undefined
  });
  */

  exports.isMousePressed = function() {
    return PVariables.mousePressed;
  };
  PHelper.updateMouseCoords = function(e) {
    pmouseX = exports.mouseX;
    pmouseY = exports.mouseY;
    exports.mouseX = e.pageX;  // - parseInt(PVariables.curElement.elt.style.left, 10);
    exports.mouseY = e.pageY;  // - parseInt(PVariables.curElement.elt.style.top, 10);
    
    for (var n = 0; n < PVariables.sketchCanvases.length; n++) {
      var s = PVariables.sketches[n];
      var c = PVariables.sketchCanvases[n];
      var bounds = c.elt.getBoundingClientRect();
      s.pmouseX = s.mouseX;
      s.pmouseY = s.mouseY;
      s.mouseX = mouseX - bounds.left;
      s.mouseY = mouseY - bounds.top;
    }
    
    // console.log(mouseX+' '+mouseY);
    // console.log('mx = '+mouseX+' my = '+mouseY);
  };
  PHelper.setMouseButton = function(e) {
   exports.mouseButton = exports.LEFT;
    if (e.button == 1) {
      exports.mouseButton = exports.CENTER;
    } else if (e.button == 2) {
      exports.mouseButton = exports.RIGHT;
    }
    for (var i = 0; i < PVariables.sketches.length; i++) {
      var s = PVariables.sketches[i];
      if (e.button == 1) {
        s.mouseButton = exports.CENTER;
      } else if (e.button == 2) {
        s.mouseButton = exports.RIGHT;
      }      
    } 
  };

}(window));
;(function(exports) {
  exports.day = function() {
    return new Date().getDate();
  };
  exports.hour = function() {
    return new Date().getHours();
  };
  exports.minute = function() {
    return new Date().getMinutes();
  };
  exports.millis = function() {
    return new Date().getTime() - PVariables.startTime;
  };
  exports.month = function() {
    return new Date().getMonth();
  };
  exports.second = function() {
    return new Date().getSeconds();
  };
  exports.year = function() {
    return new Date().getFullYear();
  };

}(window));;(function(exports) {

	exports.touchX = 0;
	exports.touchY = 0;

  PHelper.setTouchPoints = function(e) {
    exports.touchX = e.changedTouches[0].pageX;
    exports.touchY = e.changedTouches[0].pageY;
    exports.touches = [];
    for (var n = 0; n < PVariables.sketchCanvases.length; n++) {
      PVariables.sketches[n].touches = [];
    }    
    for(var i = 0; i < e.changedTouches.length; i++){
      var ct = e.changedTouches[i];
      exports.touches[i] = {x: ct.pageX, y: ct.pageY};
      for (var m = 0; m < PVariables.sketchCanvases.length; n++) {
        var s = PVariables.sketches[m];
        var c = PVariables.sketchCanvases[m];
        var bounds = c.elt.getBoundingClientRect(); 
        s.touches[i] = {x: ct.pageX - bounds.left, y: ct.pageY - bounds.top};
      }              
    }
  };

}(window));
;(function(exports) {
  exports.abs = function(n) { return Math.abs(n); };
  exports.ceil = function(n) { return Math.ceil(n); };
  exports.constrain = function(n, l, h) { return max(min(n, h), l); };
  exports.dist = function(x1, y1, x2, y2) {
    var xs = x2-x1;
    var ys = y2-y1;
    return Math.sqrt( xs*xs + ys*ys );
  };
  exports.exp = function(n) { return Math.exp(n); };
  exports.floor = function(n) { return Math.floor(n); };
  exports.lerp = function(start, stop, amt) {
    return amt*(stop-start)+start;
  };
  exports.log = function(n) { return Math.log(n); };
  exports.mag = function(x, y) { return Math.sqrt(x*x+y*y); };
  exports.map = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };
  exports.max = function(a, b) { return Math.max(a, b); };
  exports.min = function(a, b) { return Math.min(a, b); };
  exports.norm = function(n, start, stop) { return map(n, start, stop, 0, 1); };
  exports.pow = function(n, e) { return Math.pow(n, e); };
  exports.round = function(n) { return Math.round(n); };
  exports.sq = function(n) { return n*n; };
  exports.sqrt = function(n) { return Math.sqrt(n); };
}(window));
;(function(exports) {
  function PVector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  PVector.prototype.set = function (x, y, z) {
    if (x instanceof PVector) { return this.set(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.set(x[0], x[1], x[2]); }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };

  PVector.prototype.get = function () {
    return new PVector(this.x, this.y, this.z);
  };

  PVector.prototype.add = function (x, y, z) {
    if (x instanceof PVector) { return this.add(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.add(x[0], x[1], x[2]); }
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
  };

  PVector.prototype.sub = function (x, y, z) {
    if (x instanceof PVector) { return this.sub(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.sub(x[0], x[1], x[2]); }
    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    return this;
  };

  PVector.prototype.mult = function (n) {
    this.x *= n || 0;
    this.y *= n || 0;
    this.z *= n || 0;
    return this;
  };

  PVector.prototype.div = function (n) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this; 
  };

  PVector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
  };

  PVector.prototype.magSq = function () {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };

  PVector.prototype.dot = function (x, y, z) {
    if (x instanceof PVector) {
      return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) +
           this.y * (y || 0) +
           this.z * (z || 0);
  };

  PVector.prototype.cross = function (v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;
    return new PVector(x, y, z);
  };

  PVector.prototype.dist = function (v) {
    var d = v.get().sub(this);
    return d.mag();
  };

  PVector.prototype.normalize = function () {
    return this.div(this.mag());
  };

  PVector.prototype.limit = function (l) {
    var mSq = this.magSq();
    if(mSq > l*l) {
      this.div(Math.sqrt(mSq)); //normalize it
      this.mult(l);
    }
    return this;
  };

  PVector.prototype.setMag = function (n) {
    return this.normalize().mult(n);
  };

  PVector.prototype.heading = function () {
    return Math.atan2(this.y, this.x);
  };

  PVector.prototype.rotate2D = function (a) {
    var newHeading = this.heading() + a;
    var mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  };

  PVector.prototype.lerp = function (x, y, z, amt) {
    if (x instanceof PVector) {
      return this.lerp(x.x, x.y, x.z, y);
    }
    this.x += (x - this.x) * amt || 0;
    this.y += (y - this.y) * amt || 0;
    this.z += (z - this.z) * amt || 0;
    return this;
  };

  PVector.prototype.array = function () {
    return [this.x || 0, this.y || 0, this.z || 0];
  };


  // Static Methods

  PVector.random2D = function () {
    //TODO:
  };

  PVector.random3D = function () {
    //TODO:
  };

  PVector.add = function (v1, v2) {
    return v1.get().add(v2);
  };

  PVector.sub = function (v1, v2) {
    return v1.get().sub(v2);
  };

  PVector.mult = function (v, n) {
    return v.get().mult(n);
  };

  PVector.div = function (v, n) {
    return v.get().div(n);
  };

  PVector.dot = function (v1, v2) {
    return v1.dot(v2);
  };

  PVector.cross = function (v1, v2) {
    return v1.cross(v2);
  };

  PVector.dist = function (v1,v2) {
    return v1.dist(v2);
  };

  PVector.lerp = function (v1, v2, amt) {
    return v1.get().lerp(v2, amt);
  };

  PVector.angleBetween = function (v1, v2) {
    return Math.acos((v1.dot(v2))/(v1.mag() * v2.mag()));
   
  };

  exports.PVector = PVector;

}(window));
;(function(exports) {
  exports.random = function(x, y) {
    // might want to use this kind of check instead:
    // if (arguments.length === 0) {
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      return (y-x)*Math.random()+x;
    } else if (typeof x !== 'undefined') { 
      return x*Math.random();
    } else {
      return Math.random();
    }
  };

}(window));
;(function(exports) {

  exports.acos = function(x) { return Math.acos(x); };
  exports.asin = function(x) { return Math.asin(x); };
  exports.atan = function(x) { return Math.atan(x); };
  exports.atan2 = function(y, x) { return Math.atan2(y, x); };
  exports.cos = function(x) { return Math.cos(x); };
  exports.degrees = function(x) { return 360.0*x/(2*Math.PI); };
  exports.radians = function(x) { return 2*Math.PI*x/360.0; };
  exports.sin = function(x) { return Math.sin(x); };
  exports.tan = function(x) { return Math.tan(x); };
}(window));
;(function(exports) {
  exports.pWriters = [];
  exports.beginRaw = function() {
    // TODO
  };
  exports.beginRecord = function() {
    // TODO
  };
  exports.createOutput = function() {
    // TODO
  };
  exports.createWriter  = function(name) {
    if (pWriters.indexOf(name) == -1) { // check it doesn't already exist
      pWriters.name = new PrintWriter(name);
    }
  };
  exports.endRaw = function() {
    // TODO
  };
  exports.endRecord  = function() {
    // TODO
  };
  exports.PrintWriter = function(name) {
     this.name = name;
     this.content = '';
     this.print = function(data) { this.content += data; };
     this.println = function(data) { this.content += data + '\n'; };
     this.flush = function() { this.content = ''; };
     this.close = function() { writeFile(this.content); };
  };
  exports.saveBytes = function() {
    // TODO
  };
  exports.saveJSONArray = function() {
    // TODO
  };
  exports.saveJSONObject = function() {
    // TODO
  };
  exports.saveStream = function() {
    // TODO
  };
  exports.saveStrings = function(list) {
    writeFile(list.join('\n'));
  };
  exports.saveXML = function() {
    // TODO
  };
  exports.selectOutput = function() {
    // TODO
  };
  exports.writeFile = function(content) {
    exports.open('data:text/json;charset=utf-8,' + escape(content), 'download'); 
  };

}(window));
;(function(exports) {
  exports.save = function() {
    window.open(PVariables.curElement.elt.toDataURL('image/png'));
  };
}(window));
;(function(exports) {
  exports.print = console.log.bind(console);
  exports.println = console.log.bind(console);
}(window));

;(function(exports) {
	exports.arc = function() {
    // pend todo
  };
  exports.ellipse = function(a, b, c, d) {
    var vals = PHelper.modeAdjust(a, b, c, d, PVariables.ellipseMode);
    var kappa = 0.5522848,
      ox = (vals.w / 2) * kappa, // control point offset horizontal
      oy = (vals.h / 2) * kappa, // control point offset vertical
      xe = vals.x + vals.w,      // x-end
      ye = vals.y + vals.h,      // y-end
      xm = vals.x + vals.w / 2,  // x-middle
      ym = vals.y + vals.h / 2;  // y-middle
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.moveTo(vals.x, ym);
    PVariables.curElement.context.bezierCurveTo(vals.x, ym - oy, xm - ox, vals.y, xm, vals.y);
    PVariables.curElement.context.bezierCurveTo(xm + ox, vals.y, xe, ym - oy, xe, ym);
    PVariables.curElement.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    PVariables.curElement.context.bezierCurveTo(xm - ox, ye, vals.x, ym + oy, vals.x, ym);
    PVariables.curElement.context.closePath();
    PVariables.curElement.context.fill();
    PVariables.curElement.context.stroke();
  };
  exports.line = function(x1, y1, x2, y2) {
    if (PVariables.curElement.context.strokeStyle === 'rgba(0,0,0,0)') {
      return;
    }
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.moveTo(x1, y1);
    PVariables.curElement.context.lineTo(x2, y2);
    PVariables.curElement.context.stroke();
  };
  exports.point = function(x, y) {
    var s = PVariables.curElement.context.strokeStyle;
    var f = PVariables.curElement.context.fillStyle;
    if (s === 'rgba(0,0,0,0)') {
      return;
    }
    x = Math.round(x);
    y = Math.round(y);
    PVariables.curElement.context.fillStyle = s;
    if (PVariables.curElement.context.lineWidth > 1) {
      PVariables.curElement.context.beginPath();
      PVariables.curElement.context.arc(x, y, PVariables.curElement.context.lineWidth / 2, 0, TWO_PI, false);
      PVariables.curElement.context.fill();
    } else {
      PVariables.curElement.context.fillRect(x, y, 1, 1);
    }
    PVariables.curElement.context.fillStyle = f;
  };
  exports.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.moveTo(x1, y1);
    PVariables.curElement.context.lineTo(x2, y2);
    PVariables.curElement.context.lineTo(x3, y3);
    PVariables.curElement.context.lineTo(x4, y4);
    PVariables.curElement.context.closePath();
    PVariables.curElement.context.fill();
    PVariables.curElement.context.stroke();
  };
  exports.rect = function(a, b, c, d) {
    var vals = PHelper.modeAdjust(a, b, c, d, PVariables.rectMode);
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.rect(vals.x, vals.y, vals.w, vals.h);
    PVariables.curElement.context.fill();
    PVariables.curElement.context.stroke();
  };
  exports.triangle = function(x1, y1, x2, y2, x3, y3) {
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.moveTo(x1, y1);
    PVariables.curElement.context.lineTo(x2, y2);
    PVariables.curElement.context.lineTo(x3, y3);
    PVariables.curElement.context.closePath();
    PVariables.curElement.context.fill();
    PVariables.curElement.context.stroke();
  }; 
}(window));
;(function(exports) {
	exports.ellipseMode = function(m) {
    if (m == exports.CORNER || m == exports.CORNERS || m == exports.RADIUS || m == exports.CENTER) {
      PVariables.ellipseMode = m;
    }
  };
  exports.noSmooth = function() {
    PVariables.curElement.context.mozImageSmoothingEnabled = false;
    PVariables.curElement.context.webkitImageSmoothingEnabled = false;
  };
  exports.rectMode = function(m) {
    if (m == exports.CORNER || m == exports.CORNERS || m == exports.RADIUS || m == exports.CENTER) {
      PVariables.rectMode = m;
    }
  };
  exports.smooth = function() {
    PVariables.curElement.context.mozImageSmoothingEnabled = true;
    PVariables.curElement.context.webkitImageSmoothingEnabled = true;
  };
  exports.strokeCap = function(cap) {
    if (cap == exports.ROUND || cap == exports.SQUARE || cap == exports.PROJECT) {
      PVariables.curElement.context.lineCap=cap;
    }
  };
  exports.strokeJoin = function(join) {
    if (join == exports.ROUND || join == exports.BEVEL || join == exports.MITER) {
      PVariables.curElement.context.lineJoin = join;
    }
  };
  exports.strokeWeight = function(w) {
    if (typeof w === 'undefined' || w === 0)
      PVariables.curElement.context.lineWidth = 0.0001; // hack because lineWidth 0 doesn't work
    else PVariables.curElement.context.lineWidth = w;
  };

}(window));
;(function(exports) {
	exports.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.moveTo(x1, y1);
    PVariables.curElement.context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    PVariables.curElement.context.stroke();
  };
  exports.bezierDetail = function() {
    // TODO
  };
  exports.bezierPoint = function() {
    // TODO
  };
  exports.bezierTangent = function() {
    // TODO
  };
  exports.curve = function() {
    // TODO
  };
  exports.curveDetail = function() {
    // TODO
  };
  exports.curvePoint = function() {
    // TODO
  };
  exports.curveTangent = function() {
    // TODO
  };
  exports.curveTightness = function() {
    // TODO
  };
}(window));
;(function(exports) {
	exports.beginContour = function() {
    // TODO
  };
  exports.beginShape = function(kind) {
    if (kind == exports.POINTS || kind == exports.LINES || kind == exports.TRIANGLES || kind == exports.TRIANGLE_FAN || kind == exports.TRIANGLE_STRIP || kind == exports.QUADS || kind == exports.QUAD_STRIP)
      PVariables.shapeKind = kind;
    else PVariables.shapeKind = null; 
    PVariables.shapeInited = true;
    PVariables.curElement.context.beginPath();
  };
  exports.bezierVertex = function(x1, y1, x2, y2, x3, y3) {
    PVariables.curElement.context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
  };
  exports.curveVertex = function() {
    // TODO
  };
  exports.endContour = function() {
    // TODO
  };
  exports.endShape = function(mode) {
    if (mode == exports.CLOSE) {
      PVariables.curElement.context.closePath();
      PVariables.curElement.context.fill();
    } 
    PVariables.curElement.context.stroke();
  };
  exports.quadraticVertex = function(cx, cy, x3, y3) {
    PVariables.curElement.context.quadraticCurveTo(cx, cy, x3, y3);
  };
  exports.vertex = function(x, y) {
    if (PVariables.shapeInited) {
      PVariables.curElement.context.moveTo(x, y);
    } else {
      PVariables.curElement.context.lineTo(x, y); // pend this is where check for kind and do other stuff
    }
    PVariables.shapeInited = false;
  };

}(window));
;(function(exports) {
  exports.noLoop = function() { 
    if (PVariables.loop) {
      PVariables.loop = false; 
    }
  };
  exports.loop = function() {
    if (!PVariables.loop) {
      PVariables.loop = true;
    }
  };
  exports.pushStyle = function() {
    var curS = [];
    curS.fillStyle = PVariables.curElement.context.fillStyle; // fill
    curS.strokeStyle = PVariables.curElement.context.strokeStyle; // stroke
    curS.lineWidth = PVariables.curElement.context.lineWidth; // strokeWeight
    // @todo tint
    curS.lineCap = PVariables.curElement.context.lineCap; // strokeCap
    curS.lineJoin = PVariables.curElement.context.lineJoin; // strokeJoin
    curS.imageMode = PVariables.imageMode; // imageMode
    curS.rectMode = PVariables.rectMode; // rectMode
    curS.ellipseMode = PVariables.ellipseMode; // ellipseMode
    // @todo shapeMode
    curS.colorMode = PVariables.colorMode; // colorMode
    curS.textAlign = PVariables.curElement.context.textAlign; // textAlign
    curS.textFont = PVariables.textFont;
    curS.textLeading = PVariables.textLeading; // textLeading
    curS.textSize = PVariables.textSize; // textSize
    curS.textStyle = PVariables.textStyle; // textStyle
    PVariables.styles.push(curS);
  };
  exports.popStyle = function() {
    var lastS = PVariables.styles[PVariables.styles.length-1];
    PVariables.curElement.context.fillStyle = lastS.fillStyle; // fill
    PVariables.curElement.context.strokeStyle = lastS.strokeStyle; // stroke
    PVariables.curElement.context.lineWidth = lastS.lineWidth; // strokeWeight
    // @todo tint
    PVariables.curElement.context.lineCap = lastS.lineCap; // strokeCap
    PVariables.curElement.context.lineJoin = lastS.lineJoin; // strokeJoin
    PVariables.imageMode = lastS.imageMode; // imageMode
    PVariables.rectMode = lastS.rectMode; // rectMode
    PVariables.ellipseMode = lastS.ellipseMode; // elllipseMode
    // @todo shapeMode
    PVariables.colorMode = lastS.colorMode; // colorMode
    PVariables.curElement.context.textAlign = lastS.textAlign; // textAlign
    PVariables.textFont = lastS.textFont;
    PVariables.textLeading = lastS.textLeading; // textLeading
    PVariables.textSize = lastS.textSize; // textSize
    PVariables.textStyle = lastS.textStyle; // textStyle
    PVariables.styles.pop();
  };
}(window));
;(function(exports) {
  exports.applyMatrix = function(n00, n01, n02, n10, n11, n12) {
    PVariables.curElement.context.transform(n00, n01, n02, n10, n11, n12);
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m = pMultiplyMatrix(m, [n00, n01, n02, n10, n11, n12]);
  };
  exports.popMatrix = function() { 
    PVariables.curElement.context.restore(); 
    PVariables.matrices.pop();
  };
  exports.printMatrix = function() {
    console.log(PVariables.matrices[PVariables.matrices.length-1]);
  };
  exports.pushMatrix = function() { 
    PVariables.curElement.context.save(); 
    PVariables.matrices.push([1,0,0,1,0,0]);
  };
  exports.resetMatrix = function() { 
    PVariables.curElement.context.setTransform();
    PVariables.matrices[PVariables.matrices.length-1] = [1,0,0,1,0,0]; 
  };
  exports.rotate = function(r) { 
    PVariables.curElement.context.rotate(r); 
    var m = PVariables.matrices[PVariables.matrices.length-1];
    var c = Math.cos(r);
    var s = Math.sin(r);
    var m11 = m[0] * c + m[2] * s;
    var m12 = m[1] * c + m[3] * s;
    var m21 = m[0] * -s + m[2] * c;
    var m22 = m[1] * -s + m[3] * c;
    m[0] = m11;
    m[1] = m12;
    m[2] = m21;
    m[3] = m22;
  };
  exports.scale = function() {
    var x = 1.0, y = 1.0;
    if (arguments.length == 1) {
      x = y = arguments[0];
    } else {
      x = arguments[0];
      y = arguments[1];
    }
    PVariables.curElement.context.scale(x, y); 
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m[0] *= x;
    m[1] *= x;
    m[2] *= y;
    m[3] *= y;
  };
  exports.shearX = function(angle) {
    PVariables.curElement.context.transform(1, 0, tan(angle), 1, 0, 0);
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m = pMultiplyMatrix(m, [1, 0, tan(angle), 1, 0, 0]);
  };
  exports.shearY = function(angle) {
    PVariables.curElement.context.transform(1, tan(angle), 0, 1, 0, 0);
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m = pMultiplyMatrix(m, [1, tan(angle), 0, 1, 0, 0]);
  };
  exports.translate = function(x, y) { 
    PVariables.curElement.context.translate(x, y); 
    var m = PVariables.matrices[PVariables.matrices.length-1];
    m[4] += m[0] * x + m[2] * y;
    m[5] += m[1] * x + m[3] * y;
  };

}(window));;(function(exports) {
  exports.textAlign = function(a) {
    if (a == exports.LEFT || a == exports.RIGHT || a == exports.CENTER) PVariables.curElement.context.textAlign = a;
  };
  exports.textFont = function(str) {
    PVariables.textFont = str; //pend temp?
  };
  exports.textHeight = function(s) {
    return PVariables.curElement.context.measureText(s).height;
  };
  exports.textLeading = function(l) {
    PVariables.textLeading = l;
  };
  exports.textSize = function(s) {
    PVariables.textSize = s;
  };
  exports.textStyle = function(s) {
    if (s == exports.NORMAL || s == exports.ITALIC || s == exports.BOLD) {
      PVariables.textStyle = s;
    }
  };
  exports.textWidth = function(s) {
    return PVariables.curElement.context.measureText(s).width;
  };
}(window));
;(function(exports) {
  /*
    text(str, x, y)
    text(str, x1, y1, x2, y2)
  */
  exports.text = function() {
    PVariables.curElement.context.font=PVariables.textStyle+' '+PVariables.textSize+'px '+PVariables.textFont;
    if (arguments.length == 3) {
      PVariables.curElement.context.fillText(arguments[0], arguments[1], arguments[2]);
      PVariables.curElement.context.strokeText(arguments[0], arguments[1], arguments[2]);
    } else if (arguments.length == 5) {
      var words = arguments[0].split(' ');
      var line = '';
      var vals = PHelper.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], PVariables.rectMode);
      vals.y += PVariables.textLeading;
      for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = PVariables.curElement.context.measureText(testLine);
        var testWidth = metrics.width;
        if (vals.y > vals.h) {
          break;
        }
        else if (testWidth > vals.w && n > 0) {
          PVariables.curElement.context.fillText(line, vals.x, vals.y);
          PVariables.curElement.context.strokeText(line, vals.x, vals.y);
          line = words[n] + ' ';
          vals.y += PVariables.textLeading;
        }
        else {
          line = testLine;
        }
      }
      if (vals.y <= vals.h) {
        PVariables.curElement.context.fillText(line, vals.x, vals.y);
        PVariables.curElement.context.strokeText(line, vals.x, vals.y);
      }
    }
  };

}(window));
