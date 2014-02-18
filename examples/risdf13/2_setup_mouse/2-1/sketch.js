// Variables placed before setup/draw are called global variables.
// They can be accessed from everywhere in your sketch. 

var x = 200;
var y = -100;
var diameter = 400;

function setup() {
  createCanvas(600, 400);
  fill(x, 100, 100);
};

function draw() {
  background(0, 100, 150);
  ellipse(x, y, diameter, diameter);
};