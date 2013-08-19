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



// Timer class

function Timer(tempTotalTime) {
	this.savedTime = 0; // When Timer started
  this.totalTime = tempTotalTime; // How long Timer should last
}

// Starting the timer
Timer.prototype.start = function() {
  // When the timer starts it stores the current time in milliseconds.
  this.savedTime = millis(); 
};

// The function isFinished() returns true if 5,000 ms have passed. 
// The work of the timer is farmed out to this method.
Timer.prototype.isFinished = function() { 
  // Check how much time has passed
  var passedTime = millis() - this.savedTime;
  if (passedTime > this.totalTime) {
    return true;
  } else {
    return false;
  }
};
