function setup() {
  var canvas = createCanvas(200, 200);
  canvas.position(0,50);
}

function draw() {
	background(150);
	ellipse(mouseX, mouseY, 20, 20);
}