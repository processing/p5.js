// CASE 6
// setup() and draw() with createCanvas(), holding pointer
// parent call moves canvas to div with given id
var canvas;
function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent('test');
  background(255, 255, 0);
}
function draw() {
  ellipse(random(0, 400), random(0, 400), 50, 50);
  //console.log(mouseX);
}