
// pend temp hack
var frameRate = 30;
var width = 100;
var height = 100;
var c, ctx;
var pBackground = false;
var pFill = false;
var pLoop = true;
var pDrawInterval;

//// OUTPUT

// Text Area
function println(s) { console.log(s); }


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




// setters
function fill(r, g, b) {
	ctx.fillStyle = rgbToHex(r,g,b);
}

function noFill() {
	ctx.fillStyle = "none";
}

function strokeWeight(w) {
	ctx.lineWidth = w;
	if (!w) noStroke();
}

function stroke(r, g, b) {
	ctx.strokeStyle = rgbToHex(r,g,b);
}

function noStroke() {
	ctx.strokeStyle = "none";
}

function size(w, h) {
	width = w;
	height = h;
	c.setAttribute('width', width);
	c.setAttribute('height', height);
	pApplyDefaults();
}

function background(r, g, b) {
	pBackground = rgbToHex(r,g,b);
}


// 2d primitives
function rect(x, y, w, h) {
	ctx.rect(x, y, w, h);
	ctx.fill();
	ctx.stroke();
}

// transformations
function rotate(r) { ctx.rotate(r); }
function translate(x, y) { ctx.translate(x, y); }
function scale(x, y) { ctx.scale(x, y); }



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

	setup();
	pDraw();
	if (pLoop) pDrawInterval = setInterval(pDraw, 1000/frameRate);
}

function pApplyDefaults() {
	ctx.fillStyle = "#FFFFFF";
	ctx.strokeStyle = "none";
}

function pDraw() {
		console.log(ctx.fillStyle);
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
}




function rgbToHex(r,g,b) {return toHex(r)+toHex(g)+toHex(b)}
function toHex(n) {
	n = parseInt(n,10);
	if (isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
}