// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-5: Object-oriented timer

var timer;

var setup = function() {
  createGraphics(200,200);
  background(0);
  timer = new Timer(5000);
  timer.start();
};

var draw = function() {
  if (timer.isFinished()) {
    background(random(255));
    timer.start();
  }
};

