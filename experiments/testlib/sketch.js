var setup = function() {
	console.log("setup");
	size(1200, 600);
	background(255, 200, 0);
};


var draw = function() {
	console.log("d");
	noStroke();
	rotate(0.1);
	rect(10, 10, 500, 500);
};