
// pend temp hack
var frameRate = 30;
var width = 100;
var height = 100;
var c, ctx;

function fill(r, g, b) {
	ctx.fillStyle = rgbToHex(r,g,b);
};

function size(w, h) {
	width = w;
	height = h;
	c.setAttribute('width', width);
	c.setAttribute('height', height);

}


function background(r, g, b) {
	// save out the fill
	var curFill = ctx.fillStyle;
	// create background rect
	ctx.fillStyle = rgbToHex(r,g,b);
	ctx.fillRect(0, 0, width, height);
	// reset fill
	ctx.fillStyle = curFill;
};


function createCanvas() {
	console.log('create canvas');
	c = document.createElement('canvas');
	c.setAttribute('id', 'processing');
	c.setAttribute('width', width);
	c.setAttribute('height', height);
	ctx = c.getContext("2d");
	document.body.appendChild(c);

	setup();
	setInterval(draw, 1000/frameRate);
}






function rgbToHex(r,g,b) {return toHex(r)+toHex(g)+toHex(b)};
function toHex(n) {
	n = parseInt(n,10);
	if (isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
};