var angle_1 = 0;
var angle_2 = 30;

function setup() {
  createCanvas(800, 600, WEBGL);
  setAttributes('antialias', true);
}

function draw() {
  background(230);
  strokeWeight(3);
  stroke(237, 34, 93);
  fill(255);
  arc(-300, -150, 150, 150, radians(angle_1), radians(angle_2), OPEN);
  arc(-100, -150, 150, 150, radians(angle_1), radians(angle_2), CHORD);
  arc(100, -150, 150, 150, radians(angle_1), radians(angle_2), PIE);
  arc(300, -150, 150, 150, radians(angle_1), radians(angle_2));
  noFill();
  arc(-300, 150, 150, 150, radians(angle_1), radians(angle_2), OPEN);
  arc(-100, 150, 150, 150, radians(angle_1), radians(angle_2), CHORD);
  arc(100, 150, 150, 150, radians(angle_1), radians(angle_2), PIE);
  arc(300, 150, 150, 150, radians(angle_1), radians(angle_2));

  angle_1 = angle_1 + 1;
  angle_2 = angle_2 + 2;
}
