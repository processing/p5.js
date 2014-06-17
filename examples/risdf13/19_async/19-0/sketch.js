// In this example, we want to load an
// image and display it in setup().
//
// Since setup() happens quickly at the beginning, the image doesn't
// have time to properly load before setup() is done.
// 
// We are introducing preload() where you can run load
// operations that are guaranteed to complete by setup().
// This is called asynchronous loading, because it happens whenever
// the computer is done and ready, not necessarily when you call it.

var i;

function preload() {
  //i = loadImage('sun.jpg'); // preloading the image guarantees it will be ready by setup()
};

function setup() {
  createCanvas(1300, 600);
  i = loadImage('sun.jpg');   // loading the image here is too slow
  image(i, 0, 0);
};

function draw() {
	// do nothing
};