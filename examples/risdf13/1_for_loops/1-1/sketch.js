// A for loop has 3 parts. 
// The init part declares a new value to be used just within the loop, and assigns it a value. i is used a lot, but it can be anything. 
// The test part evaluates the value of the variable. As long as the value is true, the statements inside the brackets are evaluated. 
// The update part changes the variable.

// for (init; test; update) {
//  statements
// }

function setup() {
  createCanvas(600, 400);
};

function draw() {
  background(250, 250, 50);

  strokeWeight(10);

  // line(100, 100, 100, 300);
  // line(120, 100, 120, 300);
  // line(140, 100, 140, 300);
  // line(160, 100, 160, 300);

  for (var i=0; i<4; i++) {
    line(100 + 20*i, 100, 100 + 20*i, 300);
  }

  // Try changing 4 to other numbers... 8, 12, 100?!
  // Try changing 4 to a variable like width.
  // Try changing the line to an ellipse.
};