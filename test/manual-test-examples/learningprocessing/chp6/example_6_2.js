// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 6-2: Many lines with variables

const y = 80; // Vertical location of each line
let x = 50; // Initial horizontal location for first line
const spacing = 10; // How far apart is each line
const len = 20; // Length of each line

function setup() {
  createCanvas(200, 200);
  background(255);
  stroke(0);
}

function draw() {
  // Draw the first leg.
  line(x, y, x, y + len);
  // Add spacing so the next leg appears 10 pixels to the right.
  x = x + spacing;

  // Continue this process for each leg, repeating it over and over.
  line(x, y, x, y + len);
  x = x + spacing;
  line(x, y, x, y + len);
  x = x + spacing;
  line(x, y, x, y + len);
  x = x + spacing;
  line(x, y, x, y + len);
  x = x + spacing;
  line(x, y, x, y + len);
  x = x + spacing;
  line(x, y, x, y + len);
  x = x + spacing;
  line(x, y, x, y + len);
  x = x + spacing;
  line(x, y, x, y + len);
  x = x + spacing;
  line(x, y, x, y + len);
  x = x + spacing;
  line(x, y, x, y + len);
}
