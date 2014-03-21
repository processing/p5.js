// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-1: Catcher

var catcher;

function setup(){
  createCanvas(400,400);
  catcher = new Catcher(32);
  smooth();
};

function draw(){
  background(255);
  catcher.setLocation(mouseX,mouseY);
  catcher.display();
};

