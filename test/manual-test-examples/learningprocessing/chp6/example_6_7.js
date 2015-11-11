// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 6-7: Local variables

function setup(){
  createCanvas(200,200);
  // x is not available! It is local to the draw() block of code.
}

function draw(){
  background(0);
  var x = 0;
  // x is available! Since it is declared within the draw() block of code, it is available here.
  // Notice, however, that it is not available inside draw() above where it is declared.
  // Also, it is available inside the while block of code because while is inside of draw().
  while (x < width) {
    stroke(255);
    line(x,0,x,height);
    x += 5;
  }
}

function mousePressed() {
  // x is not available! It is local to the draw( ) block of code.
  println( " The mouse was pressed! " );
}