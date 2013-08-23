// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-8: Fancier looking raindrop

var setup = function() {
  background(255);
  smooth();
};

var draw = function() {
  for (var i = 2; i < 8; i++ ) {
    noStroke();
    fill(0);
    ellipse(width/2, height/2 + i*4, i*2, i*2);
  }
};