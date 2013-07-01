var setup = function() {
	println("setup");
	size(1200, 600);
	background(255, 200, 0);
	//noLoop();
};


var draw = function() {
	println("d");
	noStroke();
	rotate(mouseX/360);
	rect(10, 10, 200, 200);
	stroke(255, 0, mouseY);
	strokeWeight(10);
	line(50, 30, 400, 400);
};

var mousePressed = function() {
	println("mouse pressed");
};