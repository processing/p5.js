(function(exports) {
  //////////////////////////////////////
  ////
  //// CURRENT PROCESSING API
  ////
  //////////////////////////////////////

  //////////////////////////////////////
  ////  STRUCTURE
  //////////////////////////////////////

  exports.draw; // needed?
  exports.setup; // needed?
  exports.noLoop = function() { 
    if (pLoop) {
      pLoop = false; 
    }
  };
  exports.loop = function() {
    if (!pLoop) {
      pLoop = true;
    }
  };
  exports.pushStyle = function() {
    var curS = [];
    curS['fillStyle'] = pCurCanvas.context.fillStyle; // fill
    curS['strokeStyle'] = pCurCanvas.context.strokeStyle; // stroke
    curS['lineWidth'] = pCurCanvas.context.lineWidth; // strokeWeight
    // @todo tint
    curS['lineCap'] = pCurCanvas.context.lineCap; // strokeCap
    curS['lineJoin'] = pCurCanvas.context.lineJoin; // strokeJoin
    curS['pImageMode'] = pImageMode; // imageMode
    curS['pRectMode'] = pRectMode; // rectMode
    curS['pEllipseMode'] = pEllipseMode; // elllipseMode
    // @todo shapeMode
    curS['pColorMode'] = pColorMode; // colorMode
    curS['textAlign'] = pCurCanvas.context.textAlign; // textAlign
    // @todo textFont
    curS['pTextLeading'] = pTextLeading; // textLeading
    curS['pTextSize'] = pTextSize; // textSize
    curS['pTextStyle'] = pTextStyle; // textStyle
    // @todo textLeading
    pStyles.push(curS);
  };
  exports.popStyle = function() {
    var lastS = pStyles[pStyles.length-1];
    pCurCanvas.context.fillStyle = lastS['fillStyle']; // fill
    pCurCanvas.context.strokeStyle = lastS['strokeStyle']; // stroke
    pCurCanvas.context.lineWidth = lastS['lineWidth']; // strokeWeight
    // @todo tint
    pCurCanvas.context.lineCap = lastS['lineCap']; // strokeCap
    pCurCanvas.context.lineJoin = lastS['lineJoin']; // strokeJoin
    pImageMode = lastS['pImageMode']; // imageMode
    pRectMode = lastS['pRectMode']; // rectMode
    pEllipseMode = lastS['pEllipseMode']; // elllipseMode
    // @todo shapeMode
    pColorMode = lastS['pColorMode']; // colorMode
    pCurCanvas.context.textAlign = lastS['textAlign']; // textAlign
    // @todo textFont
    pTextLeading = lastS['pTextLeading']; // textLeading
    pTextSize = lastS['pTextSize']; // textSize
    pTextStyle = lastS['pTextStyle']; // textStyle
    // @todo textLeading
    pStyles.pop();
  }

  //////////////////////////////////////
  ////  ENVIRONMENT
  //////////////////////////////////////

  exports.frameCount = 0;
  exports.frameRate = 30;
  exports.height = 100;
  exports.width = 100;
  exports.focused = true;

  window.onfocus = function() {
    exports.focused = true;
  }
  window.onblur = function() {
    exports.focused = false;
  }
  // exports.focused
  exports.cursor = function(type) {
    var cursor = 'auto';
    if (type == CROSS || type == HAND || type == MOVE || type == TEXT || type == WAIT) {
      cursor = type;
    }
    document.getElementsByTagName('body')[0].style.cursor = cursor; 
  }
  exports.displayHeight = screen.height;
  exports.displayWidth = screen.width;
  exports.getFrameRate = function() {
    return frameRate;
  }
  exports.setFrameRate = function(fps) { 
    frameRate = fps; 
    clearInterval(pUpdateInterval);
    pUpdateInterval = setInterval(pUpdate, 1000/frameRate);
  }
  exports.noCursor = function() {
    document.getElementsByTagName('body')[0].style.cursor = 'none';
  }


  //////////////////////////////////////
  ////  DATA
  //////////////////////////////////////

  //// STRING FUNCTIONS ////////////////

  exports.join = function(list, separator) {
    return list.join(separator);
  }
  exports.match =  function(str, reg) {
    return str.match(reg);
  }
  exports.matchAll = function(str, reg) {
    var re = new RegExp(reg, "g");
    match = re.exec(str);
    var matches = []
    while (match != null) {
      matches.push(match);
      // matched text: match[0]
      // match start: match.index
      // capturing group n: match[n]
      match = re.exec(str);
    }
    return matches;
  }
  exports.nf = function() { 
    if (arguments[0] instanceof Array) {
      var a = arguments[1];
      var b = arguments[2];
      return arguments[0].map(function(x) { return doNf(x, a, b);});
    } else {
      return doNf.apply(this, arguments);
    }
  }
  function doNf() {
    var num = arguments[0]
    var neg = (num < 0);
    var n = neg ? num.toString().substring(1) : num.toString();
    var decimalInd = n.indexOf('.')
    var intPart =  decimalInd != -1 ? n.substring(0, decimalInd) : n;
    var decPart = decimalInd != -1 ? n.substring(decimalInd+1) : '';

    var str = neg ? '-' : '';
    if (arguments.length == 3) {
      for (var i=0; i<arguments[1]-intPart.length; i++) { str += '0'; }
      str += intPart;
      str += '.';
      str += decPart;
      for (var i=0; i<arguments[2]-decPart.length; i++) { str += '0'; }
      return str;
    } else {
      for (var i=0; i<max(arguments[1]-intPart.length, 0); i++) { str += '0'; }
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
  }
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
  }
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
  }
  function addNfs() {   
    return (parseFloat(arguments[0]) > 0) ? ' '+arguments[0].toString() : arguments[0].toString();
  }
  exports.split = function(str, delim) {
    return str.split(delim);
  }
  exports.splitTokens = function() {
    var d = (arguments.length > 0) ? arguments[1] : /\s/g;
    return arguments[0].split(d).filter(function(n){return n});
  }
  exports.trim = function(str) {
    if (str instanceof Array) {
      return str.map(trim);
    } else return str.trim();
  }

  //// ARRAY FUNCTIONS /////////////////

  exports.append = function(array, value) {
    array.push(value);
    return array;
  }
  exports.arrayCopy = function(src, a, b, c, d) { //src, srcPosition, dst, dstPosition, length
    if (typeof d !== 'undefined') { 
      for (var i=a; i<min(a+d, srpCurCanvas.length); i++) {
        b[dstPosition+i] = src[i];
      }
    } 
    else if (typeof b !== 'undefined') { //src, dst, length
      a = srpCurCanvas.slice(0, min(b, srpCurCanvas.length)); 
    }
    else { //src, dst
      a = srpCurCanvas.slice(0);  
    }
  }
  exports.concat = function(list0, list1) {
    return list0.concat(list1);
  }
  exports.reverse = function(list) {
    return list.reverse();
  }
  exports.shorten = function(list) { 
    list.pop();
    return list;
  }
  exports.sort = function(list, count) {
    var arr = count ? list.slice(0, min(count, list.length)) : list;
    var rest = count ? list.slice(min(count, list.length)) : [];
    if (typeof arr[0] === 'string') {
      arr = arr.sort();
    } else {
      arr = arr.sort(function(a,b){return a-b});
    }
    return arr.concat(rest);
  }
  exports.splice = function(list, value, index) {
    return list.splice(index,0,value);
  }
  exports.subset = function(list, start, count) {
    if (typeof count !== 'undefined') return list.slice(start, start+count);
    else return list.slice(start, list.length-1);
  }

  //////////////////////////////////////
  ////  SHAPE
  //////////////////////////////////////

  //// 2D PRIMITIVES ///////////////////

  exports.arc = function(a, b, c, d, start, stop, mode) {
    // PEND: TO DO
  };
  exports.ellipse = function(a, b, c, d) {
    var vals = pModeAdjust(a, b, c, d, pEllipseMode);
    var kappa = .5522848,
      ox = (vals.w / 2) * kappa, // control point offset horizontal
      oy = (vals.h / 2) * kappa, // control point offset vertical
      xe = vals.x + vals.w,      // x-end
      ye = vals.y + vals.h,      // y-end
      xm = vals.x + vals.w / 2,  // x-middle
      ym = vals.y + vals.h / 2;  // y-middle
    pCurCanvas.context.beginPath();
    pCurCanvas.context.moveTo(vals.x, ym);
    pCurCanvas.context.bezierCurveTo(vals.x, ym - oy, xm - ox, vals.y, xm, vals.y);
    pCurCanvas.context.bezierCurveTo(xm + ox, vals.y, xe, ym - oy, xe, ym);
    pCurCanvas.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    pCurCanvas.context.bezierCurveTo(xm - ox, ye, vals.x, ym + oy, vals.x, ym);
    pCurCanvas.context.closePath();
    pCurCanvas.context.fill();
    pCurCanvas.context.stroke();
  };
  exports.line = function(x1, y1, x2, y2) {
    if (pCurCanvas.context.strokeStyle === 'none') {
      return;
    }
    pCurCanvas.context.beginPath();
    pCurCanvas.context.moveTo(x1, y1);
    pCurCanvas.context.lineTo(x2, y2);
    pCurCanvas.context.stroke();
  };
  exports.point = function(x, y) {
    var s = pCurCanvas.context.strokeStyle;
    var f = pCurCanvas.context.fillStyle;
    if (s === 'none') {
      return;
    }
    x = Math.round(x);
    y = Math.round(y);
    pCurCanvas.context.fillStyle = s;
    if (pCurCanvas.context.lineWidth > 1) {
      pCurCanvas.context.beginPath();
      pCurCanvas.context.arc(x, y, pCurCanvas.context.lineWidth / 2, 0, TWO_PI, false);
      pCurCanvas.context.fill();
    } else {
      pCurCanvas.context.fillRect(x, y, 1, 1);
    }
    pCurCanvas.context.fillStyle = f;
  };
  exports.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    pCurCanvas.context.beginPath();
    pCurCanvas.context.moveTo(x1, y1);
    pCurCanvas.context.lineTo(x2, y2);
    pCurCanvas.context.lineTo(x3, y3);
    pCurCanvas.context.lineTo(x4, y4);
    pCurCanvas.context.closePath();
    pCurCanvas.context.fill();
    pCurCanvas.context.stroke();
  };
  exports.rect = function(a, b, c, d) {
    var vals = pModeAdjust(a, b, c, d, pRectMode);
    pCurCanvas.context.beginPath();
    pCurCanvas.context.rect(vals.x, vals.y, vals.w, vals.h);
    pCurCanvas.context.fill();
    pCurCanvas.context.stroke();
  };
  exports.triangle = function(x1, y1, x2, y2, x3, y3) {
    pCurCanvas.context.beginPath();
    pCurCanvas.context.moveTo(x1, y1);
    pCurCanvas.context.lineTo(x2, y2);
    pCurCanvas.context.lineTo(x3, y3);
    pCurCanvas.context.closePath();
    pCurCanvas.context.fill();
    pCurCanvas.context.stroke();
  }

  //// CURVES //////////////////////////

  exports.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    pCurCanvas.context.beginPath();
    pCurCanvas.context.moveTo(x1, y1);
    pCurCanvas.context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    pCurCanvas.context.stroke();
  }
  exports.bezierDetail = function() {
    // TODO
  }
  exports.bezierPoint = function() {
    // TODO
  }
  exports.bezierTangent = function() {
    // TODO
  }
  exports.curve = function() {
    // TODO
  }
  exports.curveDetail = function() {
    // TODO
  }
  exports.curvePoint = function() {
    // TODO
  }
  exports.curveTangent = function() {
    // TODO
  }
  exports.curveTightness = function() {
    // TODO
  }

  //// ATTRIBUTES //////////////////////

  exports.ellipseMode = function(m) {
    if (m == exports.CORNER || m == exports.CORNERS || m == exports.RADIUS || m == exports.CENTER) {
      pEllipseMode = m;
    }
  }
  exports.noSmooth = function() {
    pCurCanvas.context.mozImageSmoothingEnabled = false;
    pCurCanvas.context.webkitImageSmoothingEnabled = false;
  }
  exports.rectMode = function(m) {
    if (m == exports.CORNER || m == exports.CORNERS || m == exports.RADIUS || m == exports.CENTER) {
      pRectMode = m;
    }
  }
  exports.smooth = function() {
    pCurCanvas.context.mozImageSmoothingEnabled = true;
    pCurCanvas.context.webkitImageSmoothingEnabled = true;
  }
  exports.strokeCap = function(cap) {
    if (cap == exports.ROUND || cap == exports.SQUARE || cap == exports.PROJECT) {
      pCurCanvas.context.lineCap=cap;
    }
  }
  exports.strokeJoin = function(join) {
    if (join == exports.ROUND || join == exports.BEVEL || join == exports.MITER) {
      pCurCanvas.context.lineJoin = join;
    }
  }
  exports.strokeWeight = function(w) {
    pCurCanvas.context.lineWidth = w;
    if (typeof w === 'undefined') noStroke();
  }

  //// VERTEX //////////////////////////

  exports.beginContour = function() {
    // TODO
  }
  exports.beginShape = function(kind) {
    if (kind == exports.POINTS || kind == exports.LINES || kind == exports.TRIANGLES || kind == exports.TRIANGLE_FAN 
      || kind == exports.TRIANGLE_STRIP || kind == exports.QUADS || kind == exports.QUAD_STRIP)
      pShapeKind = kind;
    else pShapeKind = null; 
    pShapeInited = true;
    pCurCanvas.context.beginPath();
  }
  exports.bezierVertex = function(x1, y1, x2, y2, x3, y3) {
    pCurCanvas.context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
  }
  exports.curveVertex = function() {
    // TODO
  }
  exports.endContour = function() {
    // TODO
  }
  exports.endShape = function(mode) {
    if (mode == exports.CLOSE) {
      pCurCanvas.context.closePath();
      pCurCanvas.context.fill();
    } 
    pCurCanvas.context.stroke();
  }
  exports.quadraticVertex = function(cx, cy, x3, y3) {
    pCurCanvas.context.quadraticCurveTo(cx, cy, x3, y3);
  }
  exports.vertex = function(x, y) {
    if (pShapeInited) {
      pCurCanvas.context.moveTo(x, y);
    } else {
      pCurCanvas.context.lineTo(x, y); // pend this is where check for kind and do other stuff
    }
    pShapeInited = false;
  }

  //////////////////////////////////////
  ////  INPUT
  //////////////////////////////////////

  //// MOUSE ///////////////////////////

  exports.mouseX = 0;
  exports.mouseY = 0;
  exports.pmouseX = 0;
  exports.pmouseY = 0;
  exports.mouseButton = 0;
  var pMousePressed = false;

  exports.isMousePressed = function() {
    return pMousePressed;
  }
  exports.pUpdateMouseCoords = function(e) {
    pmouseX = exports.mouseX;
    pmouseY = exports.mouseY;
    exports.mouseX = e.clientX;// - parseInt(pCurCanvas.elt.style.left, 10);
    exports.mouseY = e.clientY;// - parseInt(pCurCanvas.elt.style.top, 10);
    // console.log(mouseX+' '+mouseY);
    // console.log('mx = '+mouseX+' my = '+mouseY);
  }

  function pSetMouseButton(e) {
   exports.mouseButton = exports.LEFT;
    if (e.button == 1) {
      exports.mouseButton = exports.CENTER;
    } else if (e.button == 2) {
      exports.mouseButton = exports.RIGHT;
    }
  }

  //// KEYBOARD ////////////////////////

  exports.key = '';
  exports.keyCode = 0; 
  var pKeyPressed = false;

  exports.isKeyPressed = function() {
    return pKeyPressed;
  }
  function pSetupInput() {
    document.body.onmousemove=function(e){
      pUpdateMouseCoords(e);
      if (typeof mouseMoved === 'function')
        mouseMoved(e);
    }
    document.body.onmousedown=function(e){
      pMousePressed = true;
      pSetMouseButton(e);
      if (typeof mousePressed === 'function')
        mousePressed(e);
    }
    document.body.onmouseup=function(e){
      pMousePressed = false;
      if (typeof mouseReleased === 'function')
        mouseReleased(e);
    }
    document.body.onmouseclick=function(e){
      if (typeof mouseClicked === 'function')
        mouseClicked(e);
    }
    document.body.onkeydown=function(e){
      pKeyPressed = true;
      exports.keyCode = e.keyCode;
      exports.key = String.fromCharCode(e.keyCode);
      if (typeof keyPressed === 'function')
        keyPressed(e);
    }
    document.body.onkeyup=function(e){
      pKeyPressed = false;
      if (typeof keyReleased === 'function')
        keyReleased(e);
    }
    document.body.onkeypress=function(e){
      if (typeof keyTyped === 'function')
        keyTyped(e);
    }
  }

  //// FILES ///////////////////////////

  //BufferedReader
  exports.createInput = function() {
    // TODO
  }
  exports.createReader = function() {
    // TODO
  }
  exports.loadBytes = function() {
    // TODO
  }
  exports.loadJSON = function(file, callback) {
    var req = new XMLHttpRequest();  
    req.overrideMimeType('application/json');  
    req.open('GET', 'data/'+file);  
    req.onreadystatechange = function () {
      if(req.readyState === 4) {
        if(req.status === 200 || req.status == 0) {
          if (typeof callback !== 'undefined') callback();
          return JSON.parse(req.responseText);
        }
      }
    }
    req.send(null);
  }
  exports.loadStrings = function(file, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', 'data/'+file, true);
    req.onreadystatechange = function () {
      if(req.readyState === 4) {
        if(req.status === 200 || req.status == 0) {
          if (typeof callback !== 'undefined') callback();
          return req.responseText.match(/[^\r\n]+/g);
        }
      }
    }
    req.send(null);
  }
  exports.loadTable = function () {
    // TODO
  }
  /*exports.loadXML = function() {
    var req = new XMLHttpRequest();  
    req.overrideMimeType('application/json');  
    req.overrideMimeType('text/xml');
    req.open('GET', 'data/'+file, false);  
    req.onreadystatechange = function () {
      if(req.readyState === 4) {
        if(req.status === 200 || req.status == 0) {
          console.log(JSON.parse(req.responseXML));
          return JSON.parse(req.responseXML);
        }
      }
    }
    req.send(null);
  }*/
  exports.open = function() {
    // TODO
  }
  exports.parseXML = function() {
    // TODO
  }
  exports.saveTable = function() {
    // TODO
  }
  exports.selectFolder = function() {
    // TODO
  }
  exports.selectInput = function() {
    // TODO
  }

  //// TIME & DATE /////////////////////

  exports.day = function() {
    return new Date().getDate();
  }
  exports.hour = function() {
    return new Date().getHours();
  }
  exports.millis = function() {
    return new Date().getTime() - pStartTime;
  }
  exports.month = function() {
    return new Date().getMonth();
  }
  exports.second = function() {
    return new Date().getSeconds();
  }
  exports.year = function() {
    return new Date().getFullYear();
  }

  //////////////////////////////////////
  ////  OUTPUT
  //////////////////////////////////////

  //// TEXT AREA ///////////////////////
  exports.print = function(s) {
    console.log(s);
  }
  exports.println = function(s) {
    console.log(s);
  }

  //// IMAGE ///////////////////////////

  exports.save = function() {
    exports.open(pCurCanvas.toDataURL());
  }

  //// FILES ///////////////////////////

  exports.pWriters = [];
  exports.beginRaw = function() {
    // TODO
  }
  exports.beginRecord = function() {
    // TODO
  }
  exports.createOutput = function() {
    // TODO
  }
  exports.createWriter  = function(name) {
    if (pWriters.indexOf(name) == -1) { // check it doesn't already exist
      pWriters['name'] = new PrintWriter(name);
    }
  }
  exports.endRaw = function() {
    // TODO
  }
  exports.endRecord  = function() {
    // TODO
  }
  exports.PrintWriter = function(name) {
     this.name = name;
     this.content = '';
     this.print = function(data) { this.content += data; };
     this.println = function(data) { this.content += data + '\n'; };
     this.flush = function() { this.content = ''; };
     this.close = function() { writeFile(this.content); };
  }
  exports.saveBytes = function() {
    // TODO
  }
  exports.saveJSONArray = function() {
    // TODO
  }
  exports.saveJSONObject = function() {
    // TODO
  }
  exports.saveStream = function() {
    // TODO
  }
  exports.saveStrings = function(list) {
    writeFile(list.join('\n'));
  }
  exports.saveXML = function() {
    // TODO
  }
  exports.selectOutput = function() {
    // TODO
  }
  exports.writeFile = function(content) {
    exports.open('data:text/json;charset=utf-8,' + escape(content), 'download'); 
  }

  //////////////////////////////////////
  //// TRANSFORM
  //////////////////////////////////////

  exports.applyMatrix = function(n00, n01, n02, n10, n11, n12) {
    pCurCanvas.context.transform(n00, n01, n02, n10, n11, n12);
    var m = pMatrices[pMatrices.length-1];
    m = pMultiplyMatrix(m, [n00, n01, n02, n10, n11, n12]);
  }
  exports.popMatrix = function() { 
    pCurCanvas.context.restore(); 
    pMatrices.pop();
  }
  exports.printMatrix = function() {
    console.log(pMatrices[pMatrices.length-1]);
  }
  exports.pushMatrix = function() { 
    pCurCanvas.context.save(); 
    pMatrices.push([1,0,0,1,0,0]);
  }
  exports.resetMatrix = function() { 
    pCurCanvas.context.setTransform();
    pMatrices[pMatrices.length-1] = [1,0,0,1,0,0]; 
  }
  exports.rotate = function(r) { 
    pCurCanvas.context.rotate(r); 
    var m = pMatrices[pMatrices.length-1];
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
  }
  exports.scale = function(x, y) { 
    pCurCanvas.context.scale(x, y); 
    var m = pMatrices[pMatrices.length-1];
    m[0] *= x;
    m[1] *= x;
    m[2] *= y;
    m[3] *= y;
  }
  exports.shearX = function(angle) {
    pCurCanvas.context.transform(1, 0, tan(angle), 1, 0, 0);
    var m = pMatrices[pMatrices.length-1];
    m = pMultiplyMatrix(m, [1, 0, tan(angle), 1, 0, 0]);
  }
  exports.shearY = function(angle) {
    pCurCanvas.context.transform(1, tan(angle), 0, 1, 0, 0);
    var m = pMatrices[pMatrices.length-1];
    m = pMultiplyMatrix(m, [1, tan(angle), 0, 1, 0, 0]);
  }
  exports.translate = function(x, y) { 
    pCurCanvas.context.translate(x, y); 
    var m = pMatrices[pMatrices.length-1];
    m[4] += m[0] * x + m[2] * y;
    m[5] += m[1] * x + m[3] * y;
  }

  //////////////////////////////////////
  ////  COLOR
  //////////////////////////////////////

  //// SETTING /////////////////////////

  exports.background = function() { 
    var c = getNormalizedColor(arguments);
    // save out the fill
    var curFill = pCurCanvas.context.fillStyle;
    // create background rect
    pCurCanvas.context.fillStyle = getCSSRGBColor(c);
 
    pCurCanvas.context.fillRect(0, 0, width, height);
    // reset fill
    pCurCanvas.context.fillStyle = curFill;
  }
  exports.clear = function() {
    pCurCanvas.context.clearRect(0, 0, width, height);
  }
  exports.colorMode = function(mode) { 
    if (mode == exports.RGB || mode == exports.HSB)
      pColorMode = mode; 
  }
  exports.fill = function() {
    var c = getNormalizedColor(arguments);
    pCurCanvas.context.fillStyle = getCSSRGBColor(c);
  }
  exports.noFill = function() {
    pCurCanvas.context.fillStyle = 'none';
  }
  exports.noStroke = function() {
    pCurCanvas.context.strokeStyle = 'none';
  }
  exports.stroke = function() {
    var c = getNormalizedColor(arguments);
    pCurCanvas.context.strokeStyle = getCSSRGBColor(c);
  }

  //// CREATING & READING //////////////

  exports.alpha = function(rgb) {
    if (rgb.length > 3) return rgb[3];
    else return 255;
  }
  exports.blue = function(rgb) { 
    if (rgb.length > 2) return rgb[2];
    else return 0;
  }
  exports.brightness = function(hsv) {
    if (rgb.length > 2) return rgb[2];
    else return 0;
  }
  exports.color = function() {
    return getNormalizedColor(arguments);
  }
  exports.green = function(rgb) { 
    if (rgb.length > 2) return rgb[1];
    else return 0;
  }
  exports.hue = function(hsv) { 
    if (rgb.length > 2) return rgb[0];
    else return 0;
  }
  exports.lerpColor = function(c1, c2, amt) {
    var c = [];
    for (var i=0; i<c1.length; i++) {
      c.push(lerp(c1[i], c2[i], amt));
    }
    return c;
  }
  exports.red = function(rgb) { 
    if (rgb.length > 2) return rgb[0];
    else return 0;
  }
  exports.saturation = function(hsv) { 
    if (hsv.length > 2) return hsv[1];
    else return 0;
  }

  //////////////////////////////////////
  ////  IMAGE
  //////////////////////////////////////

  //// PIMAGE //////////////////////////

  exports.createImage = function(w, h, format) {
    return new PImage(w, h);
  } //pend format?
  function PImage(w, h) {
    this.image = pCurCanvas.context.createImageData(w,h); 
    this.pixels = [];
    this.updatePixelArray();
  }
  PImage.prototype.loadPixels = function() { 
    this.image = context.createImageData(imageData); 
    this.updatePixelArray();
  };
  PImage.prototype.updatePixelArray = function() {  
    for (var i=0; i<this.data.length; i+=4) {
      this.pixels.push([this.data[i], this.data[i+1], this.data[i+2], this.data[i+3]]);
    }
  }
  PImage.prototype.updatePixels = function() {
    for (var i=0; i<this.pixels; i+=4) {
      for (var j=0; j<4; j++) {
        this.data[4*i+j] = this.pixels[i][j];
      }
    }
  };
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
  }
  PImage.prototype.set = function() {
    // TODO
    // writes a color to any pixel or writes an image into another
  };
  PImage.prototype.mask = function() {
    // TODO
    // Masks part of an image with another image as an alpha channel
  };
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

  //// LOADING & DISPLAYING //////////////////

  exports.image = function(img, a, b, c, d) { 
    if (typeof c !== 'undefined' && typeof d !== 'undefined') {
      var vals = pModeAdjust(a, b, c, d, pImageMode);
      pCurCanvas.context.drawImage(img, vals.x, vals.y, vals.w, vals.h);
    } else {
      pCurCanvas.context.drawImage(img, a, b);
    }
  }
  exports.imageMode = function(m) {
    if (m == exports.CORNER || m == exports.CORNERS || m == exports.CENTER) pImageMode = m;
  }
  exports.loadImage = function(path, callback) { 
    var imgObj = new Image();
    imgObj.onload = function() {
      if (typeof callback !== 'undefined') callback();
    }
    imgObj.src = path;
    return imgObj;
  }

  //// PIXELS ////////////////////////////////

  exports.pixels = [];
  exports.blend = function() {
    // TODO
  }
  exports.copy = function() {
    // TODO
  }
  exports.filter = function() {
    // TODO
  }
  exports.get = function(x, y, w, h) {
    var pix = pCurCanvas.context.getImageData(0, 0, width, height).data.slice(0);
    if (typeof w !== 'undefined' && typeof h !== 'undefined') {
      var region = [];
      for (var j=0; j<h; j++) {
        for (var i=0; i<w; i++) {
          region[i*w+j] = pix[(y+j)*width+(x+i)]; 
        }
      }
      return region;
    }
    else if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        return pix[y*width+x].data;
      } else {
        return [0, 0, 0, 255];
      }
    }
    else { return pix; }
  }
  exports.loadPixels = function() { 
    pixels = pCurCanvas.context.getImageData(0, 0, width, height).data.slice(0); // pend should this be 0,0 or  pCurCanvas.offsetLeft,pCurCanvas.offsetTop?
  }
  exports.set = function() {
    // TODO
  }
  exports.updatePixels = function() {
    if (typeof pixels !== 'undefined') {
      var imgd = pCurCanvas.context.getImageData(x, y, width, height);
      imgd = pixels;
      context.putImageData(imgd, 0, 0);
    }
  }

  //////////////////////////////////////
  ////  TYPOGRAPHY
  //////////////////////////////////////

  //// LOADING & DISPLAYING ////////////
  /*
    text(str, x, y)
    text(str, x1, y1, x2, y2)
  */
  exports.text = function() {
    pCurCanvas.context.font=pTextStyle+' '+pTextSize+'px Verdana';
    if (arguments.length == 3) {
      pCurCanvas.context.fillText(arguments[0], arguments[1], arguments[2]);
    } else if (arguments.length == 5) {
      var words = arguments[0].split(' ');
      var line = '';
      var vals = pModeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], pRectMode);
      vals.y += pTextLeading;
      for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = pCurCanvas.context.measureText(testLine);
        var testWidth = metrics.width;
        if (vals.y > vals.h) {
          break;
        }
        else if (testWidth > vals.w && n > 0) {
          pCurCanvas.context.fillText(line, vals.x, vals.y);
          line = words[n] + ' ';
          vals.y += pTextLeading;
        }
        else {
          line = testLine;
        }
      }
      if (vals.y <= vals.h) pCurCanvas.context.fillText(line, vals.x, vals.y);
    }
  }

  //// ATTRIBUTES //////////////////////
  exports.NORMAL = 'normal', exports.ITALIC = 'italic', exports.BOLD = 'bold';
  exports.textAlign = function(a) {
    if (a == exports.LEFT || a == exports.RIGHT || a == exports.CENTER) pCurCanvas.context.textAlign = a;
  }
  exports.textHeight = function(s) {
    return pCurCanvas.context.measureText(s).height;
  }
  exports.textLeading = function(l) {
    pTextLeading = l;
  }
  exports.textSize = function(s) {
    pTextSize = s;
  }
  exports.textStyle = function(s) {
    if (s == exports.NORMAL || s == exports.ITALIC || s == exports.BOLD) {
      pTextStyle = s;
    }
  }
  exports.textWidth = function(s) {
    return pCurCanvas.context.measureText(s).width;
  }


  //////////////////////////////////////
  ////  MATH
  //////////////////////////////////////

  //// CALCULATION /////////////////////
  /** @module Math */
  /** returns abs value */
  exports.abs = function(n) { return Math.abs(n); }
  exports.ceil = function(n) { return Math.ceil(n); }
  exports.constrain = function(n, l, h) { return max(min(n, h), l); }
  exports.dist = function(x1, y1, x2, y2) {
    var xs = x2-x1;
    var ys = y2-y1;
    return Math.sqrt( xs*xs + ys*ys );
  }
  exports.exp = function(n) { return Math.exp(n); }
  exports.floor = function(n) { return Math.floor(n); }
  exports.lerp = function(start, stop, amt) {
    return amt*(stop-start)+start;
  }
  exports.log = function(n) { return Math.log(n); }
  exports.mag = function(x, y) { return Math.sqrt(x*x+y*y); }
  exports.map = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  }
  exports.max = function(a, b) { return Math.max(a, b); }
  exports.min = function(a, b) { return Math.min(a, b); }
  exports.norm = function(n, start, stop) { return map(n, start, stop, 0, 1); }
  exports.pow = function(n, e) { return Math.pow(n, e); }
  exports.sq = function(n) { return n*n; }
  exports.sqrt = function(n) { return Math.sqrt(n); }

  //// TRIGONOMETRY ////////////////////

  exports.acos = function(x) { return Math.acos(x); }
  exports.asin = function(x) { return Math.asin(x); }
  exports.atan = function(x) { return Math.atan(x); }
  exports.atan2 = function(y, x) { return Math.atan2(y, x); }
  exports.cos = function(x) { return Math.cos(x); }
  exports.degrees = function(x) { return 360.0*x/(2*Math.PI); }
  exports.radians = function(x) { return 2*Math.PI*x/360.0; }
  exports.sin = function(x) { return Math.sin(x); }
  exports.tan = function(x) { return Math.tan(x); }

  //// RANDOM //////////////////////////

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
  }

  //////////////////////////////////////
  ////
  ////  CONSTANTS
  ////
  //////////////////////////////////////

  exports.HALF_PI = Math.PI*0.5;
  exports.PI = Math.PI;
  exports.QUARTER_PI = Math.PI*0.25;
  exports.TAU = Math.PI*2.0;
  exports.TWO_PI = Math.PI*2.0;

  exports.CORNER = 'corner', CORNERS = 'corners', exports.RADIUS = 'radius';
  exports.RIGHT = 'right', exports.LEFT = 'left', exports.CENTER = 'center';
  exports.POINTS = 'points', exports.LINES = 'lines', exports.TRIANGLES = 'triangles', exports.TRIANGLE_FAN = 'triangles_fan',
  exports.TRIANGLE_STRIP = 'triangles_strip', exports.QUADS = 'quads', exports.QUAD_STRIP = 'quad_strip';
  exports.CLOSE = 'close';
  exports.OPEN = 'open', exports.CHORD = 'chord', exports.PIE = 'pie';
  exports.SQUARE = 'butt', exports.ROUND = 'round', exports.PROJECT = 'square'; // PEND: careful this is counterintuitive
  exports.BEVEL = 'bevel', exports.MITER = 'miter';
  exports.RGB = 'rgb', exports.HSB = 'hsb';
  exports.AUTO = 'auto';
  exports.CROSS = 'crosshair', exports.HAND = 'pointer', exports.MOVE = 'move', exports.TEXT = 'text', exports.WAIT = 'wait';


  //////////////////////////////////////
  ////
  //// EXTENSIONS
  ////
  //////////////////////////////////////

  //// MISC ////////////////////////////

  //// PElement ////////////////////////

  function PElement(elt, w, h) {
    this.elt = elt;
    this.width = w;
    this.height = h;
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
      this.width = aW;
      this.height = aH;
      this.elt.width = aW;
      this.elt.height = aH;
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
    this.elt.display = 'block';
  }
  PElement.prototype.hide = function() {
    this.elt.style.display = 'none';
  }
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

  //// CREATE //////////////////////////

  exports.createGraphics = function(w, h, isDefault) {
    //console.log('create canvas');
    var c = document.createElement('canvas');
    width = w;
    height = h;
    c.setAttribute('width', width);
    c.setAttribute('height', height);
    if (isDefault) {
      c.id = 'defaultCanvas';
    } else { // remove the default canvas if new one is created
      var defaultCanvas = document.getElementById('defaultCanvas');
      if (defaultCanvas) {
        defaultCanvas.parentNode.removeChild(defaultCanvas);
      }
    }
    document.body.appendChild(c);

    pCurCanvas =  new PElement(c, w, h);
    pApplyDefaults();
    pSetupInput();
    context(pCurCanvas);

    return pCurCanvas;
  }
  exports.createElement = function(html) {
    var c = document.createElement('div');
    c.innerHTML = html;
    document.body.appendChild(c);

    return new PElement(c);
  }
  exports.createDOMImage = function(src, alt) {
    var c = document.createElement('img');
    c.src = src;
    if (typeof alt !== 'undefined') {
      c.alt = alt;
    }
    document.body.appendChild(c);

    return new PElement(c);
  }

  //// CONTEXT /////////////////////////

  exports.context = function(e) {
    var obj = (typeof e == 'string' || e instanceof String) ? document.getElementById(id) : e;
    if (typeof obj !== 'undefined') {
      pCurCanvas = obj;
      width = parseInt(obj.elt.getAttribute('width'), 10);
      height = parseInt(obj.elt.getAttribute('height'), 10);
      pCurCanvas.context.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  //// ACCESS //////////////////////////

  exports.get = function(e) {
    // TODO
  }

  //////////////////////////////////////
  ////
  //// CORE PJS STUFF
  //// 
  //////////////////////////////////////

  var pCurCanvas;
  var pShapeKind = null, pShapeInited = false;
  var pFill = false;
  var pLoop = true;
  var pStartTime;
  var pUpdateInterval;
  var pRectMode = exports.CORNER, pImageMode = exports.CORNER;
  var pEllipseMode = exports.CENTER;
  var pMatrices = [[1,0,0,1,0,0]];
  var pTextLeading = 15;
  var pTextSize = 12;
  var pTextStyle = exports.NORMAL;
  var pColorMode = exports.RGB;
  var pStyles = [];
  exports.onload = function() {
    pCreate();
  };
  function pCreate() {
    exports.createGraphics(800, 600, true); // default canvas
    pStartTime = new Date().getTime();
    if (typeof setup === 'function') setup();
    else console.log("sketch must include a setup function")
    pUpdateInterval = setInterval(pUpdate, 1000/frameRate);
    pDraw();
  }
  function pApplyDefaults() {
    pCurCanvas.context.fillStyle = '#FFFFFF';
    pCurCanvas.context.strokeStyle = '#000000';
    pCurCanvas.context.lineCap=exports.ROUND;
  }
  function pUpdate() {
    frameCount++;
  }
  function pDraw() {
    if (pLoop) {
      setTimeout(function() {
          requestAnimationFrame(pDraw);
      }, 1000 / frameRate);
    }
    // call draw
    if (typeof draw === 'function') draw();
    pCurCanvas.context.setTransform(1, 0, 0, 1, 0, 0);
  }
  function pModeAdjust(a, b, c, d, mode) {
    if (mode == exports.CORNER) {
      return { x: a, y: b, w: c, h: d };
    } else if (mode == exports.CORNERS) {
      return { x: a, y: b, w: c-a, h: d-b };
    } else if (mode == exports.RADIUS) {
      return { x: a-c, y: b-d, w: 2*c, h: 2*d };
    } else if (mode == exports.CENTER) {
      return { x: a-c*0.5, y: b-d*0.5, w: c, h: d };
    }
  }
  function pMultiplyMatrix(m1, m2) {
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
  }

  //////////////////////////////////////
  ////
  //// MISC HELPER FXNS
  ////
  //////////////////////////////////////

  /*************************************/
  // Expects: An 'array-like' object
  // Returns: An array with [r, g, b, a] values
  // Refers : https://gist.github.com/cowboy/5efe9449f4b15ea2e395
  /*************************************/
  function getNormalizedColor(args) {
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
    if (pColorMode == exports.HSB) {
      rgba = hsv2rgb(r, g, b).concat(a);
    } else {
      rgba = [r, g, b, a];
    }

    return rgba;
  }

  /*************************************/
  // Expects: An array with [r, g, b(, a)] values
  // Returns: A CSS color data type string
  // Refers : https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
  /*************************************/
  function getCSSRGBColor(arr) {
    var a = arr.map(function(val) {
      return Math.floor(val);
    });
    var alpha = a[3] ? (a[3]/255.0) : 1;
    return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
  }

  function rgb2hsv(r,g,b) {
    var computedH = 0;
    var computedS = 0;
    var computedV = 0;
    //remove spaces from input RGB values, convert to int
    var r = parseInt( (''+r).replace(/\s/g,''),10 ); 
    var g = parseInt( (''+g).replace(/\s/g,''),10 ); 
    var b = parseInt( (''+b).replace(/\s/g,''),10 ); 
    if ( r==null || g==null || b==null ||
       isNaN(r) || isNaN(g)|| isNaN(b) ) {
     alert ('Please enter numeric RGB values!');
     return;
    }
    if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
     alert ('RGB values must be in the range 0 to 255.');
     return;
    }
    r=r/255; g=g/255; b=b/255;
    var minRGB = Math.min(r,Math.min(g,b));
    var maxRGB = Math.max(r,Math.max(g,b));
    // Black-gray-white
    if (minRGB==maxRGB) {
    computedV = minRGB;
    return [0,0,computedV];
    }
    // Colors other than black-gray-white:
    var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
    var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
    computedH = 60*(h - d/(maxRGB - minRGB));
    computedS = (maxRGB - minRGB)/maxRGB;
    computedV = maxRGB;
    return [computedH,computedS,computedV];
  }

  function hsv2rgb(h,s,v) {
    // Adapted from http://www.easyrgb.com/math.html
    // hsv values = 0 - 1, rgb values = 0 - 255
    var r, g, b;
    var RGB = new Array();
    if(s==0){
      RGB = [Math.round(v*255), Math.round(v*255), Math.round(v*255)]; 
    }else{
      // h must be < 1
      var var_h = h * 6;
      if (var_h==6) var_h = 0;
      //Or ... var_i = floor( var_h )
      var var_i = Math.floor( var_h );
      var var_1 = v*(1-s);
      var var_2 = v*(1-s*(var_h-var_i));
      var var_3 = v*(1-s*(1-(var_h-var_i)));
      if(var_i==0){ 
        var_r = v; 
        var_g = var_3; 
        var_b = var_1;
      }else if(var_i==1){ 
        var_r = var_2;
        var_g = v;
        var_b = var_1;
      }else if(var_i==2){
        var_r = var_1;
        var_g = v;
        var_b = var_3
      }else if(var_i==3){
        var_r = var_1;
        var_g = var_2;
        var_b = v;
      }else if (var_i==4){
        var_r = var_3;
        var_g = var_1;
        var_b = v;
      }else{ 
        var_r = v;
        var_g = var_1;
        var_b = var_2
      }
      //rgb results = 0 ÷ 255  
      RGB = [Math.round(var_r * 255), Math.round(var_g * 255), Math.round(var_b * 255)];
      }
    return RGB;  
  };
}(window));

