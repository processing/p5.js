// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// ported by Lauren McCarthy

// Example 1-1: stroke and fill

var setup = function() {
	createGraphics(200,200);
	background(255);
};

var draw = function() {
	stroke(0); 
	fill(150);
	rect(50,50,75,100);
};