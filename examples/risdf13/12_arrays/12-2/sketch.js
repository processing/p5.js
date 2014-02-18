// A simpler array example.
// Exactly the same, but using push.

var sizes = [];

function setup() {
  createCanvas(600, 400);
  noStroke();
  fill(255);

  sizes.push(50);
  sizes.push(100);
  sizes.push(200);
};

function draw() {
  background(71);

  ellipse(100, 100, sizes[0], sizes[0]);
  ellipse(300, 100, sizes[1], sizes[1]);
  ellipse(500, 100, sizes[2], sizes[2]);
};