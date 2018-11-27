function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(250);

  randomSeed(1);
  noStroke();
  for (var i = 0; i < 1000; i++) {
    push();
    translate(random(-width / 2, width / 2), random(-height / 2, height / 2));
    rotateZ(random(0, 2 * PI) + frameCount * 0.1);
    fill(random(128, 255), 0, random(128, 255));
    beginShape(TRIANGLES);
    vertex(0, 25, 0);
    vertex(-25, -25, 0);
    vertex(25, -25, 0);
    endShape();
    pop();
  }
}
