// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 7-2: Calling a function

function setup(){
 createCanvas(100,100);
 smooth(); 
};

function draw(){
  background(255);
  drawBlackCircle();
};

var drawBlackCircle = function() {
  fill(0);
  ellipse(50,50,20,20);
};