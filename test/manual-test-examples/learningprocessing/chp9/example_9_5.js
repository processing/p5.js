// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 9-5: Using a for loop to initialize all elements of an array

var values = [];

for (var n = 0; n < 1000; n ++ ) {
  values[n] = random(0,10);
}