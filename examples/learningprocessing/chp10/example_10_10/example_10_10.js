// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-10: The raindrop catching game

var catcher;    // One catcher object
var timer;        // One timer object
var drops = [];       // An array of drop objects
var totalDrops = 0; // totalDrops

function setup(){
  createCanvas(400,400);
  smooth();
  catcher = new Catcher(32); // Create the catcher with a radius of 32
  timer = new Timer(300);   // Create a timer that goes off every 2 seconds
  timer.start();             // Starting the timer
};

function draw(){
  background(255);
  
  // Set catcher location
  catcher.setLocation(mouseX,mouseY); 
  // Display the catcher
  catcher.display(); 
  
  // Check the timer
  if (timer.isFinished()) {
    // Deal with raindrops
    // Initialize one drop
    drops[totalDrops] = new Drop();
    // Increment totalDrops
    totalDrops ++ ;
    // If we hit 1000 drops
    if (totalDrops >= 1000) {
      totalDrops = 0; // Start over
    }
    timer.start();
  }
  
  // Move and display all drops
  for (var i = 0; i < totalDrops; i++ ) {
    drops[i].move();
    drops[i].display();
    if (catcher.intersect(drops[i])) {
      drops[i].caught();
    }
  }
};