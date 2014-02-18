// Tweening

var startX = 0;    // Initial x-coordinate
var stopX = 300;    // Final x-coordinate
var startY = 0;    // Initial y-coordinate
var stopY = 200;     // Final y-coordinate
var x = startX;     // Current x-coordinate
var y = startY;     // Current y-coordinate
var step = 0.005;   // Size of each step (0.0 to 1.0)
var pct = 0.0;      // Percentage traveled (0.0 to 1.0)

function setup() {
  createCanvas(600, 400);
  noStroke();
  fill(255);
};

function draw() {
  background(100, 0, 255);

  // Determine the current location
  x = (stopX - startX) * pct + startX;
  y = (stopY - startY) * pct + startY;

  // Increment pct by one step if not at 1.0 yet
  if (pct < 1.0) {
    pct += step;
  }

  // Display circle at position
  ellipse(x, y, 50, 50);
};