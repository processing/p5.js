function setup() {
  createCanvas(640, 480, WEBGL);
  setAttributes('antialias', true);
}

function mouseClicked() {
  resizeCanvas(1280, 720);
}
function draw() {
  background(0);
  ellipse(0, 0, width / 2);
}
