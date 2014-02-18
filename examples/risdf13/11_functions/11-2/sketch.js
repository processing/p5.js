// Use a function to generate and return a useful value

function setup() {
  createCanvas(600, 400);
  noStroke();
  fill(255, 255, 0);
};

function draw() {
  background(80, 100, 90);

  ellipse(100, 100, funkySize(100), funkySize(100)); // funkySize(100) evaluates to a number just like random(0, 100) does
  ellipse(200, 200, funkySize(200), funkySize(200));
  ellipse(300, 300, funkySize(300), funkySize(300));
};

// This function takes a parameter, n, that it uses in some calculations
// Those calculations result in a new value, size, that we want returned
// The 'return' keyword is special, and makes this function evaluate to a value instead of undefined
function funkySize(n) {
  var jitter = random(0, 10);
  var size = n + jitter;
  return size;
}