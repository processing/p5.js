// Using find.

// We define the canvas variables outside of setup so we can access them from anywhere in the sketch.
var canvas0;
var canvas1;
var canvas2;

function setup() {

  // We are still calling createCanvas like before, but now we are storing a pointer to each one.
  canvas0 = createCanvas(200, 200);
  canvas1 = createCanvas(200, 200);
  canvas2 = createCanvas(200, 200);

  // Here we call methods of each element to set the position and id.
  // Use view-source to look at the HTML generated from this code when you load the sketch in your browser.
  // Let's give the first two canvases class donkey, and the third class yogurt.
  canvas0.position(50, 50);
  canvas0.class('donkey');
  canvas1.position(300, 50);
  canvas1.class('donkey');
  canvas2.position(550, 50);
  canvas2.class('yogurt');
};


function draw() {

  // Tell the program to draw into canvas0.
  context(canvas0);
  // Call the method to draw the contents of the canvas.
  drawEllipseCanvas();


  // Tell the program to draw into canvas1.
  context(canvas1);
  // Call the method to draw the contents of the canvas.
  drawRectCanvas();


  // Tell the program to draw into canvas2.
  context(canvas2);
  // Call the method to draw the contents of the canvas.
  drawRectCanvas();
  
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


// On key press, hide all elements with class donkey.
function keyPressed() {
  var donkeys = find('donkey');
  for (var i=0; i<donkeys.length; i++) {
    donkeys[i].hide();
  }
}



