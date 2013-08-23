// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-1: Catcher

function Catcher(tempR) {
  this.r = tempR;   // radius
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