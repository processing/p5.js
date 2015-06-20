// In this example, we want to load a *very large* (123MegaPixels)
// image and display it in setup().
//
// Since setup() happens quickly at the beginning, the image doesn't
// have time to properly load before setup() is done.
// 
// We are introducing preload() where you can run load
// operations that are guaranteed to complete by setup().
// This is called asynchronous loading, because it happens whenever
// the computer is done and ready, not necessarily when you call it.

var largeImage;

function preload() {
  largeImage = loadImage('test.gif'); // preloading the image guarantees it will be ready by setup()
};

function setup() {
  createCanvas(1300, 600);
  image(largeImage, 0, 0);
};

function draw() {
	// do nothing
};