// Drawing to multiple canvases using additional functions.

// This example is just like the last but now we are abstracting the drawing code,
// creating separate functions outside of draw that we call from inside draw.
// This helps to keep code organized.


// We define the canvas variables outside of setup so we can access them from anywhere in the sketch.
var canvas0;
var canvas1;

function setup() {

  // We are still calling createCanvas like before, but now we are storing a pointer to each one.
  canvas0 = createCanvas(200, 200);
  canvas1 = createCanvas(600, 400);

  // Here we call methods of each element to set the position and id.
  // Use view-source to look at the HTML generated from this code when you load the sketch in your browser.
  canvas0.position(50, 50);
  canvas1.position(300, 50);
}


function draw() {

  // Tell the program to draw into canvas0.
  context(canvas0);
  // Call the method to draw the contents of the canvas.
  drawEllipseCanvas();
  // Try switching in a different function.
  //drawRectCanvas();


  // Tell the program to draw into canvas1.
  context(canvas1);
  // Call the method to draw the contents of the canvas.
  drawRectCanvas();
  // Try switching in a different function.
  //drawEllipseCanvas();
  
}

// Addtional drawing functions.
function drawEllipseCanvas() {
  background(120, 180, 200);
  ellipse(width/2, height/2, 100, 100);
}

function drawRectCanvas() {
  background(50, 120, 80);
  rect(width/4, height/4, width/2, height/2);
}