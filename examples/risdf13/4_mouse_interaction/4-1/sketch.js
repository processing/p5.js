// Check which mouse button is pressed

function setup() {
  createCanvas(600, 600);
  noStroke();
  fill(0);
};

function draw() {
  background(204);

  // mouseButton - black, white, gray
  if (isMousePressed() == true) {
    if (mouseButton == LEFT) {
      fill(0); // Black
    } else if (mouseButton == RIGHT) {
      fill(255); // White
    }
  } else {
    fill(126); // Gray
  }

  rect(150, 150, 300, 300);
};