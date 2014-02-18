// Using a for loop to initialize values.
// Using a for loop to draw.
// Adapted from Getting Started with Processing.

var weight = [];

function setup() {
  createCanvas(600, 400);
  stroke(255);
  strokeWeight(3);

  // Here we are using a for loop and random to set the values.
  for (var i=0; i<100; i++) {
    weight[i] = random(0, 10);
  }
};

function draw() {
  background(71);

  for (var i=0; i<weight.length; i++) {
    strokeWeight(weight[i]);
    line(i*10, 0, i*10, height);
  }
};