// Creating and drawing to more than one canvas.


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

  background(120, 180, 200);
  ellipse(width/2, height/2, 100, 100);


  // Tell the program to draw into canvas1.
  context(canvas1);

  background(50, 120, 80);
  rect(width/4, height/4, width/2, height/2);


  // Tell the program to switch back to drawing into canvas0.
  // context(canvas0);
  // line(0, 0, width, height);
}
