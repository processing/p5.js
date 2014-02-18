// CASE 5
// setup() and draw() with createCanvas().
function setup() {
  createCanvas(400, 400);
  background(255, 255, 0);
}
function draw() {
  ellipse(random(0, 400), random(0, 400), 50, 50);
}