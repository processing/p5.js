function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  normalMaterial();
  let cam = createCamera();
  cam.move(0, -this.height / 4, 0);
  debugMode();
}

function draw() {
  background(250);

  orbitControl();

  for (let i = 0; i < 20; i++) {
    push();
    translate(
      sin(frameCount / 120) * i * 20,
      0,
      cos(frameCount / 120) * i * 30
    );
    rotateX(-frameCount / 60);
    box(20);
    pop();
  }
}
