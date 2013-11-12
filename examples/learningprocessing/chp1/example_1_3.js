// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 1-3: RGB Color
function setup(){
	smooth();
	background(255);
	noStroke();
};

function draw(){

	
	// Bright red
	fill(255,0,0);
	ellipse(20,20,16,16);

	// Dark red
	fill(127,0,0);
	ellipse(40,20,16,16);

	// Pink (pale red)
	fill(255,200,200);
	ellipse(60,20,16,16);
};