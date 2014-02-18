// Rotate

// Rotating a square around the Z axis. To get the results you expect, 
// send the rotate function angle parameters that are values between 
// 0 and PI*2 (TWO_PI which is roughly 6.28). 

// If you prefer to think about angles as degrees (0-360), you can use the 
// radians() method to convert your values. For example: scale(radians(90)) 
// is identical to the statement scale(PI/2).

// Adapted from processing.org.

var angle = 0;
var jitter = 0;

function setup() {
  createCanvas(600, 400);
  noStroke();
  fill(255);
  rectMode(CENTER);

  setFrameRate(1);
};

function draw() {
  background(51);

  angle = angle + PI/4;

  // Try smaller increment (set frame rate higher first)
  // angle = angle + 0.01;

  // Try jittering
  // jitter = random(-0.1, 0.1);
  // angle = angle + jitter;

  translate(width/2, height/2);

  rotate(angle);
  rect(0, 0, 180, 180);  
};