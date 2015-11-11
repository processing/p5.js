// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-6: Simple raindrop behavior

// Variables for drop location
var x,y; 

function setup(){
  createCanvas(400,400);
  background(0);
  x = width/2;
  y = 0;
  smooth();
};

function draw(){
  background(255);
  // Display the drop
  fill(50,100,150);
  noStroke();
  ellipse(x,y,16,16);
  // Move the drop
  y++ ;
};