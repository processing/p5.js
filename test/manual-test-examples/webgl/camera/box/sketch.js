function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);

  normalMaterial();
  var tx = map(mouseX, 0, width, -width / 2, width / 2);
  var ty = map(mouseY, 0, height, -height / 2, height / 2);

  push();
  translate(tx, ty);
  noStroke();
  cone(90);
  pop();

  fill(255);
  rect(0, 0, width / 4, height / 4);
  fill(0, 255, 0);
  ellipse(width / 4, height / 4, width / 4, height / 4);

  push();
  translate(width / 4, height / 4);
  fill(0, 0, 255);
  ellipse(0, 0, width / 4, height / 4);
  pop();

  fill(255, 0, 0);
  beginShape();
  vertex(0, 0);
  vertex(0, height / 4);
  vertex(-width / 4, 0);
  endShape(CLOSE);
}
