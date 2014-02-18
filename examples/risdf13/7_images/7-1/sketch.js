// Render a single image sourced from this folder as the background

var img;

function setup() {
  createCanvas(600, 600);
  img = loadImage("cat.jpg");
};

function draw() {
  // Place image at 0,0 and stretch to width and height
  // Do this first before any other drawing to make the image the "background"
  image(img, 0, 0, width, height);

  // Draw something else
  fill(255, 0, 0);
  rect(mouseX, mouseY, 50, 50);
};