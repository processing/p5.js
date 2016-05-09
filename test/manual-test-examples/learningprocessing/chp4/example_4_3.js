// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 4-3: Varying variables

// Declare and initialize two variables at the top of the code.
var circleX = 0;
var circleY = 100;

function setup(){
  createCanvas(200,200);
  smooth();
};

function draw(){
  background(255);
  stroke(0);
  fill(175);
  // Use the variables to specify the location of an ellipse.
  ellipse(circleX,circleY,50,50);
  
  // An assignment operation that increments the value of circleX by 1.
  circleX = circleX + 1;
};
