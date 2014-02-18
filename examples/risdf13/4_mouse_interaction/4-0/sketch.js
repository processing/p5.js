// Check if mouse is pressed

function setup() {
  createCanvas(600, 600);
  noStroke();
  fill(0);
};

function draw() {
  background(204);

  if (isMousePressed() == true) {
    fill(255); // White
  } else {
    fill(0); // Black
  }

  rect(150, 150, 300, 300);
};