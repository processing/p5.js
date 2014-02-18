// Move a line while any key is pressed
var x = 20;

function setup() {
  createCanvas(600, 600);
  smooth();
  strokeWeight(8);
};

function draw() {
  background(204);
  if (isKeyPressed() == true) { // If the key is pressed
    x++; // add 1 to x
  }
  line(x, 120, x-360, 480);
};

// Compare to if you change to keyPressed()??

// var keyPressed = function() {
//  x++;
// };