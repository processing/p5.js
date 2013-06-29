var c = document.createElement('canvas');
c.setAttribute('id', 'processing');
var ctx = c.getContext("2d");

// pend temp hack
var frameRate = 30;
var width = 600;
var height = 600;


function fill(r, g, b) {
	ctx.fillStyle = rgbToHex(r,g,b);
};


function background(r, g, b) {
	// save out the fill
	var curFill = ctx.fillStyle;
	// create background rect
	ctx.fillStyle = rgbToHex(r,g,b);
	ctx.fillRect(0, 0, width, height);
	// reset fill
	ctx.fillStyle = curFill;
};







setup();
setInterval(draw, 1000/frameRate);



function rgbToHex(r,g,b) {return toHex(r)+toHex(g)+toHex(b)};
function toHex(n) {
	n = parseInt(n,10);
	if (isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
};