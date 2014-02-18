// Draw three targets, using a function to avoid repeitition and help with modularity

function setup() {
  createCanvas(600, 400);
  background(71);
  noStroke();
  noLoop();
};

function draw() {
  var x;
  var y;

  // You can draw each target individually
  // But then updating the code (to say, resize the targets) is tedious and
  // bound to produce errors

  // draw a target
  x = random(0, width);
  y = random(0, height);
  for(var i = 0; i < 10; i++) {
    fill(i*20, i*20, i*20);
    ellipse(x, y, 150-(i*20), 150-(i*20));
  };

  // draw a target
  x = random(0, width);
  y = random(0, height);
  for(var i = 0; i < 10; i++) {
    fill(i*20, i*20, i*20);
    ellipse(x, y, 150-(i*20), 150-(i*20));
  };

  // draw a target
  x = random(0, width);
  y = random(0, height);
  for(var i = 0; i < 10; i++) {
    fill(i*20, i*20, i*20);
    ellipse(x, y, 150-(i*20), 150-(i*20));
  };

  //drawTarget();
  //drawTarget();
  //drawTarget();
};

// Defining the functionality of target drawing in a 'function' helps you separate out that logic
// It also helps you with code reusability and modularity

/*var drawTarget = function() {
  var x;
  var y;

  x = random(0, width);
  y = random(0, height);
  for(var i = 0; i < 10; i++) {
    fill(i*20, i*20, i*20);
    ellipse(x, y, 150-(i*20), 150-(i*20));
  };
};*/