// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-9: Using all the objects in one sketch

var catcher;    // One catcher object
var timer;        // One timer object
var drops = [];       // An array of drop objects
var totalDrops = 0; // totalDrops

function setup(){
  createCanvas(400,400);
  smooth();
  catcher = new Catcher(32); // Create the catcher with a radius of 32
  timer = new Timer(2000);   // Create a timer that goes off every 2 seconds
  timer.start();             // Starting the timer
};

function draw(){
  background(255);

  // From Part 1. The Catcher!
  catcher.setLocation(mouseX,mouseY); // Set catcher location
  catcher.display(); // Display the catcher

  // From Part 3. The Timer!
  // Check the timer
  if (timer.isFinished()) {
    println( " 2 seconds have passed! " );
    timer.start();
  }

  // From Part 4. The Raindrops!
  // Initialize one drop
  drops[totalDrops] = new Drop();
  // Increment totalDrops
  totalDrops ++ ;
  
  // If we hit 1000 drops
  if (totalDrops >= 1000) {
    totalDrops = 0; // Start over
  }
  
  // Move and display all drops
  for (var i = 0; i < totalDrops; i ++ ) {
    drops[i].move();
    drops[i].display();
  }
};