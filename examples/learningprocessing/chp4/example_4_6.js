// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 4-6: Ellipse with variables

// Declare and initialize your variables!
var r = 100;
var g = 150;
var b = 200;
var a = 200;
  
var diam = 20;
var x = 100;
var y = 100;
  
function setup(){
  createCanvas(200,200);
  background(255);
  smooth();    
};

function draw(){
  // Use those variables to draw an ellipse
  stroke(0);
  fill(r,g,b,a);  // (Remember, the fourth argument for a color is transparency.
  ellipse(x,y,diam,diam);  
};

