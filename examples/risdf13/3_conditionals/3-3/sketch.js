// Check location of 1 rectangular area

function setup() {
  createCanvas(600, 600);
  noStroke();
  fill(0);
};

function draw() {
  background(204);

  if ((mouseX >= 100) && (mouseX <= 300) && (mouseY >= 200) && (mouseY <= 400)) {
    rect(100, 200, 200, 200);
  }
};