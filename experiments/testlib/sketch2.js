var clicks = 0, presses = 1;
var img, img2, rad;
var lastAdd = 0;
var rads = 0;
var r;
var bg = [];

var setup = function() {
	println("setup");
	size(1200, 600);
	background(255, 200, 0);


};


var draw = function() {

	bg = [255*sin(.008*frameCount), 255*sin(.003*frameCount), 255*sin(.01*frameCount)];
	background(bg[0], bg[1], bg[2]);
	
	stroke(255, 255, 255);
	fill(255, 0, 0);

/*
	beginShape(LINES);
	vertex(0, 0);
	vertex(300, 100);
	vertex(200, 500);
	endShape(CLOSE);
*/
	rectMode(CENTER);
	fill(255, 200, 0, 100);
	rect(600, 0, 100, 100);
	ellipseMode(CENTER);
	fill(0, 0, 200);
	ellipse(600, height/2, 100, 300);
};

var mousePressed = function(e) {
	println("mouse pressed");
	clicks++;
};

var keyPressed = function(e) {
	println("key pressed "+keyCode);
	//alert('key pressed '+keyCode);
	presses++;
};

var keyReleased = function(e) {
};

var keyTyped = function(e) {
};




