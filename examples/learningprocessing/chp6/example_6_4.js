// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 6-4: Infinite loop. Don't do this!

var x = 0;

function setup(){

	while (x < 10) {
	  println(x);
	  // Decrementing x results in an infinite loop here because the value of x will never be 10 or greater. 
	  // Be careful!
	  x = x - 1; 
	  
	  // This line quits the loop so that this sketch does not crash
	  // Comment it out to see Processing crash! (save everything else first!)
	  break;  
	}
};

function draw(){

};