
// pend tempz
var frameRate = 30;
var width = 100;
var height = 100;
var c, ctx;
var pBackground = false;
var pFill = false;
var pLoop = true;
var pDrawInterval;
var mousePressed;

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



//// COLOR

// Setting
function background(r, g, b) { pBackground = rgbToHex(r,g,b); }
function fill(r, g, b) { ctx.fillStyle = rgbToHex(r,g,b); }
function noFill() {	ctx.fillStyle = "none"; }
function noStroke() {	ctx.strokeStyle = "none"; }
function stroke(r, g, b) { ctx.strokeStyle = rgbToHex(r,g,b); }



//// SHAPE

// 2D Primitives
function rect(x, y, w, h) {
	ctx.rect(x, y, w, h);
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
function strokeWeight(w) {
	ctx.lineWidth = w;
	if (!w) noStroke();
}


//// TRANSFORM
function rotate(r) { ctx.rotate(r); }
function translate(x, y) { ctx.translate(x, y); }
function scale(x, y) { ctx.scale(x, y); }


//// OUTPUT

// Text Area
function println(s) { console.log(s); }


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




//// INTERNALS

function pCreateCanvas() {
	console.log('create canvas');
	c = document.createElement('canvas');
	c.setAttribute('id', 'processing');
	c.setAttribute('width', width);
	c.setAttribute('height', height);
	document.body.appendChild(c);
	ctx = c.getContext("2d");
	pApplyDefaults();

	c.onmousemove=function(e){
    pUpdateMouseCoords(e);
	}

	c.onmousedown=function(e){
		if (typeof(mousePressed) == "function")
	    mousePressed();
	}

	setup();
	pDraw();
	if (pLoop) pDrawInterval = setInterval(pDraw, 1000/frameRate);
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
	draw();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
}




function rgbToHex(r,g,b) {return toHex(r)+toHex(g)+toHex(b)}
function toHex(n) {
	n = parseInt(n,10);
	if (isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
}