function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // controls should work whether or not camera center is set to (0,0,0)
  // camera(0, 0, 500, 300, 0, 0, 0, 1, 0);
}

function draw() {
  background(250);
  var radius = width;

  orbitControl();

  normalMaterial();

  let scale = 200;
  for (let px = -5; px < 5; px++) {
    for (let pz = -5; pz < 5; pz++) {
      push();
      rotateX(PI);
      translate(px * scale, 0, pz * scale);
      if (px > 0) {
        fill(255, 0, 0);
      }
      if (px === 0 && pz === 0) {
        cone(50, 100);
      } else {
        cone(20, 50);
      }
      pop();
    }
  }
}
