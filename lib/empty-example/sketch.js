// Example: Single-value (Grayscale) colors in different color modes. 
// Each rectangle is filled with one parameter, but its final color depends
// on how that parameter is interpreted by the current color mode.

function setup() {
  createCanvas(300, 200);
  noStroke();
  noLoop();
}

function draw() {
  colorMode(RGB, 255);
  fill(128);
  rect(0, 0, 100, 100);

  fill(0); // Switch to black text for clarity (RGB mode for text)
  textSize(14);
  text("RGB (128)", 10, 20);
}
