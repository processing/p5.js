// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 6-3: While loop

var y = 80;       // Vertical location of each line
var x = 50;       // Initial horizontal location for first line
var spacing = 10; // How far apart is each line
var len = 20;     // Length of each line
var endLegs = 150;  // A variable to mark where the legs end.


function setup(){
	createCanvas(200,200);
	background(255);
	stroke(0);
};

function draw(){
	// Draw each leg inside a while loop.
	while (x <= endLegs) { 
	  line (x,y,x,y + len);
	  x = x + spacing;
	}
};