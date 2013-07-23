
// pend tempz
var pCurCanvas;

var CORNER = "corner", CORNERS = "corners", RADIUS = "radius";
var RIGHT = "right", LEFT = "left", CENTER = "center";
var POINTS = "points", LINES = "lines", TRIANGLES = "triangles", TRIANGLE_FAN = "triangles_fan",
TRIANGLE_STRIP = "triangles_strip", QUADS = "quads", QUAD_STRIP = "quad_strip";
var CLOSE = "close";
var OPEN = "open", CHORD = "chord", PIE = "pie";
var SQUARE = "butt", ROUND = "round", PROJECT = "square"; // PEND: careful this is counterintuitive
var BEVEL = "bevel", MITER = "miter";
var RGB = "rgb", HSB = "hsb";
var AUTO = "auto";


var pShapeKind = null, pShapeInited = false;
var pFill = false;
var pLoop = true;
var pStartTime;
var pUpdateInterval;
var pRectMode = CORNER, pImageMode = CORNER;
var pEllipseMode = CENTER;
var pMatrices = [[1,0,0,1,0,0]];
var pTextSize = 12;
var pColorMode = RGB;


////	STRUCTURE
var draw;
function noLoop() {	
	if (pLoop) {
		pLoop = false; 
	}
}

function loop() { 
	if (!pLoop) {
		pLoop = true;
	}
}
function redraw() {
	pDraw();
}
var setup;



//// ENVIRONMENT
//cursor()
function displayHeight() { return window.innerHeight; }
function displayWidth() { return window.innerWidth; }
//focused
var frameCount = 0;
var frameRate = 30;
function getFrameRate() { return frameRate; }
var height = 100;
function setFrameRate(fps) { 
	frameRate = fps; 
	clearInterval(pUpdateInterval);
	pUpdateInterval = setInterval(pUpdate, 1000/frameRate);
}
//noCursor()
function size(w, h) {
	width = w;
	height = h;
	pCurCanvas.setAttribute('width', width);
	pCurCanvas.setAttribute('height', height);
	pApplyDefaults();
}
var width = 100;



//// DATA

// String Functions
function join(list, separator) { return list.join(separator); }
function match(str, reg) { return str.match(reg); }
//function matchAll(str, reg) {}
function nf(num, digits) { 
	var str = "";
	for (var i=0; i<min(digits-num.toString().length, 0); i++) {
		str += "0";
	}
	return str+num;
}
/*
function nfc() {}
function nfp() {}
function nfs()*/
function split(str, delim) { return str.split(delim); }
//function splitTokens(str, delim) {}
function trim(str) {
	if (str instanceof Array) {
		var strps = [];
		for (var i=0; i<str.length; i++) {
			stps.push(str[i].trim());
		}
		return strps;
	} else return str.trim();
}

// Array Functions
function append(array, value) { return array.push(value); }
function arrayCopy(src, a, b, c, d) { //src, srcPosition, dst, dstPosition, length
	if (d) { 
		for (var i=a; i<min(a+d, srpCurCanvas.length); i++) {
			b[dstPosition+i] = src[i];
		}
	} 
	else if (b) { //src, dst, length
		a = srpCurCanvas.slice(0, min(b, srpCurCanvas.length)); 
	}
	else { //src, dst
		a = srpCurCanvas.slice(0);	
	}
}
function concat(list0, list1) { return list0.concat(list1); }
function reverse(list) { return list.reverse(); }
function shorten(list) { 
	list.pop();
	return list;
}
//function sort(list, count) {}
function splice(list, value, index) { return list.splice(index,0,value); }
function subset(list, start, count) {
	if (count) return list.slice(start, start+count);
	else return list.slice(start, list.length-1);
}




//// SHAPE

// 2D Primitives
function arc(a, b, c, d, start, stop, mode) {

}
function ellipse(a, b, c, d) {

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
}
function line(x1, y1, x2, y2) {
	pCurCanvas.context.beginPath();
	pCurCanvas.context.moveTo(x1, y1);
	pCurCanvas.context.lineTo(x2, y2);
	pCurCanvas.context.stroke();
}
// point
function quad(x1, y1, x2, y2, x3, y3, x4, y4) {
	pCurCanvas.context.beginPath();
	pCurCanvas.context.moveTo(x1, y1);
	pCurCanvas.context.lineTo(x2, y2);
	pCurCanvas.context.lineTo(x3, y3);
	pCurCanvas.context.lineTo(x4, y4);
	pCurCanvas.context.closePath();
	pCurCanvas.context.fill();
	pCurCanvas.context.stroke();
}

function rect(a, b, c, d) {
	var vals = pModeAdjust(a, b, c, d, pRectMode);
	pCurCanvas.context.beginPath();
	pCurCanvas.context.rect(vals.x, vals.y, vals.w, vals.h);
	pCurCanvas.context.fill();
	pCurCanvas.context.stroke();
}

function triangle(x1, y1, x2, y2, x3, y3) {
	pCurCanvas.context.beginPath();
	pCurCanvas.context.moveTo(x1, y1);
	pCurCanvas.context.lineTo(x2, y2);
	pCurCanvas.context.lineTo(x3, y3);
	pCurCanvas.context.closePath();
	pCurCanvas.context.fill();
	pCurCanvas.context.stroke();
}

// Curves
function bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
	pCurCanvas.context.beginPath();
	pCurCanvas.context.moveTo(x1, y1);
	pCurCanvas.context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
	pCurCanvas.context.stroke();
}
//bezierDetail()
/*bezierPoint()
bezierTangent()
curve()
curveDetail()
curvePoint()
curveTangent()
curveTightness()
*/


// Attributes
function ellipseMode(m) {
	if (m == CORNER || m == CORNERS || m == RADIUS || m == CENTER) {
		pEllipseMode = m;
	}
}
function noSmooth() {
	pCurCanvas.context.mozImageSmoothingEnabled = false;
	pCurCanvas.context.webkitImageSmoothingEnabled = false;
}
function rectMode(m) {
	if (m == CORNER || m == CORNERS || m == RADIUS || m == CENTER) {
		pRectMode = m;
	}
}
function smooth() {
	pCurCanvas.context.mozImageSmoothingEnabled = true;
	pCurCanvas.context.webkitImageSmoothingEnabled = true;
}
function strokeCap(cap) {
	if (cap == ROUND || cap == SQUARE || cap == PROJECT) {
		pCurCanvas.context.lineCap=cap;
	}
}
function strokeJoin(join) {
	if (join == ROUND || join == BEVEL || join == MITER) {
		pCurCanvas.context.lineJoin = join;
	}
}
function strokeWeight(w) {
	pCurCanvas.context.lineWidth = w;
	if (!w) noStroke();
}


//Vertex
//beginContour()
function beginShape(kind) {
	if (kind == POINTS || kind == LINES || kind == TRIANGLES || kind == TRIANGLE_FAN 
		|| kind == TRIANGLE_STRIP || kind == QUADS || kind == QUAD_STRIP)
		pShapeKind = kind;
	else pShapeKind = null; 
	pShapeInited = true;
	pCurCanvas.context.beginPath();
}
function bezierVertex(x1, y1, x2, y2, x3, y3) { pCurCanvas.context.bezierCurveTo(x1, y1, x2, y2, x3, y3); }
/*curveVertex()
endContour()*/
function endShape(mode) {
	if (mode == CLOSE) {
		pCurCanvas.context.closePath();
		pCurCanvas.context.fill();
	} 
	pCurCanvas.context.stroke();
}
function quadraticVertex(cx, cy, x3, y3) { pCurCanvas.context.quadraticCurveTo(cx, cy, x3, y3); }
function vertex(x, y) {
	if (pShapeInited) {
		pCurCanvas.context.moveTo(x, y);
	} else {
		pCurCanvas.context.lineTo(x, y); // pend this is where check for kind and do other stuff
	}
	pShapeInited = false;
}


//// INPUT

// Files

//BufferedReader
//createInput()
//createReader()
//loadBytes()
function loadJSON(file) {
	var req = new XMLHttpRequest();  
	req.overrideMimeType("application/json");  
	req.open('GET', "data/"+file);  
  req.onreadystatechange = function () {
    if(req.readyState === 4) {
      if(req.status === 200 || req.status == 0) {
        return JSON.parse(req.responseText);
      }
    }
  }
	req.send(null);
}

function loadStrings(file) {
  var req = new XMLHttpRequest();
  req.open("GET", "data/"+file, true);
  req.onreadystatechange = function () {
    if(req.readyState === 4) {
      if(req.status === 200 || req.status == 0) {
        return req.responseText.match(/[^\r\n]+/g);
      }
    }
  }
	req.send(null);
}
//loadTable()
/*function loadXML() {
	var req = new XMLHttpRequest();  
	req.overrideMimeType("application/json");  
	req.overrideMimeType('text/xml');
	req.open('GET', "data/"+file, false);  
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
//open()
//parseXML()
//saveTable()
//selectFolder()
//selectInput()*/

// Mouse
var pMouseX = 0, pMouseY = 0, mouseX = 0, mouseY = 0;

function pUpdateMouseCoords(e) {
	pMouseX = mouseX;
	pMouseY = mouseY;
	mouseX = e.clientX;// - parseInt(pCurCanvas.elt.style.left, 10);
	mouseY = e.clientY;// - parseInt(pCurCanvas.elt.style.top, 10);
	//console.log(mouseX+" "+mouseY);
	//	console.log('mx = '+mouseX+' my = '+mouseY);
}

// Keyboard
var key = "";
var keyCode = 0; 
var pKeyPressed = false;
function isKeyPressed() { return pKeyPressed; }

function pSetupInput() {
	document.body.onmousemove=function(e){
    pUpdateMouseCoords(e);
    if (typeof(mouseMoved) == "function")
    	mouseMoved(e);
	}

	document.body.onmousedown=function(e){
		if (typeof(mousePressed) == "function")
	    mousePressed(e);
	}

	document.body.onmouseup=function(e){
		if (typeof(mouseReleased) == "function")
			mouseReleased(e);
	}

	document.body.onmouseclick=function(e){
		if (typeof(mouseClicked) == "function")
			mouseClicked(e);
	}

	document.body.onkeydown=function(e){
		pKeyPressed = true;
		if (typeof(keyPressed) == "function")
	  	keyPressed(e);
	}

	document.body.onkeyup=function(e){
		pKeyPressed = false;
		if (typeof(keyReleased) == "function")
	  	keyReleased(e);
	}

	document.body.onkeypress=function(e){
		keyCode = e.keyCode;
		if (typeof(keyTyped) == "function")
	  	keyTyped(e);
	}
}



// Time & Date
function day() { return new Date().getDate(); }
function hour() { return new Date().getHours(); }
function millis() { return new Date().getTime() - pStartTime; }
function month() { return new Date().getMonth(); }
function second() { return new Date().getSeconds(); }
function year() { return new Date().getFullYear(); }




//// OUTPUT

// Text Area
function println(s) { console.log(s); }

// Image
function save() {
	window.open(pCurCanvas.toDataURL());
}

// Files
var pWriters = [];
//beginRaw()
//beginRecord()
//createOutput()
function createWriter(name) {
	if (pWriters.indexOf(name) == -1) { // check it doesn't already exist
		pWriters['name'] = new PrintWriter(name);
	}
}
/*endRaw()
endRecord()*/
function PrintWriter(name){
   this.name = name;
   this.content = "";
   this.print = function(data) { this.content += data; };
   this.println = function(data) { this.content += data + "\n"; };
   this.flush = function() { this.content = ""; };
   this.close = function() { writeFile(this.content); };
}
/*
saveBytes()
saveJSONArray()
saveJSONObject()
saveStream()
*/
function saveStrings(list) { writeFile(list.join('\n')); }
/*saveXML()
selectOutput()
*/
function writeFile(content) {
	window.open("data:text/json;charset=utf-8," + escape(content), 'download'); 
}

//// TRANSFORM
function applyMatrix(n00, n01, n02, n10, n11, n12) {
	pCurCanvas.context.transform(n00, n01, n02, n10, n11, n12);
	var m = pMatrices[pMatrices.length-1];
	m = pMultiplyMatrix(m, [n00, n01, n02, n10, n11, n12]);
}
function popMatrix() { 
	pCurCanvas.context.restore(); 
	pMatrices.pop();
}
function printMatrix() {
	console.log(pMatrices[pMatrices.length-1]);
}
function pushMatrix() { 
	pCurCanvas.context.save(); 
	pMatrices.push([1,0,0,1,0,0]);
}
function resetMatrix() { 
	pCurCanvas.context.setTransform();
	pMatrices[pMatrices.length-1] = [1,0,0,1,0,0]; 
}
function rotate(r) { 
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
function scale(x, y) { 
	pCurCanvas.context.scale(x, y); 
	var m = pMatrices[pMatrices.length-1];
  m[0] *= x;
  m[1] *= x;
  m[2] *= y;
  m[3] *= y;
}
function shearX(angle) {
	pCurCanvas.context.transform(1, 0, tan(angle), 1, 0, 0);
	var m = pMatrices[pMatrices.length-1];
	m = pMultiplyMatrix(m, [1, 0, tan(angle), 1, 0, 0]);
}
function shearY(angle) {
	pCurCanvas.context.transform(1, tan(angle), 0, 1, 0, 0);
	var m = pMatrices[pMatrices.length-1];
	m = pMultiplyMatrix(m, [1, tan(angle), 0, 1, 0, 0]);
}
function translate(x, y) { 
	pCurCanvas.context.translate(x, y); 
	var m = pMatrices[pMatrices.length-1];
  m[4] += m[0] * x + m[2] * y;
  m[5] += m[1] * x + m[3] * y;
}

//// COLOR

// Setting
function background(v1, v2, v3) { 
	var c = [v1, v2, v3];
	if (pColorMode == HSB) c = hsv2rgb(v1, v2, v3);

	// save out the fill
	var curFill = pCurCanvas.context.fillStyle;
	// create background rect
	pCurCanvas.context.fillStyle = rgbToHex(c[0], c[1], c[2]); 
	pCurCanvas.context.fillRect(0, 0, width, height);
	// reset fill
	pCurCanvas.context.fillStyle = curFill;
}
//clear()
function colorMode(mode) { 
	if (mode == RGB || mode == HSB)
		pColorMode = mode; 
}
function fill(v1, v2, v3, a) { 
	var c = [parseInt(v1, 10), parseInt(v2, 10), parseInt(v3, 10)];
	if (pColorMode == HSB) c = hsv2rgb(v1, v2, v3);
	if (a) pCurCanvas.context.fillStyle = "rgba("+c[0]+","+c[1]+","+c[2]+","+(parseInt(a, 10)/255.0)+")";
	else pCurCanvas.context.fillStyle = "rgb("+c[0]+","+c[1]+","+c[2]+")";
}
function noFill() {	pCurCanvas.context.fillStyle = "none"; }
function noStroke() {	pCurCanvas.context.strokeStyle = "none"; }
function stroke(v1, v2, v3, a) { 
	var c = [v1, v2, v3];
	if (pColorMode == HSB) c = hsv2rgb(v1, v2, v3);
	if (a) pCurCanvas.context.strokeStyle = "rgba("+c[0]+","+c[1]+","+c[2]+","+(a/255.0)+")";
	else pCurCanvas.context.strokeStyle = "rgb("+c[0]+","+c[1]+","+c[2]+")"; 
}


// Creating & Reading
function alpha(rgb) {
	if (rgb.length > 3) return rgb[3];
	else return 255;
}
function blue(rgb) { 
	if (rgb.length > 2) return rgb[2];
	else return 0;
}
function brightness(hsv) {
	if (rgb.length > 2) return rgb[2];
	else return 0;
}
function color(gray) { return [gray, gray, gray]; }
function color(gray, alpha) { return [gray, gray, gray, alpha]; }
function color(v1, v2, v3) { return [v1, v2, v3]; }
function color(v1, v2, v3, alpha) { return [v1, v2, v3, alpha]; }
function green(rgb) { 
	if (rgb.length > 2) return rgb[1];
	else return 0;
}
function hue(hsv) { 
	if (rgb.length > 2) return rgb[0];
	else return 0;
}
function lerpColor(c1, c2, amt) {
	var c = [];
	for (var i=0; i<c1.length; i++) {
		c.push(lerp(c1[i], c2[i], amt));
	}
	return c;
}
function red(rgb) { 
	if (rgb.length > 2) return rgb[0];
	else return 0;
}
function saturation(hsv) { 
	if (rgb.length > 2) return rgb[1];
	else return 0;
}


//// Image

function createImage(w, h, format) { return new PImage(w, h); } //pend format?
function PImage(w, h){
	this = pCurCanvas.context.createImageData(w,h); 
  this.pixels = [];
  this.updatePixelArray();

  this.updatePixelArray = function() {	
	  for (var i=0; i<this.data.length; i+=4) {
	  	this.pixels.push([this.data[i], this.data[i+1], this.data[i+2], this.data[i+3]]);
	  }
  }
  this.loadPixels = function()	{ 
  	this = context.createImageData(imageData); 
  	this.updatePixelArray();
  };
  this.updatePixels = function() {
  	for (var i=0; i<this.pixels; i+=4) {
  		for (var j=0; j<4; j++) {
  			this.data[4*i+j] = this.pixels[i][j];
  		}
  	}
  };
  //this.resize() = function() {};
  this.get = function(x, y, w, h) {
  	var wp = w ? w : 1;
  	var hp = h ? h : 1;
  	var vals = [];
  	for (var j=y; j<y+hp; j++) {
  		for (var i=x; i<x+wp; i++) {
  			vals.push(this.pixels[j*this.width+i]);
  		}
  	}
  }
   /*set()	writes a color to any pixel or writes an image into another
	mask()	Masks part of an image with another image as an alpha channel
	filter()	Converts the image to grayscale or black and white
	copy()	Copies the entire image
	blend()	Copies a pixel or rectangle of pixels using different blending modes
	save()	Saves the image to a TIFF, TARGA, PNG, or JPEG file*/
}

 

// Loading & Displaying
function image(img, a, b, c, d) { 
	if (c && d) {
		var vals = pModeAdjust(a, b, c, d, pImageMode);
		pCurCanvas.context.drawImage(img, vals.x, vals.y, vals.w, vals.h);
	} else {
		pCurCanvas.context.drawImage(img, a, b);
	}
}

function imageMode(m) {
	if (m == CORNER || m == CORNERS || m == CENTER) pImageMode = m;
}

function loadImage(path) { 
	var imgObj = new Image();
	imgObj.onload = function() {
		// loaded
	}
	imgObj.src = path;
	return imgObj;
}

// Pixels
//blend()
//copy()
//filter()
function get(x, y, w, h) {
	var pix = pCurCanvas.context.getImageData(0, 0, width, height).data.slice(0);
	if (w && h) {
		var region = [];
		for (var j=0; j<h; j++) {
			for (var i=0; i<w; i++) {
				region[i*w+j] = pix[(y+j)*width+(x+i)]; 
			}
		}
		return region;
	}
	else if (x && y) {
		if (x >= 0 && x < width && y >= 0 && y < height) {
			return pix[y*width+x].data;
		} else {
			return [0, 0, 0, 255];
		}
	}
	else { return pix; }
}
function loadPixels() { 
	pixels = pCurCanvas.context.getImageData(0, 0, width, height).data.slice(0); // pend should this be 0,0 or  pCurCanvas.offsetLeft,pCurCanvas.offsetTop?
}
var pixels = [];
//set()
function updatePixels() {
	if (pixels) {
		var imgd = pCurCanvas.context.getImageData(x, y, width, height);
		imgd = pixels;
		context.putImageData(imgd, 0, 0);
	}
}


//// TYPOGRAPHY

// Loading & Displaying
function text(s, x, y) {
	pCurCanvas.context.font=pTextSize+"px Verdana";
	pCurCanvas.context.fillText(s, x, y);
}

// Atributes
function textAlign(a) {
	if (a == LEFT || a == RIGHT || a == CENTER) pCurCanvas.context.textAlign = a;
}
function textSize(s) { pTextSize = s; }
function textWidth(s) { return pCurCanvas.context.measureText(s).width; }
function textHeight(s) { return pCurCanvas.context.measureText(s).height; }

//// MATH
/** @module Math */
/** returns abs value */
function abs(n) { return Math.abs(n); }
function ceil(n) { return Math.ceil(n); }
function constrain(n, l, h) { return max(min(n, h), l); }
function dist(x1, y1, x2, y2) { return Math.dist(x1, y1, x2, y2); }
function exp(n) { return Math.exp(n); }
function floor(n) { return Math.floor(n); }
function lerp(start, stop, amt) { return amt*(stop-start)+start; }
function log(n) { return Math.log(n); }
function mag(x, y) { return Math.sqrt(x*x+y*y); }
function map(n, start1, stop1, start2, stop2) { return ((n-start1)/(stop1-start1))*(stop2-start2)+start2; }
function max(a, b) { return Math.max(a, b); }
function min(a, b) { return Math.min(a, b); }
function norm(n, start, stop) { return map(n, start, stop, 0, 1); }
function pow(n, e) { return Math.pow(n, e); }
function sq(n) { return n*n; }
function sqrt(n) { return Math.sqrt(n); }

// Trigonometry
function acos(x) { return Math.acos(x); }
function asin(x) { return Math.asin(x); }
function atan(x) { return Math.atan(x); }
function atan2(y, x) { return Math.atan2(y, x); }
function cos(x) { return Math.cos(x); }
function degrees(x) { return 360.0*x/(2*Math.PI); }
function radians(x) { return 2*Math.PI*x/360.0; }
function sin(x) { return Math.sin(x); }
function tan(x) { return Math.tan(x); }

// Random
function random(x, y) { 
	if (y) return (y-x)*Math.random()+x;
	else if (x) return x*Math.random();
	else return Math.random();
}

// Constants
var HALF_PI = Math.PI*0.5;
var PI = Math.PI;
var QUARTER_PI = Math.PI*0.25;
var TAU = Math.PI*2.0;
var TWO_PI = Math.PI*2.0;



//// EXTENSIONS

// PElement

function PElement(elt, w, h){
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
	this.html = function(html) { this.elt.innerHTML = html; };
  this.position = function(x, y) {
		this.x = x;
		this.y = y;
  	this.elt.style.left = x+'px';
		this.elt.style.top = y+'px';
  };
  this.size = function(w, h) {
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
  this.style = function(s) { this.elt.style.cssText += s; }
  this.id = function(id) { this.elt.id = id; };
  this.class = function(c) { this.elt.className = c; }
  this.show = function() { this.elt.display = 'block'; }
  this.hide = function() { this.elt.style.display = 'none'; }
  this.mousePressed = function(fxn) { var _this = this; this.elt.addEventListener("click", function(e){fxn(e, _this);}, false); }; // pend false?
  this.mouseOver = function(fxn) { var _this = this; this.elt.addEventListener("mouseover", function(e){fxn(e, _this);}, false); };
  this.mouseOut = function(fxn) { var _this = this; this.elt.addEventListener("mouseout", function(e){fxn(e, _this);}, false); };
 }

// Create
function createCanvas(w, h) {
	console.log('create canvas');
	var c = document.createElement('canvas');
	width = w;
	height = h;
	c.setAttribute('width', width);
	c.setAttribute('height', height);
	document.body.appendChild(c);

	pCurCanvas =  new PElement(c, w, h);
	pApplyDefaults();
	pSetupInput();
	context(pCurCanvas);

	return pCurCanvas;
}

function createElement(html) {
	var c = document.createElement('div');
	c.innerHTML = html;
	document.body.appendChild(c);

	return new PElement(c);
}

function createImage(src, alt) {
	var c = document.createElement('img');
	c.src = src;
	if (alt) c.alt = alt;
	document.body.appendChild(c);

	return new PElement(c);
}

// Set context
function context(e) {
	var obj = (typeof e == 'string' || e instanceof String) ? document.getElementById(id) : e;
	if (obj) {
		pCurCanvas = obj;
		width = obj.elt.getAttribute('width');
		height = obj.elt.getAttribute('height');
		pCurCanvas.context.setTransform(1, 0, 0, 1, 0, 0);
	}
}

// Get
function get(e) {

}


function pCreate() {

	pStartTime = new Date().getTime();
	if (typeof(setup) == "function") setup();
	pUpdateInterval = setInterval(pUpdate, 1000/frameRate);
	pDraw();
}


function pApplyDefaults() {
	pCurCanvas.context.fillStyle = "#FFFFFF";
	pCurCanvas.context.strokeStyle = "none";
	pCurCanvas.context.lineCap=ROUND;
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
	if (typeof(draw) == "function") draw();
	pCurCanvas.context.setTransform(1, 0, 0, 1, 0, 0);
}


function pModeAdjust(a, b, c, d, mode) {
	if (mode == CORNER) {
		return { x: a, y: b, w: c, h: d };
	} else if (mode == CORNERS) {
		return { x: a, y: b, w: c-a, h: d-b };
	} else if (mode == RADIUS) {
		return { x: a-c, y: b-d, w: 2*c, h: 2*d };
	} else if (mode == CENTER) {
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

function rgbToHex(r,g,b) {return toHex(r)+toHex(g)+toHex(b)}
function toHex(n) {
	n = parseInt(n,10);
	if (isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
}










/// HELPER FXNS

function rgb2hsv (r,g,b) {
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
  RGB= [Math.round(var_r * 255), Math.round(var_g * 255), Math.round(var_b * 255)];
  }
return RGB;  
};


