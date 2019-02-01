var slider;

function setup() {
  createCanvas(710, 500, WEBGL);
  slider = createSlider(1, 100, 32).position(550, 450);
}

function draw() {
  background(0);
  let locX = mouseX - 200 / 2;
  let locY = mouseY - 200 / 2;

  ambientLight(60, 60, 60);
  pointLight(255, 255, 255, locX, locY, 100);

  rotateZ(frameCount * 0.01);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  specularMaterial(250);
  shininess(0 + slider.value());

  torus(80, 20, 64, 64);
}
