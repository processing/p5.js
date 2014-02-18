// Using a for loop to initialize values.
// Using a for loop to draw.
// Adapted from Getting Started with Processing.

var numCircles = 12;
var x = [];
var y = [];
var speed = [];

function setup() {
  createCanvas(600, 400);
  strokeWeight(10);

  for (var i=0; i < numCircles; i++) {
    x[i] = i; // Set initial position
    y[i] = random(height); // Set initial position
    speed[i] = 0.1 + random(5); // Set initial speed
  }
};

function draw() {
  background(204);
  
  for (var i = 0; i < x.length; i++) {
    x[i] += speed[i]; // Update ellipse position
    if (x[i] > width) { // If off the right,
      x[i] = 0; // return to the left
    }
    ellipse(x[i], y[i], 20, 20); // Draw ellipse
  }
};