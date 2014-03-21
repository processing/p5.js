// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-7: Drops one at a time

// An array for drops
var drops = [];

 // New variable to keep track of total number of drops we want to use!
var totalDrops = 0;

function setup(){
  createCanvas(400,400);
  smooth();
  background(0);
};

function draw(){
  background(255);

  // Initialize one drop
  drops[totalDrops] = new Drop();

  // Increment totalDrops
  totalDrops++ ;

  // 1000 drops
  if (totalDrops >= 1000) {
    totalDrops = 0; //Start over
  }

  // Move and display drops
  for (var i = 0; i < totalDrops; i++ ) { // New! We no longer move and display all drops, but rather only the “totalDrops” that are currently present in the game.
    drops[i].move();
    drops[i].display();
  }

};
