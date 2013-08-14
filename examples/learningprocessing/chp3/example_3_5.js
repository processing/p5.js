// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 3-5: mousePressed and keyPressed
var setup = function() {
  createGraphics(200,200);
  background(255);
};

var draw = function() {
 // Nothing happens in draw() in this example!
};

// Whenever a user clicks the mouse the code written inside mousePressed() is executed.
var mousePressed = function() {
  stroke(0);
  fill(175);
  rectMode(CENTER);
  rect(mouseX,mouseY,16,16);
};

// Whenever a user presses a key the code written inside keyPressed() is executed.
var keyPressed = function() {
  background(255);
};