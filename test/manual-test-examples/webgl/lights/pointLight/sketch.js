function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);

  ambientLight(50);
  pointLight(250, 250, 250, mouseX - width / 2, mouseY - height / 2, 100);

  specularMaterial(mouseIsPressed ? 255 : 0);

  push();
  translate(-width / 3, 0, 0);
  fill(250, 0, 0);
  sphere(50, 64);
  pop();

  fill(0, 250, 0);
  sphere(50, 64);

  push();
  translate(width / 3, 0, 0);
  fill(0, 0, 250);
  sphere(50, 64);
  pop();
}
