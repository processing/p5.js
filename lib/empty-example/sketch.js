function preload() {
  img = loadImage('../../test/unit/assets/cat.jpg');
}

let oldColor;
let newColor;

function setup() {
  // put setup code here
  createCanvas(250, 250);
  background(51);

  oldColor = color(0, 0, 0, 255);
  newColor = color(random(255), random(255), random(255), 255);
}

function draw() {
  // put drawing code here
  img.filter(REPLACE_COLOR, [oldColor, newColor]); // Trying new feature here
  image(img, 0, 0);
  oldColor = newColor;
  newColor = color(random(255), random(255), random(255), 255);
}