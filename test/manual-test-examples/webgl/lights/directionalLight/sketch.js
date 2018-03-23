function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //setAttributes('perPixelLighting', true);
}

function draw() {
  background(0);

  var dirY = (mouseY / height - 0.5) * 2;
  var dirX = (mouseX / width - 0.5) * 2;

  ambientLight(50);
  directionalLight(250, 250, 250, -dirX, -dirY, 0);

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
