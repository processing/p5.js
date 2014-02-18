// pushMatrix(), popMatrix()

var x, y;

function setup() {
  createCanvas(600, 400);
  noStroke();
};

function draw() {
  background(100, 200, 200);

  // Add in push and pop matrix to preserve state of transformation.  
  //pushMatrix();

  translate(100, 100);
  fill(0);
  ellipse(0, 0, 100, 100);

  //popMatrix();

  translate(100, 100);
  fill(255);
  ellipse(0, 0, 50, 50);
};