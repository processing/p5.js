function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
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
      if (px == 0 && pz == 0) {
        cone(50, 100);
      } else {
        cone(20, 50);
      }
      pop();
    }
  }
}
