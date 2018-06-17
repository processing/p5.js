var randX;
var randY;

var randStroke_r;
var randStroke_g;
var randStroke_b;

var randStrokeWeight;

function setup() {
  createCanvas(800, 600, WEBGL);
  background(50);
}

function draw() {
  for (var i = 0; i < 10; i++) {
    randStroke_r = Math.floor(Math.random() * 255 + 1);
    randStroke_g = Math.floor(Math.random() * 255 + 1);
    randStroke_b = Math.floor(Math.random() * 255 + 1);
    randStrokeWeight = Math.floor(Math.random() * 10 + 1);
    stroke(randStroke_r, randStroke_g, randStroke_b);
    strokeWeight(randStrokeWeight);
    randX = Math.floor(Math.random() * (-800 - 800 + 1)) + 800;
    randY = Math.floor(Math.random() * (-600 - 600 + 1)) + 600;
    point(randX, randY);
  }
}
