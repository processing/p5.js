var clicks = 0;

var setup = function() {
	println("setup");
	size(1200, 600);
	background(255, 200, 0);
	//noLoop();
};


var draw = function() {
	println("d");
	noStroke();
	rotate(clicks/10);
	rect(10, 10, 200, 200);
	stroke(255, map(mouseX, 0, width, 0, 255), map(mouseY, 0, height, 0, 255));
	strokeWeight(10);
	translate(clicks*5, 0);
	line(50, 30, 400, 400);
};

var mousePressed = function() {
	println("mouse pressed");
	clicks++;
};