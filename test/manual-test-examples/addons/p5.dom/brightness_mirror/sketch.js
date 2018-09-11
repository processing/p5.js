// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 16-6: Drawing a grid of squares

// Size of each cell in the grid, ratio of window size to video size
// 40 * 16 = 640
// 30 * 16 = 480
const videoScale = 16;

// Number of columns and rows in our system
let cols, rows;

function setup() {
  createCanvas(640, 480);

  // Initialize columns and rows
  cols = width / videoScale;
  rows = height / videoScale;

  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(cols, rows);
  //video.hide();
}

function draw() {
  background(0);
  video.loadPixels();

  // Begin loop for columns
  for (let i = 0; i < cols; i++) {
    // Begin loop for rows
    for (let j = 0; j < rows; j++) {
      // Reversing x to mirror the image
      // In order to mirror the image, the column is reversed with the following formula:
      // mirrored column = width - column - 1
      const loc = (cols - i - 1 + j * cols) * 4;

      // The functions red(), green(), and blue() pull out the three color components from a pixel.
      const r = video.pixels[loc];
      const g = video.pixels[loc + 1];
      const b = video.pixels[loc + 2];

      // A rectangle size is calculated as a function of the pixel's brightness.
      // A bright pixel is a large rectangle, and a dark pixel is a small one.
      const sz = map((r + g + b) / 3, 0, 255, 0, videoScale);
      rectMode(CENTER);
      fill(255);
      noStroke();
      // For every column and row, a rectangle is drawn at an (x,y) location scaled and sized by videoScale.
      const x = i * videoScale;
      const y = j * videoScale;
      rect(x + videoScale / 2, y + videoScale / 2, sz, sz);
    }
  }
}
