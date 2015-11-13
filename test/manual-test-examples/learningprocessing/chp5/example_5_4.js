// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 5-4: Hold down the button
var button = false;

var x = 50;
var y = 50;
var w = 100;
var h = 75;

function setup(){
  createCanvas(200,200); 
};

function draw(){
  // The button is pressed if (mouseX,mouseY) is inside the rectangle and mousePressed is true.
  if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h && isMousePressed()) {
    button = true; 
  } else {
    button = false;
  }

 if (button) {
    background(255);
    stroke(0);
  } else {
    background(0);
    stroke(255);
  }
  
  fill(175);
  rect(x,y,w,h);
};





