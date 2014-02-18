function setup() {
  createCanvas(600, 400);
};

function draw() {
  background(150, 250, 150);

  // Here is a simpler version of a nested for loop. 
  // Try uncommenting this and commenting out the other one below.
  // for (var i=200; i<250; i+= 20) {
  //   for (var j=50; j<100; j+= 20) {
  //     ellipse(i, j, 10, 10);
  //   }
  // }

  // Here we are using two for loops inside each other. I know, what??
  // The easiest way to understand this is to walk through the code like a computer, try it.

  for (var i=0; i<width; i+= 20) {
    for (var j=0; j<height/2; j+= 20) {
      ellipse(i, j, 10, 10);
    }
  }
  
  // Try changing the < sign to <= sign.
};