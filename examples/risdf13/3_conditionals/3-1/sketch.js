// Check location with 3 areas

function setup() {
  createCanvas(600, 600);
  noStroke();
  fill(0);
};

function draw() {
  background(204);
  if (mouseX < 200) {
    rect(0, 0, 200, 600); // Left
  } else if (mouseX > 200 && mouseX <= 400) {
    rect(200, 0, 200, 600); // Middle
  } else {
    rect(400, 0, 200, 600); // Right
  }
};