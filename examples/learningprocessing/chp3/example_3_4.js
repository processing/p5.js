// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 3-4: Drawing a continuous line
function setup(){
  createCanvas(200, 200);
  background(255);
  smooth();
};

function draw(){
  stroke(0);
  // Draw a line from previous mouse location to current mouse location.
  line(pmouseX, pmouseY, mouseX, mouseY);
};