// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 6-3: While loop

const y = 80; // Vertical location of each line
let x = 50; // Initial horizontal location for first line
const spacing = 10; // How far apart is each line
const len = 20; // Length of each line
const endLegs = 150; // A variable to mark where the legs end.

function setup() {
  createCanvas(200, 200);
  background(255);
  stroke(0);
}

function draw() {
  // Draw each leg inside a while loop.
  while (x <= endLegs) {
    line(x, y, x, y + len);
    x = x + spacing;
  }
}
