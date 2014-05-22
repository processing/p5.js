var img;

function preload() {
  img = loadImage("flowers.jpg");
}

function setup() {
  createCanvas(480,160);
  fill(255, 255, 255);
  rect(0, 0, 480, 160);
	image(img, 0, 0);
	tint(0, 0, 150, 150);  // Tint blue
	image(img, 160, 0);
  tint(255, 255, 255);
  image(img, 320, 0);
}