// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// example 10-4: Implementing a timer

var savedTime;
var totalTime = 5000;

function setup(){
  createCanvas(200,200);
  background(0);
  savedTime = millis();
};

function draw(){
  // Calculate how much time has passed
  var passedTime = millis() - savedTime;
  // Has five seconds passed?
  if (passedTime > totalTime) {
    println( " 5 seconds have passed! " );
    background(random(255)); // Color a new background
    savedTime = millis(); // Save the current time to restart the timer!
  }
};