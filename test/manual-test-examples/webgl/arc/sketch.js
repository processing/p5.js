let angle = 4.2;
let angle_2 = 0.2;

function setup() {
  createCanvas(800, 600, WEBGL);
  setAttributes('antialias', true);
}

function draw() {
  background(230);
  strokeWeight(3);
  stroke(237, 34, 93);
  fill(255);
  arc(-300, -150, 100, 100, angle_2, angle, OPEN);
  arc(-100, -150, 100, 100, angle_2, angle, CHORD);
  arc(100, -150, 100, 100, angle_2, angle, PIE);
  arc(300, -150, 100, 100, angle_2, angle);
  noFill();
  arc(-300, 150, 100, 100, angle_2, angle, OPEN);
  arc(-100, 150, 100, 100, angle_2, angle, CHORD);
  arc(100, 150, 100, 100, angle_2, angle, PIE);
  arc(300, 150, 100, 100, angle_2, angle);

  if (angle === angle_2) {
    angle = 0;
    angle_2 = 0;
  } else {
    angle += 0.03;
    angle_2 += 0.01;
  }
}
