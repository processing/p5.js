
// pend tempz
var frameRate = 30;
var frameCount = 0;
var width = 100;
var height = 100;
var c, ctx;

var CORNER = "corner", CORNERS = "corners", RADIUS = "radius";
var RIGHT = "right", LEFT = "left", CENTER = "center";

var pBackground = false;
var pFill = false;
var pLoop = true;
var pDrawInterval;
var pStartTime;
var pRectMode = CORNER, pImageMode = CORNER;
var pTextSize = 12;
var setup, draw, mousePressed;
var keyCode = 0;

var pMouseX = 0, pMouseY = 0, mouseX = 0, mouseY = 0;



////	STRUCTURE
function noLoop() {	
	if (pLoop) {
		clearInterval(pDrawInterval);
		pLoop = false; 
	}
}

function loop() { 
	if (!pLoop) {
		pDrawInterval = setInterval(pDraw, 1000/frameRate);
		pLoop = true;
	}
}


//// ENVIRONMENT
function size(w, h) {
	width = w;
	height = h;
	c.setAttribute('width', width);
	c.setAttribute('height', height);
	pApplyDefaults();
}


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
nfc()
nfp()
nfs()
split()
splitTokens()
trim()
*/

//// SHAPE

// 2D Primitives
function rect(a, b, c, d) {
	if (pRectMode == CORNER) {
		ctx.rect(a, b, c, d);
	} else if (pRectMode == CORNERS) {
		ctx.rect(a, b, c-a, d-b);
	} else if (pRectMode == RADIUS) {
		ctx.rect(a-c, b-d, 2*c, 2*d);
	} else if (pRectMode == CENTER) {
		ctx.rect(a-(c-a)*0.5, b-(d-b)*0.5, c, d);
	}
	ctx.fill();
	ctx.stroke();
}

function line(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

// Attributes
function rectMode(m) {
	if (m == CORNER || m == CORNERS || m == RADIUS || m == CENTER) {
		pRectMode = m;
	}
}

function strokeWeight(w) {
	ctx.lineWidth = w;
	if (!w) noStroke();
}


//// INPUT

// Files
if (window.File && window.FileReader && window.FileList && window.Blob) {
  //do your stuff!
  
} else {
  alert('The File APIs are not fully supported by your browser.');
}
/*BufferedReader
createInput()
createReader()
loadBytes()
loadJSONArray()
loadJSONObject()
loadStrings()
loadTable()
loadXML()
open()
parseXML()
saveTable()
selectFolder()
selectInput()*/



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



//// TRANSFORM
function popMatrix() { ctx.restore(); }
function pushMatrix() { ctx.save(); }
function rotate(r) { ctx.rotate(r); }
function translate(x, y) { ctx.translate(x, y); }
function scale(x, y) { ctx.scale(x, y); }


//// COLOR

// Setting
function background(r, g, b) { pBackground = rgbToHex(r,g,b); }
function fill(r, g, b, a) { 
	if (a) ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
	else ctx.fillStyle = "rgba("+r+","+g+","+b+")";
}
function noFill() {	ctx.fillStyle = "none"; }
function noStroke() {	ctx.strokeStyle = "none"; }
function stroke(r, g, b) { ctx.strokeStyle = rgbToHex(r,g,b); }


//// Image

// Loading & Displaying
function image(img, a, b, c, d) { 
	var imgW = img.width, imgH = img.height;

	if (pImageMode == CORNER) {
		if (c && d) ctx.drawImage(img, a, b, c, d);
		else ctx.drawImage(img, a, b);
	} else if (pImageMode == CORNERS) {
		ctx.drawImage(img, a, b, c-a, d-b);
	} else if (pImageMode == CENTER) {
		ctx.drawImage(img, a-(c-a)*0.5, b-(d-b)*0.5, c, d);
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


//// TYPOGRAPHY

// Loading & Displaying
function text(s, x, y) {
	ctx.font=pTextSize+"px Verdana";
	ctx.fillText(s, x, y);
}

// Atributes
function textAlign(a) {
	if (a == LEFT || a == RIGHT || a == CENTER) ctx.textAlign = a;
}
function textSize(s) { pTextSize = s; }
function textWidth(s) { return ctx.measureText(s).width; }
function textHeight(s) { return ctx.measureText(s).height; }

//// MATH

// Calculation
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



//// INTERNALS

function pCreateCanvas() {
	console.log('create canvas');
	pStartTime = new Date().getTime();
	c = document.createElement('canvas');
	c.setAttribute('id', 'processing');
	c.setAttribute('width', width);
	c.setAttribute('height', height);
	document.body.appendChild(c);
	ctx = c.getContext("2d");
	pApplyDefaults();

	pSetupInput();

	if (typeof(setup) == "function") setup();
	
	setInterval(pUpdate, 1000/frameRate);

	pDraw();
	if (pLoop) pDrawInterval = setInterval(pDraw, 1000/frameRate);
}

function pSetupInput() {
	c.onmousemove=function(e){
    pUpdateMouseCoords(e);
    if (typeof(mouseMoved) == "function")
    	mouseMoved(e);
	}

	c.onmousedown=function(e){
		if (typeof(mousePressed) == "function")
	    mousePressed(e);
	}

	c.onmouseup=function(e){
		if (typeof(mouseReleased) == "function")
			mouseReleased(e);
	}

	c.onmouseclick=function(e){
		if (typeof(mouseClicked) == "function")
			mouseClicked(e);
	}

	document.body.onkeydown=function(e){
		if (typeof(keyPressed) == "function")
	  	keyPressed(e);
	}

	document.body.onkeyup=function(e){
		if (typeof(keyReleased) == "function")
	  	keyReleased(e);
	}

	document.body.onkeypress=function(e){
		keyCode = e.keyCode;
		if (typeof(keyTyped) == "function")
	  	keyTyped(e);
	}
}

function pApplyDefaults() {
	ctx.fillStyle = "#FFFFFF";
	ctx.strokeStyle = "none";
}

function pUpdateMouseCoords(e) {
	pMouseX = mouseX;
	pMouseY = mouseY;
	mouseX = e.clientX - c.offsetLeft;
	mouseY = e.clientY - c.offsetTop;
	//console.log('mx = '+mouseX+' my = '+mouseY);
}

function pUpdate() {
	frameCount++;
}

function pDraw() {
	// draw bg
	if (pBackground) {
		// save out the fill
		var curFill = ctx.fillStyle;
		// create background rect
		ctx.fillStyle = pBackground;
		ctx.fillRect(0, 0, width, height);
		// reset fill
		ctx.fillStyle = curFill;
	}

	// call draw
	if (typeof(draw) == "function") draw();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
}




function rgbToHex(r,g,b) {return toHex(r)+toHex(g)+toHex(b)}
function toHex(n) {
	n = parseInt(n,10);
	if (isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
}