// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 1-4: Alpha Transparency

function setup(){
	createCanvas(200,200);
	noStroke();
};

function draw(){

	background(0);
	
	// No fourth argument means 100% opacity.
	fill(0,0,255);
	rect(0,0,100,200);

	// 255 means 100% opacity.
	fill(255,0,0,255);
	rect(0,0,200,40);

	// 75% opacity.
	fill(255,0,0,191);
	rect(0,50,200,40);

	// 55% opacity.
	fill(255,0,0,127);
	rect(0,100,200,40);

	// 25% opacity.
	fill(255,0,0,63);
	rect(0,150,200,40);
};