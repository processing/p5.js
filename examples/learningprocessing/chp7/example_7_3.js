// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 7-3: Bouncing ball with functions

// Declare all global variables (stays the same)
var x = 0;
var speed = 1;

// Setup does not change
function setup(){
  createCanvas(200,200);
  smooth();
};

function draw(){
  background(255);
  move(); // Instead of writing out all the code about the ball is draw(), we simply call three functions. How do we know the names of these functions? We made them up!
  bounce();
  display();
};

// Where should functions be placed?
// You can define your functions anywhere in the code outside of setup() and draw().
// However, the convention is to place your function definitions below draw().

// A function to move the ball
var move = function() { 
  // Change the x location by speed
  x = x + speed;
};

// A function to bounce the ball
var bounce = function() {
  // If we’ve reached an edge, reverse speed
  if ((x > width) || (x < 0)) {
    speed = speed * - 1;
  }
};

// A function to display the ball
var display = function() {
  stroke(0);
  fill(175);
  ellipse(x,100,32,32);
};