// mouseX and mouseY give you the x and y coordinates of the mouse

function setup() {
  createCanvas(600, 400);
  background(0);
  fill(255);
};

function draw() {
  // If you add in a line to redraw the background, you don't see the previous ellipses
  // background(0);
  
  // ellipse that follows the mouse
  ellipse(mouseX, mouseY, 20, 20);

  // mouseX and mouseY are just variables that can be used anywhere
  // background(mouseX);
  // ellipse(width/2, height/2, mouseX, mouseY);
};