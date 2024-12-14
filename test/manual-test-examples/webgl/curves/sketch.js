var angle = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
}

function draw() {
  background(220);
  strokeWeight(2);

  rotateY(angle);
  stroke(255, 235, 59);
  fill(121, 85, 72);
  ellipse(0, -120, 50, 50);
  fill(255, 111, 0);

  push();
  translate(0, -120, 0);
  for (var i = 0; i < 20; i++) {
    var _x = 30 * Math.cos(radians(i));
    var _y = 30 * Math.sin(radians(i));
    beginShape();
    vertex(_x, _y, 0);
    bezierVertex(-50, -250, -20, 120, -200, -10, _x, _y, 0);
    rotateZ(1);
    endShape();
  }
  pop();

  fill(62, 39, 35);
  stroke(0, 0, 0);

  beginShape();
  vertex(0, -40, -5);
  quadraticVertex(0, 300, -5, 100, 280, -5);
  quadraticVertex(0, 250, -5, 0, -40, -5);
  endShape();

  fill(0, 77, 64);

  beginShape();
  splineVertex(10, 150, -4);
  splineVertex(10, 150, -4);
  splineVertex(60, 80, -4);
  splineVertex(140, 100, -4);
  splineVertex(200, 100, -4);
  splineVertex(200, 110, -4);
  splineVertex(160, 140, -4);
  splineVertex(80, 160, -4);
  splineVertex(10, 150, -4);
  splineVertex(10, 150, -4);
  endShape();

  angle += 0.01;
}
