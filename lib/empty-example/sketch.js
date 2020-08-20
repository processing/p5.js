function preload() {
  img = loadImage('../../test/unit/assets/cat.jpg');
}

function setup() {
  // put setup code here
  createCanvas(250, 250);
  background(51);

  let oldColor = color(0, 0, 0, 255);
  let newColor = color(random(255), random(255), random(255), random(255));
  img.filter(REPLACE_COLOR, [oldColor, newColor]); // Trying new feature here
  image(img, 0, 0);
}

function draw() {
  // put drawing code here
}