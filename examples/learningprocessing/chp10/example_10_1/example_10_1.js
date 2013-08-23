// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-1: Catcher

var catcher;

var setup = function() {
  createGraphics(400,400);
  catcher = new Catcher(32);
  smooth();
};

var draw = function() {
  background(255);
  catcher.setLocation(mouseX,mouseY);
  catcher.display();
};

