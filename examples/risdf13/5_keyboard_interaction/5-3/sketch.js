function setup() {
  createCanvas(600, 400);
  background(0, 150, 255);
};

function draw() {
};

function keyPressed() {
  print(keyCode);
  var y = map(keyCode, 65, 90, 0, 400);
  rect(0, y, 600, height/26);
};