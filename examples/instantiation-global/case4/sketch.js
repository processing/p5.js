// CASE 4
// setup() and draw() without createCanvas().
// createCanvas() is called automatically with defaults.
function setup() {
  background(255, 0, 0);
}
function draw() {
  ellipse(random(0, 400), random(0, 400), 50, 50);
}