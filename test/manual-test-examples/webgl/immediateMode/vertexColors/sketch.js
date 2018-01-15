function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  colorMode(HSB);
}

function draw() {
  background(0);

  rotateX(TWO_PI/6);

  beginShape(TRIANGLE_FAN);

  fill((millis()/30) % 360, 255, 255);
  vertex(0,0);

  for (var i = 0; i <= 360; i += 360/36) {
    var v = p5.Vector.fromAngle(i * TWO_PI / 360, 200);
    fill(i, 255, 255);
    vertex(v.x, v.y, sin(i * 5 * TWO_PI / 360 + millis() / 300) * 20);
  }
  endShape();
}