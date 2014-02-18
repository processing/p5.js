// Paramenters for the scale() function are values specified as decimal percentages. 
// For example, the method call scale(2.0, 2.0) will increase the dimension of the 
// shape by 200 percent. Objects always scale from the origin.

// Adapted from Denis Grutze's example on processing.org.

var a = 0.0;
var s = 0.0;

function setup() {
  createCanvas(600, 600);
  noStroke();
  rectMode(CENTER);
};

function draw() {
  background(102, 200, 50);
  
  a = a + 0.04;
  s = cos(a)*3;
  
  // Translate to middle of screen
  translate(width/2, height/2);

  // Scale and draw one rect
  scale(s, s); 
  fill(51);
  rect(0, 0, 50, 50); 
  
  // Further scale and draw second rect, this one gets twice as big
  fill(255, 150);
  scale(s, s);
  rect(0, 0, 50, 50);
};