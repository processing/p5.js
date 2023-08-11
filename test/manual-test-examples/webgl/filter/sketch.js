let img;

function preload() {
  img = loadImage('../../../../docs/reference/assets/bricks.jpg');
}

function setup() {
  createCanvas(200, 200, WEBGL);
  img.resize(200, 200);
}

function draw() {
  image(img, -width/2, -height/2);
  filter(POSTERIZE, 4);
}
