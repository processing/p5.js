var setup = function() {
	println("setup");
	size(1200, 600);
	background(255, 200, 0);
	noLoop();
};


var draw = function() {
	println("d");
	noStroke();
	rotate(0.1);
	rect(10, 10, 500, 500);
};