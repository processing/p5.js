// CASE 2
// Only setup() and createCanvas().
// setup() runs once and createCanvas() returns a pointer to the canvas created
// with the input size, at 0,0.  Holding the pointer is optional.
function setup() {
  createCanvas(400, 400); 
  background(255, 0, 0);
  noStroke();
  ellipse(0, 0, 50, 50);
}