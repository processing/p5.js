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
  randStroke_r = Math.floor(Math.random() * 255 + 1);
  randStroke_g = Math.floor(Math.random() * 255 + 1);
  randStroke_b = Math.floor(Math.random() * 255 + 1);
  randStrokeWeight = Math.floor(Math.random() * 10 + 5);
  stroke(randStroke_r, randStroke_g, randStroke_b);
  strokeWeight(8);
  randX = Math.floor(Math.random() * (-800 - 800 + 1)) + 800;
  randY = Math.floor(Math.random() * (-600 - 600 + 1)) + 600;
  point(mouseX - 400, mouseY - 300);
}

function mousePressed() {
  background(50);
}
