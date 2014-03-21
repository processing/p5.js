// CASE 6
// setup() and draw() with createCanvas(), holding pointer
var canvas;
function setup() {
  canvas = createCanvas(400, 400);
  canvas.position(100, 50); // allows you to set position, id, etc
  background(255, 255, 0);
}
function draw() {
  ellipse(random(0, 400), random(0, 400), 50, 50);
  console.log(mouseX);
}