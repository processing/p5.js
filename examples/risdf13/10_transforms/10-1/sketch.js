// Translate accumulation with motion
// Adapted from processing.org

// The translate() function allows objects to be moved to any location within the window. 
// The first parameter sets the x-axis offset and the second parameter sets the y-axis offset.
 
var x = 0;
var y = 0;

var side = 80.0;

function setup() {
  createCanvas(600, 400);
  noStroke();
};

function draw() {
  background(102);
  
  x += 0.8;

  // Add this in to loop around again
  // if (x > width + side) {
  //   x = -side;
  // } 

  translate(x, height/2-side/2);
  fill(255);
  rect(-side/2, -side/2, side, side);
  
  // Transforms accumulate. Notice how this rect moves 
  // twice as fast as the other, but it has the same 
  // parameter for the x-axis value
  translate(x, side);
  fill(0);
  rect(-side/2, -side/2, side, side);
};