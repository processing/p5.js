function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  var fov = PI / 3.0;
  var cameraZ = height / 2.0 / tan(fov / 2.0);
  perspective(fov, width / height, cameraZ * 0.1, cameraZ * 10);
}

function draw() {
  background(0);
  rotateX(map(mouseY, 0, height, 0, TWO_PI));
  rotateY(map(mouseX, 0, width, 0, TWO_PI));
  normalMaterial();

  for (var i = -5; i < 6; i++) {
    for (var j = -5; j < 6; j++) {
      push();
      translate(i * 100, 0, j * 100);
      sphere(20);
      pop();
    }
  }
}
