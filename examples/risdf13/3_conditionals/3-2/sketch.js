// Check location with OR

function setup() {
  createCanvas(600, 600);
  noStroke();
  fill(0);
};

function draw() {
  background(204);

  if ((mouseX < 300) || (mouseY < 300)) { // either or
    ellipse(300,300,50,50);
  }
};