
// Keyboard input
// Draw a rectangle when any key is pressed

var setup = function() {

  createGraphics(600, 600);
  smooth();
  strokeWeight(8);

}

var draw = function() {

  background(204);

  if (isKeyPressed() == true) { // If the key is pressed,
    line(120, 120, 480, 480); // draw a line
  } else { // Otherwise,
    rect(240, 240, 120, 120); // draw a rectangle
  }
};