var canvas1;
var canvas2;

function setup() {
  canvas1 = createGraphics(200, 200);
  canvas1.position(50, 50);

  canvas2 = createGraphics(600, 400);
  canvas2.position(300, 50);
};

function draw() {
  context(canvas1);
  background(120, 180, 200);
  rect(mouseX, mouseY, 100, 100);

  context(canvas2);
  background(50, 120, 80);
  rect(mouseX, mouseY, width / 2, height / 2);
};