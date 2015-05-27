// Creating other HTML elements.


function setup() {


  // We are still calling createCanvas like in the past, but now we are storing the result as a variable.
  // This way we can call methods of the element, to set the position for instance.

  // Try switching the order of these two lines. You notice that it breaks when you put them the other way.
  // This is because the most the program tries to draw into the most recently created element.
  // If you create the HTML element second, it doesn't make work to draw background and ellipse into it
  // because drawing only works with graphics elements.
  var text = createP("This is an HTML string!");
  var canvas = createCanvas(600, 400);

  // Here we call methods of each element to set the position and id, try changing these values.
  // Use the inspector to look at the HTML generated from this code when you load the sketch in your browser.
  text.position(50, 50);
  text.id("apple");
  canvas.position(300, 50);
  canvas.class("lemon");

}


function draw() {

  // These commands are applied to whichever element was most recently created.
  background(220, 180, 200);
  ellipse(width/2, height/2, 100, 100);
  ellipse(width/4, height/2, 50, 50);

}
