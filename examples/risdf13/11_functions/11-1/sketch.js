// Draw three targets, using a function with parameters to set the location of the targets

function setup() {
  createCanvas(600, 400);
  background(71);
  noStroke();
  noLoop();
};

function draw() {
  drawTarget(100, 200); // x is assigned to 100, y is assigned to 200
  drawTarget(300, 200); // x is assigned to 300, y is assigned to 200
  drawTarget(500, 200); // x is assigned to 500, y is assigned to 200

  // var a = random(0, width);
  // var b = random(0, height);
  // drawTarget(a, b); // you can also pass variables in as values
};

// Here, the drawTarget function takes two parameters (or arguments)
// The x argument automatically gets made into a variable, the value is assigned to whatever the user passes in when they use the function above
// The y argument behaves the same way
function drawTarget(x, y) {
  for(var i = 0; i < 10; i++) {
    fill(i*20, i*20, i*20);
    ellipse(x, y, 150-(i*20), 150-(i*20)); // x and y here are used just like any other variables
  };
};