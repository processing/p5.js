// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 6-6: Legs with a for loop

var y = 80;       // Vertical location of each line
var spacing = 10; // How far apart is each line
var len = 20;     // Length of each line

function setup(){
	createCanvas(200,200);
	background(255);
};

function draw(){
	// Translation of the legs while loop to a for loop.
	for (var x = 50; x <= 150; x += spacing) { 
	  line(x,y,x,y + len);
	}
};