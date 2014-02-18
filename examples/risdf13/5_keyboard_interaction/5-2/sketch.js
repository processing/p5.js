function setup() {
  createCanvas(600, 400);
};

function draw() {
  background(0);
  ellipse(width/2, height/2, 100, 100);
};

function keyPressed() {
  if (key == 'A') {
    fill(0); // Black
  } 
  else if (key == 'B') {
    fill(255); // White
  } 
  else if (key == 'C') {
    fill(126); // Gray
  }

  //print(keyCode);
};