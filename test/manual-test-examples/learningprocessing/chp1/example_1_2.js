// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 1-2: noFill
function setup(){
	createCanvas(200,200);
	smooth();
	background(255);
	// noFill() leaves the shape with only an outline.
	noFill();
	stroke(0);
};

function draw(){
	ellipse(60,60,100,100);
};