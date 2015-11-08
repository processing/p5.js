// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-8: Fancier looking raindrop

function setup(){
  background(255);
  smooth();
};

function draw(){
  for (var i = 2; i < 8; i++ ) {
    noStroke();
    fill(0);
    ellipse(width/2, height/2 + i*4, i*2, i*2);
  }
};