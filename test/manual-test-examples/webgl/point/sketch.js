var randNum_1;
var randNum_2;

function setup() {
  createCanvas(800, 600, WEBGL);
  background(50);
  stroke(255);
  strokeWeight(1);
}
function draw() {
  for (var i = 0; i < 10; i++) {
    randNum_1 = Math.floor(Math.random() * (-1366 - 1366 + 1)) + 1366;
    randNum_2 = Math.floor(Math.random() * (-760 - 760 + 1)) + 760;
    point(randNum_1, randNum_2);
  }
}
