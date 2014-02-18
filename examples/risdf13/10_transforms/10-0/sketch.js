// The translate() function allows objects to be moved to any location within the window. 
// The first parameter sets the x-axis offset and the second parameter sets the y-axis offset.
 
function setup() {
  createCanvas(600, 400);
  noStroke();
};

function draw() {
  background(102);

  fill(255);
  rect(200, 100, 80, 80);

  // Replace x and y coords using translate
  // translate(200, 100);
  // rect(0, 0, 80, 80);

  // Translate further and draw another

  // Transforms accumulate. Notice how this rect is twice as
  // far in the x and y direction but both have (0, 0) as
  // the x and y axis values.

  // fill(0);
  // translate(200, 100);
  // rect(0, 0, 80, 80);
};