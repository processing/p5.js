// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 7-5: Zoog with functions

var x = 100;
var y = 100;
var w = 60;
var h = 60;
var eyeSize = 16;

function setup(){
  createCanvas(200,200);
  smooth();
};

function draw(){
  background(255); // Draw a black background
  
  // mouseX position determines speed factor for moveZoog function
  var factor = constrain(mouseX/10,0,5);

  // The code for changing the variables associated with Zoog and displaying Zoog is moved outside of draw() and into functions called here. 
  // The functions are given arguments, such as “Jiggle Zoog by the following factor” and “draw Zoog with the following eye color.
  jiggleZoog(factor);
  // pass in a color to drawZoog
  // function for eye's color
  var d = dist(x,y,mouseX,mouseY);
  var c = color(d);
  drawZoog(c);
};

var jiggleZoog = function(speed) {
  // Change the x and y location of Zoog randomly
  x = x + random( - 1,1)*speed;
  y = y + random( - 1,1)*speed;
  // Constrain Zoog to window
  x = constrain(x,0,width);
  y = constrain(y,0,height);
};

var drawZoog = function(eyeColor) {
  // Set ellipses and rects to CENTER mode
  ellipseMode(CENTER);
  rectMode(CENTER);
  // Draw Zoog's arms with a for loop
  for (var i = y - h/3; i < y + h/2; i += 10) {
    stroke(0);
    line(x - w/4,i,x + w/4,i);
  }
  // Draw Zoog's body
  stroke(0);
  fill(175);
  rect(x,y,w/6,h);
  // Draw Zoog's head
  stroke(0);
  fill(255);
  ellipse(x,y - h,w,h);
  // Draw Zoog's eyes
  fill(eyeColor);
  ellipse(x - w/3,y - h,eyeSize,eyeSize*2);
  ellipse(x + w/3,y - h,eyeSize,eyeSize*2);
  // Draw Zoog's legs
  stroke(0);
  line(x - w/12,y + h/2,x - w/4,y + h/2 + 10);
  line(x + w/12,y + h/2,x + w/4,y + h/2 + 10);
};

