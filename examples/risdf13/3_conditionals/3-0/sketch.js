// Check location

// Cursor position selects the left or right half
// of the display window
function setup() {
  createCanvas(600, 600);
  noStroke();
  fill(0);
};

function draw() {
  background(204);
  if (mouseX < 300) {
    rect(0, 0, 300, 600); // Left
  } else {
    save();
    rect(300, 0, 300, 600); // Right
  }
};