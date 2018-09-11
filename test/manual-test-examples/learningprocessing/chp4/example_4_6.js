// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 4-6: Ellipse with variables

// Declare and initialize your variables!
const r = 100;
const g = 150;
const b = 200;
const a = 200;

const diam = 20;
const x = 100;
const y = 100;

function setup() {
  createCanvas(200, 200);
  background(255);
  smooth();
}

function draw() {
  // Use those variables to draw an ellipse
  stroke(0);
  fill(r, g, b, a); // (Remember, the fourth argument for a color is transparency.
  ellipse(x, y, diam, diam);
}
