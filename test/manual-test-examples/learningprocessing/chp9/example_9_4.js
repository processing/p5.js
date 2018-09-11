// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 9-4: Using a while loop to initialize all elements of an array

const values = [];

let n = 0;
while (n < 1000) {
  values[n] = random(0, 10);
  n = n + 1;
}
