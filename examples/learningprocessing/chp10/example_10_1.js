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


// Catch class

function Catcher(tempR) {

  this.r = tempR; // radius
  this.x = 0; // location
  this.y = 0;
}

Catcher.prototype.setLocation = function(tempX, tempY) {
  this.x = tempX;
  this.y = tempY;
};

Catcher.prototype.display = function() {
  stroke(0);
  fill(175);
  ellipse(this.x, this.y, this.r*2, this.r*2);
};

