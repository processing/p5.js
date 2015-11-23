// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 3-5: mousePressed and keyPressed
function setup(){
  createCanvas(200,200);
  background(255);
}

function draw(){
 // Nothing happens in draw() in this example!
}

// Whenever a user clicks the mouse the code written inside mousePressed() is executed.
function mousePressed() {
  stroke(0);
  fill(175);
  rectMode(CENTER);
  rect(mouseX,mouseY,16,16);
}

// Whenever a user presses a key the code written inside keyPressed() is executed.
function keyPressed() {
  background(255);
}