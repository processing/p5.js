// Render a single image sourced from this folder

var img;

function setup() {
  createCanvas(600, 600);
  // Load an image file that is located in the same folder as this sketch.js file
  // File name must be spelled exactly the same, with the extension
  // The right hand side of this equation 'returns' an image object and stores it in the 'img' variable
  img = loadImage("cat.jpg");
};

function draw() {
  background(250, 200, 200);
  // For a fading image, try:
  //background(250, 200, 200, 20);

  // Draw the image with the image() command
  // Takes three arguments: the image variable, x position, y position
  image(img, mouseX, mouseY);
};