// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 3-2: mouseX and mouseY

let offsetX, offsetY; // Declare variables globally

function setup() {
  createCanvas(200, 200);
  const rect = canvas.elt.getBoundingClientRect(); // Get canvas position
  offsetX = rect.left + window.scrollX;
  offsetY = rect.top + window.scrollY;
}

function draw() {
  // Try moving background() to setup() and see the difference!
  background(255);

  // Body
  stroke(0);
  fill(175);
  rectMode(CENTER);

  // Corrected mouseX and mouseY for canvas offset
  const correctedMouseX = mouseX - offsetX;
  const correctedMouseY = mouseY - offsetY;

  rect(correctedMouseX, correctedMouseY, 50, 50); // Adjust size as needed
}
