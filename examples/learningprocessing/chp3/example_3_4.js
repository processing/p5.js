// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 3-4: Drawing a continuous line
var setup = function() {
  createGraphics(200, 200);
  background(255);
  smooth();
};

var draw = function() {
  stroke(0);
  // Draw a line from previous mouse location to current mouse location.
  line(pmouseX, pmouseY, mouseX, mouseY);
};