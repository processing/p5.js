// ===== sketch.js =====
var img;
let sel; // global variable for dropdown

function preload() {
  img = loadImage('flowers.jpg'); // make sure the image is in the same folder
}

function setup() {
  createCanvas(800, 160);

  // Draw white rectangle as background
  fill(255, 255, 255);
  rect(0, 0, 480, 160);

  // Draw images with different tints
  image(img, 0, 0);
  tint(0, 0, 150, 150); // Alpha blue
  image(img, 160, 0);
  tint(255, 255, 255); // Normal
  image(img, 320, 0);
  tint(0, 153, 150); // Turquoise
  image(img, 480, 0);
  noTint(); // Default
  image(img, 640, 0);

  // ===== Safari createSelect() test =====
  sel = createSelect();
  sel.option('Option 1');
  sel.option('Option 2');
  sel.option('Option 3');
  sel.position(10, 180); // position below canvas
  sel.changed(() => {
    console.log('Changed to:', sel.value());
  });
}

// No draw() function needed — keeps dropdown visible
