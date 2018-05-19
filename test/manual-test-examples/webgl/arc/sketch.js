let angle = 4.2;
let angle_2 = 0.2;

function setup() {
  createCanvas(800, 600, WEBGL);
}

function draw() {
  background(230);
  strokeWeight(3);
  stroke(237, 34, 93);
  fill(255);
  arc(-220, -150, 200, 200, angle_2, angle, OPEN);
  arc(0, -150, 200, 200, angle_2, angle, CHORD);
  arc(220, -150, 200, 200, angle_2, angle, PIE);
  noFill();
  arc(-220, 150, 200, 200, angle_2, angle, OPEN);
  arc(0, 150, 200, 200, angle_2, angle, CHORD);
  arc(220, 150, 200, 200, angle_2, angle, PIE);

  if (angle >= 6.28) {
    angle = 0;
  } else {
    angle += 0.03;
    angle_2 += 0.01;
  }
}
