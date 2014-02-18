// Think about our example from last week, moving an ellipse across the screen
// We could do this with two ellipses.
// Imagine doing this with 100 ellipse... it gets messy. BUT we can use arrays!
// Adapted from Getting Started with Processing

var x0 = 0;
// var x1 = 0; // Second ellipse
// var x = []; // USING ARRAYS

function setup() {
  createCanvas(600, 400);
  noStroke();
  fill(255);

  // USING ARRAYS
  // for (var i=0; i<100; i++) {
  //   x.push(random(0, width));
  // }
};

function draw() {
  background(71);

  x0 = x0 + 5;
  if (x0 > width + 5) {
    x0 = -5;
  }

  ellipse(x0, 50, 10, 10);

  // Second ellipse
  // x1 = x1 + 5;
  // if (x1 > width + 5) {
  //   x1 = -5;
  // }

  // ellipse(x1, 100, 10, 10);

  // USING ARRAYS
  // for (var i=0; i<100; i++) {

  //   x[i] = x[i] + 1;
  //   if (x[i] > width + 5) {
  //     x[i] = -5;
  //   }

  //   ellipse (x[i], i*5, 10, 10);
  // }
};