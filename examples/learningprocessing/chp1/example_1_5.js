// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 1-5: Zoog

var setup = function() {
	createGraphics(200,200);
	background(255);
	smooth();
	ellipseMode(CENTER);
	rectMode(CENTER); 
};

var draw = function() {
	// Body
	stroke(0);
	fill(150);
	rect(100,100,20,100);

	// Head
	fill(255);
	ellipse(100,70,60,60); 

	// Eyes
	fill(0); 
	ellipse(81,70,16,32); 
	ellipse(119,70,16,32);

	// Legs
	stroke(0);
	line(90,150,80,160);
	line(110,150,120,160);	
};