// Using a for loop to initialize values.
// Using a for loop to draw.

var y = [];

function setup() {
  createCanvas(600, 400);
  stroke(255);
  strokeWeight(3);

  // Here we are using a for loop and random to set the values.
  for (var i=0; i<20; i++) {
    y[i] = random(0, height);
  }
};

function draw() {
  background(71);

  // Here we are using a for loop to draw using the values.
  for (var i=0; i<20; i++) {
    line(i*10, 0, i*10, y[i]);
  }

  // You can also use length to automatically get the length of the array.
  // This is useful in case you change the number of elements in it.
  // for (var i=0; i<y.length; i++) {
  //   line(i*10, 0, i*10, y[i]);
  // }
};