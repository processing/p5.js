// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 4-4: Many variables

// We've got 8 variables now!
let circleX = 0;
let circleY = 0;
let circleW = 50;
let circleH = 100;
let circleStroke = 255;
let circleFill = 0;
const backgroundColor = 255;
const change = 0.5;

// Your basic setup
function setup() {
  createCanvas(200, 200);
  smooth();
}

function draw() {
  // Draw the background and the ellipse
  // Variables are used for everything: background, stroke, fill, location, and size.
  background(backgroundColor);
  stroke(circleStroke);
  fill(circleFill);
  ellipse(circleX, circleY, circleW, circleH);

  // Change the values of all variables
  // The variable change is used to increment and decrement the other variables.
  circleX = circleX + change;
  circleY = circleY + change;
  circleW = circleW + change;
  circleH = circleH - change;
  circleStroke = circleStroke - change;
  circleFill = circleFill + change;
}
